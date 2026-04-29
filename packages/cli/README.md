# Primer CLI

`@primer/cli` is a command line interface for querying information about Primer.

```sh
primer --help
primer components list
primer components get Button
primer tokens list --group bgColor
primer tokens get bgColor-default
```

Commands print tables by default. Add `--json` anywhere in the command to return JSON instead:

```sh
primer --json components list
primer tokens get --json bgColor-default
```

The CLI is intended to be a homebase for agents that need information about Primer components, APIs, source, docs, and design tokens.
