package com.mhjoy.nextcart.product.service.serviceImpl;

import com.mhjoy.nextcart.product.dto.request.CreateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateBrandRequestDto;
import com.mhjoy.nextcart.product.dto.response.BrandResponseDto;
import com.mhjoy.nextcart.product.entity.Brand;
import com.mhjoy.nextcart.product.exception.BrandInUseException;
import com.mhjoy.nextcart.product.exception.BrandNotFoundException;
import com.mhjoy.nextcart.product.exception.BrandSlugConflictException;
import com.mhjoy.nextcart.product.mapper.BrandMapper;
import com.mhjoy.nextcart.product.repository.BrandRepository;
import com.mhjoy.nextcart.product.repository.ProductRepository;
import com.mhjoy.nextcart.product.service.BrandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final BrandMapper brandMapper;

    @Override
    public BrandResponseDto createBrand(CreateBrandRequestDto requestDto) {
        String slug = buildSlug(requestDto.getName(), requestDto.getSlug());

        if (brandRepository.existsBySlug(slug)) {
            throw new BrandSlugConflictException(slug);
        }

        Brand brand = brandMapper.toEntity(requestDto);
        brand.setSlug(slug);
        brand.setActive(requestDto.getActive() == null || requestDto.getActive());

        log.debug("Creating brand with slug '{}'", slug);
        return brandMapper.toResponseDto(brandRepository.save(brand));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponseDto> getBrands() {
        return brandRepository.findAllByOrderByNameAsc()
                .stream()
                .map(brandMapper::toResponseDto)
                .toList();
    }

    @Override
    public BrandResponseDto updateBrand(Long brandId, UpdateBrandRequestDto requestDto) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new BrandNotFoundException(brandId));

        String slug = buildSlug(requestDto.getName(), requestDto.getSlug());
        if (!slug.equals(brand.getSlug()) && brandRepository.existsBySlug(slug)) {
            throw new BrandSlugConflictException(slug);
        }

        brand.setName(requestDto.getName());
        brand.setSlug(slug);
        brand.setActive(requestDto.getActive() == null || requestDto.getActive());
        return brandMapper.toResponseDto(brandRepository.save(brand));
    }

    @Override
    public void deleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new BrandNotFoundException(brandId));
        if (productRepository.existsByBrand_Id(brandId)) {
            throw new BrandInUseException(brandId);
        }
        brandRepository.delete(brand);
        log.info("Deleted brand id={}", brandId);
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
