package com.mhjoy.nextcart.common.email;

import java.util.Map;

/**
 * Immutable value object representing a single outbound email.
 *
 * @param to        recipient email address
 * @param template  which Thymeleaf template to render
 * @param variables template variables (key → value)
 */
public record EmailRequest(
        String to,
        EmailTemplate template,
        Map<String, Object> variables
) {
    /**
     * Convenience factory method.
     */
    public static EmailRequest of(String to, EmailTemplate template, Map<String, Object> variables) {
        return new EmailRequest(to, template, variables);
    }
}
