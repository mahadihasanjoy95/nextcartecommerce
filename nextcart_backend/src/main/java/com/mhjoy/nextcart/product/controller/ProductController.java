package com.mhjoy.nextcart.product.controller;

import com.mhjoy.nextcart.common.config.StorageProperties;
import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.common.response.PageResponse;
import com.mhjoy.nextcart.common.storage.StorageService;
import com.mhjoy.nextcart.product.dto.request.CreateProductRequestDto;
import com.mhjoy.nextcart.product.dto.request.ProductSearchRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateProductRequestDto;
import com.mhjoy.nextcart.product.dto.response.ProductResponseDto;
import com.mhjoy.nextcart.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Validated
@Tag(name = "Product Management", description = "APIs for managing and retrieving products")
public class ProductController {

    private final ProductService productService;
    private final StorageService storageService;
    private final StorageProperties storageProperties;

    // ── Public storefront endpoints ──────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Search active products",
               description = "Paginated list of ACTIVE products with keyword search, filters, and sorting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product list retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid search or pagination input")
    })
    public CommonApiResponse<PageResponse<ProductResponseDto>> getProducts(
            @RequestParam(name = "q", required = false) String keyword,
            @Valid @ModelAttribute ProductSearchRequestDto requestDto
    ) {
        if (keyword != null && !keyword.isBlank()) {
            requestDto.setQuery(keyword);
        }
        return CommonApiResponse.success(PageResponse.from(productService.searchActiveProducts(requestDto)));
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get active product by id", description = "Retrieves an ACTIVE product by its id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved"),
            @ApiResponse(responseCode = "404", description = "Product not found or not active")
    })
    public CommonApiResponse<ProductResponseDto> getProductById(@PathVariable Long productId) {
        return CommonApiResponse.success(productService.getActiveProductById(productId));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get active product by slug", description = "Retrieves an ACTIVE product by its slug")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved"),
            @ApiResponse(responseCode = "404", description = "Product not found or not active")
    })
    public CommonApiResponse<ProductResponseDto> getProductBySlug(@PathVariable String slug) {
        return CommonApiResponse.success(productService.getActiveProductBySlug(slug));
    }

    // ── Admin endpoints (all statuses) ──────────────────────────────────────

    @GetMapping("/admin")
    @Operation(summary = "Admin: search all products",
               description = "Paginated product list for admins — returns all statuses (DRAFT, INACTIVE, ARCHIVED, ACTIVE)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product list retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid search or pagination input")
    })
    public CommonApiResponse<PageResponse<ProductResponseDto>> getProductsForAdmin(
            @RequestParam(name = "q", required = false) String keyword,
            @Valid @ModelAttribute ProductSearchRequestDto requestDto
    ) {
        if (keyword != null && !keyword.isBlank()) {
            requestDto.setQuery(keyword);
        }
        return CommonApiResponse.success(PageResponse.from(productService.searchProductsForAdmin(requestDto)));
    }

    @GetMapping("/admin/{productId}")
    @Operation(summary = "Admin: get product by id",
               description = "Retrieves any product by id regardless of status — for admin edit view")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> getAdminProductById(@PathVariable Long productId) {
        return CommonApiResponse.success(productService.getAdminProductById(productId));
    }

    // ── Create & update ──────────────────────────────────────────────────────

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create product", description = "Creates a new product record")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Product created"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Slug already exists")
    })
    public CommonApiResponse<ProductResponseDto> createProduct(@Valid @RequestBody CreateProductRequestDto requestDto) {
        return CommonApiResponse.success("Product created successfully", productService.createProduct(requestDto));
    }

    @PutMapping("/{productId}")
    @Operation(summary = "Update product", description = "Updates an existing product by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateProductRequestDto requestDto
    ) {
        return CommonApiResponse.success("Product updated successfully",
                productService.updateProduct(productId, requestDto));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Delete product", description = "Permanently deletes a product by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product deleted"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return CommonApiResponse.success("Product deleted successfully", null);
    }

    // ── Image upload endpoints ───────────────────────────────────────────────

    /**
     * Uploads a thumbnail image to S3 and immediately links it to the product.
     * This is the correct single-call pattern: upload + link happen in one request.
     */
    @PatchMapping(value = "/{productId}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload product thumbnail",
               description = "Uploads a thumbnail to S3 and saves the URL on the product record")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thumbnail uploaded and linked"),
            @ApiResponse(responseCode = "400", description = "Invalid file"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> uploadThumbnail(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {

        String key = storageService.upload(file, storageProperties.getProductThumbnailPrefix());
        String url = storageService.buildUrl(key);
        ProductResponseDto result = productService.updateThumbnailKey(productId, url);
        return CommonApiResponse.success("Thumbnail uploaded successfully", result);
    }

    @DeleteMapping("/{productId}/thumbnail")
    @Operation(summary = "Remove product thumbnail",
               description = "Deletes the thumbnail from S3 and clears the thumbnailUrl field on the product")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thumbnail removed"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> removeThumbnail(@PathVariable Long productId) {
        return CommonApiResponse.success("Thumbnail removed successfully", productService.removeThumbnail(productId));
    }

    @DeleteMapping("/{productId}/images")
    @Operation(summary = "Remove all gallery images",
               description = "Deletes all gallery images from S3 and clears the product's image collection")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Gallery cleared"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> removeGallery(@PathVariable Long productId) {
        return CommonApiResponse.success("Gallery cleared successfully", productService.removeGallery(productId));
    }

    /**
     * Uploads gallery images to S3 and replaces all existing gallery images on the product.
     * This is the correct single-call pattern: upload + link happen in one request.
     */
    @PostMapping(value = "/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload product gallery images",
               description = "Uploads gallery images to S3 and replaces the product's gallery in one call")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Images uploaded and linked"),
            @ApiResponse(responseCode = "400", description = "Invalid files"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public CommonApiResponse<ProductResponseDto> uploadGalleryImages(
            @PathVariable Long productId,
            @RequestParam("files") List<MultipartFile> files) {

        List<String> keys = storageService.uploadAll(files, storageProperties.getProductGalleryPrefix());
        List<String> urls = keys.stream().map(storageService::buildUrl).toList();
        ProductResponseDto result = productService.replaceGalleryKeys(productId, urls);
        return CommonApiResponse.success("Gallery images uploaded successfully", result);
    }
}
