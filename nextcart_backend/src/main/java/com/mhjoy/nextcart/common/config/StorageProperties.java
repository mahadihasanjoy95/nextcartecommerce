package com.mhjoy.nextcart.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds {@code app.storage.*} properties from application.properties.
 *
 * <p>Used by {@link com.mhjoy.nextcart.product.mapper.ProductMapper} and
 * {@link com.mhjoy.nextcart.common.storage.StorageService} to construct
 * full public URLs from stored S3 object keys.</p>
 */
@Component
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /** Base URL of the S3 bucket, e.g. {@code https://nextcart-media.s3.us-east-1.amazonaws.com/} */
    private String baseUrl;

    /** Key prefix for profile pictures, e.g. {@code profiles/} */
    private String profilePicturePrefix;

    /** Key prefix for product thumbnails, e.g. {@code products/thumbnails/} */
    private String productThumbnailPrefix;

    /** Key prefix for product gallery images, e.g. {@code products/gallery/} */
    private String productGalleryPrefix;

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getProfilePicturePrefix() { return profilePicturePrefix; }
    public void setProfilePicturePrefix(String profilePicturePrefix) { this.profilePicturePrefix = profilePicturePrefix; }

    public String getProductThumbnailPrefix() { return productThumbnailPrefix; }
    public void setProductThumbnailPrefix(String productThumbnailPrefix) { this.productThumbnailPrefix = productThumbnailPrefix; }

    public String getProductGalleryPrefix() { return productGalleryPrefix; }
    public void setProductGalleryPrefix(String productGalleryPrefix) { this.productGalleryPrefix = productGalleryPrefix; }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Returns the base URL guaranteed to end with a slash.
     * Example: {@code "https://nextcart-media.s3.us-east-1.amazonaws.com/"}
     */
    public String normalizedBaseUrl() {
        if (baseUrl == null) return "";
        return baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
    }
}
