package com.mhjoy.nextcart.common.config;

import com.mhjoy.nextcart.auth.oauth2.OAuth2FailureHandler;
import com.mhjoy.nextcart.auth.oauth2.OAuth2SuccessHandler;
import com.mhjoy.nextcart.auth.service.serviceImpl.CustomOAuth2UserService;
import com.mhjoy.nextcart.auth.service.serviceImpl.CustomOidcUserService;
import com.mhjoy.nextcart.security.DbAuthorizationManager;
import com.mhjoy.nextcart.security.JwtAuthFilter;
import com.mhjoy.nextcart.security.UserPrincipal;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final DbAuthorizationManager dbAuthorizationManager;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOidcUserService customOidcUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    /**
     * Pure infrastructure endpoints — these never change regardless of business rules.
     * All business-level public/protected decisions are handled dynamically by
     * DbAuthorizationManager using the api_permission_map table.
     */
    private static final String[] INFRA_PUBLIC_ENDPOINTS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/actuator/**",
            // OAuth2 redirect endpoints — handled entirely by Spring Security's OAuth2 machinery
            "/oauth2/**",
            "/login/oauth2/**",
            // Public storefront product endpoints — never require authentication
            "/api/v1/products",
            "/api/v1/products/{productId}",
            "/api/v1/products/slug/{slug}"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                // IF_REQUIRED allows Spring Security to create a short-lived session only
                // during the OAuth2 redirect round-trip (needed for the state/CSRF parameter).
                // All regular API calls remain stateless via JWT.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // ── Infrastructure endpoints — always public, never DB-driven ──
                        .requestMatchers(INFRA_PUBLIC_ENDPOINTS).permitAll()
                        // ── All business endpoints — fully dynamic via DbAuthorizationManager ──
                        // Public routes, authenticated-only routes, and permission-protected
                        // routes are all resolved from api_permission_map at runtime.
                        .anyRequest().access(dbAuthorizationManager)
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)       // plain OAuth2 providers
                                .oidcUserService(customOidcUserService)     // OIDC providers (Google with openid scope)
                        )
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"UNAUTHORIZED","message":"Authentication required"}}"""
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"FORBIDDEN","message":"You do not have permission to access this resource"}}"""
                            );
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Provides the current authenticated user's email for JPA auditing (@CreatedBy, @LastModifiedBy).
     */
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return Optional.of("system");
            }
            if (auth.getPrincipal() instanceof UserPrincipal principal) {
                return Optional.of(principal.getEmail());
            }
            return Optional.of("system");
        };
    }
}
