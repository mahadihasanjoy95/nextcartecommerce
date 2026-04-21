package com.mhjoy.nextcart.security;

import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.auth.enums.UserType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT authentication filter that runs once per request.
 *
 * <p>Flow:
 * <ol>
 *   <li>Extract Bearer token from Authorization header</li>
 *   <li>Validate JWT signature and check it is an access token</li>
 *   <li>Load user from DB and verify account is enabled</li>
 *   <li>Set {@link UserPrincipal} in {@link SecurityContextHolder}</li>
 * </ol>
 * Invalid or missing tokens are silently ignored here — the
 * {@link DbAuthorizationManager} will reject unauthenticated requests to
 * protected endpoints with 401/403.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = jwtService.parse(token);

            // Only access tokens are accepted here — refresh tokens cannot authenticate requests
            if (!jwtService.isAccessToken(claims)) {
                log.debug("Rejected non-access token type on request to {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtService.extractUserId(claims);
            String email = jwtService.extractEmail(claims);
            UserType userType = jwtService.extractUserType(claims);

            // Skip if already authenticated in this request context
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Verify user still exists and is enabled in DB
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || !user.isEnabled()) {
                log.debug("User {} not found or disabled — rejecting token", userId);
                filterChain.doFilter(request, response);
                return;
            }

            UserPrincipal principal = new UserPrincipal(userId, email, userType);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException ex) {
            log.debug("Invalid JWT on request to {}: {}", request.getRequestURI(), ex.getMessage());
            // Fall through — unauthenticated request will be handled downstream
        }

        filterChain.doFilter(request, response);
    }
}
