# @primer/mcp

> The Primer MCP server connects AI tools to Primer's design system. It provides
> tools for AI agents to connect with design tokens, components, patterns, and
> more.

## Getting started

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=Primer&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40primer%2Fmcp%40latest%22%5D%7D) [![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_Server-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=Primer&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40primer%2Fmcp%40latest%22%5D%7D&quality=insiders)

The `@primer/mcp` package provides a server that can be run in your local
development environment or can be setup in tools like GitHub Actions to be used
by AI agents.

### VS Code

To use `@primer/mcp` in VS Code, you can use the button in the section above or
follow these steps:

1. Open the Command Palette (Cmd/Ctrl + Shift + P)
2. Type `MCP: Install Server` and select it
3. Select the `stdio` type
4. Enter in the following command: `npx @primer/mcp@latest`
5. Enter the name `Primer` for the server

Your MCP servers configuration should look like:

```json
{
  "servers": {
    "Primer": {
      "type": "stdio",
      "command": "npx",
      "args": ["@primer/mcp@latest"]
    }
  },
  "inputs": []
}
```

## Component metadata sources

`get_component_composition` returns source-derived composition metadata from the
installed `@primer/react` package. It is package-backed, so a local workspace
can exercise newly generated metadata without waiting for hosted Primer Style
documentation to deploy.

`get_component` and `get_component_batch` use hosted Primer Style documentation
by default. Pass `source: "package"` to return the installed package's
generated component metadata and composition instead. Set
`PRIMER_COMPONENT_DOCS_SOURCE=package` when starting the server to make package
metadata the default; use `PRIMER_COMPONENT_DOCS_SOURCE=hosted` to retain the
hosted default. The per-call `source` input takes precedence over the startup
default. Package-mode batches return a compact composition-first summary;
observed relationship types are deterministically limited to the three strongest
records and report omitted counts. `get_component` remains available when full
package documentation or complete relationship provenance is needed.

## Hosted documentation

Documentation tools prefer the matching Primer Style text-only `llms.txt`
endpoint. During the hosted rollout, a missing endpoint (HTTP 404) falls back
to the existing HTML conversion; other endpoint failures are returned as errors.

## Pattern guidance

`get_pattern` returns compact structured guidance by default. Its component and
related-pattern references are parsed from the authoritative Primer Style page
at request time: `/product/components/` links are reported as
`primer-public`, and `/product/internal-components/` links are reported as
`primer-internal`. This avoids a separate mapping catalog and keeps the result
current as the hosted page changes.

Pass `detail: "full"` to receive the complete Primer Style guidance when
compact implementation, accessibility, and state guidance is insufficient. Full
guidance uses the pattern's text-only `llms.txt` endpoint. Until a hosted
pattern page has that endpoint, the server falls back to the existing HTML
conversion. The compact parser intentionally fails when it cannot identify the
page's guidance body, rather than returning navigation content as pattern
guidance.

## 🙌 Contributing

We love collaborating with folks inside and outside of GitHub and welcome contributions! If you're interested, check out our [contributing docs](contributor-docs/CONTRIBUTING.md) for more info on how to get started.
