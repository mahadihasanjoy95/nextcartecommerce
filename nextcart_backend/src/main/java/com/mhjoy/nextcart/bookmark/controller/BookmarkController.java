package com.mhjoy.nextcart.bookmark.controller;

import com.mhjoy.nextcart.bookmark.dto.response.BookmarkedProductResponseDto;
import com.mhjoy.nextcart.bookmark.dto.response.BookmarkStatusResponseDto;
import com.mhjoy.nextcart.bookmark.service.BookmarkService;
import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.common.response.PageResponse;
import com.mhjoy.nextcart.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmark Management", description = "APIs for managing a customer's bookmarked/favourite products")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final CurrentUserService currentUserService;

    @PostMapping("/{productId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add bookmark", description = "Adds an ACTIVE product to the current user's bookmarks. Idempotent.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Bookmark added"),
            @ApiResponse(responseCode = "404", description = "Product not found or not active"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<Void> addBookmark(@PathVariable Long productId) {
        bookmarkService.addBookmark(currentUserService.getCurrentUserId(), productId);
        return CommonApiResponse.success("Product bookmarked successfully", null);
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove bookmark", description = "Removes a product from the current user's bookmarks. No-op if not bookmarked.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bookmark removed"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<Void> removeBookmark(@PathVariable Long productId) {
        bookmarkService.removeBookmark(currentUserService.getCurrentUserId(), productId);
        return CommonApiResponse.success("Bookmark removed successfully", null);
    }

    @GetMapping
    @Operation(summary = "Get bookmarks", description = "Returns a paginated list of the current user's bookmarked products (ACTIVE only).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bookmark list retrieved"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<PageResponse<BookmarkedProductResponseDto>> getBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return CommonApiResponse.success(
                PageResponse.from(bookmarkService.getUserBookmarks(currentUserService.getCurrentUserId(), pageable))
        );
    }

    @GetMapping("/ids")
    @Operation(summary = "Get bookmarked product IDs", description = "Returns the list of product IDs bookmarked by the current user. Lightweight — used by the frontend to set heart icon state.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ID list retrieved"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<List<Long>> getBookmarkedIds() {
        return CommonApiResponse.success(
                bookmarkService.getBookmarkedProductIds(currentUserService.getCurrentUserId())
        );
    }

    @GetMapping("/{productId}/status")
    @Operation(summary = "Check bookmark status", description = "Returns whether the current user has bookmarked the given product.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status returned"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public CommonApiResponse<BookmarkStatusResponseDto> getBookmarkStatus(@PathVariable Long productId) {
        boolean bookmarked = bookmarkService.isBookmarked(currentUserService.getCurrentUserId(), productId);
        return CommonApiResponse.success(new BookmarkStatusResponseDto(productId, bookmarked));
    }
}
