package com.mhjoy.nextcart.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration.
 *
 * Allows the React frontend (localhost:3000) and Flutter web (localhost:5000)
 * to call the backend during local development.
 *
 * When deploying to production, replace the allowedOrigins with the real
 * frontend domain (e.g. "https://nextcart.com") and remove localhost entries.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",   // React frontend (Vite dev server)
                        "http://localhost:3001",   // React frontend (Vite dev server)
                        "http://localhost:5000",   // Flutter web (future)
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5000"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600); // cache preflight response for 1 hour
    }
}
