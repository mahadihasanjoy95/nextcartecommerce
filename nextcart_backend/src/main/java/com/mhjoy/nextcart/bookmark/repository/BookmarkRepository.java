package com.mhjoy.nextcart.bookmark.repository;

import com.mhjoy.nextcart.bookmark.entity.Bookmark;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Optional<Bookmark> findByUserIdAndProductId(Long userId, Long productId);

    @Query("""
        SELECT b FROM Bookmark b
        JOIN FETCH b.product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.brand
        WHERE b.user.id = :userId AND p.status = :status
        ORDER BY b.createdAt DESC
        """)
    Page<Bookmark> findActiveBookmarksByUserId(
            @Param("userId") Long userId,
            @Param("status") ProductStatus status,
            Pageable pageable
    );

    @Query("SELECT b.product.id FROM Bookmark b WHERE b.user.id = :userId")
    List<Long> findBookmarkedProductIdsByUserId(@Param("userId") Long userId);
}
