package com.mhjoy.nextcart.common.upload.controller;

import com.mhjoy.nextcart.auth.service.AuthService;
import com.mhjoy.nextcart.common.config.StorageProperties;
import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.common.storage.StorageService;
import com.mhjoy.nextcart.common.upload.dto.response.UploadResponseDto;
import com.mhjoy.nextcart.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Handles file uploads for profile pictures and product images.
 *
 * <p>Uploads are authenticated operations — the JWT filter populates
 * the security context before these endpoints execute.</p>
 */
@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "APIs for uploading images to S3")
public class UploadController {

    private final StorageService storageService;
    private final StorageProperties storageProperties;
    private final AuthService authService;
    private final CurrentUserService currentUserService;

    // ── Profile picture ───────────────────────────────────────────────────────

    @PostMapping(value = "/profile-picture",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload profile picture",
               description = "Uploads a profile picture for the authenticated user and updates their record.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Profile picture uploaded"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<UploadResponseDto> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {

        Long userId = currentUserService.getCurrentUserId();
        String newKey = storageService.upload(file, storageProperties.getProfilePicturePrefix());

        // Delete the previous picture and persist the new key
        String oldKey = authService.updateProfilePictureKey(userId, newKey);
        if (oldKey != null && !oldKey.isBlank()) {
            storageService.delete(oldKey);
        }

        String url = storageService.buildUrl(newKey);
        return CommonApiResponse.success("Profile picture uploaded successfully",
                new UploadResponseDto(newKey, url));
    }

    // ── Product thumbnail ─────────────────────────────────────────────────────

    @PostMapping(value = "/product-thumbnail",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload product thumbnail",
               description = "Uploads a thumbnail image for a product.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Thumbnail uploaded"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<UploadResponseDto> uploadProductThumbnail(
            @RequestParam("file") MultipartFile file) {

        String key = storageService.upload(file, storageProperties.getProductThumbnailPrefix());
        String url = storageService.buildUrl(key);
        return CommonApiResponse.success("Thumbnail uploaded successfully",
                new UploadResponseDto(key, url));
    }

    // ── Product gallery images ─────────────────────────────────────────────────

    @PostMapping(value = "/product-images",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload product gallery images",
               description = "Uploads one or more gallery images for a product.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Images uploaded"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<List<UploadResponseDto>> uploadProductImages(
            @RequestParam("files") List<MultipartFile> files) {

        List<UploadResponseDto> results = storageService
                .uploadAll(files, storageProperties.getProductGalleryPrefix())
                .stream()
                .map(key -> new UploadResponseDto(key, storageService.buildUrl(key)))
                .toList();

        return CommonApiResponse.success("Images uploaded successfully", results);
    }
}
