package com.mhjoy.nextcart.bookmark.dto.response;

import com.mhjoy.nextcart.product.dto.response.ProductResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkedProductResponseDto {
    private Long bookmarkId;
    private LocalDateTime bookmarkedAt;
    private ProductResponseDto product;
}
