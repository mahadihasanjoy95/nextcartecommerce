package com.mhjoy.nextcart.auth.service.serviceImpl;

import com.mhjoy.nextcart.auth.dto.request.ChangePasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CustomerRegisterRequestDto;
import com.mhjoy.nextcart.auth.dto.request.ForgotPasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.LoginRequestDto;
import com.mhjoy.nextcart.auth.dto.request.RefreshTokenRequestDto;
import com.mhjoy.nextcart.auth.dto.request.ResetPasswordRequestDto;
import com.mhjoy.nextcart.auth.dto.request.UpdateProfileRequestDto;
import com.mhjoy.nextcart.auth.dto.response.ForgotPasswordResponseDto;
import com.mhjoy.nextcart.auth.dto.response.TokenResponseDto;
import com.mhjoy.nextcart.auth.dto.response.UserResponseDto;
import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.entity.CustomerProfile;
import com.mhjoy.nextcart.auth.entity.PasswordResetToken;
import com.mhjoy.nextcart.auth.entity.RefreshToken;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.auth.exception.*;
import com.mhjoy.nextcart.auth.repository.PasswordResetTokenRepository;
import com.mhjoy.nextcart.auth.repository.RefreshTokenRepository;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.auth.service.AuthService;
import com.mhjoy.nextcart.common.email.EmailRequest;
import com.mhjoy.nextcart.common.email.EmailService;
import com.mhjoy.nextcart.common.email.EmailTemplate;
import com.mhjoy.nextcart.common.storage.StorageService;
import com.mhjoy.nextcart.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.admin.url}")
    private String adminUrl;

    /** Password reset tokens expire after 1 hour. */
    private static final long RESET_TOKEN_EXPIRY_SECONDS = 3600L;

    @Override
    @Transactional
    public UserResponseDto register(CustomerRegisterRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new UserAlreadyExistsException("An account with email '" + requestDto.email() + "' already exists");
        }

        Role customerRole = roleRepository.findByName(SystemRoles.CUSTOMER)
                .orElseThrow(() -> new RoleNotFoundException(SystemRoles.CUSTOMER));

        User user = new User();
        user.setFirstName(requestDto.firstName());
        user.setLastName(requestDto.lastName());
        user.setEmail(requestDto.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(requestDto.password()));
        user.setUserType(UserType.CUSTOMER);
        user.setEnabled(true);
        user.getRoles().add(customerRole);

        User savedUser = userRepository.save(user);

        CustomerProfile profile = new CustomerProfile(savedUser);
        savedUser.setCustomerProfile(profile);
        userRepository.save(savedUser);

        log.info("New customer registered: {}", savedUser.getEmail());
        return toUserResponse(savedUser);
    }

    @Override
    @Transactional
    public TokenResponseDto login(LoginRequestDto requestDto) {
        User user = userRepository.findByEmail(requestDto.email().toLowerCase().trim())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isEnabled()) {
            throw new InvalidCredentialsException();
        }

        // Google-only accounts have no password — direct them to OAuth2
        if (user.getPasswordHash() == null) {
            throw new GoogleSignInRequiredException();
        }

        if (!passwordEncoder.matches(requestDto.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return issueTokenPair(user);
    }

    @Override
    @Transactional
    public TokenResponseDto refresh(RefreshTokenRequestDto requestDto) {
        RefreshToken stored = refreshTokenRepository.findByToken(requestDto.refreshToken())
                .orElseThrow(TokenRevokedException::new);

        if (stored.isRevoked()) {
            throw new TokenRevokedException();
        }

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException();
        }

        // Validate the JWT signature and type
        try {
            Claims claims = jwtService.parse(requestDto.refreshToken());
            if (!jwtService.isRefreshToken(claims)) {
                throw new TokenRevokedException();
            }
        } catch (JwtException ex) {
            throw new TokenRevokedException();
        }

        User user = stored.getUser();
        if (!user.isEnabled()) {
            throw new InvalidCredentialsException();
        }

        // Rotate: revoke old token
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return issueTokenPair(user);
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto me(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponseDto updateMe(Long userId, UpdateProfileRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (requestDto.firstName() != null && !requestDto.firstName().isBlank()) {
            user.setFirstName(requestDto.firstName().trim());
        }
        if (requestDto.lastName() != null) {
            user.setLastName(requestDto.lastName().isBlank() ? null : requestDto.lastName().trim());
        }
        if (requestDto.phone() != null) {
            user.setPhone(requestDto.phone().isBlank() ? null : requestDto.phone().trim());
        }

        return toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // For Google-only users (no password yet), skip the current-password check.
        // They are setting a password for the very first time.
        if (user.getPasswordHash() != null) {
            if (requestDto.currentPassword() == null || requestDto.currentPassword().isBlank()) {
                throw new InvalidCredentialsException();
            }
            if (!passwordEncoder.matches(requestDto.currentPassword(), user.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }
        }

        user.setPasswordHash(passwordEncoder.encode(requestDto.newPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public ForgotPasswordResponseDto forgotPassword(ForgotPasswordRequestDto requestDto) {
        String email = requestDto.email().toLowerCase().trim();

        var userOpt = userRepository.findByEmail(email);

        // Unknown email — return generic success to prevent enumeration
        if (userOpt.isEmpty()) {
            log.debug("Forgot-password: email not found (not disclosed to caller): {}", email);
            return ForgotPasswordResponseDto.emailSent();
        }

        User user = userOpt.get();

        // Disabled account — treat same as unknown email
        if (!user.isEnabled()) {
            return ForgotPasswordResponseDto.emailSent();
        }

        // Google-only account (no password) — send a social-login reminder email
        // and tell the frontend explicitly so it can show the Google sign-in button
        if (user.getPasswordHash() == null) {
            String loginUrl = (user.getUserType() == UserType.STAFF) ? adminUrl + "/login" : frontendUrl + "/login";
            emailService.send(EmailRequest.of(
                    user.getEmail(),
                    EmailTemplate.SOCIAL_LOGIN_REMINDER,
                    Map.of(
                            "firstName", user.getFirstName(),
                            "email",     user.getEmail(),
                            "loginUrl",  loginUrl
                    )
            ));
            log.info("Social login reminder sent to Google-only account: {}", email);
            return ForgotPasswordResponseDto.socialAccount();
        }

        // Normal user — generate reset token and send reset-link email
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String tokenValue = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(RESET_TOKEN_EXPIRY_SECONDS);
        passwordResetTokenRepository.save(new PasswordResetToken(tokenValue, user, expiresAt));

        String baseUrl  = (user.getUserType() == UserType.STAFF) ? adminUrl : frontendUrl;
        String resetUrl = baseUrl + "/reset-password?token=" + tokenValue;

        emailService.send(EmailRequest.of(
                user.getEmail(),
                EmailTemplate.PASSWORD_RESET,
                Map.of(
                        "firstName", user.getFirstName(),
                        "resetUrl",  resetUrl
                )
        ));

        log.info("Password reset email sent to: {}", email);
        return ForgotPasswordResponseDto.emailSent();
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDto requestDto) {
        PasswordResetToken prt = passwordResetTokenRepository
                .findByToken(requestDto.token())
                .orElseThrow(PasswordResetTokenNotFoundException::new);

        if (prt.isUsed()) {
            throw new PasswordResetTokenNotFoundException();
        }

        if (prt.getExpiresAt().isBefore(Instant.now())) {
            throw new PasswordResetTokenExpiredException();
        }

        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(requestDto.newPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public String updateProfilePictureKey(Long userId, String newKey) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        String oldKey = user.getProfilePictureKey();
        user.setProfilePictureKey(newKey);
        userRepository.save(user);
        return oldKey;
    }

    // ──────────────────────────────────────────────────────────────────────────

    private TokenResponseDto issueTokenPair(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getUserType());
        String refreshTokenValue = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        Instant expiresAt = Instant.now().plusSeconds(jwtService.getRefreshTokenExpirySeconds());
        RefreshToken refreshToken = new RefreshToken(refreshTokenValue, user, expiresAt);
        refreshTokenRepository.save(refreshToken);

        return TokenResponseDto.of(accessToken, refreshTokenValue, 3600L);
    }

    private UserResponseDto toUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getPhone(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserType(),
                user.isEnabled(),
                user.isEmailVerified(),
                user.isPhoneVerified(),
                roleNames,
                user.getCreatedAt(),
                storageService.buildUrl(user.getProfilePictureKey()),
                user.getPasswordHash() != null
        );
    }
}
