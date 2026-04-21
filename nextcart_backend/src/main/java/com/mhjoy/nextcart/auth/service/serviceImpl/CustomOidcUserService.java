package com.mhjoy.nextcart.auth.service.serviceImpl;

import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.entity.CustomerProfile;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.auth.exception.RoleNotFoundException;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.security.CustomOidcUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles the OIDC user-info step for OIDC-capable providers such as Google
 * when the {@code openid} scope is requested.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String email     = oidcUser.getEmail();
        String googleId  = oidcUser.getSubject();
        String firstName = oidcUser.getGivenName();
        String lastName  = oidcUser.getFamilyName();

        if (firstName == null || firstName.isBlank()) {
            String fullName = oidcUser.getFullName();
            if (fullName != null && !fullName.isBlank()) {
                String[] parts = fullName.split(" ", 2);
                firstName = parts[0];
                if (lastName == null && parts.length > 1) lastName = parts[1];
            }
        }

        User user = findOrCreateUser(email, googleId,
                firstName != null ? firstName : "User", lastName);

        return new CustomOidcUser(user, oidcUser.getIdToken(), oidcUser.getUserInfo(),
                oidcUser.getAttributes());
    }

    private User findOrCreateUser(String email, String googleId,
                                  String firstName, String lastName) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getGoogleId() == null) {
                        existing.setGoogleId(googleId);
                        existing.setEmailVerified(true);
                        userRepository.save(existing);
                        log.info("Linked Google OIDC to existing user: {}", email);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    Role customerRole = roleRepository.findByName(SystemRoles.CUSTOMER)
                            .orElseThrow(() -> new RoleNotFoundException(SystemRoles.CUSTOMER));

                    User newUser = new User();
                    newUser.setEmail(email.toLowerCase().trim());
                    newUser.setGoogleId(googleId);
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);
                    newUser.setUserType(UserType.CUSTOMER);
                    newUser.setEnabled(true);
                    newUser.setEmailVerified(true);
                    newUser.getRoles().add(customerRole);

                    User saved = userRepository.save(newUser);
                    CustomerProfile profile = new CustomerProfile(saved);
                    saved.setCustomerProfile(profile);
                    userRepository.save(saved);

                    log.info("Created new user via Google OIDC: {}", email);
                    return saved;
                });
    }
}
