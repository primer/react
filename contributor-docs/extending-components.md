# Extending components

## Composing trigger behaviors

Prefer the configured `Tooltip` children and `ActionMenu.Button` APIs for ordinary
usage. Use `renderAnchor` when a custom trigger needs to route props or refs
explicitly. `Tooltip`, `ActionMenu`, and `AnchoredOverlay` support this convention;
the existing children-based APIs remain supported.

For example, compose a menu and tooltip on one icon button without teaching the
menu to inspect the tooltip's children:

```tsx
import {ActionList, ActionMenu, IconButton, Tooltip} from '@primer/react'
import {KebabHorizontalIcon} from '@primer/octicons-react'

function Actions() {
  return (
    <ActionMenu
      renderAnchor={({ref, ...menuProps}) => (
        <Tooltip
          ref={ref}
          text="Choose an action"
          renderAnchor={tooltipProps => (
            <IconButton
              {...menuProps}
              {...tooltipProps}
              icon={KebabHorizontalIcon}
              aria-label="Actions"
              aria-labelledby={undefined}
            />
          )}
        />
      )}
    >
      <ActionMenu.Overlay>
        <ActionList>
          <ActionList.Item>Copy link</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}
```

The menu's click/keyboard handlers and tooltip's focus/pointer handlers are
disjoint in this example. The tooltip combines the menu ref with its own ref and
any forwarded ref. The final callback ref reaches the same button used for
positioning, outside-click handling, and focus return. Callback and object refs
passed to `Tooltip` are supported in this path without a feature flag.

`renderAnchor` is a rendering callback, not a component: do not call hooks inside
it. Render a separate component if you need hooks, such as `useMergedRefs` from
`@primer/react`, to attach additional refs or route the supplied ref through a
custom prop. All behavior refs must resolve to the actual interactive HTML
element, not a wrapper or imperative handle.

### Prop ownership

- Spread every supplied prop onto the single interactive element, including the
  ref. Do not nest buttons. Use either `Tooltip` children or `renderAnchor`, and
  either configured menu anchors or `ActionMenu.renderAnchor`, not both.
- Keep the generated `id`, `aria-haspopup`, `aria-expanded`, and tooltip
  `aria-labelledby`/`aria-describedby` relationships on that element. If adding
  another description, append its ID to `aria-describedby` rather than replacing
  the tooltip ID. Use `type="description"` for an already named button, or
  `type="label"` to name an otherwise unnamed trigger.
  When spreading onto `IconButton` with an explicit `aria-label`, set
  `aria-labelledby={undefined}` to satisfy its mutually exclusive naming props.
- Call supplied event handlers before additional handlers, and skip additional
  handlers when `event.defaultPrevented` is true, following Primer's prop-merging
  convention. If deliberately cancelling menu activation, call `preventDefault`
  before forwarding the event; menu click and keyboard activation respect it.
- If props overlap, merge them explicitly rather than relying on spread order:
  combine class names, apply custom styles after supplied styles, and compose
  handlers as above. Render callbacks do not automatically merge props you add.
- Native `disabled` buttons remain non-interactive. As with the existing
  `Tooltip` children API, do not use a disabled native button as a tooltip
  trigger. Use the existing `inactive` button pattern if an unavailable action
  needs an explanation.

Tooltip supplies only the ARIA relationship for its selected type. A description
tooltip does not supply `aria-labelledby`, so spreading its props preserves an
overlay's existing label. A label tooltip similarly leaves existing descriptions
alone. When both behaviors supply description IDs, explicitly combine them on the
final element; the render callback cannot inspect the props you pass separately:

```tsx
<Tooltip
  text="Additional context"
  renderAnchor={tooltipProps => (
    <Button
      {...anchorProps}
      {...tooltipProps}
      aria-describedby={[anchorProps['aria-describedby'], tooltipProps['aria-describedby']].filter(Boolean).join(' ')}
    >
      Actions
    </Button>
  )}
/>
```

`Popover` is presentational and does not provide trigger behavior. For a custom
popover or picker interaction, `AnchoredOverlay` and `SelectPanel` provide the
object ref in a second callback argument:

```tsx
<AnchoredOverlay
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  renderAnchor={(anchorProps, context) => (
    <Tooltip
      ref={context?.ref}
      text="Show page details"
      renderAnchor={tooltipProps => (
        <Button {...anchorProps} {...tooltipProps}>
          Pages
        </Button>
      )}
    />
  )}
>
  {children}
</AnchoredOverlay>
```

The context ref is the same object already supplied at runtime in the anchor
props. It is also the supplied `anchorRef`, if present. Existing one-argument
callbacks, one-argument callback invocations, and object-ref behavior are
unchanged. Primer always supplies the context, but its type is optional for
compatibility with callers invoking a render callback themselves; use
`context?.ref` when forwarding it. Keeping the additional typed ref
in a separate context avoids making existing prop spreads incompatible with
more narrowly typed button and link refs.

This API does not introduce an independent focus-return target or replace either
component's overlay behavior.
