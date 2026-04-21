package com.mhjoy.nextcart.auth.service.serviceImpl;

import com.mhjoy.nextcart.auth.dto.request.AssignUserRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateAdminRequestDto;
import com.mhjoy.nextcart.auth.dto.response.UserResponseDto;
import com.mhjoy.nextcart.auth.constants.SystemRoles;
import com.mhjoy.nextcart.auth.entity.Role;
import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.auth.exception.InvalidAssignableRoleException;
import com.mhjoy.nextcart.auth.exception.InvalidRoleAssignmentTargetException;
import com.mhjoy.nextcart.auth.exception.ProtectedSuperAdminOperationException;
import com.mhjoy.nextcart.auth.exception.RoleNotFoundException;
import com.mhjoy.nextcart.auth.exception.UserAlreadyExistsException;
import com.mhjoy.nextcart.auth.exception.UserNotFoundException;
import com.mhjoy.nextcart.auth.repository.RefreshTokenRepository;
import com.mhjoy.nextcart.auth.repository.RoleRepository;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.auth.service.UserService;
import com.mhjoy.nextcart.common.email.EmailRequest;
import com.mhjoy.nextcart.common.email.EmailService;
import com.mhjoy.nextcart.common.email.EmailTemplate;
import com.mhjoy.nextcart.common.response.PageResponse;
import com.mhjoy.nextcart.common.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.admin.url}")
    private String adminUrl;

    @Override
    @Transactional
    public UserResponseDto createAdmin(CreateAdminRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new UserAlreadyExistsException("An account with email '" + requestDto.email() + "' already exists");
        }

        String roleName = requestDto.effectiveRole();

        // Prevent assigning reserved roles (SUPER_ADMIN, CUSTOMER) through this endpoint
        if (SystemRoles.isReserved(roleName)) {
            throw new InvalidAssignableRoleException(roleName);
        }

        Role adminRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException(roleName));

        String temporaryPassword = generateSecurePassword();

        User user = new User();
        user.setFirstName(requestDto.firstName());
        user.setLastName(requestDto.lastName());
        user.setEmail(requestDto.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setUserType(UserType.STAFF);
        user.setEnabled(true);
        user.getRoles().add(adminRole);

        User saved = userRepository.save(user);
        log.info("New admin created: {}", saved.getEmail());

        emailService.send(EmailRequest.of(
                saved.getEmail(),
                EmailTemplate.ADMIN_INVITE,
                Map.of(
                        "firstName",         saved.getFirstName(),
                        "email",             saved.getEmail(),
                        "temporaryPassword", temporaryPassword,
                        "loginUrl",          adminUrl + "/login"   // admin panel, not customer storefront
                )
        ));

        return toUserResponse(saved);
    }

    private String generateSecurePassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findAll(pageable)
                .map(this::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listAdminUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findAllByUserType(UserType.STAFF, pageable)
                .map(this::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listCustomerUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findAllByUserType(UserType.CUSTOMER, pageable)
                .map(this::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponseDto assignRole(Long userId, AssignUserRoleRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertRoleAssignmentTargetIsAllowed(user);
        assertSuperAdminIsMutable(user);
        assertRoleIsAssignable(requestDto.role());

        Role role = roleRepository.findByName(requestDto.role())
                .orElseThrow(() -> new RoleNotFoundException(requestDto.role()));

        // Enforce single-role: clear existing roles before assigning
        user.getRoles().clear();
        user.getRoles().add(role);

        // Revoke all active refresh tokens so the user re-authenticates with the new role
        refreshTokenRepository.revokeAllByUserId(userId);

        User saved = userRepository.save(user);
        log.info("Role {} assigned to user {}", requestDto.role(), userId);
        return toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponseDto enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertSuperAdminIsMutable(user);
        user.setEnabled(true);
        return toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDto disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertSuperAdminIsMutable(user);
        user.setEnabled(false);
        // Revoke all active refresh tokens
        refreshTokenRepository.revokeAllByUserId(userId);
        return toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertSuperAdminIsMutable(user);
        refreshTokenRepository.deleteAllByUserId(userId);
        userRepository.delete(user);
        log.info("Deleted user {}", userId);
    }

    // ──────────────────────────────────────────────────────────────────────────

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

    private void assertSuperAdminIsMutable(User user) {
        boolean isSuperAdmin = user.getRoles().stream()
                .anyMatch(role -> SystemRoles.SUPER_ADMIN.equals(role.getName()));

        if (isSuperAdmin) {
            throw new ProtectedSuperAdminOperationException();
        }
    }

    private void assertRoleIsAssignable(String roleName) {
        if (SystemRoles.isReserved(roleName)) {
            throw new InvalidAssignableRoleException(roleName);
        }
    }

    private void assertRoleAssignmentTargetIsAllowed(User user) {
        if (user.getUserType() != UserType.STAFF) {
            throw new InvalidRoleAssignmentTargetException();
        }
    }
}
