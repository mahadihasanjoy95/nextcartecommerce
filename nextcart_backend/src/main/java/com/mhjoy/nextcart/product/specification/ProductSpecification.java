package com.mhjoy.nextcart.product.specification;

import com.mhjoy.nextcart.product.dto.request.ProductSearchRequestDto;
import com.mhjoy.nextcart.product.entity.Brand;
import com.mhjoy.nextcart.product.entity.Category;
import com.mhjoy.nextcart.product.entity.Product;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> forPublicSearch(ProductSearchRequestDto requestDto) {
        return buildSearchSpecification(requestDto, true);
    }

    public static Specification<Product> forAdminSearch(ProductSearchRequestDto requestDto) {
        return buildSearchSpecification(requestDto, false);
    }

    private static Specification<Product> buildSearchSpecification(ProductSearchRequestDto requestDto, boolean publicOnly) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            query.distinct(true);

            Join<Product, Category> categoryJoin = root.join("category", JoinType.LEFT);
            Join<Product, Brand> brandJoin = root.join("brand", JoinType.LEFT);
            Expression<java.math.BigDecimal> effectivePrice =
                    cb.coalesce(root.get("salePrice"), root.get("basePrice"));

            if (publicOnly) {
                predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));
            } else if (requestDto.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), requestDto.getStatus()));
            }

            if (hasText(requestDto.getQuery())) {
                String keyword = "%" + requestDto.getQuery().trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), keyword),
                        cb.like(cb.lower(root.get("slug")), keyword),
                        cb.like(cb.lower(cb.coalesce(root.get("shortDescription"), "")), keyword),
                        cb.like(cb.lower(cb.coalesce(categoryJoin.get("name"), "")), keyword),
                        cb.like(cb.lower(cb.coalesce(brandJoin.get("name"), "")), keyword)
                ));
            }

            if (requestDto.getCategoryId() != null) {
                predicates.add(cb.equal(categoryJoin.get("id"), requestDto.getCategoryId()));
            }

            if (hasText(requestDto.getCategorySlug())) {
                predicates.add(cb.equal(cb.lower(categoryJoin.get("slug")),
                        requestDto.getCategorySlug().trim().toLowerCase(Locale.ROOT)));
            }

            if (requestDto.getBrandId() != null) {
                predicates.add(cb.equal(brandJoin.get("id"), requestDto.getBrandId()));
            }

            if (hasText(requestDto.getBrandSlug())) {
                predicates.add(cb.equal(cb.lower(brandJoin.get("slug")),
                        requestDto.getBrandSlug().trim().toLowerCase(Locale.ROOT)));
            }

            if (requestDto.getProductType() != null) {
                predicates.add(cb.equal(root.get("productType"), requestDto.getProductType()));
            }

            if (requestDto.getFeatured() != null) {
                predicates.add(cb.equal(root.get("featured"), requestDto.getFeatured()));
            }

            if (requestDto.getNewArrival() != null) {
                predicates.add(cb.equal(root.get("newArrival"), requestDto.getNewArrival()));
            }

            if (requestDto.getInStock() != null) {
                predicates.add(cb.equal(root.get("inStock"), requestDto.getInStock()));
            }

            if (requestDto.getOnSale() != null) {
                if (requestDto.getOnSale()) {
                    predicates.add(cb.isNotNull(root.get("salePrice")));
                    predicates.add(cb.isNotNull(root.get("basePrice")));
                    predicates.add(cb.lessThan(root.get("salePrice"), root.get("basePrice")));
                } else {
                    predicates.add(cb.or(
                            cb.isNull(root.get("salePrice")),
                            cb.isNull(root.get("basePrice")),
                            cb.greaterThanOrEqualTo(root.get("salePrice"), root.get("basePrice"))
                    ));
                }
            }

            if (requestDto.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(effectivePrice, requestDto.getMinPrice()));
            }

            if (requestDto.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(effectivePrice, requestDto.getMaxPrice()));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
