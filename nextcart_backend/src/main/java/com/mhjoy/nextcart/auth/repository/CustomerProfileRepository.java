package com.mhjoy.nextcart.auth.repository;

import com.mhjoy.nextcart.auth.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {
}
