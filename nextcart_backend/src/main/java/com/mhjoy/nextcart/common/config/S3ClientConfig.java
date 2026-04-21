package com.mhjoy.nextcart.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Creates the AWS S3Client bean using credentials from {@link AwsS3Properties}.
 */
@Configuration
public class S3ClientConfig {

    private final AwsS3Properties awsS3Properties;

    public S3ClientConfig(AwsS3Properties awsS3Properties) {
        this.awsS3Properties = awsS3Properties;
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(awsS3Properties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                                awsS3Properties.getAccessKey(),
                                awsS3Properties.getSecretKey()
                        )
                ))
                .build();
    }
}
