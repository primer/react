import {get} from '../constants'
import {SegmentedControlButtonProps} from './SegmentedControlButton'

export const directChildLayoutAdjustments = {
  ':first-child': {
    marginLeft: '-1px'
  },

  ':last-child': {
    marginRight: '-1px'
  }
}

export const borderedSegment = {
  marginRight: '1px',
  ':after': {
    backgroundColor: 'var(--separator-color)',
    content: '""',
    position: 'absolute',
    right: '-2px',
    top: 2,
    bottom: 2,
    width: '1px'
  }
}

export const getSegmentedControlButtonStyles = (
  props?: Partial<Pick<SegmentedControlButtonProps, 'children' | 'selected'>> & {isIconOnly?: boolean}
) => ({
  '--segmented-control-button-inner-padding': '12px', // TODO: use primitive `primer.control.medium.paddingInline.normal` when it is available
  '--segmented-control-button-bg-inset': '4px',
  '--segmented-control-outer-radius': get('radii.2')(props),
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderRadius: 'var(--segmented-control-outer-radius)',
  borderWidth: 0,
  color: 'currentColor',
  cursor: 'pointer',
  flexGrow: 1,
  fontFamily: 'inherit',
  fontSize: 1,
  fontWeight: props?.selected ? 'bold' : 'normal',
  marginTop: '-1px',
  marginBottom: '-1px',
  padding: props?.selected ? 0 : 'var(--segmented-control-button-bg-inset)',
  position: 'relative',
  ...(props?.isIconOnly && {
    height: 'var(--primer-control-medium-size, 32px)',
    width: 'var(--primer-control-medium-size, 32px)'
  }),

  '.segmentedControl-content': {
    alignItems: 'center',
    backgroundColor: props?.selected ? 'btn.bg' : 'transparent',
    borderColor: props?.selected ? '#8c959f' : 'transparent', // TODO: use a functional primitive for the selected border color when it is available
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: props?.selected
      ? 'var(--segmented-control-outer-radius)'
      : // innerRadius = outerRadius - distance/2
        // https://stackoverflow.com/questions/2932146/math-problem-determine-the-corner-radius-of-an-inner-border-based-on-outer-corn
        'calc(var(--segmented-control-outer-radius) - var(--segmented-control-button-bg-inset) / 2)',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: props?.selected
      ? 'var(--segmented-control-button-inner-padding)'
      : 'calc(var(--segmented-control-button-inner-padding) - var(--segmented-control-button-bg-inset))',
    paddingRight: props?.selected
      ? 'var(--segmented-control-button-inner-padding)'
      : 'calc(var(--segmented-control-button-inner-padding) - var(--segmented-control-button-bg-inset))'
  },

  svg: {
    fill: 'fg.muted'
  },

  ':hover .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'actionListItem.default.hoverBg' // TODO: replace with a functional primitive
  },

  ':active .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'actionListItem.default.activeBg' // TODO: replace with a functional primitive
  },

  // Icon-only buttons render the button inside of an element rendered by the Tooltip component.
  // This breaks `:first-child` and `:last-child` selectors on buttons because the button is the only child inside of the element rendered by the Tooltip component.
  ...(!props?.isIconOnly && {
    ...directChildLayoutAdjustments,
    ':not(:last-child)': borderedSegment
  }),

  // fixes an issue where the focus outline shows over the pseudo-element
  ':focus:focus-visible:not(:last-child):after': {
    width: 0
  },

  '.segmentedControl-text': {
    ':after': {
      content: `"${props?.children}"`,
      display: 'block',
      fontWeight: 'bold',
      height: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      visibility: 'hidden'
    }
  },

  '@media (pointer: coarse)': {
    ':before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px'
    }
  }
})
