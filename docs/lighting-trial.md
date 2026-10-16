# Lighting trial

Baseline: 060418077f7cfc22b649fdc5e22ddca07c906fff

Only lycoris lighting changes: camera-facing surface normals, upper-left directional diffuse light, darker ambient red and stem shadows. Existing smoothed specular bloom, opacity, depth blur, trajectory and timing retained.

To restore, revert the lighting trial commit (including app.js and encrypted content cache versions). No design rebuild is needed.

Enhanced trial: low-resolution orthographic light-space depth map for tepal self-shadowing, 3×3 shadow sampling, smoothed visibility, view-facing normals and side key diffuse/specular/rim terms. Shadow geometry updates every 100ms; color/shadow transitions remain smoothed. This is a lightweight raster approximation, not path tracing.
