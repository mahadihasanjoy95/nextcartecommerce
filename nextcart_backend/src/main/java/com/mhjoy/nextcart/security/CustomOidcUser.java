package com.mhjoy.nextcart.security;

import com.mhjoy.nextcart.auth.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Wraps our {@link User} entity as a Spring Security {@link OidcUser}.
 *
 * <p>Used by the OIDC flow — Google with {@code openid} scope triggers this path.</p>
 */
public class CustomOidcUser implements OidcUser {

    private final User user;
    private final OidcIdToken idToken;
    private final OidcUserInfo userInfo;
    private final Map<String, Object> attributes;

    public CustomOidcUser(User user, OidcIdToken idToken, OidcUserInfo userInfo,
                          Map<String, Object> attributes) {
        this.user       = user;
        this.idToken    = idToken;
        this.userInfo   = userInfo;
        this.attributes = attributes;
    }

    public User getUser() {
        return user;
    }

    @Override
    public Map<String, Object> getClaims() {
        return idToken.getClaims();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public OidcIdToken getIdToken() {
        return idToken;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()));
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
