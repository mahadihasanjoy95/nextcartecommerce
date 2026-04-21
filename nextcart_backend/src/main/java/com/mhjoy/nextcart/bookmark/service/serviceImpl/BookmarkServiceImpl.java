package com.mhjoy.nextcart.bookmark.service.serviceImpl;

import com.mhjoy.nextcart.auth.entity.User;
import com.mhjoy.nextcart.auth.repository.UserRepository;
import com.mhjoy.nextcart.bookmark.dto.response.BookmarkedProductResponseDto;
import com.mhjoy.nextcart.bookmark.entity.Bookmark;
import com.mhjoy.nextcart.bookmark.repository.BookmarkRepository;
import com.mhjoy.nextcart.bookmark.service.BookmarkService;
import com.mhjoy.nextcart.product.entity.Product;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.mapper.ProductMapper;
import com.mhjoy.nextcart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public void addBookmark(Long userId, Long productId) {
        if (bookmarkRepository.existsByUserIdAndProductId(userId, productId)) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Product product = productRepository.findByIdAndStatus(productId, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found or not available"));

        bookmarkRepository.save(new Bookmark(null, user, product, LocalDateTime.now()));
    }

    @Override
    @Transactional
    public void removeBookmark(Long userId, Long productId) {
        bookmarkRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(bookmarkRepository::delete);
    }

    @Override
    public Page<BookmarkedProductResponseDto> getUserBookmarks(Long userId, Pageable pageable) {
        return bookmarkRepository
                .findActiveBookmarksByUserId(userId, ProductStatus.ACTIVE, pageable)
                .map(b -> new BookmarkedProductResponseDto(
                        b.getId(),
                        b.getCreatedAt(),
                        productMapper.toResponseDto(b.getProduct())
                ));
    }

    @Override
    public boolean isBookmarked(Long userId, Long productId) {
        return bookmarkRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Override
    public List<Long> getBookmarkedProductIds(Long userId) {
        return bookmarkRepository.findBookmarkedProductIdsByUserId(userId);
    }
}
