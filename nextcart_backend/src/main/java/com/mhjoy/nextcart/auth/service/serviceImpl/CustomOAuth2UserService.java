package com.mhjoy.nextcart.auth.service.serviceImpl;

import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.entity.CustomerProfile;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.auth.exception.RoleNotFoundException;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles the OAuth2 user-info loading step for plain OAuth2 providers (non-OIDC).
 *
 * <p>Google with {@code openid} scope uses {@link CustomOidcUserService} instead.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email    = oAuth2User.getAttribute("email");
        String googleId = oAuth2User.getAttribute("sub");
        String firstName = getFirstName(oAuth2User);
        String lastName  = oAuth2User.getAttribute("family_name");

        User user = findOrCreateUser(email, googleId, firstName, lastName);
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User findOrCreateUser(String email, String googleId, String firstName, String lastName) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getGoogleId() == null) {
                        existing.setGoogleId(googleId);
                        existing.setEmailVerified(true);
                        userRepository.save(existing);
                        log.info("Linked Google account to existing user: {}", email);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    Role customerRole = roleRepository.findByName(SystemRoles.CUSTOMER)
                            .orElseThrow(() -> new RoleNotFoundException(SystemRoles.CUSTOMER));

                    User newUser = new User();
                    newUser.setEmail(email.toLowerCase().trim());
                    newUser.setGoogleId(googleId);
                    newUser.setFirstName(firstName != null ? firstName : "User");
                    newUser.setLastName(lastName);
                    newUser.setUserType(UserType.CUSTOMER);
                    newUser.setEnabled(true);
                    newUser.setEmailVerified(true);
                    newUser.getRoles().add(customerRole);

                    User saved = userRepository.save(newUser);
                    CustomerProfile profile = new CustomerProfile(saved);
                    saved.setCustomerProfile(profile);
                    userRepository.save(saved);

                    log.info("Created new user via Google OAuth2: {}", email);
                    return saved;
                });
    }

    private String getFirstName(OAuth2User oAuth2User) {
        String given = oAuth2User.getAttribute("given_name");
        if (given != null && !given.isBlank()) return given;
        String name = oAuth2User.getAttribute("name");
        if (name != null && name.contains(" ")) return name.split(" ")[0];
        return name;
    }
}
