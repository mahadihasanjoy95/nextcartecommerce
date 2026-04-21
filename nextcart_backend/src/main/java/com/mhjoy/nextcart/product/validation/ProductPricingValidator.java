package com.mhjoy.nextcart.product.validation;

import com.mhjoy.nextcart.product.dto.request.CreateProductRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateProductRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.math.BigDecimal;

public class ProductPricingValidator implements ConstraintValidator<ValidProductPricing, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        BigDecimal basePrice = null;
        BigDecimal salePrice = null;

        if (value instanceof CreateProductRequestDto dto) {
            basePrice = dto.getBasePrice();
            salePrice = dto.getSalePrice();
        } else if (value instanceof UpdateProductRequestDto dto) {
            basePrice = dto.getBasePrice();
            salePrice = dto.getSalePrice();
        }

        if (basePrice == null || salePrice == null) {
            return true;
        }

        return salePrice.compareTo(basePrice) <= 0;
    }
}