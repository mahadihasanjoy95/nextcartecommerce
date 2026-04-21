package com.mhjoy.nextcart.product.repository;

import com.mhjoy.nextcart.product.entity.Product;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    boolean existsBySlug(String slug);

    boolean existsByCategory_Id(Long categoryId);

    boolean existsByBrand_Id(Long brandId);

    @EntityGraph(attributePaths = {"category", "brand", "productImages"})
    Optional<Product> findByIdAndStatus(Long id, ProductStatus status);

    @EntityGraph(attributePaths = {"category", "brand", "productImages"})
    Optional<Product> findBySlugAndStatus(String slug, ProductStatus status);

    @EntityGraph(attributePaths = {"category", "brand", "productImages"})
    Optional<Product> findById(Long id);

    Page<Product> findAllByStatus(ProductStatus status, Pageable pageable);
}
