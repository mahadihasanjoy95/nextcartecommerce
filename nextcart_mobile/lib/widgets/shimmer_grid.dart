import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../core/constants.dart';

/// Skeleton loading grid — shown while products are fetching.
class ShimmerGrid extends StatelessWidget {
  final int columns;
  final int itemCount;

  const ShimmerGrid({
    super.key,
    this.columns   = 2,
    this.itemCount = 6,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      physics:    const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      padding:    EdgeInsets.zero,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount:   columns,
        crossAxisSpacing: 12,
        mainAxisSpacing:  12,
        childAspectRatio: 0.60,
      ),
      itemCount:   itemCount,
      itemBuilder: (_, _) => _ShimmerCard(),
    );
  }
}

class _ShimmerCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor:      AppColors.shimmerBase,
      highlightColor: AppColors.shimmerHigh,
      child: Container(
        decoration: BoxDecoration(
          color:        Colors.white,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image placeholder
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color:        Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                ),
              ),
            ),

            // Text placeholders
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(height: 10, width: 60, color: Colors.white),
                  const SizedBox(height: 6),
                  Container(height: 12, width: double.infinity, color: Colors.white),
                  const SizedBox(height: 4),
                  Container(height: 12, width: 100, color: Colors.white),
                  const SizedBox(height: 8),
                  Container(height: 14, width: 70, color: Colors.white),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
