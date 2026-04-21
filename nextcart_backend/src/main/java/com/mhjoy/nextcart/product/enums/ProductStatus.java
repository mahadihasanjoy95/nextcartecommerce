package com.mhjoy.nextcart.product.enums;

public enum ProductStatus {
    DRAFT,      // not visible to users
    ACTIVE,     // visible and sellable
    INACTIVE,   // hidden temporarily
    ARCHIVED    // soft deleted / historical
}