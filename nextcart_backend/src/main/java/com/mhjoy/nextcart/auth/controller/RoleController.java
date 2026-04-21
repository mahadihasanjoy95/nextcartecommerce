package com.mhjoy.nextcart.auth.controller;

import com.mhjoy.nextcart.auth.dto.request.AssignRolePermissionsRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.response.RoleResponseDto;
import com.mhjoy.nextcart.auth.service.RoleService;
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
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "Manage roles and assign permissions to roles")
@SecurityRequirement(name = "bearerAuth")
public class RoleController {

    private final RoleService roleService;

    @PostMapping("/api/v1/roles")
    @Operation(summary = "Create a new role")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Role created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "409", description = "Role already exists")
    })
    public ResponseEntity<CommonApiResponse<RoleResponseDto>> createRole(
            @Valid @RequestBody CreateRoleRequestDto requestDto) {
        RoleResponseDto role = roleService.createRole(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Role created", role));
    }

    @GetMapping("/api/v1/roles")
    @Operation(summary = "List all roles")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Roles returned"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<List<RoleResponseDto>>> listRoles() {
        return ResponseEntity.ok(CommonApiResponse.success(roleService.listAllRoles()));
    }

    @DeleteMapping("/api/v1/roles/{roleId}")
    @Operation(summary = "Delete a role")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role deleted"),
            @ApiResponse(responseCode = "404", description = "Role not found"),
            @ApiResponse(responseCode = "409", description = "Role is protected or still assigned to users")
    })
    public ResponseEntity<CommonApiResponse<Void>> deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.ok(CommonApiResponse.success("Role deleted successfully", null));
    }

    @GetMapping("/api/v1/roles/{roleId}/permissions")
    @Operation(summary = "Get all permissions assigned to a role")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role permissions returned"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    public ResponseEntity<CommonApiResponse<RoleResponseDto>> getRolePermissions(@PathVariable Long roleId) {
        return ResponseEntity.ok(CommonApiResponse.success(roleService.getPermissionsForRole(roleId)));
    }

    @PutMapping("/api/v1/roles/{roleId}/permissions")
    @Operation(summary = "Bulk assign permissions to a role (replaces existing set)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permissions assigned"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Role or permission not found")
    })
    public ResponseEntity<CommonApiResponse<RoleResponseDto>> assignPermissionsToRole(
            @PathVariable Long roleId,
            @Valid @RequestBody AssignRolePermissionsRequestDto requestDto) {
        RoleResponseDto role = roleService.assignPermissionsToRole(roleId, requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Permissions assigned to role", role));
    }
}
