package com.mhjoy.nextcart.auth.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        log.warn("OAuth2 authentication failed: {}", exception.getMessage());
        String message = URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        response.sendRedirect(frontendUrl + "/login?error=" + message);
    }
}
