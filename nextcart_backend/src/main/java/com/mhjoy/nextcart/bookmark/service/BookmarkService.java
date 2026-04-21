package com.mhjoy.nextcart.bookmark.service;

import com.mhjoy.nextcart.bookmark.dto.response.BookmarkedProductResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookmarkService {

    void addBookmark(Long userId, Long productId);

    void removeBookmark(Long userId, Long productId);

    Page<BookmarkedProductResponseDto> getUserBookmarks(Long userId, Pageable pageable);

    boolean isBookmarked(Long userId, Long productId);

    List<Long> getBookmarkedProductIds(Long userId);
}
