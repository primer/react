---
name: storybook
description: 'Use when: starting, checking, or using the Storybook dev server; looking up Primer React component stories, props, or documentation; previewing component variants; writing or verifying Storybook stories; using the primer-storybook MCP to explore components. Covers starting Storybook, checking if it is running, and using MCP tools (list-all-documentation, get-documentation, get-storybook-story-instructions, preview-stories) to look up components.'
---

# Storybook — Start Server & Use MCP

## When to Use

- You need to look up a component's stories, props, or usage examples
- You are writing or editing a Storybook story
- You want to preview a component variant at a URL
- Any task that benefits from live Storybook documentation

---

## Step 1 — Ensure Storybook Is Running

Storybook must be running **before** any MCP tool calls. The MCP server is served by Storybook at `http://localhost:6006/mcp`.

### Check if it is already running

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:6006
```

- **200 / 3xx** → Storybook is already up. Skip to Step 2.
- **000 / connection refused** → Start it now.

### Start Storybook

Run from the workspace root (not `packages/react`):

```bash
npm start
```

This starts the Storybook dev server on `http://localhost:6006`. It takes ~3–10 seconds.
Run as a **background process** so the agent continues working.

### Verify it is ready

Poll until the server responds:

```bash
until curl -s -o /dev/null -w "%{http_code}" http://localhost:6006 | grep -q "200\|301\|302"; do sleep 1; done
```

---

## Step 2 — Use the `primer-storybook` MCP

The `primer-storybook` MCP is configured in `.vscode/mcp.json` as an HTTP server at `http://localhost:6006/mcp`.

Load deferred tools before calling them:

```
tool_search_tool_regex pattern: "mcp_primer-storyb"
```

### Available Tools

| Tool                                                 | When to Use                                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `mcp_primer-storyb_list-all-documentation`           | Discover all available component and documentation IDs — call once per task                    |
| `mcp_primer-storyb_get-documentation`                | Retrieve full docs, props, and examples for a component by `id`                                |
| `mcp_primer-storyb_get-documentation-for-story`      | Get docs for a specific story variant not covered by `get-documentation`                       |
| `mcp_primer-storyb_get-storybook-story-instructions` | Get framework-specific imports and story patterns — always call before writing/editing stories |
| `mcp_primer-storyb_preview-stories`                  | Get live preview URLs for stories — always include returned URLs in your response              |

### Workflow

1. **Always list first**: Call `list-all-documentation` to get the full list of valid IDs. **Never call `get-documentation` without first obtaining an ID from this list.** Do not guess or infer IDs from component names (e.g. `"button"` is wrong — the correct ID is `"components-button"`).
2. **Match the ID**: Find the entry in the list that corresponds to the component you need. IDs follow the pattern `components-<componentname>` (e.g. `components-button`, `components-actionmenu`).
3. **Get by ID**: Call `get-documentation` with the exact `id` from the list (use `storybookId` to scope to one source when multiple are configured).
4. **Verify props**: Never invent props or variants not present in the documentation.
5. **Before writing stories**: Always call `get-storybook-story-instructions` first — treat its output as the source of truth.
6. **After changing stories**: Call `preview-stories` and include every returned URL in your response.

---

## Rules

- Do **not** call MCP tools before Storybook is running — they will fail silently.
- **Always** call `list-all-documentation` before `get-documentation` — never guess or derive an ID from a component name. Only use `id` values returned by this list.
- **Never invent props or variants** not present in the documentation. Only use properties explicitly documented or shown in example stories — do not assume properties based on naming conventions or patterns from other libraries. If a property isn't documented, report it as not found and check back with the user.
- Before writing or editing stories, always call `get-storybook-story-instructions` — treat its output as the source of truth.
