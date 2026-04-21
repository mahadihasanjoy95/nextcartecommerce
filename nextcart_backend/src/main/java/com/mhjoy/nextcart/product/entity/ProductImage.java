package com.mhjoy.nextcart.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_images", indexes = {
        @Index(name = "idx_product_image_product", columnList = "product_id"),
        @Index(name = "idx_product_image_sort", columnList = "product_id, sort_order")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_primary", nullable = false)
    private boolean primaryImage;
}
