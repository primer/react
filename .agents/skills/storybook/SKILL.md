---
name: storybook
description: 'Use when starting or checking Storybook; looking up component stories, props, or documentation; writing, reviewing, or linting stories; or adding Storybook conventions. Covers story file/title naming, Default and Playground stories, controls, and the primer-storybook MCP. Do not use for component implementation without story changes or Storybook usage.'
---

# Storybook

## When to Use

- You need to look up a component's stories, props, or usage examples
- You are writing or editing a Storybook story
- You want to preview a component variant at a URL
- You are reviewing story conventions or introducing a new convention

## Writing stories

This skill is the source of truth for Storybook authoring conventions. When adding
or changing a convention, detail it here in the same change, including the file
pattern, title scheme, and an example. Keep the linter and its tests consistent
with conventions that can be checked statically.

Colocate stories with their component, usually in
`packages/react/src/<ComponentName>/`. Use these file names and CSF `title` values:

| Purpose                      | File                                   | Title                                 |
| ---------------------------- | -------------------------------------- | ------------------------------------- |
| Component                    | `<ComponentName>.stories.tsx`          | `Components/<ComponentName>`          |
| Feature coverage             | `<ComponentName>.features.stories.tsx` | `Components/<ComponentName>/Features` |
| Usage examples and scenarios | `<ComponentName>.examples.stories.tsx` | `Components/<ComponentName>/Examples` |
| Development-only cases       | `<ComponentName>.dev.stories.tsx`      | `Components/<ComponentName>/Dev`      |

For example, `Button.examples.stories.tsx` uses
`title: 'Components/Button/Examples'`.

- The component file must export `Default` and `Playground`. `Default` shows the
  simplest representative usage; `Playground` exposes controls for configurable
  props. Pass its `args` to the component so changing controls updates the preview.
- Configure controls with `argTypes` on the meta or Playground, or let Storybook
  infer them from `component` and nonempty `args`. Do not disable controls on the
  Playground. Both CSF object stories and function stories with `.args` and
  `.argTypes` assignments are supported.
- Feature stories isolate supported variants, states, and behaviors. Examples
  demonstrate compositions or realistic scenarios. Neither replaces the
  component file's `Default` and `Playground`.
- Dev stories are for debugging, stress tests, and internal fixtures. The
  `*.dev.stories.tsx` suffix matters: production Storybook excludes these files,
  regardless of their title.
- Preserve existing `Experimental/`, `Deprecated/`, or `Private/` title prefixes
  and component groups such as `Components/Skeleton/SkeletonBox`.
- When splitting a category, use `<ComponentName>.<topic>.features.stories.tsx`
  (or `.examples.stories.tsx` / `.dev.stories.tsx`) with a title under that
  category, for example `Components/Button/Features/Loading`.
- Existing stress-test files use `<ComponentName>.stress.dev.stories.tsx` and
  `StressTests/Components/<ComponentName>`. Keep this development-only exception.
- Use descriptive PascalCase named story exports, such as `WithLeadingVisual`.
  The required component exports are exactly `Default` and `Playground`.

### Linting conventions

Run from the repository root; no running Storybook server is required:

```bash
npm run lint:storybook
npm run lint:storybook -- 'packages/react/src/Button/*.stories.tsx'
node --test script/lint-storybook.test.mts
```

The opt-in linter checks story extensions, file/title naming, required component
exports, and statically configured Playground controls. It exits nonzero for
violations or unmatched patterns. The default scans `packages/react/src`; legacy
violations are reported, not automatically migrated or added to the main lint
command. The non-component namespaces `Behaviors/`, `Hooks/`, and `Octicons/`
are outside its scope.

Keep meta, args, and argTypes statically readable (inline objects or local
variables, including `as` / `satisfies`). The linter does not execute imported
helpers or imported spreads; it reports controls it cannot verify. It also cannot
infer the full component prop surface or verify that a render function actually
uses its args. Controls checks honor explicit disabling and static
`parameters.controls.include` / `exclude` arrays or regular expressions. Preview
the Playground and change controls to verify the interaction.

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
