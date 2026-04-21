import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../models/product.dart';
import '../services/product_service.dart';
import '../widgets/error_view.dart';
import '../widgets/product_card.dart';
import '../widgets/shimmer_grid.dart';
import 'product_detail_screen.dart';

// ─── Filter model ─────────────────────────────────────────────────────────────

class _Filter {
  final String label;
  final bool?  featured;
  final bool?  newArrival;
  const _Filter(this.label, {this.featured, this.newArrival});
}

const _filters = [
  _Filter('All'),
  _Filter('Featured',    featured:   true),
  _Filter('New Arrivals', newArrival: true),
];

// ─── Home screen ──────────────────────────────────────────────────────────────

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _service = ProductService.instance;

  // State
  int           _filterIndex = 0;
  int           _page        = 0;
  PageData<Product>? _pageData;
  bool          _loading     = true;
  String?       _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  // ── Data fetching ───────────────────────────────────────────────────────────

  Future<void> _load({bool reset = false}) async {
    if (reset) _page = 0;

    setState(() { _loading = true; _error = null; });

    final f = _filters[_filterIndex];

    try {
      final data = await _service.getProducts(
        featured:   f.featured,
        newArrival: f.newArrival,
        page:       _page,
        size:       12,
      );
      setState(() {
        _pageData = data;
        _loading  = false;
      });
    } catch (e) {
      setState(() {
        _error   = e.toString();
        _loading = false;
      });
    }
  }

  void _setFilter(int index) {
    if (_filterIndex == index) return;
    setState(() => _filterIndex = index);
    _load(reset: true);
  }

  void _prevPage() { _page--; _load(); }
  void _nextPage() { _page++; _load(); }

  // ── UI ──────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          _buildHeroBanner(),
          _buildFilterBar(),
          _buildBody(),
          if (_pageData != null && _pageData!.totalPages > 1)
            SliverToBoxAdapter(child: _buildPagination()),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  // ─── App Bar ──────────────────────────────────────────────────────────────

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      floating:          true,
      snap:              true,
      backgroundColor:   Colors.white,
      elevation:         0,
      surfaceTintColor:  Colors.transparent,
      shadowColor:       AppColors.border,
      forceElevated:     true,
      title: Row(
        children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color:        AppColors.primary,
              borderRadius: BorderRadius.circular(9),
            ),
            child: const Icon(Icons.shopping_bag_rounded, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 10),
          const Text(
            'NextCart',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize:   20,
              color:      AppColors.textPrimary,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search_rounded, color: AppColors.textPrimary),
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const _SearchScreen()),
          ),
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  // ─── Hero banner ──────────────────────────────────────────────────────────

  SliverToBoxAdapter _buildHeroBanner() {
    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
        height: 150,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
            colors: [Color(0xFFFCE7F3), Color(0xFFFFF7ED)],
            begin:  Alignment.topLeft,
            end:    Alignment.bottomRight,
          ),
        ),
        child: Stack(
          children: [
            // Text
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 130, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color:        AppColors.primary.withAlpha(31),
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: const Text(
                      'New Season 2025',
                      style: TextStyle(
                        fontSize:   11, fontWeight: FontWeight.w700,
                        color:      AppColors.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Dress with\nConfidence',
                    style: TextStyle(
                      fontSize:   20, fontWeight: FontWeight.w800,
                      color:      AppColors.textPrimary, height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color:        AppColors.primary,
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: const Text(
                      'Shop Now',
                      style: TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Decorative image
            Positioned(
              right: 12, top: 12, bottom: 12,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  'https://picsum.photos/seed/nextcart-hero/100/130',
                  width: 100, fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => const SizedBox(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Filter bar ───────────────────────────────────────────────────────────

  SliverToBoxAdapter _buildFilterBar() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
        child: Row(
          children: [
            Expanded(
              child: Text(
                _pageData != null
                    ? '${_pageData!.totalElements} Products'
                    : 'Products',
                style: const TextStyle(
                  fontSize:   16, fontWeight: FontWeight.w700,
                  color:      AppColors.textPrimary,
                ),
              ),
            ),

            // Filter chips
            Row(
              children: List.generate(_filters.length, (i) {
                final active = _filterIndex == i;
                return Padding(
                  padding: const EdgeInsets.only(left: 6),
                  child: GestureDetector(
                    onTap: () => _setFilter(i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color:        active ? AppColors.primary : const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Text(
                        _filters[i].label,
                        style: TextStyle(
                          fontSize:   12, fontWeight: FontWeight.w600,
                          color:      active ? Colors.white : AppColors.textSecond,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Product grid body ────────────────────────────────────────────────────

  SliverPadding _buildBody() {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      sliver: SliverToBoxAdapter(
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    if (_loading) return const ShimmerGrid();

    if (_error != null) {
      return ErrorView(
        message: _error!,
        onRetry: () => _load(reset: true),
      );
    }

    final products = _pageData?.content ?? [];

    if (products.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 60),
        child: Center(
          child: Text(
            'No products found.',
            style: TextStyle(color: AppColors.textSecond),
          ),
        ),
      );
    }

    return GridView.builder(
      physics:    const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount:   2,
        crossAxisSpacing: 12,
        mainAxisSpacing:  12,
        childAspectRatio: 0.60,
      ),
      itemCount:   products.length,
      itemBuilder: (_, i) => ProductCard(
        product: products[i],
        onTap:   () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailScreen(slug: products[i].slug),
          ),
        ),
      ),
    );
  }

  // ─── Pagination ───────────────────────────────────────────────────────────

  Widget _buildPagination() {
    final data = _pageData!;
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Page ${_page + 1} of ${data.totalPages}',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecond),
          ),
          Row(
            children: [
              _PageBtn(
                icon:     Icons.chevron_left_rounded,
                enabled:  data.hasPrevious,
                onTap:    _prevPage,
              ),
              const SizedBox(width: 8),
              _PageBtn(
                icon:    Icons.chevron_right_rounded,
                enabled: data.hasNext,
                onTap:   _nextPage,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Page button ──────────────────────────────────────────────────────────────

class _PageBtn extends StatelessWidget {
  final IconData     icon;
  final bool         enabled;
  final VoidCallback onTap;

  const _PageBtn({
    required this.icon,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 36, height: 36,
        decoration: BoxDecoration(
          color:        enabled ? AppColors.primary : const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          size:  20,
          color: enabled ? Colors.white : AppColors.textMuted,
        ),
      ),
    );
  }
}

// ─── Inline search screen (lightweight, no extra file) ───────────────────────

class _SearchScreen extends StatefulWidget {
  const _SearchScreen();

  @override
  State<_SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<_SearchScreen> {
  final _controller = TextEditingController();
  final _service    = ProductService.instance;

  List<Product> _results = [];
  bool   _loading = false;
  String _query   = '';

  @override
  void dispose() { _controller.dispose(); super.dispose(); }

  Future<void> _search(String q) async {
    if (q.trim().isEmpty) { setState(() => _results = []); return; }
    setState(() => _loading = true);
    try {
      final r = await _service.search(q);
      setState(() { _results = r; _loading = false; });
    } catch (_) {
      setState(() { _results = []; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        backgroundColor:  Colors.white,
        elevation:        0,
        surfaceTintColor: Colors.transparent,
        title: TextField(
          controller:      _controller,
          autofocus:       true,
          textInputAction: TextInputAction.search,
          onChanged: (q) {
            _query = q;
            Future.delayed(const Duration(milliseconds: 400), () {
              if (_query == q) _search(q);
            });
          },
          decoration: const InputDecoration(
            hintText:      'Search products…',
            border:        InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            filled:        false,
            contentPadding: EdgeInsets.zero,
          ),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        actions: [
          if (_controller.text.isNotEmpty)
            IconButton(
              icon:      const Icon(Icons.clear_rounded),
              onPressed: () { _controller.clear(); setState(() => _results = []); },
            ),
        ],
      ),
      body: _loading
          ? const Padding(
              padding: EdgeInsets.all(16),
              child:   ShimmerGrid(itemCount: 4),
            )
          : _controller.text.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.search_rounded, size: 52, color: AppColors.textMuted),
                      SizedBox(height: 10),
                      Text('Type to search products',
                          style: TextStyle(color: AppColors.textSecond)),
                    ],
                  ),
                )
              : _results.isEmpty
                  ? const Center(
                      child: Text('No products found.',
                          style: TextStyle(color: AppColors.textSecond)),
                    )
                  : Padding(
                      padding: const EdgeInsets.all(16),
                      child: GridView.builder(
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount:   2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing:  12,
                          childAspectRatio: 0.60,
                        ),
                        itemCount:   _results.length,
                        itemBuilder: (_, i) => ProductCard(
                          product: _results[i],
                          onTap:   () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  ProductDetailScreen(slug: _results[i].slug),
                            ),
                          ),
                        ),
                      ),
                    ),
    );
  }
}
