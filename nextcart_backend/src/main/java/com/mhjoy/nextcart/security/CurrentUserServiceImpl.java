package com.mhjoy.nextcart.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserServiceImpl implements CurrentUserService {

    @Override
    public UserPrincipal getPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal)) {
            throw new IllegalStateException("No authenticated user found in SecurityContext");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    @Override
    public Long getCurrentUserId() {
        return getPrincipal().getUserId();
    }

    @Override
    public String getCurrentUserEmail() {
        return getPrincipal().getEmail();
    }
}
