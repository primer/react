export const dividerStyles = {
  display: 'inline-block',
  borderLeft: '1px solid',
  width: '1px',
  borderLeftColor: 'var(--borderColor-muted)',
  marginRight: 'var(--base-size-4)',
  height: '24px', // The height of the divider - reference from Figma
}

export const menuItemStyles = {
  // This is needed to hide the selected check icon on the menu item. https://github.com/primer/react/tree/main/packages/react/src/ActionList/Selection.tsx#L32
  '& > span': {
    display: 'none',
  },
  // To reset the style when the menu items are rendered as react router links
  textDecoration: 'none',
}

export const baseMenuMinWidth = 192
