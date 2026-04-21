package com.mhjoy.nextcart.auth.controller;

import com.mhjoy.nextcart.auth.dto.request.AssignUserRoleRequestDto;
import com.mhjoy.nextcart.auth.dto.request.CreateAdminRequestDto;
import com.mhjoy.nextcart.auth.dto.response.UserResponseDto;
import com.mhjoy.nextcart.auth.service.UserService;
import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Create and manage users, assign roles")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new admin user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Admin created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> createAdmin(
            @Valid @RequestBody CreateAdminRequestDto requestDto) {
        UserResponseDto user = userService.createAdmin(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Admin created successfully", user));
    }

    @GetMapping
    @Operation(summary = "List all users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/admins")
    @Operation(summary = "List admin and staff users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listAdminUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listAdminUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/customers")
    @Operation(summary = "List customer users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listCustomerUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listCustomerUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(CommonApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Assign a role to a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role assigned"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User or role not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> assignRole(
            @PathVariable Long id,
            @Valid @RequestBody AssignUserRoleRequestDto requestDto) {
        return ResponseEntity.ok(CommonApiResponse.success("Role assigned successfully",
                userService.assignRole(id, requestDto)));
    }

    @PatchMapping("/{id}/enable")
    @Operation(summary = "Enable a user account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User enabled"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> enableUser(@PathVariable Long id) {
        return ResponseEntity.ok(CommonApiResponse.success("User enabled", userService.enableUser(id)));
    }

    @PatchMapping("/{id}/disable")
    @Operation(summary = "Disable a user account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User disabled"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> disableUser(@PathVariable Long id) {
        return ResponseEntity.ok(CommonApiResponse.success("User disabled", userService.disableUser(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "409", description = "Protected user cannot be deleted")
    })
    public ResponseEntity<CommonApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(CommonApiResponse.success("User deleted", null));
    }
}
