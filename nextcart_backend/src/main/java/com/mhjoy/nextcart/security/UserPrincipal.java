package com.mhjoy.nextcart.security;

import com.mhjoy.nextcart.auth.enums.UserType;
import lombok.Getter;

/**
 * Lightweight principal stored in SecurityContextHolder after successful JWT validation.
 * Does NOT implement Spring's UserDetails — authorization is handled by DbAuthorizationManager
 * using DB lookups, not granted authorities on the principal.
 */
@Getter
public class UserPrincipal {

    private final Long userId;
    private final String email;
    private final UserType userType;

    public UserPrincipal(Long userId, String email, UserType userType) {
        this.userId = userId;
        this.email = email;
        this.userType = userType;
    }

    @Override
    public String toString() {
        return "UserPrincipal{userId=" + userId + ", email='" + email + "', userType=" + userType + "}";
    }
}
