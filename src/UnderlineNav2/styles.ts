import {Theme} from '../ThemeProvider'
import {BetterSystemStyleObject} from '../sx'
import {UnderlineNavProps} from './UnderlineNav'

export const iconWrapStyles = {
  alignItems: 'center',
  display: 'inline-flex',
  marginRight: 2
}

export const textStyles: BetterSystemStyleObject = {
  whiteSpace: 'nowrap'
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
  marginLeft: 2
}

export const getNavStyles = (theme?: Theme, props?: Partial<Pick<UnderlineNavProps, 'align'>>) => ({
  display: 'flex',
  justifyContent: props?.align === 'right' ? 'flex-end' : 'flex-start',
  borderBottom: '1px solid',
  borderBottomColor: `${theme?.colors.border.muted}`,
  align: 'row',
  alignItems: 'center'
})

export const ulStyles = {
  display: 'flex',
  listStyle: 'none',
  padding: '0',
  paddingX: 1,
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

export const arrowBtnStyles = {
  ...moreBtnStyles,
  paddingX: 0,
  paddingY: 0,
  opacity: 1,
  transition: 'opacity 1s ease'
}

export const hiddenBtn = {
  ...arrowBtnStyles,
  opacity: 0
}

export const leftArrowBtnStyles = {
  ...arrowBtnStyles
  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   background: 'linear-gradient(to left,#fff0,#fff)',
  //   height: '100%',
  //   width: '30px',
  //   zIndex: 1,
  //   left: '16px',
  //   pointerEvents: 'none'
  // }
}

export const rightArrowBtnStyles = {
  ...arrowBtnStyles,
  opacity: 1
  // '&::before': {
  //   position: 'absolute',
  //   background: 'linear-gradient(to right,#fff0,#fff)',
  //   content: '""',
  //   height: '100%',
  //   left: '-30px',
  //   width: '30px',
  //   zIndex: 1,
  //   pointerEvents: 'none'
  // }
}

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
  '&:hover > div[data-component="wrapper"] ': {
    backgroundColor: theme?.colors.neutral.muted,
    transition: 'background .12s ease-out'
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
    visibility: 'hidden'
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
  }
})
