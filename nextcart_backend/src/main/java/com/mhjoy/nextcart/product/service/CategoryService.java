package com.mhjoy.nextcart.product.service;

import com.mhjoy.nextcart.product.dto.request.CreateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    CategoryResponseDto createCategory(CreateCategoryRequestDto requestDto);

    CategoryResponseDto updateCategory(Long categoryId, UpdateCategoryRequestDto requestDto);

    void deleteCategory(Long categoryId);

    List<CategoryResponseDto> getCategories();
}
