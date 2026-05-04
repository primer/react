---
applyTo: '**/*.css'
---

# Project coding standards for CSS Modules

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

If the file ends with `*.module.css`, it is a CSS Module.

## General Conventions

- After making a change to a file, use `npx stylelint -q --rd --fix` with a path to the file changed to make sure the code lints

## `:has()` Selectors and Safari Performance

`:has()` selectors are blocked by stylelint (`selector-pseudo-class-disallowed-list`) because they can cause catastrophic Safari performance regressions. In Aug 2025, a single `:has()` selector on a broadly-present component froze the entire GitHub UI for 10-20+ seconds on Safari. See [github/github-ui#17224](https://github.com/github/github-ui/issues/17224) for the full audit.

**When you need `:has()`:**

1. Ensure it's scoped to a CSS Module class (`&:has(...)` inside a `.Component` rule). Never use `:has()` on `body`, `html`, `*`, or other high-cardinality selectors.
2. Keep the argument simple. Avoid deeply-nested descendant selectors inside `:has()`.
3. Add a scoped stylelint disable with justification. Use `stylelint-disable-next-line` for individual selectors, or a `stylelint-disable`/`stylelint-enable` block around a group of related selectors. Avoid file-level disables so new `:has()` selectors in the same file still trigger review. Example: `/* stylelint-disable-next-line selector-pseudo-class-disallowed-list -- scoped to CSS Module, audited (github/github-ui#17224) */`
4. Consider alternatives first: data attributes set via JS, `:where()`, or restructuring the DOM so the parent already has the information it needs.

**Why CSS Modules help:** CSS Module class names are unique hashed identifiers, so the browser only evaluates `:has()` on elements matching that specific class, not the entire DOM. This limits the invalidation blast radius. Unscoped selectors like `body:has(...)` force the browser to scan all descendants of `body` on every DOM mutation, which is where WebKit's quadratic invalidation triggers.
