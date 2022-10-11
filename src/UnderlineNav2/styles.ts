import {Theme} from '../ThemeProvider'
import {BetterSystemStyleObject} from '../sx'
import {UnderlineNavProps} from './UnderlineNav'

export const iconWrapStyles = {
  alignItems: 'center',
  display: 'inline-flex',
  marginRight: 2
}

export const wrapperStyles = {
  display: 'inline-flex',
  paddingY: 1,
  paddingX: 2,
  borderRadius: 2
}

const smallVariantLinkStyles = {
  paddingY: 1,
  fontSize: 0
}
const defaultVariantLinkStyles = {
  paddingY: 2,
  fontSize: 1
}

export const counterStyles = {
  marginLeft: 2,
  display: 'flex',
  alignItems: 'center'
}

export const getNavStyles = (theme?: Theme, props?: Partial<Pick<UnderlineNavProps, 'align'>>) => ({
  display: 'flex',
  paddingX: 2,
  justifyContent: props?.align === 'right' ? 'flex-end' : 'flex-start',
  borderBottom: '1px solid',
  borderBottomColor: `${theme?.colors.border.muted}`,
  align: 'row',
  alignItems: 'center',
  position: 'relative'
})

export const ulStyles = {
  display: 'flex',
  listStyle: 'none',
  padding: '0',
  margin: '0',
  marginBottom: '-1px',
  alignItems: 'center'
}

export const getDividerStyle = (theme?: Theme) => ({
  display: 'inline-block',
  borderLeft: '1px solid',
  width: '1px',
  borderLeftColor: `${theme?.colors.border.muted}`,
  marginRight: 1
})

export const moreBtnStyles = {
  //set margin 0 here because safari puts extra margin around the button, rest is to reset style to make it look like a list element
  margin: 0,
  border: 0,
  background: 'transparent',
  fontWeight: 'normal',
  boxShadow: 'none',
  paddingY: 1,
  paddingX: 2
}

export const btnWrapperStyles = (
  theme?: Theme,
  direction = 'left',
  show = false,
  translateX = 0,
  display = 'flex'
) => ({
  position: 'absolute',
  zIndex: 1,
  top: 0,
  bottom: 0,
  left: direction === 'left' ? 0 : 'auto',
  right: direction === 'right' ? 0 : 'auto',
  alignItems: 'center',
  background: show
    ? `linear-gradient(to ${direction} ,#fff0, ${theme?.colors.canvas.default} 14px, ${theme?.colors.canvas.default} 100%)`
    : 'transparent',
  transform: `translateX(${translateX}px)`,
  display: `${display}`
})

export const getArrowBtnStyles = (theme?: Theme, direction = 'left') => ({
  fontWeight: 'normal',
  boxShadow: 'none',
  margin: 0,
  border: 0,
  borderRadius: 2,
  paddingX: '14px',
  paddingY: 0,
  background: 'transparent',
  height: '60%',

  '&:hover:not([disabled]), &:focus-visible': {
    background: theme?.colors.canvas.default
  },
  '&:focus:not(:disabled)': {
    outline: 0,
    boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`,
    background: `linear-gradient(to ${direction} ,#fff0, ${theme?.colors.canvas.default} 14px, ${theme?.colors.canvas.default} 100%)`
  },
  // where focus-visible is supported, remove the focus box-shadow
  '&:not(:focus-visible)': {
    boxShadow: 'none',
    background: `linear-gradient(to ${direction} ,#fff0, ${theme?.colors.canvas.default} 14px, ${theme?.colors.canvas.default} 100%)`
  },
  '&:focus-visible:not(:disabled)': {
    boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`,
    background: `linear-gradient(to ${direction} ,#fff0, ${theme?.colors.canvas.default} 14px, ${theme?.colors.canvas.default} 100%)`
  }
})

export const getLinkStyles = (
  theme?: Theme,
  props?: Partial<Pick<UnderlineNavProps, 'variant'>>,
  selectedLink?: React.RefObject<HTMLElement>,
  ref?: React.RefObject<HTMLElement>
) => ({
  position: 'relative',
  display: 'inline-flex',
  color: 'fg.default',
  textAlign: 'center',
  textDecoration: 'none',
  paddingX: 1,
  ...(props?.variant === 'small' ? smallVariantLinkStyles : defaultVariantLinkStyles),
  '@media (hover:hover)': {
    '&:hover > div[data-component="wrapper"] ': {
      backgroundColor: theme?.colors.neutral.muted,
      transition: 'background .12s ease-out'
    }
  },
  '&:focus': {
    outline: 0,
    '& > div[data-component="wrapper"]': {
      boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`
    },
    // where focus-visible is supported, remove the focus box-shadow
    '&:not(:focus-visible) > div[data-component="wrapper"]': {
      boxShadow: 'none'
    }
  },
  '&:focus-visible > div[data-component="wrapper"]': {
    boxShadow: `inset 0 0 0 2px ${theme?.colors.accent.fg}`
  },
  // renders a visibly hidden "copy" of the label in bold, reserving box space for when label becomes bold on selected
  '& span[data-content]::before': {
    content: 'attr(data-content)',
    display: 'block',
    height: 0,
    fontWeight: '600',
    visibility: 'hidden',
    whiteSpace: 'nowrap'
  },
  // selected state styles
  '&::after': {
    position: 'absolute',
    right: '50%',
    bottom: 0,
    width: `calc(100% - 8px)`,
    height: 2,
    content: '""',
    bg: selectedLink === ref ? theme?.colors.primer.border.active : 'transparent',
    borderRadius: 0,
    transform: 'translate(50%, -50%)'
  },
  '@media (forced-colors: active)': {
    '::after': {
      // Support for Window Force Color Mode https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast
      bg: selectedLink === ref ? 'LinkText' : 'transparent'
    }
  }
})

export const scrollStyles: BetterSystemStyleObject = {
  whiteSpace: 'nowrap',
  overflowX: 'auto',
  // Hiding scrollbar on Firefox
  scrollbarWidth: 'none',
  // Hiding scrollbar on IE 10+
  msOverflowStyle: 'none',
  // Hiding scrollbar on Chrome, Safari and Opera
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}

export const moreMenuStyles: BetterSystemStyleObject = {whiteSpace: 'nowrap'}

export const menuItemStyles = {
  // This is needed to hide the selected check icon on the menu item. https://github.com/primer/react/blob/main/src/ActionList/Selection.tsx#L32
  '& > span': {
    display: 'none'
  }
}
