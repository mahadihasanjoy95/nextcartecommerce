package com.mhjoy.nextcart.common.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Sends HTML emails using Thymeleaf for template rendering and
 * Spring Mail (SMTP) for delivery.
 *
 * <p>All sends are {@code @Async} — they run on the {@code emailExecutor}
 * thread pool so controller threads are never blocked by SMTP.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Override
    @Async("emailExecutor")
    public void send(EmailRequest request) {
        try {
            Context context = new Context();
            if (request.variables() != null) {
                request.variables().forEach(context::setVariable);
            }

            String htmlBody = templateEngine.process(request.template().getTemplatePath(), context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(request.to());
            helper.setSubject(resolveSubject(request.template()));
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Email sent to {} using template {}", request.to(), request.template());

        } catch (MessagingException e) {
            log.error("Failed to send email to {} using template {}: {}",
                    request.to(), request.template(), e.getMessage(), e);
        }
    }

    private String resolveSubject(EmailTemplate template) {
        return switch (template) {
            case PASSWORD_RESET       -> "Reset your NextCart password";
            case SOCIAL_LOGIN_REMINDER -> "Sign in to NextCart with Google";
            case ADMIN_INVITE          -> "Your NextCart Admin Account";
        };
    }
}
