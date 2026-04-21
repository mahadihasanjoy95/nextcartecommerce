package com.mhjoy.nextcart.product.service.serviceImpl;

import com.mhjoy.nextcart.product.dto.request.CreateProductRequestDto;
import com.mhjoy.nextcart.product.dto.request.ProductSearchRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateProductRequestDto;
import com.mhjoy.nextcart.product.dto.response.ProductResponseDto;
import com.mhjoy.nextcart.product.entity.Brand;
import com.mhjoy.nextcart.product.entity.Category;
import com.mhjoy.nextcart.product.entity.Product;
import com.mhjoy.nextcart.product.entity.ProductImage;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.exception.BrandNotFoundException;
import com.mhjoy.nextcart.product.exception.CategoryNotFoundException;
import com.mhjoy.nextcart.product.exception.InvalidProductSearchException;
import com.mhjoy.nextcart.product.exception.ProductNotFoundException;
import com.mhjoy.nextcart.product.exception.ProductSlugConflictException;
import com.mhjoy.nextcart.common.storage.StorageService;
import com.mhjoy.nextcart.product.mapper.ProductMapper;
import com.mhjoy.nextcart.product.repository.BrandRepository;
import com.mhjoy.nextcart.product.repository.CategoryRepository;
import com.mhjoy.nextcart.product.repository.ProductRepository;
import com.mhjoy.nextcart.product.service.ProductService;
import com.mhjoy.nextcart.product.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;
    private final StorageService storageService;

    /**
     * Creates a new product.
     *
     * <p>The slug is derived from the supplied slug value, falling back to the product name
     * if none is provided. A {@link ProductSlugConflictException} is thrown if the resolved
     * slug is already taken.</p>
     *
     * @author Mahadi Hasan Joy
     * @since 2026-04-09
     */
    @Override
    public ProductResponseDto createProduct(CreateProductRequestDto requestDto) {
        String slug = buildSlug(requestDto.getName(), requestDto.getSlug());

        if (productRepository.existsBySlug(slug)) {
            throw new ProductSlugConflictException(slug);
        }

        Product product = productMapper.toEntity(requestDto);
        product.setSlug(slug);
        product.setCategory(resolveCategory(requestDto.getCategoryId()));
        product.setBrand(resolveBrand(requestDto.getBrandId()));
        replaceProductImages(product, requestDto.getImageUrls());

        log.debug("Creating product with slug '{}'", slug);
        return productMapper.toResponseDto(productRepository.save(product));
    }

    /**
     * Updates an existing product by its ID.
     *
     * <p>Only non-null fields in the request DTO are applied. Slug changes are validated
     * for uniqueness before assignment. Category and brand are re-resolved from the
     * database when new IDs are supplied.</p>
     *
     * @author Mahadi Hasan Joy
     * @since 2026-04-09
     */
    @Override
    public ProductResponseDto updateProduct(Long productId, UpdateProductRequestDto requestDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (requestDto.getSlug() != null && !requestDto.getSlug().isBlank()) {
            String newSlug = toSlug(requestDto.getSlug());
            if (!newSlug.equals(product.getSlug()) && productRepository.existsBySlug(newSlug)) {
                throw new ProductSlugConflictException(newSlug);
            }
            product.setSlug(newSlug);
        }

        if (requestDto.getCategoryId() != null) {
            product.setCategory(resolveCategory(requestDto.getCategoryId()));
        }

        if (requestDto.getBrandId() != null) {
            product.setBrand(resolveBrand(requestDto.getBrandId()));
        }

        productMapper.updateProductFromDto(requestDto, product);
        if (requestDto.getImageUrls() != null) {
            List<String> oldUrls = product.getProductImages().stream()
                    .map(ProductImage::getImageUrl)
                    .toList();
            replaceProductImages(product, requestDto.getImageUrls());
            ProductResponseDto result = productMapper.toResponseDto(productRepository.save(product));
            deleteRemovedImages(oldUrls, requestDto.getImageUrls());
            log.debug("Updating product id={}", productId);
            return result;
        }

        log.debug("Updating product id={}", productId);
        return productMapper.toResponseDto(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        // Collect S3 keys before deletion so we can purge them afterward
        String thumbnailUrl = product.getThumbnailUrl();
        List<String> galleryUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        productRepository.delete(product);
        log.info("Deleted product id={}", productId);

        // Purge S3 objects — fire-and-forget, failures are logged but do not surface
        storageService.delete(storageService.extractKey(thumbnailUrl));
        galleryUrls.forEach(url -> storageService.delete(storageService.extractKey(url)));
    }

    @Override
    public ProductResponseDto removeThumbnail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        String existing = product.getThumbnailUrl();
        product.setThumbnailUrl(null);
        ProductResponseDto result = productMapper.toResponseDto(productRepository.save(product));

        storageService.delete(storageService.extractKey(existing));
        log.info("Removed thumbnail for product id={}", productId);
        return result;
    }

    /**
     * Retrieves a product by its ID regardless of status.
     *
     * @author Mahadi Hasan Joy
     * @since 2026-04-09
     */
    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getActiveProductById(Long productId) {
        return productRepository.findById(productId)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .map(productMapper::toResponseDto)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getAdminProductById(Long productId) {
        return productRepository.findById(productId)
                .map(productMapper::toResponseDto)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    /**
     * Retrieves an active product by its slug.
     *
     * @author Mahadi Hasan Joy
     * @since 2026-04-09
     */
    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getActiveProductBySlug(String slug) {
        return productRepository.findBySlugAndStatus(slug, ProductStatus.ACTIVE)
                .map(productMapper::toResponseDto)
                .orElseThrow(() -> new ProductNotFoundException(slug));
    }

    /**
     * Returns a paginated list of active products.
     *
     * @author Mahadi Hasan Joy
     * @since 2026-04-09
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> searchActiveProducts(ProductSearchRequestDto requestDto) {
        validateSearchRequest(requestDto);

        Pageable pageable = PageRequest.of(
                requestDto.getPage(),
                requestDto.getSize(),
                buildSort(requestDto)
        );

        return productRepository.findAll(ProductSpecification.forPublicSearch(requestDto), pageable)
                .map(productMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> searchProductsForAdmin(ProductSearchRequestDto requestDto) {
        validateSearchRequest(requestDto);

        Pageable pageable = PageRequest.of(
                requestDto.getPage(),
                requestDto.getSize(),
                buildSort(requestDto)
        );

        return productRepository.findAll(ProductSpecification.forAdminSearch(requestDto), pageable)
                .map(productMapper::toResponseDto);
    }

    @Override
    public ProductResponseDto updateThumbnailKey(Long productId, String thumbnailKey) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        product.setThumbnailUrl(thumbnailKey);
        log.info("Updated thumbnail key for product id={}", productId);
        return productMapper.toResponseDto(productRepository.save(product));
    }

    @Override
    public ProductResponseDto replaceGalleryKeys(Long productId, List<String> imageKeys) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        List<String> oldUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        replaceProductImages(product, imageKeys);
        ProductResponseDto result = productMapper.toResponseDto(productRepository.save(product));

        deleteRemovedImages(oldUrls, imageKeys);
        log.info("Replaced {} gallery image(s) for product id={}", imageKeys.size(), productId);
        return result;
    }

    @Override
    public ProductResponseDto removeGallery(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        List<String> oldUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        product.getProductImages().clear();
        ProductResponseDto result = productMapper.toResponseDto(productRepository.save(product));

        oldUrls.forEach(url -> storageService.delete(storageService.extractKey(url)));
        log.info("Cleared {} gallery image(s) for product id={}", oldUrls.size(), productId);
        return result;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));
    }

    private Brand resolveBrand(Long brandId) {
        if (brandId == null) {
            return null;
        }
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new BrandNotFoundException(brandId));
    }

    private String buildSlug(String name, String slug) {
        if (slug != null && !slug.isBlank()) {
            return toSlug(slug);
        }
        return toSlug(name);
    }

    private void validateSearchRequest(ProductSearchRequestDto requestDto) {
        BigDecimal minPrice = requestDto.getMinPrice();
        BigDecimal maxPrice = requestDto.getMaxPrice();

        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new InvalidProductSearchException("Minimum price cannot be greater than maximum price");
        }

        if (requestDto.getSize() > 100) {
            throw new InvalidProductSearchException("Size cannot be greater than 100");
        }
    }

    private Sort buildSort(ProductSearchRequestDto requestDto) {
        if (requestDto.getSortBy() == null) {
            requestDto.setSortBy(com.mhjoy.nextcart.product.enums.ProductSortBy.NEWEST);
        }

        Sort.Direction direction = requestDto.getSortDir() != null ? requestDto.getSortDir() : Sort.Direction.DESC;

        return switch (requestDto.getSortBy()) {
            case OLDEST -> Sort.by(Sort.Direction.ASC, "createdAt").and(Sort.by(Sort.Direction.ASC, "id"));
            case NAME -> Sort.by(direction, "name").and(Sort.by(Sort.Direction.ASC, "id"));
            case PRICE -> JpaSort.unsafe(direction, "coalesce(salePrice, basePrice)")
                    .and(Sort.by(Sort.Direction.ASC, "id"));
            case NEWEST -> Sort.by(direction, "createdAt").and(Sort.by(Sort.Direction.DESC, "id"));
        };
    }

    private void replaceProductImages(Product product, List<String> imageUrls) {
        product.getProductImages().clear();

        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrls.get(i));
            productImage.setSortOrder(i);
            productImage.setPrimaryImage(i == 0);
            product.getProductImages().add(productImage);
        }

        // Only fall back to first gallery image if no dedicated thumbnail has been set.
        // Never overwrite an existing thumbnail — gallery and thumbnail are separate.
        if (product.getThumbnailUrl() == null || product.getThumbnailUrl().isBlank()) {
            product.setThumbnailUrl(imageUrls.getFirst());
        }
    }

    private void deleteRemovedImages(List<String> oldUrls, List<String> newUrls) {
        Set<String> retainedUrls = new HashSet<>(newUrls);
        oldUrls.stream()
                .filter(url -> !retainedUrls.contains(url))
                .forEach(url -> storageService.delete(storageService.extractKey(url)));
    }

    private String toSlug(String value) {
        return value.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
