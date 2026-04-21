package com.mhjoy.nextcart.product.controller;

import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.product.dto.request.CreateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.response.CategoryResponseDto;
import com.mhjoy.nextcart.product.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "APIs for managing and retrieving categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create category", description = "Creates a new category")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Category slug already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public CommonApiResponse<CategoryResponseDto> createCategory(@Valid @RequestBody CreateCategoryRequestDto requestDto) {
        return CommonApiResponse.success("Category created successfully", categoryService.createCategory(requestDto));
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "Update category", description = "Updates a category")
    public CommonApiResponse<CategoryResponseDto> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody UpdateCategoryRequestDto requestDto) {
        return CommonApiResponse.success("Category updated successfully", categoryService.updateCategory(categoryId, requestDto));
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "Delete category", description = "Deletes a category")
    public CommonApiResponse<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return CommonApiResponse.success("Category deleted successfully", null);
    }

    @GetMapping
    @Operation(summary = "Get category list", description = "Retrieves the list of categories")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category list retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public CommonApiResponse<List<CategoryResponseDto>> getCategories() {
        return CommonApiResponse.success(categoryService.getCategories());
    }
}
