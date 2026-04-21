package com.mhjoy.nextcart.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds {@code aws.*} properties from application.properties / profile files.
 *
 * <p>Secret values (access-key, secret-key) must be provided through
 * gitignored profile files — they are never committed.</p>
 */
@Component
@ConfigurationProperties(prefix = "aws")
public class AwsS3Properties {

    private String region;
    private String accessKey;
    private String secretKey;
    private S3 s3 = new S3();

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getAccessKey() { return accessKey; }
    public void setAccessKey(String accessKey) { this.accessKey = accessKey; }

    public String getSecretKey() { return secretKey; }
    public void setSecretKey(String secretKey) { this.secretKey = secretKey; }

    public S3 getS3() { return s3; }
    public void setS3(S3 s3) { this.s3 = s3; }

    public static class S3 {
        private String bucketName;
        public String getBucketName() { return bucketName; }
        public void setBucketName(String bucketName) { this.bucketName = bucketName; }
    }
}
