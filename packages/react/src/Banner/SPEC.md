# Banner spec

Banner highlights important information or provides feedback after a user action.

## Accessibility

- A Banner MUST have a title that identifies its purpose and communicates the type of message it contains.
- A Banner MUST be discoverable as both a named landmark and part of the page's heading hierarchy.
- A Banner's variant MUST be communicated by more than color alone.
- Interactive controls within a Banner MUST have descriptive accessible names that include their visible labels.
- When a Banner appears dynamically, consumers MUST either move focus to the Banner when its content is essential or announce its content through a persistent live region that existed before the Banner appeared when moving focus would be disruptive.
- When Banner content changes after it is rendered, consumers MUST announce the update through a persistent live region within the Banner or an external live region that existed before the content changed.
- When a dismissed Banner is removed, consumers MUST move focus to a useful element if removal would otherwise cause focus loss.
- Banner content MUST remain readable and operable without horizontal scrolling at 200% zoom and at a viewport size of 320 by 256 CSS pixels.
- Text MUST have a contrast ratio of at least 4.5:1. Icons and other meaningful non-text content MUST have a contrast ratio of at least 3:1.
- Interactive controls MUST have a target size of at least 24 by 24 CSS pixels.

## Features

### Default

Banner provides a title, an optional description, and a visual that communicates the selected variant.

#### Default markup

```html
<section aria-labelledby="banner-title" tabindex="-1">
  <h2 id="banner-title">Banner title</h2>
  <!-- optional description -->
  <p>Description text</p>
</section>
```

- The root MUST render as a `<section>` landmark.
- The root MUST be programmatically focusable without placing it in the sequential focus order.
- The Banner title MUST render as a heading. It MUST render as an `<h2>` by default and MAY render as an `<h3>`, `<h4>`, `<h5>`, or `<h6>` when consumers provide the appropriate heading level.
- The landmark MUST be named by the Banner title by default.
- When `aria-label` is provided without `aria-labelledby`, the landmark MUST use `aria-label` instead of the Banner title for its accessible name.
- When `aria-labelledby` is provided, it MUST take precedence over `aria-label`.
- A visually hidden title MUST remain in the accessibility tree and continue to name the landmark.
- The built-in leading visual MUST be hidden from the accessibility tree.

#### Default behavior

- Consumers MUST provide exactly one title, either through the `title` prop or a `Banner.Title` child.
- The component MUST report a development error when no title is provided.
- Hiding the title MUST affect only its visual presentation.
- The component MUST NOT automatically announce itself when it is rendered.

#### Default public API

- When a `Banner.Title` child provides a custom `id`, consumers MUST provide a matching `aria-labelledby` value on Banner.
- The forwarded ref MUST target the root `<section>`.
- Additional root element props MUST be forwarded to the root `<section>`.

### Variants and leading visuals

Variants communicate the type of message and provide a corresponding visual treatment.

#### Variants and leading visuals behavior

- Banner MUST support critical, info, success, upsell, and warning variants.
- Each variant MUST render a leading visual that distinguishes it without relying on color alone.
- Consumers MUST NOT be able to remove the leading visual.
- Custom leading visuals MUST be supported only for info and upsell variants.
- When both `leadingVisual` and `icon` are provided, `leadingVisual` MUST take precedence.
- A custom leading visual SHOULD be decorative and hidden from the accessibility tree. It MUST NOT be the only way the Banner's purpose is communicated.
- Changing the variant MUST NOT change the landmark role or accessible naming behavior.

### Actions

Banner may provide one primary action, one secondary action, or both.

#### Actions markup

```html
<!-- Primary action as a button -->
<button type="button">Action label</button>

<!-- Primary action as a link -->
<a href="...">Action label</a>

<!-- Secondary action as a link -->
<a href="...">Action label</a>
```

- Primary and secondary actions MUST render as interactive controls.
- Primary and secondary actions MAY render as buttons for actions or links for navigation.
- Responsive layout changes MUST expose only one operable instance of each action at a time.

#### Actions behavior

- When both actions are present, the primary action MUST represent the recommended action.
- In the default actions layout, actions MUST remain inline when sufficient container space is available and stack when the available container width is less than 500 CSS pixels.
- In the inline actions layout, actions SHOULD remain inline with the content but MUST stack at narrow viewport widths.
- In the stacked actions layout, actions MUST remain in a separate stacked row.
- When actions stack, the primary action MUST precede the secondary action.
- Activating an action MUST invoke the handler provided to that action without invoking Banner dismissal.

#### Actions accessibility

- When a Banner appears dynamically and contains an action that is required to continue, consumers MUST move focus to the Banner when it appears.

### Dismissal

A Banner may provide a dismiss control when the message can be safely removed.

#### Dismissal markup

```html
<button type="button">Dismiss banner</button>
```

- A dismissible Banner MUST render a button with the accessible name `Dismiss banner`.

#### Dismissal behavior

- Activating the dismiss button MUST invoke `onDismiss` once for each activation.
- Banner MUST NOT remove itself after dismissal. Consumers are responsible for updating visibility in response to `onDismiss`.
- Banner MUST NOT move focus after dismissal. Consumers are responsible for restoring focus when removing the Banner would otherwise cause focus loss.

### Layout

Banner supports default and compact spacing, responsive action placement, and a flush presentation for confined surfaces.

#### Layout behavior

- The default layout MUST use the standard Banner spacing.
- The compact layout MUST reduce the Banner's padding without changing its semantic structure.
- The default actions layout MUST respond to the Banner's available container width rather than only the viewport width.
- A flush Banner MUST span the available width without rounded side borders.
- Flush presentation SHOULD be used only within confined surfaces such as dialogs, tables, cards, or boxes.
