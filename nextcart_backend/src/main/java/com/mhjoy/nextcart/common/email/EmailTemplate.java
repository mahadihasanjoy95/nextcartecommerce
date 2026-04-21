package com.mhjoy.nextcart.common.email;

/**
 * All supported email templates.
 *
 * <p>Each enum constant maps to an HTML file in
 * {@code src/main/resources/templates/emails/}.
 * The file name is {@code <templateName>.html} where
 * {@code templateName} is the lowercase, hyphenated version of the constant name.</p>
 */
public enum EmailTemplate {

    /** Sent to a user who requests a password reset link. */
    PASSWORD_RESET("emails/password-reset"),

    /** Sent to a Google-only account that tries to use forgot-password. */
    SOCIAL_LOGIN_REMINDER("emails/social-login-reminder"),

    /** Sent to a newly created admin/staff with their temporary password. */
    ADMIN_INVITE("emails/admin-invite");

    private final String templatePath;

    EmailTemplate(String templatePath) {
        this.templatePath = templatePath;
    }

    /** Thymeleaf template path (without {@code .html} extension). */
    public String getTemplatePath() {
        return templatePath;
    }
}
