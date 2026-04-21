package com.mhjoy.nextcart.product.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BrandResponseDto {

    private Long id;
    private String name;
    private String slug;
    private boolean active;
}
