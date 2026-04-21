// ─── Product model ────────────────────────────────────────────────────────────

class Product {
  final int     id;
  final String  name;
  final String  slug;
  final String? shortDescription;
  final String? description;
  final String  status;
  final String? categoryName;
  final String? brandName;
  final bool    featured;
  final bool    newArrival;
  final bool    inStock;
  final double? basePrice;
  final double? salePrice;
  final String  currency;
  final String? thumbnailUrl;
  final List<String> imageUrls;

  const Product({
    required this.id,
    required this.name,
    required this.slug,
    this.shortDescription,
    this.description,
    required this.status,
    this.categoryName,
    this.brandName,
    required this.featured,
    required this.newArrival,
    required this.inStock,
    this.basePrice,
    this.salePrice,
    required this.currency,
    this.thumbnailUrl,
    this.imageUrls = const [],
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id:               json['id']           as int,
        name:             json['name']         as String,
        slug:             json['slug']         as String,
        shortDescription: json['shortDescription'] as String?,
        description:      json['description']  as String?,
        status:           json['status']       as String? ?? 'ACTIVE',
        categoryName:     json['categoryName'] as String?,
        brandName:        json['brandName']    as String?,
        featured:         json['featured']     as bool? ?? false,
        newArrival:       json['newArrival']   as bool? ?? false,
        inStock:          json['inStock']      as bool? ?? true,
        basePrice:        (json['basePrice']   as num?)?.toDouble(),
        salePrice:        (json['salePrice']   as num?)?.toDouble(),
        currency:         json['currency']     as String? ?? 'BDT',
        thumbnailUrl:     json['thumbnailUrl'] as String?,
        imageUrls: (json['imageUrls'] as List<dynamic>?)
                ?.map((e) => e as String)
                .toList() ??
            const [],
      );

  // ── Computed helpers ──────────────────────────────────────────────────────

  /// True when a sale price is set and lower than base price.
  bool get onSale =>
      salePrice != null && basePrice != null && salePrice! < basePrice!;

  /// The price the customer actually pays.
  double get displayPrice => salePrice ?? basePrice ?? 0;

  /// Discount percentage, e.g. 20 for "20% OFF".
  int get discountPercent {
    if (!onSale) return 0;
    return (((basePrice! - salePrice!) / basePrice!) * 100).round();
  }

  /// Best image to show in list/card views.
  String get coverImage =>
      thumbnailUrl ??
      (imageUrls.isNotEmpty ? imageUrls.first : '');
}

// ─── API envelope wrappers ────────────────────────────────────────────────────

/// Mirrors `CommonApiResponse<T>` from the backend.
class ApiResponse<T> {
  final bool    success;
  final String? message;
  final T?      data;

  const ApiResponse({required this.success, this.message, this.data});

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromData,
  ) =>
      ApiResponse(
        success: json['success'] as bool,
        message: json['message'] as String?,
        data:    json['data'] != null ? fromData(json['data']) : null,
      );
}

/// Mirrors `PageResponse<T>` from the backend.
class PageData<T> {
  final List<T> content;
  final int     page;
  final int     totalElements;
  final int     totalPages;
  final bool    hasNext;
  final bool    hasPrevious;

  const PageData({
    required this.content,
    required this.page,
    required this.totalElements,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrevious,
  });

  factory PageData.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromItem,
  ) =>
      PageData(
        content: (json['content'] as List<dynamic>)
            .map((e) => fromItem(e as Map<String, dynamic>))
            .toList(),
        page:          json['page']          as int,
        totalElements: json['totalElements'] as int,
        totalPages:    json['totalPages']    as int,
        hasNext:       json['hasNext']       as bool,
        hasPrevious:   json['hasPrevious']   as bool,
      );
}
