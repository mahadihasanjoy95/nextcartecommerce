package com.mhjoy.nextcart.common.storage;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Abstraction over the underlying object storage (currently AWS S3).
 */
public interface StorageService {

    /**
     * Uploads a file and returns the stored object key.
     *
     * @param file   the file to upload
     * @param prefix the S3 key prefix (folder), e.g. {@code "profiles/"}
     * @return the S3 object key of the uploaded file
     * @throws StorageException if the upload fails or the file type is not allowed
     */
    String upload(MultipartFile file, String prefix);

    /**
     * Uploads multiple files and returns the list of stored object keys.
     */
    List<String> uploadAll(List<MultipartFile> files, String prefix);

    /**
     * Deletes an object by its S3 key.
     * No-ops silently if the key is null or blank.
     */
    void delete(String key);

    /**
     * Builds a full public URL from an S3 object key.
     * Returns {@code null} if the key is null or blank.
     * If the key is already a full URL it is returned as-is (legacy data support).
     */
    String buildUrl(String key);

    /**
     * Extracts the S3 object key from a full URL by stripping the base URL prefix.
     * If the value is already a bare key it is returned as-is.
     * Returns {@code null} if the input is null or blank.
     */
    String extractKey(String url);
}
