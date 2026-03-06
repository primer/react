# @primer/doc-gen

## Context

Documentation for https://primer.style/ is generated via summaries defined in `*.docs.json` files for components (e.g. [Button.docs.json](packages/react/src/Button/Button.docs.json)). This package facilitates ensuring TypeScript typings & the documentation site don't diverge.

## How to use

### Generation

As part of the [build](packages/react/script/components-json/build.ts) script for compiling the `docs.json` summaries, this `doc-gen` module is run as a pre-processor for the content. Any props marked as `derived` within their `Component.docs.json` will have their meta-data pulled & merged from it's TS source and validated using the existing JSONSchema. Errors during this phase will fail the build.

### Validation

In order to validate that the properties taken from TypeScript and the authored `.docs.json` are aligned, there is a `validate` command to run:

```bash
npx doc-gen validate ./packages/react/src/Button
```

This will display a table summary of all props found in `.docs.json` and ensure they are also present in TypeScript.

#### Deriving Props from TS

In order to derive a prop for a component from it's TS source, use the `"derive": true` flag within the given property. The `name` is the only other required property in order to map the appropriate property. Any property marked as _derived_ that are not found within the TS source will throw an error.

<table>
<tr><td>Before</td><td>After</td></tr>
<tr>
<td>

In the component's `*.docs.json`

```json
{
  "props": [
    {
      "name": "alignContent",
      "type": "'start' | 'center'",
      "default": "start",
      "description": "Content alignment for when visuals are present.",
      "required": false
    }
  ]
}
```

</td>

<td>

In the component's `*.docs.json`

```json
{
  "props": [
    {
      "name": "alignContent",
      "derive": true
    }
  ]
}
```

In the component's `*.tsx`

```tsx
interface Props {
  /**
   * Content alignment for when visuals are present.
   *
   * @default 'start'
   */
  alignContent?: 'start' | 'center'
}
```

</td>

</tr>
</table>

To override any value of a derived property, set the value within the `*.docs.json` as usual:

```json
{
  "props": [
    {
      "name": "alignContent",
      "description": "Override the default value",
      "derive": true
    }
  ]
}
```

### Auto-Fix

To make the transition easier for the migration, a `--fix` option is available:

```bash
npx doc-gen validate ./packages/react/src/Button --fix
```

For each property in the `*.docs.json`, it will:

- Write any `description`, `required`, and `default` values for that property into the TS source.
- Mark the `prop` in the `.docs.json` as _derived_
- Remove any attributes from the `.docs.json` that duplicate the values from the TS source.
