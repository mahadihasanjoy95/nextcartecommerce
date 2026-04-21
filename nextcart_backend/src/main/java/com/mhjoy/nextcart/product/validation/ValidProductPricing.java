package com.mhjoy.nextcart.product.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductPricingValidator.class)
@Documented
public @interface ValidProductPricing {

    String message() default "Sale price cannot be greater than base price";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}