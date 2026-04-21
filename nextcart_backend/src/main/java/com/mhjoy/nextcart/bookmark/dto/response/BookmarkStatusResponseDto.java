package com.mhjoy.nextcart.bookmark.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookmarkStatusResponseDto {
    private Long productId;
    private boolean bookmarked;
}
