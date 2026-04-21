package com.mhjoy.nextcart.auth.entity;

import com.mhjoy.nextcart.auth.enums.Gender;
import com.mhjoy.nextcart.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@NoArgsConstructor
public class CustomerProfile extends BaseAuditableEntity {

    /**
     * Shares the same PK as the parent User — true one-to-one.
     */
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 20)
    private Gender gender;

    @Column(name = "loyalty_points", nullable = false)
    private int loyaltyPoints = 0;

    public CustomerProfile(User user) {
        this.user = user;
    }
}
