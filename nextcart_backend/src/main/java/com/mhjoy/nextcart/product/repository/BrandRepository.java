package com.mhjoy.nextcart.product.repository;

import com.mhjoy.nextcart.product.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    boolean existsBySlug(String slug);

    List<Brand> findAllByOrderByNameAsc();
}
