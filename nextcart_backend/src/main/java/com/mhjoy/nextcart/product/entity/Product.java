package com.mhjoy.nextcart.product.entity;

import com.mhjoy.nextcart.common.entity.BaseAuditableEntity;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "products",
        indexes = {
                @Index(name = "idx_product_slug", columnList = "slug", unique = true),
                @Index(name = "idx_product_status", columnList = "status"),
                @Index(name = "idx_product_featured", columnList = "featured"),
                @Index(name = "idx_product_category", columnList = "category_id"),
                @Index(name = "idx_product_brand", columnList = "brand_id"),
                @Index(name = "idx_product_name", columnList = "name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = {"category", "brand", "productImages"})
public class Product extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(length = 1000)
    private String shortDescription;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProductType productType = ProductType.SIMPLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProductStatus status = ProductStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean newArrival = false;

    @Column(nullable = false)
    private boolean trackInventory = true;

    @Column(nullable = false)
    private boolean inStock = true;

    @Column(precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal salePrice;

    @Column(nullable = false, length = 10)
    private String currency = "BDT";

    @Column(length = 1000)
    private String thumbnailUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    private List<ProductImage> productImages = new ArrayList<>();

    @Column(length = 255)
    private String metaTitle;

    @Column(length = 500)
    private String metaDescription;

    private LocalDateTime publishedAt;
}
