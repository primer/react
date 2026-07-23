# Blankslate spec

Blankslate explains why content is missing and may guide users toward a next step.

## Accessibility

- Consumers MUST include a heading that identifies the empty state.
- Consumers MUST choose a heading level that fits the surrounding page hierarchy.
- Consumers MUST provide text that explains the empty state without relying on the visual alone.
- Consumers MUST give interactive controls descriptive accessible names that communicate their purpose.

## Features

### Default

Blankslate provides a compound component for composing a heading, optional description, visual, and actions.

#### Default markup

```html
<!-- Heading defaults to h2; consumers may specify h1–h6 -->
<h2>Heading text</h2>
<p>Description text</p>
```

- The heading MUST render as an `<h2>` by default and MAY render as an `<h1>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>` when consumers provide the appropriate heading level.
- The description MUST render as a paragraph.

#### Default public API

- Additional HTML attributes MUST be forwarded to the outer container.
- `className` MUST be applied to the inner Blankslate presentation container rather than the outer container.
- `Blankslate.Visual`, `Blankslate.Heading`, and `Blankslate.Description` MUST forward additional HTML attributes to their rendered elements.

### Visual

The optional visual supports the empty-state message with an icon, illustration, or other graphic.

#### Visual accessibility

- The visual MUST be presentational and hidden from the accessibility tree.

### Actions

Blankslate may provide a primary action, a secondary action, or both.

#### Actions markup

```html
<!-- Primary action without a navigation target renders as a button -->
<button type="button">Create the first page</button>

<!-- Primary action with a navigation target renders as a link -->
<a href="...">Create the first page</a>

<!-- Secondary action always renders as a link -->
<a href="...">Learn more about wikis</a>
```

- A primary action without a navigation target MUST render as a button.
- A primary action with a navigation target MUST render as a link.
- A secondary action MUST render as a link.

#### Actions behavior

- Consumers SHOULD use the primary action for the recommended next step.
- Consumers SHOULD use the secondary action for supplementary navigation, such as documentation or more information.

#### Actions public API

- A button-form primary action MUST forward additional button props to its rendered button.
- A primary action MAY be rendered independently from Blankslate.

## Log

<!-- Record notable decisions and significant spec changes in reverse-chronological order. -->
