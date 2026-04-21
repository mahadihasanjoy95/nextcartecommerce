import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/constants.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock portrait orientation
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Make the status bar transparent (nice on iOS)
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor:           Colors.transparent,
    statusBarIconBrightness:  Brightness.dark,
  ));

  runApp(const NextCartApp());
}

class NextCartApp extends StatelessWidget {
  const NextCartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title:                    'NextCart',
      debugShowCheckedModeBanner: false,
      theme:                    _buildTheme(),
      home:                     const HomeScreen(),
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      useMaterial3:     true,
      colorScheme:      ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        surface:   Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.bg,
      fontFamily: 'SF Pro Display', // falls back to system sans-serif gracefully

      appBarTheme: const AppBarTheme(
        backgroundColor:       Colors.white,
        elevation:             0,
        scrolledUnderElevation: 0.5,
        surfaceTintColor:      Colors.transparent,
        centerTitle:           false,
        titleTextStyle: TextStyle(
          fontSize:   18,
          fontWeight: FontWeight.w700,
          color:      AppColors.textPrimary,
        ),
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),

      cardTheme: const CardThemeData(
        elevation: 0,
        color:     Colors.white,
        margin:    EdgeInsets.zero,
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled:       true,
        fillColor:    const Color(0xFFF3F4F6),
        border:       OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide:   BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        hintStyle:    const TextStyle(color: AppColors.textMuted, fontSize: 14),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation:       0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
        ),
      ),
    );
  }
}
