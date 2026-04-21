package com.mhjoy.nextcart.security;

/**
 * Provides access to the currently authenticated user from the SecurityContext.
 */
public interface CurrentUserService {

    /**
     * Returns the {@link UserPrincipal} of the currently authenticated user.
     * Throws {@link IllegalStateException} if no authenticated user is present.
     */
    UserPrincipal getPrincipal();

    /**
     * Returns the ID of the currently authenticated user.
     */
    Long getCurrentUserId();

    /**
     * Returns the email of the currently authenticated user.
     */
    String getCurrentUserEmail();
}
