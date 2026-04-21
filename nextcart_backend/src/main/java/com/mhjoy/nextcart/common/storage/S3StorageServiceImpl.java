package com.mhjoy.nextcart.common.storage;

import com.mhjoy.nextcart.common.config.AwsS3Properties;
import com.mhjoy.nextcart.common.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * AWS S3 implementation of {@link StorageService}.
 *
 * <p>Allowed content types: JPEG, PNG, WebP, GIF.
 * Max file size is enforced at the Spring multipart level (10 MB per file).</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageServiceImpl implements StorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final S3Client s3Client;
    private final AwsS3Properties awsProps;
    private final StorageProperties storageProperties;

    @Override
    public String upload(MultipartFile file, String prefix) {
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        String key = prefix + UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(awsProps.getS3().getBucketName())
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
            log.debug("Uploaded file to S3: {}", key);
            return key;

        } catch (IOException e) {
            throw new StorageException("Failed to read file bytes: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new StorageException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> uploadAll(List<MultipartFile> files, String prefix) {
        return files.stream()
                .map(file -> upload(file, prefix))
                .toList();
    }

    @Override
    public void delete(String key) {
        if (key == null || key.isBlank()) {
            return;
        }
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(awsProps.getS3().getBucketName())
                    .key(key)
                    .build();
            s3Client.deleteObject(request);
            log.debug("Deleted S3 object: {}", key);
        } catch (Exception e) {
            log.warn("Failed to delete S3 object '{}': {}", key, e.getMessage());
        }
    }

    @Override
    public String buildUrl(String key) {
        if (key == null || key.isBlank()) return null;
        if (key.startsWith("http://") || key.startsWith("https://")) return key;
        return storageProperties.normalizedBaseUrl() + key;
    }

    @Override
    public String extractKey(String url) {
        if (url == null || url.isBlank()) return null;
        String base = storageProperties.normalizedBaseUrl();
        if (!base.isBlank() && url.startsWith(base)) {
            return url.substring(base.length());
        }
        return url; // already a bare key
    }

    // ─────────────────────────────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new StorageException("File must not be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new StorageException("File type not allowed. Accepted: JPEG, PNG, WebP, GIF");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
