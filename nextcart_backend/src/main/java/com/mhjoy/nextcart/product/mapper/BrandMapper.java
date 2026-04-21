package com.mhjoy.nextcart.product.mapper;

import com.mhjoy.nextcart.product.dto.request.CreateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.response.BrandResponseDto;
import com.mhjoy.nextcart.product.entity.Brand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    @Mapping(target = "id", ignore = true)
    Brand toEntity(CreateBrandRequestDto dto);

    BrandResponseDto toResponseDto(Brand brand);
}
