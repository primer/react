---
applyTo: '**/*.css'
---

# Project coding standards for CSS Modules

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

If the file ends with `*.module.css`, it is a CSS Module.

## General Conventions

- After making a change to a file, use `npx stylelint -q --rd --fix` with a path to the file changed to make sure the code lints
