import type {BetterSystemStyleObject} from '../sx'
import {computePosition, flip, shift, offset} from '@floating-ui/dom'

export const dividerStyles = {
  display: 'inline-block',
  borderLeft: '1px solid',
  width: '1px',
  borderLeftColor: 'var(--borderColor-muted)',
  marginRight: 'var(--base-size-4)',
  height: '24px', // The height of the divider - reference from Figma
}

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
    // synchronous left approximation using bounding rects so callers get immediate value
    const anchorRect = (listRef as HTMLElement).getBoundingClientRect()
    const offsetParentRect = (containerRef as HTMLElement).offsetParent
      ? ((containerRef as HTMLElement).offsetParent as HTMLElement).getBoundingClientRect()
      : {left: 0}
    const left = anchorRect.left - offsetParentRect.left

    ;(async () => {
      try {
        const {x} = await computePosition(listRef as HTMLElement, containerRef as HTMLElement, {
          placement: 'bottom-start',
          middleware: [offset(0), flip(), shift({padding: 4})],
        })
        if (containerRef instanceof HTMLElement) {
          containerRef.style.left = `${x}px`
        }
      } catch {
        /* swallow */
      }
    })()
    const {...rest} = baseMenuStyles
    return {...rest, left}
  }
  return baseMenuStyles
}
