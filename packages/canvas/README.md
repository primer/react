# @primer/react-canvas

A canvas extension compatible package for `@primer/react`. This package provides
components without any additional build step, just include the `importmap` below
and start building.

## Getting started

To install `@primer/react-canvas` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/react-canvas
```

## Usage

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@%5E19",
      "react/jsx-runtime": "https://esm.sh/react@%5E19/jsx-runtime",
      "react-dom": "https://esm.sh/react-dom@%5E19",
      "react-dom/client": "https://esm.sh/react-dom@%5E19/client",
      "@primer/react": "https://esm.sh/@primer/react-canvas@%5E38?deps=react@%5E19,react-dom@%5E19",
      "@primer/octicons-react": "https://esm.sh/@primer/octicons-react@19.13.0?deps=react@%5E19",
      "htm": "https://esm.sh/htm@3.1.1"
    }
  }
</script>
```
