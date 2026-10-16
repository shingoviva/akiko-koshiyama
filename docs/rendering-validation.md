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
