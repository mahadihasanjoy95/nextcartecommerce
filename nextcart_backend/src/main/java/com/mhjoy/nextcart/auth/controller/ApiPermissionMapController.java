package com.mhjoy.nextcart.auth.controller;

import com.mhjoy.nextcart.auth.dto.request.CreateApiPermissionMapRequestDto;
import com.mhjoy.nextcart.auth.dto.request.UpdateApiPermissionMapRequestDto;
import com.mhjoy.nextcart.auth.dto.response.ApiPermissionMapResponseDto;
import com.mhjoy.nextcart.auth.service.PermissionService;
import com.mhjoy.nextcart.common.response.CommonApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/api-permission-maps")
@RequiredArgsConstructor
@Tag(name = "API Permission Map Management", description = "Map HTTP endpoints to required permissions")
@SecurityRequirement(name = "bearerAuth")
public class ApiPermissionMapController {

    private final PermissionService permissionService;

    @PostMapping
    @Operation(summary = "Create a new API → permission mapping")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Mapping created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Permission not found"),
            @ApiResponse(responseCode = "409", description = "Mapping already exists for this method + path")
    })
    public ResponseEntity<CommonApiResponse<ApiPermissionMapResponseDto>> create(
            @Valid @RequestBody CreateApiPermissionMapRequestDto requestDto) {
        ApiPermissionMapResponseDto result = permissionService.createApiPermissionMap(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("API permission map created", result));
    }

    @GetMapping
    @Operation(summary = "List all API permission mappings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mappings returned"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<List<ApiPermissionMapResponseDto>>> list() {
        return ResponseEntity.ok(CommonApiResponse.success(permissionService.listApiPermissionMaps()));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a mapping (permission, active flag or description)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mapping updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Mapping not found")
    })
    public ResponseEntity<CommonApiResponse<ApiPermissionMapResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApiPermissionMapRequestDto requestDto) {
        ApiPermissionMapResponseDto result = permissionService.updateApiPermissionMap(id, requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("API permission map updated", result));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an API permission mapping")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mapping deleted"),
            @ApiResponse(responseCode = "404", description = "Mapping not found")
    })
    public ResponseEntity<CommonApiResponse<Void>> delete(@PathVariable Long id) {
        permissionService.deleteApiPermissionMap(id);
        return ResponseEntity.ok(CommonApiResponse.success("API permission map deleted"));
    }
}
