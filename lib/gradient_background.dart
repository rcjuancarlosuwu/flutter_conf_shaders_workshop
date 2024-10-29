import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

/// {@template gradient_background}
/// A widget that paints a gradient background.
/// {@endtemplate}
class GradientBackground extends StatefulWidget {
  /// Creates an instance of [GradientBackground].
  ///
  /// - `child`: The child widget to paint on top of the gradient background.
  /// {@macro gradient_background}
  const GradientBackground({
    super.key,
    required this.child,
  });

  /// The child widget to paint on top of the gradient background.
  final Widget child;

  @override
  State<GradientBackground> createState() => _GradientBackgroundState();
}

class _GradientBackgroundState extends State<GradientBackground>
    with SingleTickerProviderStateMixin {
  late Ticker _ticker;
  final ValueNotifier<Duration> _time = ValueNotifier(Duration.zero);

  @override
  void initState() {
    super.initState();
    _ticker = createTicker((elapsed) => _time.value = elapsed)..start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    _time.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ShaderBuilder(
      assetKey: 'shaders/gradient.frag',
      (context, shader, child) => CustomPaint(
        painter: GradientPainter(shader: shader, time: _time),
        child: child,
      ),
      child: widget.child,
    );
  }
}

class GradientPainter extends CustomPainter {
  final FragmentShader shader;
  final ValueNotifier<Duration> time;

  GradientPainter({
    required this.time,
    required this.shader,
  }) : super(repaint: time);

  @override
  void paint(Canvas canvas, Size size) {
    shader
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time.value.inMicroseconds / Duration.microsecondsPerSecond);
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant GradientPainter oldDelegate) =>
      shader != oldDelegate.shader;
}
