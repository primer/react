import type {Theme} from '../ThemeProvider'
import type {BetterSystemStyleObject} from '../sx'
import {getAnchoredPosition} from '@primer/behaviors'

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
export const GAP = 8

export const iconWrapStyles = {
  alignItems: 'center',
  display: 'inline-flex',
  marginRight: 2,
}

export const counterStyles = {
  marginLeft: 2,
  display: 'flex',
  alignItems: 'center',
}

export const getNavStyles = (theme?: Theme) => ({
  display: 'flex',
  paddingX: 3,
  justifyContent: 'flex-start',
  borderBottom: '1px solid',
  borderBottomColor: `${theme?.colors.border.muted}`,
  align: 'row',
  alignItems: 'center',
  minHeight: '48px',
})

export const ulStyles = {
  display: 'flex',
  listStyle: 'none',
  whiteSpace: 'nowrap',
  paddingY: 0,
  paddingX: 0,
  margin: 0,
  marginBottom: '-1px',
  alignItems: 'center',
  gap: `${GAP}px`,
  position: 'relative',
}

export const getDividerStyle = (theme?: Theme) => ({
  display: 'inline-block',
  borderLeft: '1px solid',
  width: '1px',
  borderLeftColor: `${theme?.colors.border.muted}`,
  marginRight: 1,
  height: '24px', // The height of the divider - reference from Figma
})

export const moreBtnStyles = {
  //set margin 0 here because safari puts extra margin around the button, rest is to reset style to make it look like a list element
  margin: 0,
  border: 0,
  background: 'transparent',
  fontWeight: 'normal',
  boxShadow: 'none',
  paddingY: 1,
  paddingX: 2,
  '& > span[data-component="trailingVisual"]': {
    marginLeft: 0,
  },
}

export const getLinkStyles = (theme?: Theme, ariaCurrent?: string | boolean) => ({
  position: 'relative',
  display: 'inline-flex',
  color: 'fg.default',
  textAlign: 'center',
  textDecoration: 'none',
  lineHeight: 'calc(20/14)',
  '& span[data-component="icon"]': {
    color: 'fg.muted',
  },
  borderRadius: 2,
  fontSize: 1,
  paddingX: 2,
  paddingY: 'calc((2rem - 1.25rem) / 2)',
  '@media (hover:hover)': {
    '&:hover ': {
      backgroundColor: theme?.colors.neutral.muted,
      transition: 'background .12s ease-out',
      textDecoration: 'none',
    },
  },
  '&:focus': {
    outline: '2px solid transparent',
    '&': {
      boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`,
    },
    // where focus-visible is supported, remove the focus box-shadow
    '&:not(:focus-visible)': {
      boxShadow: 'none',
    },
  },
  '&:focus-visible': {
    outline: '2px solid transparent',
    boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`,
  },
  // renders a visibly hidden "copy" of the label in bold, reserving box space for when label becomes bold on selected
  '& span[data-content]::before': {
    content: 'attr(data-content)',
    display: 'block',
    height: 0,
    fontWeight: '600',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
  },
  // selected state styles
  '&::after': {
    position: 'absolute',
    right: '50%',
    bottom: 'calc(50% - 25px)', // 48px total height / 2 (24px) + 1px
    width: '100%',
    height: 2,
    content: '""',
    backgroundColor:
      Boolean(ariaCurrent) && ariaCurrent !== 'false' ? theme?.colors.primer.border.active : 'transparent',
    borderRadius: 0,
    transform: 'translate(50%, -50%)',
  },
  '@media (forced-colors: active)': {
    '::after': {
      // Support for Window Force Color Mode https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast
      backgroundColor: Boolean(ariaCurrent) && ariaCurrent ? 'LinkText' : 'transparent',
    },
  },
})

export const menuItemStyles = {
  // This is needed to hide the selected check icon on the menu item. https://github.com/primer/react/tree/main/packages/react/src/ActionList/Selection.tsx#L32
  '& > span': {
    display: 'none',
  },
  // To reset the style when the menu items are rendered as react router links
  textDecoration: 'none',
}

export const baseMenuMinWidth = 192
export const baseMenuStyles: BetterSystemStyleObject = {
  position: 'absolute',
  zIndex: 1,
  top: '90%',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  borderRadius: '12px',
  backgroundColor: 'canvas.overlay',
  listStyle: 'none',
  // Values are from ActionMenu
  minWidth: `${baseMenuMinWidth}px`,
  maxWidth: '640px',
  right: '0',
}

/**
 *
 * @param containerRef The Menu List Container Reference.
 * @param listRef The Underline Nav Container Reference.
 * @description This calculates the position of the menu
 */
export const menuStyles = (containerRef: Element | null, listRef: Element | null): BetterSystemStyleObject => {
  if (containerRef && listRef) {
    const {left} = getAnchoredPosition(containerRef, listRef, {align: 'start', side: 'outside-bottom'})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {right, ...rest} = baseMenuStyles
    return {...rest, left}
  }

  return baseMenuStyles
}
