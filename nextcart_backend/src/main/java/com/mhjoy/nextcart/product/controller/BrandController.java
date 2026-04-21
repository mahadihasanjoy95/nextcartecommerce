package com.mhjoy.nextcart.product.controller;

import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.product.dto.request.CreateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.response.BrandResponseDto;
import com.mhjoy.nextcart.product.service.BrandService;
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
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
@Tag(name = "Brand Management", description = "APIs for managing and retrieving brands")
public class BrandController {

    private final BrandService brandService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create brand", description = "Creates a new brand")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Brand created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Brand slug already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public CommonApiResponse<BrandResponseDto> createBrand(@Valid @RequestBody CreateBrandRequestDto requestDto) {
        return CommonApiResponse.success("Brand created successfully", brandService.createBrand(requestDto));
    }

    @PutMapping("/{brandId}")
    @Operation(summary = "Update brand", description = "Updates a brand")
    public CommonApiResponse<BrandResponseDto> updateBrand(
            @PathVariable Long brandId,
            @Valid @RequestBody UpdateBrandRequestDto requestDto) {
        return CommonApiResponse.success("Brand updated successfully", brandService.updateBrand(brandId, requestDto));
    }

    @DeleteMapping("/{brandId}")
    @Operation(summary = "Delete brand", description = "Deletes a brand")
    public CommonApiResponse<Void> deleteBrand(@PathVariable Long brandId) {
        brandService.deleteBrand(brandId);
        return CommonApiResponse.success("Brand deleted successfully", null);
    }

    @GetMapping
    @Operation(summary = "Get brand list", description = "Retrieves the list of brands")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Brand list retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public CommonApiResponse<List<BrandResponseDto>> getBrands() {
        return CommonApiResponse.success(brandService.getBrands());
    }
}
