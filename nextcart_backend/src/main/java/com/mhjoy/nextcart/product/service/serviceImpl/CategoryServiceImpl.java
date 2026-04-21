package com.mhjoy.nextcart.product.service.serviceImpl;

import com.mhjoy.nextcart.product.dto.request.CreateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateCategoryRequestDto;
import com.mhjoy.nextcart.product.dto.response.CategoryResponseDto;
import com.mhjoy.nextcart.product.entity.Category;
import com.mhjoy.nextcart.product.exception.CategoryInUseException;
import com.mhjoy.nextcart.product.exception.CategoryNotFoundException;
import com.mhjoy.nextcart.product.exception.CategorySlugConflictException;
import com.mhjoy.nextcart.product.mapper.CategoryMapper;
import com.mhjoy.nextcart.product.repository.CategoryRepository;
import com.mhjoy.nextcart.product.repository.ProductRepository;
import com.mhjoy.nextcart.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponseDto createCategory(CreateCategoryRequestDto requestDto) {
        String slug = buildSlug(requestDto.getName(), requestDto.getSlug());

        if (categoryRepository.existsBySlug(slug)) {
            throw new CategorySlugConflictException(slug);
        }

        Category category = categoryMapper.toEntity(requestDto);
        category.setSlug(slug);
        category.setActive(requestDto.getActive() == null || requestDto.getActive());

        log.debug("Creating category with slug '{}'", slug);
        return categoryMapper.toResponseDto(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(categoryMapper::toResponseDto)
                .toList();
    }

    @Override
    public CategoryResponseDto updateCategory(Long categoryId, UpdateCategoryRequestDto requestDto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        String slug = buildSlug(requestDto.getName(), requestDto.getSlug());
        if (!slug.equals(category.getSlug()) && categoryRepository.existsBySlug(slug)) {
            throw new CategorySlugConflictException(slug);
        }

        category.setName(requestDto.getName());
        category.setSlug(slug);
        category.setActive(requestDto.getActive() == null || requestDto.getActive());
        return categoryMapper.toResponseDto(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));
        if (productRepository.existsByCategory_Id(categoryId)) {
            throw new CategoryInUseException(categoryId);
        }
        categoryRepository.delete(category);
        log.info("Deleted category id={}", categoryId);
    }

    private String buildSlug(String name, String slug) {
        if (slug != null && !slug.isBlank()) {
            return toSlug(slug);
        }
        return toSlug(name);
    }

    private String toSlug(String value) {
        return value.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
