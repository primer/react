---
title: Linting
description: Primer React offers an ESLint plugin to enforce best practices and fix common problems.
---

<Note variant="warning">

`eslint-plugin-primer-react` is experimental. Please report issues in the [primer/react](https://github.com/primer/react) repository.

</Note>

## Installation

1. Assuming you already have [ESLint](https://www.npmjs.com/package/eslint) and [Primer React](https://github.com/primer/react) installed, run:

   ```shell
   npm install --save-dev eslint-plugin-primer-react

   # or

   yarn add --dev eslint-plugin-primer-react
   ```

2. In your [ESLint configuration file](https://eslint.org/docs/user-guide/configuring/configuration-files), extend the recommended Primer React ESLint config:

   ```json
   {
     "extends": [
       // ...
       "plugin:primer-react/recommended"
     ]
   }
   ```

See the [eslint-plugin-primer-react](https://github.com/primer/eslint-plugin-primer-react) repository for a list of included lint rules.
