# Rendering hardening — 2026-10-16

- Visual desktop and mobile inspection of hero and artwork dialog; responsive DOM checks at 320, 390, 768 and 1440 CSS px found no horizontal overflow.
- Main stylesheet loads before replacing the password gate; load failure retains the gate with retry messaging.
- Intrinsic dimensions reserve image layout; lazy images remain lazy and async decoded. Hero edge masks use standard and WebKit compositing.
- Flower geometry normals and draw containers are cached. Maximum render cadence is 60fps; elapsed-time movement remains independent of refresh rate. Hidden tabs skip paint. Coarse-pointer height-only resize does not reset the drawing surface.
- Removed unused seal styles and superseded intermediate plus cue sizes. Active orbital decorations remain.
- `node tests/rendering.cjs`: background resize, 120Hz elapsed time, pause, parallax bounds and line spacing pass.
- `node tests/flowers.cjs`: flower render, 120Hz scheduling, iOS-style toolbar height change, orientation and hidden-page painting pass.

Limits: browser checks use desktop engine viewport emulation, not physical iPhone/Android hardware. Reduced-motion preferences intentionally reduce animation. No assertion of identical rendering on every browser or quantified performance improvement.

2026-10-16 effects update: gentler interruptible in-page scroll, explicit sRGB canvas, lower baseline blur with a wider near/far blur range, brighter lit petal surfaces. About 6% of flowers release individual petals after mid-descent; per-petal transforms retain the parent rotation and are included in shadow rendering. Fragment geometry continuity and unit normals are tested. Physical iPhone color/luminance matching remains unverified.

Optical-depth update: phones (<700 CSS px) cap the intact bloom projected width to 82% of viewport. Three depth compositing planes (0.65, 2.8 and 3.2px CSS blur) interpolate per-surface depth within each flower; whole-flower blur removed. Fragment spread is retained. Canvas resize tests updated for three layers.

Fixed-scale update: scale is constant throughout each flower lifetime. Mobile cap uses a precomputed envelope across rotation angles, rather than resizing each frame. Initial document visits and pageshow/bfcache restores start at the hero; in-page links still use the animated scroll. Local UI test: contact section at scrollY 5319 -> reload -> gate scrollY 0 -> unlock -> main scrollY 0. tests/startup.cjs covers hash reset and persisted-page return.

Performance update: projected coordinates, normals, light-space vertices, stem geometry and fragment buffers are pooled. Materials are calculated once per surface rather than twice for depth layers. Blur CSS writes only occur when its value changes. Hidden/empty flower layers stop clearing and compositing. Rendering uses an absolute 60Hz deadline with timing tolerance rather than an arbitrary 15ms skip gate, avoiding excess work on 120Hz screens. Mobile flower canvas DPR cap 1 (previously 1.5), retaining CSS blur radii.

Same-host Node/VM CPU-only comparison (120 frames, no-op drawing API): baseline median 34.61ms / p95 63.85ms; optimized normal-flower sample median 6.94ms / p95 19.40ms. This isolates JS work; it does not measure GPU cost or physical iPhone FPS. Tests assert projection buffers retain identity across frames.

Consistent-blur update: CSS blur sigma equals the depth-plane coefficient × fixed bloom scale / 130. The same raster density (1 canvas pixel per CSS px) is used on every device, retaining the mobile size cap and frame-buffer reuse. A deterministic flower pose was visually compared at 390 and 1280px widths; automated tests check invariant sigma/scale across scales. Physical device display/color differences are not covered by viewport emulation.

Local-surface update: compute projected bloom bounds before shading, crop the three blur planes with four-sigma blur plus glow padding, translate the contexts without changing projection, quantize backing-store sizes to 64px and only grow during a flower. Entirely offscreen flowers skip shadow/material painting; idle backing stores are released. Existing geometry, lighting, blur formula, timing and rarity stay unchanged.

Deterministic 390×844 comparison: old surfaces 390×844 each, new 390×448 each, 46.9% fewer surface pixels. JPEG screenshot comparison mean absolute channel difference 0.0237/255, max 8/255. This is a single pose and viewport, not a universal GPU/FPS guarantee. Mobile and desktop viewport visuals were inspected; physical low-end phones remain untested.
