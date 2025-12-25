---
'@primer/react': patch
---

perf(BaseStyles): Feature-flag expensive :has([data-color-mode]) selectors

Add a feature flag (`primer_react_css_perf_has_selector`) to opt-in to skipping expensive `:has([data-color-mode])` selectors that scan the entire DOM on every style recalculation.

To enable the optimization, set the `primer_react_css_perf_has_selector` feature flag to `true` via the `FeatureFlags` component. The BaseStyles component will automatically add the `data-primer-css-perf-has-selector` attribute when the flag is enabled. Input color-scheme is already handled by global selectors in the codebase.

See #7325 and #7312 for context on this performance optimization.
