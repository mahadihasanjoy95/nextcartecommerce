import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../core/constants.dart';
import '../models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const ProductCard({
    super.key,
    required this.product,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color:        AppColors.card,
          borderRadius: BorderRadius.circular(14),
          border:       Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color:       Colors.black.withAlpha(10),
              blurRadius:  8,
              offset:      const Offset(0, 2),
            ),
          ],
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Product image ──────────────────────────────────────────────
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  _ProductImage(url: product.coverImage),

                  // Top-left badges
                  Positioned(
                    top: 8, left: 8,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (product.newArrival)
                          _Badge(label: 'NEW', color: AppColors.primary),
                        if (product.onSale) ...[
                          const SizedBox(height: 4),
                          _Badge(
                            label: '${product.discountPercent}% OFF',
                            color: AppColors.danger,
                          ),
                        ],
                        if (product.featured) ...[
                          const SizedBox(height: 4),
                          _Badge(
                            label: '★ FEATURED',
                            color: AppColors.accent,
                            textColor: AppColors.textPrimary,
                          ),
                        ],
                      ],
                    ),
                  ),

                  // Out-of-stock dim overlay
                  if (!product.inStock)
                    Container(
                      color: Colors.black38,
                      alignment: Alignment.center,
                      child: _Badge(
                        label: 'OUT OF STOCK',
                        color: Colors.black54,
                      ),
                    ),
                ],
              ),
            ),

            // ── Product info ───────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand label
                  if (product.brandName != null)
                    Text(
                      product.brandName!.toUpperCase(),
                      style: AppText.label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                  const SizedBox(height: 2),

                  // Product name
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.title.copyWith(fontSize: 13),
                  ),

                  const SizedBox(height: 6),

                  // Price row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        _formatPrice(product.displayPrice, product.currency),
                        style: AppText.price,
                      ),
                      if (product.onSale) ...[
                        const SizedBox(width: 5),
                        Text(
                          _formatPrice(product.basePrice!, product.currency),
                          style: AppText.priceStrike,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Badge chip ───────────────────────────────────────────────────────────────

class _Badge extends StatelessWidget {
  final String label;
  final Color  color;
  final Color  textColor;

  const _Badge({
    required this.label,
    required this.color,
    this.textColor = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color:        color,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: AppText.badge.copyWith(color: textColor),
      ),
    );
  }
}

// ─── Product image with shimmer placeholder ───────────────────────────────────

class _ProductImage extends StatelessWidget {
  final String url;
  const _ProductImage({required this.url});

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return _placeholder();

    return CachedNetworkImage(
      imageUrl: url,
      fit:      BoxFit.cover,
      placeholder: (_, _) => Shimmer.fromColors(
        baseColor:      AppColors.shimmerBase,
        highlightColor: AppColors.shimmerHigh,
        child: Container(color: Colors.white),
      ),
      errorWidget: (_, _, _) => _placeholder(),
    );
  }

  Widget _placeholder() => Container(
        color: const Color(0xFFF3F4F6),
        child: const Center(
          child: Icon(
            Icons.image_not_supported_outlined,
            color: Color(0xFFD1D5DB),
            size: 32,
          ),
        ),
      );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

String _formatPrice(double amount, String currency) {
  final symbol = currency == 'BDT' ? '৳' : '\$';
  return '$symbol${amount.toStringAsFixed(0)}';
}
