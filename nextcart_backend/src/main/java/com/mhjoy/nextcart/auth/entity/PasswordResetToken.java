package com.mhjoy.nextcart.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "password_reset_tokens", indexes = {
        @Index(name = "idx_prt_token", columnList = "token", unique = true),
        @Index(name = "idx_prt_user",  columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "used", nullable = false)
    private boolean used = false;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public PasswordResetToken(String token, User user, Instant expiresAt) {
        this.token     = token;
        this.user      = user;
        this.expiresAt = expiresAt;
    }
}
