package com.mhjoy.nextcart.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URI;
import java.util.LinkedHashSet;
import java.util.Set;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.admin.url:http://localhost:3001}")
    private String adminUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        Set<String> origins = new LinkedHashSet<>();

        // Always allow local dev origins
        origins.add("http://localhost:3000");
        origins.add("http://localhost:3001");
        origins.add("http://localhost:5000");
        origins.add("http://127.0.0.1:3000");
        origins.add("http://127.0.0.1:5000");

        // Add production origins from env vars (strips path, keeps scheme+host+port)
        origins.add(extractOrigin(frontendUrl));
        origins.add(extractOrigin(adminUrl));

        registry.addMapping("/api/**")
                .allowedOrigins(origins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    private String extractOrigin(String url) {
        try {
            URI uri = URI.create(url);
            int port = uri.getPort();
            return port == -1
                    ? uri.getScheme() + "://" + uri.getHost()
                    : uri.getScheme() + "://" + uri.getHost() + ":" + port;
        } catch (Exception e) {
            return url;
        }
    }
}
