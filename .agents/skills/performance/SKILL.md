---
name: performance
description: 'Use when investigating or improving Primer React performance, including slow interactions, rendering, layout, page loads, and memory growth. Do not use for functional debugging without a performance symptom or for analytics and adoption metrics.'
---

# Performance

Start with a reproducible symptom and a baseline. Use measurements to identify
the bottleneck before proposing a change.

## Workflow

1. Define the scenario, expected behavior, and metric: interaction latency,
   scripting time, style/layout cost, LCP, or retained heap size.
2. Read the [browser reference](references/browser.md) for browser investigations.
   For component scenarios, load the `storybook` skill to find an existing story
   and start Storybook only if needed.
3. Capture a baseline using Chrome DevTools MCP. Keep content, viewport, theme,
   cache state, CPU/network emulation, and interaction sequence consistent.
4. Follow the evidence to the responsible work. Distinguish React rendering from
   JavaScript, style recalculation, layout, paint, network, and retained objects.
5. Make the smallest change that addresses the measured cause without changing
   behavior or accessibility.
6. Repeat the same scenario and compare multiple runs. Report the before/after
   measurements, capture conditions, supporting trace or retaining path, and
   remaining uncertainty. Do not claim a win from a single noisy run.

## Related skills

- `chrome-devtools`: MCP browser inspection, interaction, and trace tooling.
- `chrome-devtools-cli`: terminal automation when MCP is unavailable or a script
  is explicitly needed.
- `debug-optimize-lcp`: page-load and Largest Contentful Paint investigations.
- `memory-leak-debugging`: heap growth, detached nodes, and retaining paths.
- `a11y-debugging`: verify keyboard, focus, and semantic behavior affected by a fix.

## References

| Reference                        | When to use                                                         |
| :------------------------------- | :------------------------------------------------------------------ |
| [Browser](references/browser.md) | Browser tool selection, repeatable traces, and heap investigations. |
