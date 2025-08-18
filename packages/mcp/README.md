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

## 🙌 Contributing

We love collaborating with folks inside and outside of GitHub and welcome contributions! If you're interested, check out our [contributing docs](contributor-docs/CONTRIBUTING.md) for more info on how to get started.
