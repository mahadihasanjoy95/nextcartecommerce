package com.mhjoy.nextcart.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCategoryRequestDto {

    @NotBlank(message = "Category name is required")
    @Size(max = 150, message = "Category name must not exceed 150 characters")
    private String name;

    @Size(max = 180, message = "Slug must not exceed 180 characters")
    private String slug;

    private Boolean active = true;
}
