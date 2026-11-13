# ActionList

`ActionList` is a semantic action, menu, or listbox list composed from explicit child parts.

Import: `import {ActionList} from '@primer/react-tailwind/ActionList'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`ActionList` accepts `role`, `selectionVariant`, `variant`, `showDividers`, `disableItemGap`, and a `heading` region. `Item` supports `selected`, `active`, `disabled`, `inactiveText`, `loading`, `loadingText`, `size` (`small`, `medium`, or `large`), danger styling, and `onSelect`; `LinkItem` supports `active`, `inactiveText`, `render`, and `size`. `Description` supports inline or block layout and truncation. `Heading` renders before the list and labels it, and supports `size` and `visuallyHidden`. `GroupHeading` supports `auxiliaryText`, subtle and filled variants, and a small icon `TrailingAction`. `TrailingAction` supports button or link rendering, icon or text labels, and loading state; all documented child parts forward their relevant HTML props.

## Import and composition

```tsx
import {ActionList} from '@primer/react-tailwind/ActionList'
```

Compose `Item` or `LinkItem`, optional `Group`, `GroupHeading`, `Heading`, `Divider`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`, and one or more `Description` parts in author order. Inline descriptions share the label row and block descriptions create supporting rows. `TrailingAction` is rendered as an interactive sibling of the item action, so it never creates nested button or link markup.

Long trailing text wraps within the available row width; inline descriptions can move below the label when space is limited. Custom trailing content with fixed or non-wrapping dimensions may require its own responsive layout. Prefer wrapping to `Description truncate` when people need the full text, especially at narrow widths or zoom.

`GroupHeading` renders a heading for an ordinary list and a neutral text element for other list roles. Use `as` to choose an appropriate heading level in a plain list or a neutral element in a composite. Menu, menubar, and listbox group labels cannot be semantic headings; a custom `as` component must also render a neutral element. `auxiliaryText` appears below the heading without becoming part of its accessible name or automatically describing the group. Pass it to `Group` or `Listbox.Group` to apply it to the first heading; a value on `GroupHeading` takes precedence. When supplying a wrapped heading through a group's `heading` region, forward the supplied `id` to `GroupHeading` so the group retains its name.

For static status/error text in an ordinary list, render a native `li` directly or use the static `role="listitem"` item described below. Any other `Item` remains a button even without an action callback; `tabIndex={-1}` does not make it noninteractive, and changing its render element still retains button behavior. A native `li` can keep `tabIndex={-1}` and an `HTMLLIElement` ref when programmatic focus is needed. See the static-row migration example. Do not place plain status rows inside menu/listbox/tree composites as if they were actions or options.

For client-side navigation, pass your router's ref-forwarding link through `render` and its destination to that element:

```tsx
<ActionList.LinkItem render={<RouterLink to="/projects" />}>Projects</ActionList.LinkItem>
```

The router link must render a real anchor and forward its ref and received props. Use `onClick` for link activation; `LinkItem`'s `onSelect` is the native React selection event, not `Item.onSelect`. While `inactiveText` is present, `LinkItem` renders a non-navigable anchor without `href` and forwards its ref to that anchor. A custom `render` is not mounted until the item is available, so a ref attached to that custom element remains unset. `aria-disabled` alone does not disable navigation.

When `Item` uses a custom render component, it must forward the received ref and props, including capture handlers, to the same actionable element. The component must also respect its disabled state; side effects in its own earlier capture handlers or discarded props cannot be prevented by `Item`. If the render replaces the item's children, it must render and associate any inactive reason itself.

## Selection and events

ActionList does not own selection state. Render `selected` and update it from `Item.onSelect`. For a listbox whose options are directly owned, use the `Listbox` composition:

```tsx
<ActionList.Listbox aria-label="Projects" selectionVariant="single">
  <ActionList.Item selected onSelect={selectPrimer}>
    Primer React
  </ActionList.Item>
  <ActionList.Listbox.Group aria-label="More projects">
    <ActionList.GroupHeading variant="filled">More projects</ActionList.GroupHeading>
    <ActionList.Item onSelect={selectOcticons}>Octicons</ActionList.Item>
  </ActionList.Listbox.Group>
  <ActionList.Listbox.Divider />
  <ActionList.Item onSelect={selectOtherProjects}>Other projects</ActionList.Item>
</ActionList.Listbox>
```

`Listbox` and `Listbox.Group` render `div` elements and forward their refs to those elements; their options are direct button or anchor elements. Use `Listbox.Divider` and `Listbox.Group` rather than the list-based `Divider` and `Group` in this composition. A group needs an accessible name, supplied by its heading, `aria-label`, or `aria-labelledby`. Group headings default to a non-heading element and cannot contain trailing actions. Direct options support visuals and descriptions, but not trailing actions or other nested interactive controls. Any custom option must retain the direct ownership and keyboard semantics of the listbox.

`ActionList.LinkItem` in a `Listbox` retains its anchor and destination but is exposed as an option rather than a link. Do not rely on this composition when results need accessible link semantics. An ordinary `ActionList` with `LinkItem` children is a link list; an input-owned popup of navigable links requires a separately reviewed interaction pattern.

For static results in a `role="list"` list, pass `role="listitem"` to `Item`. It renders one native, non-focusable `li` with the item's visuals and descriptions and no inner button, and may contain trailing content. It is static content: it throws when given `onSelect`, `onClick`, `render`, selection state, or `loading`, or when it is outside a `role="list"` list. Use an ordinary `Item` when the row itself is an action. Its ref, `className`, and other `li` attributes, including keyboard and capture handlers, target the `li`; an explicit `tabIndex={0}` puts a read-only row in the Tab order for legacy keyboard-traversal compatibility without adding activation behavior. Put interactive trailing content in `trailingAction` or `TrailingAction`, which follows the row in Tab order, rather than in `trailingVisual`. WAI-ARIA 1.2 deprecates `aria-disabled` on `listitem` and it does not make descendants inoperable, so a static row throws for `disabled` or `aria-disabled`; pass `inactiveText` instead to show a warning and the visible reason in the row's content. An inactive row hides its trailing action.

This is not a drop-in replacement for a legacy static row whose unavailable state is only a boolean. `inactiveText` requires a meaningful reason, and hiding trailing actions may change the content or behavior. When no reason is available or interactive descendants are involved, the migration needs accessibility-specialist review; do not invent an explanation or remove meaningful passive trailing content.

For a typed static-row wrapper, use `ActionListStaticItemProps`; its event handlers target the `li` and its type excludes unsupported action and disabled props. Action items continue to use `ActionListItemProps`.

```tsx
<ActionList aria-label="Results">
  <ActionList.Item role="listitem" leadingVisual={<RepoIcon />} description="Owned by octocat">
    primer/react
  </ActionList.Item>
</ActionList>
```

For a custom checkbox tree, retain the `ActionList role="tree"` list and use `TreeItem` for its leaf items:

```tsx
<ActionList aria-label="Projects" aria-multiselectable="true" role="tree" selectionVariant="multiple" disableFocusZone>
  <li role="treeitem" aria-level={1} aria-expanded="true" aria-checked="mixed">
    <ActionList.GroupHeading as="div">Projects</ActionList.GroupHeading>
    <ul role="group" aria-label="Projects">
      <ActionList.TreeItem aria-level={2} aria-checked={selected} onSelect={toggleSelection}>
        Primer React
      </ActionList.TreeItem>
    </ul>
  </li>
</ActionList>
```

`TreeItem` renders a focusable `li` with `role="treeitem"`, forwards its ref to that element, and supports item visuals and descriptions. It is a leaf: compose parent treeitems and their child groups yourself, without nested interactive controls. The root remains a `ul` and forwards its list ref unchanged.

For custom selection semantics, an explicitly supplied `aria-checked` or `aria-selected` takes precedence over the role-derived attribute and `selected` for the indicator. For example, a checkbox tree can supply `aria-checked="mixed"` with `selectionVariant="multiple"` to show a partial-selection dash. If both ARIA attributes are supplied, both are preserved and the indicator follows `aria-checked`; use both only when they represent distinct states.

## Accessibility, disabled behavior, and keyboard

Choose `list`, `menu`, or listbox semantics intentionally and give interactive lists an accessible name. `Listbox` sets `aria-multiselectable` for `selectionVariant="multiple"`. For selection variants, items receive `aria-selected` or `aria-checked`; disabled, inactive, and loading items cannot be activated. Inactive items display their reason as supporting text and also use a warning indicator in ordinary lists. The loading spinner and inactive warning indicator replace the leading visual when one exists, otherwise the trailing visual. Loading and inactive items suppress trailing actions. Native button and link keyboard behavior is retained.

`loadingText` is included in an inferred item name even without supporting descriptions. If the item has an explicit accessible name, the loading text is associated as a description instead, including when that name is supplied by a render element or callback.

`Item` and `LinkItem` expose their `Description` parts and `inactiveText` as accessible descriptions instead of including them in the item name. The name is the primary label and visible trailing visual, with or without a description, so a leading visual's text or `aria-label` is never part of the name; put meaningful leading-visual information in the label or a description. An item without label text, such as an icon-only item, is named from its content. An explicit `aria-label` or `aria-labelledby` supplies the name instead; include the visible primary label. Additional `aria-describedby` references are retained:

```tsx
<ActionList.Item aria-label="Archive repository" aria-describedby="archive-details">
  Archive
  <ActionList.Description id="archive-details">Move this repository out of active lists</ActionList.Description>
</ActionList.Item>
```

Pass a wrapped description through the `description` region. Tree items do not associate descriptions or inactive reasons automatically; provide an explicit name and `aria-describedby` when their supporting text should be announced separately.

An `Item` with a string inactive reason also uses it as a native title unless an explicit `title` is supplied. Native titles are not reliably available to keyboard or touch users; the visible reason does not depend on the title.

Menu, menubar, and listbox lists keep one item in the tab order. The arrow keys, Home, End, Page Up, and Page Down move focus between items, and menus wrap at either end. Pass `disableFocusZone` when a parent widget manages focus; it does not itself implement combobox relationships or keyboard behavior. Disabled items in these composite widgets and in a tree remain focusable with `aria-disabled`, but cannot be activated. Pass `focusableWhenDisabled={false}` to opt out.

An `ActionList role="tree"` does not implement tree navigation or roving focus. Prefer `TreeView` for a complete tree; a custom tree must manage focus, keyboard interaction, and hierarchical semantics itself.

## State attributes

Stable selectors include `ActionList`, `ActionList.Listbox`, `ActionList.Item`, `ActionList.Item.Action`, `ActionList.TreeItem`, `ActionList.LinkItem`, `ActionList.Group`, `ActionList.Listbox.Group`, and their respective dividers. Items expose `data-active`, `data-selected`, `data-variant`, and disabled state; root exposes `data-variant` and `data-dividers`.

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `disableFocusZone`: `boolean` — Default `false`. Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
- `disableItemGap`: `boolean` — Disable the gap between items when this list is rendered in a `NavList`.
- `heading`: `React.ReactNode`
- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Density and inset treatment of the list.

## ActionList.Root

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `disableFocusZone`: `boolean` — Default `false`. Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
- `disableItemGap`: `boolean` — Disable the gap between items when this list is rendered in a `NavList`.
- `heading`: `React.ReactNode`
- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Density and inset treatment of the list.

## ActionList.Item

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `active`: `boolean` — Highlights the item as the current one, without marking it selected.
- `children`: `React.ReactNode`
- `className`: `string`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `disabled`: `boolean` — Prevents activation. In a plain list the item also leaves the keyboard order; in a menu, menubar, listbox, or tree it stays focusable and is marked `aria-disabled`, so keyboard users can still discover it. Static list items cannot be disabled.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and displays why. Unlike `disabled`, the item stays reachable.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation. Loading state is not supported on a static list item.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading. Static list items do not announce a loading state.
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated by click or keyboard. Selection handlers are not supported on a static list item.
- `role`: `(Role & AriaRole)` — Renders a static item in an ordinary list rather than an interactive action.
- `selected`: `boolean` — Marks the item selected, reported through the role's selection attribute. Selection is not supported on a static list item.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`. Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'default'`. Use `danger` for a destructive action.

## ActionList.TreeItem

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `active`: `boolean` — Highlights the item as the current one, without marking it selected.
- `children`: `React.ReactNode`
- `className`: `string`
- `description`: `React.ReactNode`
- `disabled`: `boolean` — Prevents activation. In a plain list the item also leaves the keyboard order; in a menu, menubar, listbox, or tree it stays focusable and is marked `aria-disabled`, so keyboard users can still discover it.
- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and displays why. Unlike `disabled`, the item stays reachable.
- `leadingVisual`: `React.ReactNode`
- `loading`: `boolean` — Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated by click or keyboard.
- `selected`: `boolean` — Marks the item selected, reported through the role's selection attribute.
- `size`: `"large" | "medium" | "small"` — Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target.
- `trailingVisual`: `React.ReactNode`
- `variant`: `"danger" | "default"` — Use `danger` for a destructive action.

## ActionList.LinkItem

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `active`: `boolean` — Highlights the link as the current one.
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `inactiveText`: `React.ReactNode` — Marks the link temporarily unavailable and displays why. The link cannot navigate until it is available.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `render`: `RenderProp<{ active: boolean; }>` — Renders the link using a ref-forwarding element, such as a router link.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`. Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `"danger" | "default"` — Default `'default'`. Use `danger` for a destructive navigation.

## ActionList.Group

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `auxiliaryText`: `string` — Secondary text shown below the group's first heading.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.GroupHeading` child.
- `selectionVariant`: `false | SelectionVariant` — Overrides the list's selection behaviour for this group. `false` renders the group's items without selection.
- `title`: `React.ReactNode` — Heading text for the group, as an alternative to supplying a heading child.

## ActionList.Listbox

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `disableFocusZone`: `boolean` — Default `false`. Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
- `disableItemGap`: `boolean` — Disable the gap between items when this list is rendered in a `NavList`.
- `heading`: `React.ReactNode`
- `selectionVariant`: `SelectionVariant` — How many items may be selected, which also decides the list's ARIA role.
- `showDividers`: `boolean` — Draws a divider between items.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Density and inset treatment of the list.

## ActionList.Listbox.Group

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `auxiliaryText`: `string` — Secondary text shown below the group's first heading.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.GroupHeading` child.
- `selectionVariant`: `false | SelectionVariant` — Overrides the list's selection behaviour for this group.
- `title`: `React.ReactNode` — Heading text for the group, as an alternative to supplying a heading child.

## ActionList.Listbox.Divider

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.GroupHeading

Renders a [`<h3>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h3#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Heading element to render, so the group heading fits the surrounding document outline.
- `auxiliaryText`: `string` — Secondary text shown below the group heading.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.GroupHeading.TrailingAction` child.
- `variant`: `"filled" | "subtle"` — Default `'subtle'`. Use `filled` to give the heading a background and separate it from the items above.

## ActionList.GroupHeading.TrailingAction

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'button'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon` (required): `(React.ElementType | undefined) & React.ElementType` — Icon component to render. Icon rendered inside the heading's trailing action.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.
- `type`: `string` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## ActionList.Divider

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionList.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## ActionList.Heading

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'h2'`. Heading element to render, so the list heading fits the surrounding document outline.
- `size`: `"large" | "medium" | "small"` — Title size of the heading. Omit it to keep the default large heading font size.
- `visuallyHidden`: `boolean` — Default `false`. Hides the heading visually while it still names the list for assistive technology.

## ActionList.TrailingAction

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `as`: `"a" | "button"` — Default `'button'`. Renders the action as a button. Renders the action as a link.
- `block`: `boolean` — Stretches the button to fill the width of its container. Stretches the link to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity. Number shown in a trailing counter.
- `disabled`: `boolean` — Default `false`. Prevents activation and removes the button from the keyboard order. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `href`: `string` — Not available on a button action. Use `as="a"` to make the action navigate.
- `icon`: `React.ElementType` — Icon component to render.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. Marks the link temporarily unavailable while keeping it focusable.
- `label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses activation. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `style`: `React.CSSProperties`
- `tooltipDirection`: `TooltipDirection` — Default `'w'`. Side and alignment of the tooltip that shows `label` for an icon action.
- `type`: `string` — Default `'button'`. Native button behavior. Use `submit` to submit a form.

## Differences from `@primer/react`

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList` and `ActionList.Group` accept `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- Move wrapped `ActionList.TrailingAction` or `ActionList.GroupHeading.TrailingAction` children into their parent's `trailingAction` prop. A wrapped action placed directly in `children` is not recognized as a part and can become part of the primary label instead.
- Compose a custom group heading with `ActionList.Group heading={<WrappedHeading />}`. The wrapper must forward the supplied `id` to `ActionList.GroupHeading` so the group keeps its accessible name.
- `GroupHeading auxiliaryText` renders secondary text separately from the heading and any trailing action. It is not automatically included in the group name or associated as its description. `Group` and `Listbox.Group` also accept `auxiliaryText` for their first heading, including a wrapped heading supplied through the `heading` region. An explicit `GroupHeading` value takes precedence; a group-level value requires a heading.
- **Intentional breaking change:** Group headings default to a neutral `span` for non-list roles rather than an `h3`. In menu, menubar, and listbox compositions, semantic heading elements and `role="heading"` are rejected; use a neutral `as` element, and ensure custom components render one. The list-based composite still has the separate wrapper and ownership limitations noted below.
- `ActionList.Heading` renders before the list, as upstream does, and the list is labelled by it. It accepts `size` (`small`, `medium`, or `large`) and `visuallyHidden`, and keeps an `id` you pass.
- `ActionList.GroupHeading.TrailingAction` renders a small invisible icon button or link, matching upstream, and a group that follows another item is always spaced from it, including a group with a filled heading.
- Use `loading` with `loadingText` for an unavailable item that is waiting on work. Loading items expose disabled semantics, render a shared spinner, and suppress trailing actions until ready. As upstream does, the spinner (and the inactive warning icon outside menus and listboxes) replaces the leading visual when the item has one and the trailing visual otherwise, so the selection indicator stays in place.
- Loading text is included in an inferred item name even without a `Description`; when an explicit name is supplied directly or through `render`, the loading text is associated as a description instead.
- Use `inactiveText` for supporting inactive status text, not a legacy inactive prop. Outside tree items, the reason is an accessible description.
- **Intentional:** In ordinary lists, `Item` and `LinkItem` display inactive reasons inline instead of relying on the legacy indicator tooltip. This can increase row height but makes the reason available without hover.
- **Compatibility exception requiring accessibility review:** A string `Item` reason retains its native-title fallback unless an explicit title is supplied. Current GitHub accessibility guidance prohibits native titles, so this compatibility behavior requires specialist review before release.
- While an enabled item's `TrailingAction` is `loading`, the item sets `data-trailing-action-loading` and keeps its label and description at the default foreground colour, as upstream does. A text trailing action shows its spinner at its end.
- Multiple `Description` children are preserved in author order instead of being collapsed by the legacy slot extractor. Use one description when strict legacy rendering is required.
- `Item` and `LinkItem` associate `Description` parts as accessible descriptions, preserving additional `aria-describedby` references. An explicit `aria-label` or `aria-labelledby` supplies the name; keep the primary visible label in it. Tree items still need explicit description associations.
- The generated name is the label and trailing visual whether or not the item has a description, as upstream's `aria-labelledby` does. Earlier canaries (including `afdf7e9`) named an item without a description from all of its content, so a leading visual's `aria-label` was part of the name only until a description was added. An item without label text is still named from its content.
- **Intentional:** Upstream renders an item in a `role="list"` list as a focusable `li` itself. Here `Item role="listitem"` renders a native `li` with no inner action; it is non-focusable unless given an explicit `tabIndex={0}`, forwards keyboard and capture handlers to the `li`, and rejects selection, activation, and loading state. Arbitrary trailing content can be passed through `trailingAction`, including independently focusable controls. Upstream sets `aria-disabled` on a disabled list-item row, which WAI-ARIA 1.2 deprecates on `listitem` and which does not make its descendants inoperable; here `disabled` and `aria-disabled` throw, and `inactiveText` shows the visible reason inside the `li` and hides its trailing action, unlike legacy `disabled` alone. An ordinary `Item` remains an `li` containing a button. In earlier canaries (including `afdf7e9`), `role="listitem"` was forwarded to the inner button, exposing two list items per row.
- **Styling change:** Static `Item` now applies `className` to the same `li` as its ref and DOM props, rather than the inner content element. Content-specific classes may need adjustment.
- Static-row handlers are typed against `HTMLLIElement` rather than the action button. Use `ActionListStaticItemProps` for a typed static wrapper and `ActionListItemProps` for an action wrapper.
- **Unresolved static disabled-row migration:** a legacy dynamic picker may supply only a boolean disabled state, retain meaningful passive trailing content, and expose `aria-disabled` on its focusable list item. `inactiveText` is not an equivalent substitute without a supplied reason, and it hides trailing actions. There is no reviewed drop-in composition for this contract or for independently interactive descendants; obtain accessibility-specialist guidance rather than inventing a reason or discarding meaningful content.
- Long labels, descriptions, and passive trailing text wrap within the available row width; inline descriptions may move below the label. Custom fixed-size or non-wrapping content must provide its own responsive behavior. Explicit `Description truncate` remains available for compatibility, but prefer wrapping when the full text is needed.
- Use `size="small"` for compact items, `size="large"` for the spacious item geometry, and `GroupHeading variant="filled"` for a separated heading surface. `LinkItem` accepts the same `size`, plus `active` and `inactiveText`.
- Replace `ActionList.LinkItem as={RouterLink} to="/projects"` with `render={<RouterLink to="/projects" />}`. The router link must forward its ref and props to an anchor; ordinary-list items retain link semantics and keyboard behavior. A `LinkItem` inside `ActionList.Listbox` is instead exposed as an option, not a link, even when its anchor has an `href`. Use `onClick` for link activation: `LinkItem.onSelect` is the native React selection event, not `Item.onSelect`. While `inactiveText` is present, `LinkItem` renders a non-navigable anchor without `href` and forwards its ref to that anchor. The custom render is not mounted, so a ref attached to that element remains unset until the link becomes available.
- **Intentional:** Use `ActionList.Listbox`, `ActionList.Listbox.Group`, and `ActionList.Listbox.Divider` for directly owned options and groups. Their refs point to `div` elements rather than the legacy list elements. A group heading is non-semantic and cannot contain a trailing action; options cannot contain trailing actions or other nested interactive controls.
- **Parity gap:** The original `ActionList role="listbox"` composition retains semantic list-item wrappers: a link option may not be owned by the listbox in Chromium's accessibility tree, while an item or group wrapper uses `role="none"`, conflicting with GitHub accessibility policy. Prefer the direct `Listbox` composition where those constraints apply. A Chromium probe found that the role-based listbox exposed a link item as a list item containing a link, placed a group heading outside its group, and failed axe's `aria-required-children` and `listitem` rules. With the direct composition, a button option, a link option, and a grouped option were all options owned by the listbox or its named group, with no `none` or `presentation` roles. The `none` roles are not removed mechanically because that changes listbox ownership. A listbox whose options need secondary actions has no supported policy-compatible composition; it needs an API decision and specialist accessibility review. Assistive-technology parity is not verified.
- When the `primer_react_action_list_item_gap` feature flag is on, items in a list contained by NavList are separated by a small gap. Pass `disableItemGap` to opt a list out. The container is identified internally rather than through upstream's `ActionList.ContainerContext` export.
- Upstream's private `_PrivateTooltipText` item prop is not ported; NavList renders its own tooltip with `tooltipText`.
- Selection indicators, visuals, and the label align to the first line of an item, as upstream does, so multi-line items keep their visuals at the top. The single-select checkmark uses the muted foreground colour. Multiple selection inside a menu also renders a checkmark rather than a checkbox, as upstream does.
- For a custom checkbox tree, pass `aria-checked` on each item, including `"mixed"` for a partially checked parent, and use `selectionVariant="multiple"` for matching visuals. Explicit `aria-checked` or `aria-selected` suppresses the other role-derived attribute and takes precedence over `selected` for the indicator. If both attributes are explicitly supplied, both are preserved and the indicator follows `aria-checked`. Use `TreeItem` for directly owned, focusable leaf `li` elements without presentational list-item wrappers. Compose parent items and groups separately and keep the root `ul` ref.
- `showDividers` draws each divider above the item's content rather than across the whole row, so it starts after the selection indicator and leading visual. It is hidden for the first item, the item after an `ActionList.Divider`, and around active and hovered items. Items with an inline description paint the line twice, matching upstream's slightly stronger rule there.
- Item content inherits its colour from the item, so `variant="danger"` and inactive items tint their label, descriptions, and visuals together. The inactive warning keeps the attention colour. Custom item content that sets its own text colour will override this.
- A disabled item in a `menu`, `menubar`, `listbox`, or `tree` stays focusable and is marked `aria-disabled`, so keyboard users can still discover it. In a plain list the item uses native `disabled` and leaves the tab order. Upstream keeps disabled items focusable in every list role. Set `focusableWhenDisabled` on the item to choose explicitly.
- A `menu`, `menubar`, or `listbox` list keeps one item in the tab order and moves focus with the arrow keys, Home, End, Page Up, and Page Down, as upstream does. Menus wrap at either end and other lists stop. Upstream also wraps lists inside SelectPanel and FilteredActionList, which are built here on Base UI rather than an ActionList root. Pass `disableFocusZone` when a parent widget manages focus.
- `role="tree"` does not add tree keyboard navigation or roving focus. Prefer `TreeView`, or manage the complete tree interaction and hierarchy in your own composition.
- `TrailingAction` accepts `tooltipDirection` (default `'w'`). An icon-only trailing action, including a link, renders with the muted invisible icon button look and labels itself with a tooltip, as upstream does.
- The keyboard focus ring sits flush against the item edge, and the dividers around a focused item are hidden, matching upstream.
- CSS-module-only variants remain unsupported.
- Use `className` rather than `sx` or styled-system props.
- **Confirmed host utility collision:** the default `variant="inset"` adds vertical padding through `py-2`. In the host's installed `95baea6` Chromium dashboard, the root carried `p-0 py-2` plus a CSS-module class and computed `padding: 8px 0px`. The host's matched rules show legacy Primer CSS supplying unlayered `.p-0 { padding: 0 !important }`, followed by equal-specificity `.py-2` physical top/bottom declarations with `!important`. The latter win vertically over the earlier shorthand; both outrank the package's normal layered utilities and the module's normal unlayered `padding: 0`. This is a shared utility-name collision with important declarations, not normal layered CSS defeating a normal unlayered module. In horizontal writing mode, the list and a separate toggle each retained 8px unwanted padding, producing a 20px feedback-to-toggle gap rather than the expected maximum 4px. Arbitrary CSS-module classes are not interpreted by Tailwind class merging.
- **Verified host-scoped mitigation:** the feedback list's caller `className="p-0"` removes its default `py-2` through class merging. The separate toggle uses `variant="horizontal-inset"`, emitting `p-0` and `pb-2` without `py-2`: host Chromium measures 0px top and 8px bottom padding while retaining the item's `mx-2` horizontal inset. Together these restore the original maximum 4px gap in expanded and collapsed states; the host reports all 54 focused shared-sidebar tests passing without changing the threshold. This does not establish package-wide CSS isolation, cross-browser parity, or a clean full dashboard suite; a separate assignee-picker failure remains under host investigation. No global reset is recommended.
- **Static status rows:** a legacy plain `ActionList.Item` without an action could render noninteractive list-item content, including a status or error message with a programmatic focus target. Before:

  ```tsx
  import {ActionList} from '@primer/react'
  ;<ActionList>
    <ActionList.Item tabIndex={-1}>Could not load repositories.</ActionList.Item>
  </ActionList>
  ```

  After: Tailwind `ActionList.Item` is an action and renders a button by default, even without `onSelect` and even with `tabIndex={-1}`. A negative tab index changes tab order, not button semantics. For a static row in an ordinary list, use a native `li` directly:

  ```tsx
  import React from 'react'
  import {ActionList} from '@primer/react-tailwind/ActionList'

  const statusRef = React.createRef<HTMLLIElement>()

  ;<ActionList>
    <li ref={statusRef} tabIndex={-1} className="px-4 py-2 text-sm text-muted">
      Could not load repositories.
    </li>
  </ActionList>
  ```

  The ref targets the `li`, so existing programmatic focus can use `statusRef.current?.focus()`. Omit `tabIndex` when the message does not need a focus target. This row has no button role, selection contract, activation handler, or automatic status announcement; style it directly and keep announcement policy caller-owned. There is no dedicated static-row export. Do not use `Item render={<li />} nativeButton={false}` as a static-row substitute: it still composes button behavior. Do not wrap a static row or its links/buttons inside an `Item` action. This example is for an ordinary list, not a `menu`, `listbox`, or `tree`; place non-option status content outside those composite widgets rather than assigning it an action or option role.
