---
'@primer/react': major
---

ThemeProvider: Remove `colorSchemes` from the default `theme` and stop merging
color scheme values into the theme context. Color schemes are applied via CSS
variables instead, and passing an unknown color scheme no longer logs an error.
`useTheme()` no longer returns `theme` or `resolvedColorScheme`. The
`ThemeColorPaths` and `ThemeShadowPaths` types are also no longer exported.
