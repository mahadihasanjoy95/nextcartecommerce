import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../core/constants.dart';
import '../models/product.dart';

class ProductService {
  ProductService._();
  static final ProductService instance = ProductService._();

  final http.Client _client = http.Client();

  // ─── Fetch paginated product list ──────────────────────────────────────────

  Future<PageData<Product>> getProducts({
    String?  q,
    bool?    featured,
    bool?    newArrival,
    String   sortBy  = 'NEWEST',
    String   sortDir = 'DESC',
    int      page    = 0,
    int      size    = 12,
  }) async {
    final params = <String, String>{
      'page':    page.toString(),
      'size':    size.toString(),
      'sortBy':  sortBy,
      'sortDir': sortDir,
      if (q         != null && q.isNotEmpty) 'q':         q,
      if (featured  != null) 'featured':  featured.toString(),
      if (newArrival != null) 'newArrival': newArrival.toString(),
    };

    final uri = Uri.parse(ApiConstants.productsUrl)
        .replace(queryParameters: params);

    return _get(uri, (data) => PageData.fromJson(
          data as Map<String, dynamic>,
          Product.fromJson,
        ));
  }

  // ─── Fetch single product by slug ──────────────────────────────────────────

  Future<Product> getProductBySlug(String slug) async {
    final uri = Uri.parse('${ApiConstants.productsUrl}/slug/$slug');
    return _get(uri, (data) => Product.fromJson(data as Map<String, dynamic>));
  }

  // ─── Search (same endpoint, just passes q param) ───────────────────────────

  Future<List<Product>> search(String query) async {
    final page = await getProducts(q: query, size: 20);
    return page.content;
  }

  // ─── Private HTTP helper ───────────────────────────────────────────────────

  Future<T> _get<T>(Uri uri, T Function(dynamic) parse) async {
    try {
      final response = await _client
          .get(uri, headers: {'Accept': 'application/json'})
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;

        // Backend wraps everything in CommonApiResponse
        if (json['success'] == true && json['data'] != null) {
          return parse(json['data']);
        }

        final msg = json['error']?['message']
            ?? json['message']
            ?? 'Server returned an error.';
        throw AppException(msg as String);
      }

      if (response.statusCode == 404) {
        throw const AppException('Product not found.');
      }

      throw AppException('Server error (${response.statusCode}).');

    } on SocketException {
      throw const AppException(
        'Cannot reach the server.\nCheck that the backend is running on port 8081.',
      );
    } on AppException {
      rethrow;
    } catch (e) {
      throw AppException('Unexpected error: $e');
    }
  }
}

// ─── Typed error ──────────────────────────────────────────────────────────────

class AppException implements Exception {
  final String message;
  const AppException(this.message);

  @override
  String toString() => message;
}
