import 'dart:io' show Platform;
import 'package:flutter/material.dart';

// ─── API ─────────────────────────────────────────────────────────────────────

class ApiConstants {
  ApiConstants._();

  static const int _port = 8081;

  /// iOS Simulator  → localhost resolves to the Mac directly.
  /// Android Emulator → 10.0.2.2 routes to the host machine's localhost.
  static String get baseUrl {
    if (Platform.isAndroid) return 'http://10.0.2.2:$_port/api/v1';
    return 'http://localhost:$_port/api/v1';
  }

  static String get productsUrl => '$baseUrl/products';
}

// ─── Colours (matches web frontend pink/yellow theme) ────────────────────────

class AppColors {
  AppColors._();

  static const Color primary     = Color(0xFFDB2777); // pink-600
  static const Color primaryLight= Color(0xFFFCE7F3); // pink-50
  static const Color accent      = Color(0xFFF59E0B); // amber-500
  static const Color accentLight = Color(0xFFFEF3C7); // amber-50
  static const Color bg          = Color(0xFFF9FAFB); // gray-50
  static const Color card        = Color(0xFFFFFFFF);
  static const Color border      = Color(0xFFE5E7EB); // gray-200
  static const Color textPrimary = Color(0xFF111827); // gray-900
  static const Color textSecond  = Color(0xFF6B7280); // gray-500
  static const Color textMuted   = Color(0xFF9CA3AF); // gray-400
  static const Color success     = Color(0xFF059669); // emerald-600
  static const Color successBg   = Color(0xFFECFDF5);
  static const Color danger      = Color(0xFFDC2626); // red-600
  static const Color dangerBg    = Color(0xFFFEF2F2);
  static const Color shimmerBase = Color(0xFFE5E7EB);
  static const Color shimmerHigh = Color(0xFFF9FAFB);
}

// ─── Text styles ─────────────────────────────────────────────────────────────

class AppText {
  AppText._();

  static const TextStyle heading = TextStyle(
    fontSize: 20, fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static const TextStyle title = TextStyle(
    fontSize: 14, fontWeight: FontWeight.w600,
    color: AppColors.textPrimary, height: 1.3,
  );

  static const TextStyle body = TextStyle(
    fontSize: 13, color: AppColors.textSecond, height: 1.5,
  );

  static const TextStyle price = TextStyle(
    fontSize: 15, fontWeight: FontWeight.w700,
    color: AppColors.primary,
  );

  static const TextStyle priceStrike = TextStyle(
    fontSize: 12, color: AppColors.textMuted,
    decoration: TextDecoration.lineThrough,
  );

  static const TextStyle badge = TextStyle(
    fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.3,
  );

  static const TextStyle label = TextStyle(
    fontSize: 10, fontWeight: FontWeight.w600,
    color: AppColors.textMuted, letterSpacing: 0.5,
  );
}
