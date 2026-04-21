import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../models/product.dart';
import '../services/product_service.dart';
import '../widgets/error_view.dart';

class ProductDetailScreen extends StatefulWidget {
  final String slug;
  const ProductDetailScreen({super.key, required this.slug});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final _service = ProductService.instance;

  Product? _product;
  bool     _loading = true;
  String?  _error;
  int      _selectedImage = 0;
  bool     _wishlist      = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final p = await _service.getProductBySlug(widget.slug);
      setState(() { _product = p; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  List<String> get _images {
    if (_product == null) return [];
    final all = <String>[];
    if (_product!.thumbnailUrl != null) all.add(_product!.thumbnailUrl!);
    for (final u in _product!.imageUrls) {
      if (!all.contains(u)) all.add(u);
    }
    return all.isEmpty ? [''] : all;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
        body: const Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
        body: ErrorView(message: _error!, onRetry: _load),
      );
    }

    final p      = _product!;
    final images = _images;
    final current = images[_selectedImage.clamp(0, images.length - 1)];

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(
        slivers: [
          // ── Pinned image app bar ─────────────────────────────────────────
          SliverAppBar(
            pinned:           true,
            expandedHeight:   360,
            backgroundColor:  Colors.white,
            surfaceTintColor: Colors.transparent,
            iconTheme:        const IconThemeData(color: AppColors.textPrimary),
            actions: [
              IconButton(
                icon: Icon(
                  _wishlist
                      ? Icons.favorite_rounded
                      : Icons.favorite_border_rounded,
                  color: _wishlist ? AppColors.danger : AppColors.textPrimary,
                ),
                onPressed: () => setState(() => _wishlist = !_wishlist),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  if (current.isNotEmpty)
                    CachedNetworkImage(imageUrl: current, fit: BoxFit.cover)
                  else
                    Container(color: const Color(0xFFF3F4F6)),

                  // Bottom gradient fade
                  Positioned(
                    bottom: 0, left: 0, right: 0,
                    child: Container(
                      height: 60,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end:   Alignment.topCenter,
                          colors: [AppColors.bg, Colors.transparent],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Thumbnail strip ──────────────────────────────────────────────
          if (images.length > 1)
            SliverToBoxAdapter(
              child: SizedBox(
                height: 68,
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  scrollDirection: Axis.horizontal,
                  itemCount:   images.length,
                  itemBuilder: (_, i) => GestureDetector(
                    onTap: () => setState(() => _selectedImage = i),
                    child: Container(
                      width: 56, height: 56,
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: i == _selectedImage
                              ? AppColors.primary
                              : AppColors.border,
                          width: 2,
                        ),
                      ),
                      clipBehavior: Clip.hardEdge,
                      child: CachedNetworkImage(
                        imageUrl: images[i], fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ),
            ),

          // ── Product info ─────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  // Badges
                  Wrap(
                    spacing: 6, runSpacing: 4,
                    children: [
                      if (p.newArrival) _badge('New Arrival', AppColors.primary),
                      if (p.onSale)     _badge('${p.discountPercent}% OFF', AppColors.danger),
                      if (p.featured)   _badge('★ Featured', AppColors.accent, text: AppColors.textPrimary),
                      if (!p.inStock)   _badge('Out of Stock', Colors.black54),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Product name
                  Text(
                    p.name,
                    style: const TextStyle(
                      fontSize:   22, fontWeight: FontWeight.w800,
                      color:      AppColors.textPrimary, height: 1.25,
                    ),
                  ),

                  // Brand · Category
                  if (p.brandName != null || p.categoryName != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        [p.brandName, p.categoryName]
                            .whereType<String>()
                            .join(' · '),
                        style: const TextStyle(
                          fontSize: 13, color: AppColors.textSecond,
                        ),
                      ),
                    ),

                  // Price
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          _fmt(p.displayPrice, p.currency),
                          style: const TextStyle(
                            fontSize: 26, fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                        if (p.onSale) ...[
                          const SizedBox(width: 10),
                          Text(
                            _fmt(p.basePrice!, p.currency),
                            style: const TextStyle(
                              fontSize: 16, color: AppColors.textMuted,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  const Divider(color: AppColors.border),
                  const SizedBox(height: 12),

                  // Short description
                  if (p.shortDescription != null) ...[
                    Text(
                      p.shortDescription!,
                      style: AppText.body,
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Full description
                  if (p.description != null) ...[
                    const Text('Description',
                      style: TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(p.description!, style: AppText.body),
                    const SizedBox(height: 20),
                  ],

                  // Details table
                  const Text('Details',
                    style: TextStyle(
                      fontSize: 15, fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 10),
                  _DetailsTable(product: p),

                  const SizedBox(height: 20),

                  // Trust strip
                  _TrustStrip(),

                  const SizedBox(height: 24),

                  // Add to cart (placeholder — no cart yet)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: null, // cart not yet implemented
                      style: ElevatedButton.styleFrom(
                        backgroundColor:         AppColors.primary,
                        disabledBackgroundColor: AppColors.primary.withAlpha(102),
                        foregroundColor:         Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Add to Cart — Coming Soon',
                        style: TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _badge(String label, Color bg, {Color text = Colors.white}) =>
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
        child: Text(
          label,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: text),
        ),
      );

  String _fmt(double amount, String currency) {
    final symbol = currency == 'BDT' ? '৳' : '\$';
    return '$symbol${amount.toStringAsFixed(0)}';
  }
}

// ─── Details table ────────────────────────────────────────────────────────────

class _DetailsTable extends StatelessWidget {
  final Product product;
  const _DetailsTable({required this.product});

  @override
  Widget build(BuildContext context) {
    final rows = <(String, String)>[
      if (product.brandName    != null) ('Brand',    product.brandName!),
      if (product.categoryName != null) ('Category', product.categoryName!),
      ('Stock',  product.inStock ? 'In Stock' : 'Out of Stock'),
      ('Status', product.status),
    ];

    return Container(
      decoration: BoxDecoration(
        border:       Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: rows.asMap().entries.map((entry) {
          final isLast = entry.key == rows.length - 1;
          final (label, value) = entry.value;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              border: isLast
                  ? null
                  : const Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                SizedBox(
                  width: 90,
                  child: Text(label,
                    style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ),
                Expanded(
                  child: Text(value,
                    style: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w500,
                      color: AppColors.textPrimary,
                    )),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── Trust strip ──────────────────────────────────────────────────────────────

class _TrustStrip extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final items = [
      (Icons.local_shipping_outlined, 'Free Shipping'),
      (Icons.refresh_rounded,          'Easy Returns'),
      (Icons.verified_user_outlined,   'Secure Pay'),
    ];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: items.map((item) => Column(
        children: [
          Icon(item.$1, size: 22, color: AppColors.primary),
          const SizedBox(height: 4),
          Text(item.$2,
            style: const TextStyle(fontSize: 11, color: AppColors.textSecond)),
        ],
      )).toList(),
    );
  }
}
