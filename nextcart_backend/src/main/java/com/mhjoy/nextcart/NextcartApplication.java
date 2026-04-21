package com.mhjoy.nextcart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@SpringBootApplication
public class NextcartApplication {

    public static void main(String[] args) {
        SpringApplication.run(NextcartApplication.class, args);
    }

}
