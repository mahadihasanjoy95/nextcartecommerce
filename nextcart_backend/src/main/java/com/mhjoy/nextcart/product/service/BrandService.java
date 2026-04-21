package com.mhjoy.nextcart.product.service;

import com.mhjoy.nextcart.product.dto.request.CreateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.response.BrandResponseDto;

import java.util.List;

public interface BrandService {

    BrandResponseDto createBrand(CreateBrandRequestDto requestDto);

    BrandResponseDto updateBrand(Long brandId, UpdateBrandRequestDto requestDto);

    void deleteBrand(Long brandId);

    List<BrandResponseDto> getBrands();
}
