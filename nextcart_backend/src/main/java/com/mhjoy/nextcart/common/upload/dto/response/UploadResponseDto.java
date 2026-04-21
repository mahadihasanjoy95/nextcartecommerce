package com.mhjoy.nextcart.common.upload.dto.response;

/**
 * Response returned by upload endpoints.
 *
 * @param key the S3 object key — store this in the database
 * @param url the full public URL — use this to display the image immediately
 */
public record UploadResponseDto(String key, String url) {}
