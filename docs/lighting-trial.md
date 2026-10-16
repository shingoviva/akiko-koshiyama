# Lighting trial

Baseline: 060418077f7cfc22b649fdc5e22ddca07c906fff

Only lycoris lighting changes: camera-facing surface normals, upper-left directional diffuse light, darker ambient red and stem shadows. Existing smoothed specular bloom, opacity, depth blur, trajectory and timing retained.

To restore, revert the lighting trial commit (including app.js and encrypted content cache versions). No design rebuild is needed.

Enhanced trial: low-resolution orthographic light-space depth map for tepal self-shadowing, 3×3 shadow sampling, smoothed visibility, view-facing normals and side key diffuse/specular/rim terms. Shadow geometry updates every 100ms; color/shadow transitions remain smoothed. This is a lightweight raster approximation, not path tracing.

Environment/transmission trial baseline: bd6ccfdabf3d6d0c88e307270efb374fe28948cb. Added a fixed weak hemisphere fill, reduced in occluded folds, and a red backlighting term on thin tepals only. Fill/transmission energy is added in linear RGB using lookup tables; this is an inexpensive thin-material approximation, not volumetric scattering or full light transport. It does not inspect DOM background colors or mask flowers by section. Existing alpha/depth compositing remains unchanged. Deterministic flower poses were inspected on dark and light backgrounds. Revert this trial commit to restore baseline.
