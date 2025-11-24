import 'package:flutter/material.dart';

class AppColors {
  // Primary colors
  static const Color primary = Color(0xFFFAA531); // Orange
  static const Color primarySubtle = Color(0x1AFAA531); // 10% opacity

  // Background colors
  static const Color background = Color(0xFFF9FAFB); // Light Gray

  // Text colors
  static const Color textDark = Color(0xFF111827); // Dark Gray
  static const Color textMedium = Color(0xFF4B5563); // Medium Gray
  static const Color textLight = Color(0xFF9CA3AE); // Light Gray
  static const Color black = Color(0xFF000000);

  // Other colors
  static const Color white = Colors.white;
  static const Color error = Colors.red;
  static const Color success = Colors.green;
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.background,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: AppColors.primary),
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      textTheme: TextTheme(
        bodyLarge: TextStyle(color: AppColors.textDark),
        bodyMedium: TextStyle(color: AppColors.textMedium),
        bodySmall: TextStyle(color: AppColors.textLight),
      ),
    );
  }
}