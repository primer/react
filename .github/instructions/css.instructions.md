---
applyTo: '**/*.css'
---

# Project coding standards for CSS Modules

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

If the file ends with `*.module.css`, it is a CSS Module.

## General Conventions

- After making a change to a file, use `npx stylelint -q --rd --fix` with a path to the file changed to make sure the code lints.

## Performance and Web Vitals Analysis (Required)

When creating or modifying CSS, you must **explicitly analyze and account for impact on Core Web Vitals**. Treat this as a first-class requirement, not an afterthought.

### Metrics to Consider

Evaluate changes against the following metrics and call out any risks:

- **LCP (Largest Contentful Paint)**

  - Risk factors: render-blocking styles, large above-the-fold background images, heavy font usage, complex selectors on critical elements.

- **CLS (Cumulative Layout Shift)**

  - Risk factors: late-loading fonts, size-less images/media, conditional styles that affect layout after initial render, JS-driven class toggles that change dimensions.

- **INP (Interaction to Next Paint)**

  - Risk factors: expensive selector matching, `:has()` on large subtrees, frequent style recalculation triggers, deep descendant selectors on interactive paths.

### Required Analysis Checklist

For each meaningful CSS change, reason through and validate the following:

- **Selector Cost**

  - Prefer class selectors over tag or attribute selectors.
  - Avoid deep descendant chains (`.a .b .c .d`) in large or frequently updated subtrees.
  - Use `:has()` only when strictly necessary; assume worst-case cost on large DOMs and justify usage.

- **Style Recalculation Scope**

  - Consider which DOM nodes are affected when classes or attributes change.
  - Avoid selectors that match large portions of the tree when toggling state (e.g., `[data-*] .child`).

- **Layout and Paint Stability**

  - Do not introduce layout-affecting properties (`width`, `height`, `margin`, `padding`, `display`) that may change after hydration or user interaction unless explicitly intended.
  - Prefer transform/opacity for interaction-driven effects.
  - Ensure predictable sizing for media, containers, and dynamic content to prevent CLS.

- **Critical Rendering Path**

  - Avoid adding styles that block first paint or LCP for above-the-fold content.
  - Be cautious with large background images, filters, and shadows on critical elements.

### CSS Modules–Specific Guidance

- Assume CSS Modules may be used across multiple React roots and hydration boundaries.
- Avoid styles that depend on global cascade ordering or implicit inheritance from non-module CSS.
- Do not rely on runtime-injected styles to correct layout shifts introduced by base styles.

### Documentation Requirement

When a change has **any non-trivial performance implication**, include a brief inline comment or PR description that states:

- Which Web Vital(s) may be affected.
- Why the change is safe, or what tradeoff is being made.
- Any assumptions about DOM size, interaction frequency, or rendering phase (SSR vs client).

### Examples of High-Risk Patterns (Avoid Unless Justified)

- `:has()` selectors applied to containers with large or frequently changing subtrees.
- Attribute selectors used as global state flags on high-level containers.
- Layout changes driven by hover, focus, or JS state on large components.
- Font or image-dependent sizing without explicit fallbacks.

Performance regressions are considered correctness issues. If a change cannot be justified as Web Vitals–safe, it should not be merged without explicit sign-off.
