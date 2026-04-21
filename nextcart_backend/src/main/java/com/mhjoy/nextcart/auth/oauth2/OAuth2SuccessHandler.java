package com.mhjoy.nextcart.auth.oauth2;

import com.mhjoy.nextcart.auth.entity.RefreshToken;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.repository.RefreshTokenRepository;
import com.mhjoy.nextcart.security.CustomOAuth2User;
import com.mhjoy.nextcart.security.CustomOidcUser;
import com.mhjoy.nextcart.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        User user = resolveUser(authentication);
        if (user == null) {
            log.error("OAuth2 success handler: could not resolve user from principal {}", authentication.getPrincipal().getClass());
            response.sendRedirect(frontendUrl + "/login?error=oauth2_failed");
            return;
        }

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getUserType());
        String rawRefresh  = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        RefreshToken refreshToken = new RefreshToken(
                rawRefresh,
                user,
                Instant.now().plusSeconds(jwtService.getRefreshTokenExpirySeconds())
        );
        refreshTokenRepository.save(refreshToken);

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", rawRefresh)
                .build().toUriString();

        log.info("OAuth2 login successful for user: {}", user.getEmail());
        response.sendRedirect(redirectUrl);
    }

    private User resolveUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomOidcUser oidcUser) {
            return oidcUser.getUser();
        }
        if (principal instanceof CustomOAuth2User oauth2User) {
            return oauth2User.getUser();
        }
        return null;
    }
}
