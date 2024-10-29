// Shader Version and Extensions
#version 460 core
#extension GL_GOOGLE_include_directive: enable
#include "flutter/runtime_effect.glsl"
#define S(a, b, t) smoothstep(a, b, t) // Smoothstep function shortcut

precision mediump float;

// Uniforms and Outputs
uniform vec2 iResolution;   // Screen resolution
uniform float iTime;         // Time variable for animation
out vec4 fragColor;          // Final fragment color output

// Rotation Matrix Function
// Creates a 2D rotation matrix that rotates a point by angle `a`
mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// Noise Functions
// Hash function generates pseudorandom values based on input coordinates
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
}

// Generates smooth 2D noise
float noise(in vec2 p) {
    vec2 i = floor(p);      // Integer part of the position
    vec2 f = fract(p);      // Fractional part of the position
    
    vec2 u = f * f * (3.0 - 2.0 * f);  // Smoothing

    // Interpolates noise for smooth blending between points
    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y
    );
    return 0.5 + 0.5 * n;
}

// Main Shader Function
void main() {
    vec2 fragCoord = FlutterFragCoord();               // Get fragment coordinates
    vec2 uv = fragCoord / iResolution.xy;              // Normalize coordinates
    float ratio = iResolution.x / iResolution.y;       // Aspect ratio

    vec2 tuv = uv - 0.5;                               // Center coordinates around (0,0)
    
    // Rotate Coordinates with Noise
    float degree = noise(vec2(iTime * 0.1, tuv.x * tuv.y)); // Noise-based angle for rotation
    tuv.y /= ratio;                                   // Adjust y for aspect ratio
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0)); // Rotate tuv
    tuv.y *= ratio;                                   // Reset y after rotation
    
    // Wave Warp Effect
    float frequency = 5.0;
    float amplitude = 30.0;
    float speed = iTime * 2.0;

    tuv.x += sin(tuv.y * frequency + speed) / amplitude;         // Sinusoidal x-warp
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5); // Sinusoidal y-warp

    // Color Layers
    vec3 colorRedish = vec3(0.855, 0.267, 0.302);    // RGB for #DA444D
    vec3 colorWhite = vec3(1.0, 1.0, 1.0);           // RGB for white

    // Layer blending with smooth transitions using new colors
    vec3 layer1 = mix(colorRedish, colorWhite, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(colorRedish, colorWhite, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    // Final blending of layers
    vec3 finalComp = mix(layer1, layer2, S(0.5, -0.3, tuv.y));

    fragColor = vec4(finalComp, 1.0);                  // Output the final color
}
