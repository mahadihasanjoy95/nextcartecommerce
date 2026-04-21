package com.mhjoy.nextcart.common.email;

/**
 * Abstraction for sending transactional emails.
 *
 * <p>The default implementation renders a Thymeleaf template and sends it
 * asynchronously via Spring Mail / SMTP.</p>
 */
public interface EmailService {

    /**
     * Sends an email using the given {@link EmailRequest}.
     * Implementations are expected to execute asynchronously.
     */
    void send(EmailRequest request);
}
