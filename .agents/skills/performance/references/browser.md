# Browser Performance

## Table of Contents

- [Tooling](#tooling), L:11
- [Rendering and interactions](#rendering-and-interactions), L:28
- [Page loads](#page-loads), L:44
- [Memory](#memory), L:53
- [Evidence](#evidence), L:62

## Tooling

Use [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
for browser performance investigations. The project configures `chrome-devtools`
in `.mcp.json`, including `--memoryDebugging`. Usage statistics and CrUX URL
lookups are disabled. Node.js, npm, and current stable Chrome are prerequisites.
Restart the MCP client after changing its configuration.

Load the `chrome-devtools` skill and discover the available tool schemas before
calling tools. Do not guess tool arguments or reuse page IDs from another session.
Use `list_pages` or the page ID returned by `new_page`.

Prefer MCP for interactive investigations. Use the `chrome-devtools-cli` skill
when terminal scripting is needed or MCP is unavailable. For environments using
CFS, follow the `gh-cfs` skill for package acquisition and local MCP setup rather
than bypassing the configured feed. Do not install a second browser harness.

## Rendering and interactions

1. Find an existing reproduction. For Storybook, use the `storybook` skill and a
   focused story URL rather than measuring the manager UI.
2. Warm up the scenario and record the viewport, theme, cache state, and any
   `emulate` settings. Each emulation call replaces prior settings (except extra
   HTTP headers), so pass the complete desired settings together.
3. Start `performance_start_trace` with the target `pageId`, `reload: false`,
   and `autoStop: false`. Perform the slow interaction, then call
   `performance_stop_trace`.
4. Inspect the returned trace summary and use `performance_analyze_insight` with
   insight IDs and names actually returned by the tools.
5. Correlate long tasks, style recalculation, layout, and paint with the
   interaction. Use `get_css_styles` for matched rules and `evaluate_script` only
   for runtime data not already exposed by a tool.

## Page loads

Load `debug-optimize-lcp`. Record with `reload: true` and `autoStop: true`.
Identify the actual LCP element and its slow subpart before changing images,
fonts, CSS, or scripts. Keep cold-cache and warm-cache runs separate.

Storybook development traces help diagnose work, but do not represent production
bundle or page-load performance. Use a production reproduction for those claims.

## Memory

Load `memory-leak-debugging`. Capture baseline, post-interaction, and
post-cleanup heaps after repeating the same interaction cycle. Compare retained
objects and inspect retaining paths rather than treating peak allocation as a
leak. Do not read raw heap snapshots into context.

Use `close_heapsnapshot` for each loaded snapshot when finished.

## Evidence

Report the URL/story, exact interaction, capture settings, relevant trace insight
or retaining path, and comparable before/after measurements. Save large artifacts
only when needed, to an explicitly scoped workspace-local scratch path, and
remove task-owned scratch artifacts after use. Do not commit traces or heaps
unless explicitly requested.
