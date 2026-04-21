package com.mhjoy.nextcart.product.repository;

import com.mhjoy.nextcart.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsBySlug(String slug);

    List<Category> findAllByOrderByNameAsc();
}
