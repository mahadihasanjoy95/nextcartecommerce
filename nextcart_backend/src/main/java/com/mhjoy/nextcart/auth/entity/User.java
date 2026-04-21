package com.mhjoy.nextcart.auth.entity;

import com.mhjoy.nextcart.auth.enums.UserType;
import com.mhjoy.nextcart.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true),
        @Index(name = "idx_user_phone", columnList = "phone", unique = true),
        @Index(name = "idx_user_type", columnList = "user_type")
})
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nullable: customers may register with phone only in the future (OTP flow).
     * Unique index allows multiple NULLs in MySQL.
     */
    @Column(name = "email", unique = true, length = 255)
    private String email;

    /**
     * Nullable now. Will be the primary identifier for phone+OTP login.
     */
    @Column(name = "phone", unique = true, length = 20)
    private String phone;

    /**
     * BCrypt-hashed password. Nullable to support future passwordless/OTP-only accounts.
     */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    /**
     * Google OAuth2 subject ID ("sub" claim). Null for non-Google users.
     * Unique index allows multiple NULLs in MySQL — same pattern as email/phone.
     */
    @Column(name = "google_id", unique = true, length = 255)
    private String googleId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "phone_verified", nullable = false)
    private boolean phoneVerified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private CustomerProfile customerProfile;

    /**
     * S3 object key for the user's profile picture (e.g. "profiles/uuid.jpg").
     * Null means no profile picture uploaded. Full URL is constructed at response time.
     */
    @Column(name = "profile_picture_key", length = 500)
    private String profilePictureKey;
}
