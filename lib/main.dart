import 'package:flutter/material.dart';
import 'package:flutter_conf_shaders_workshop/gradient_background.dart';

void main() {
  runApp(const MainApp());
}

/// {@template main_app}
/// Main application widget.
/// {@endtemplate}
class MainApp extends StatelessWidget {
  /// {@macro main_app}
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: GradientBackground(
          child: Center(
            child: SizedBox.square(
              dimension: 250,
              child: Image.asset('assets/dash.png'),
            ),
          ),
        ),
      ),
    );
  }
}
