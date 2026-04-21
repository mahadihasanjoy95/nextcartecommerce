package com.mhjoy.nextcart.product.mapper;

import com.mhjoy.nextcart.product.dto.request.CreateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.response.CategoryResponseDto;
import com.mhjoy.nextcart.product.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    Category toEntity(CreateCategoryRequestDto dto);

    CategoryResponseDto toResponseDto(Category category);
}
