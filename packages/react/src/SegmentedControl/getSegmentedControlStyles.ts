import {get} from '../constants'
import type {SegmentedControlButtonProps} from './SegmentedControlButton'

export const directChildLayoutAdjustments = {
  ':first-child': {
    marginLeft: '-1px',
  },

  ':last-child': {
    marginRight: '-1px',
  },
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
    width: '1px',
  },
}

export const getSegmentedControlButtonStyles = (
  props?: Partial<Pick<SegmentedControlButtonProps, 'children' | 'selected'>> & {isIconOnly?: boolean},
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
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: props?.selected ? 'bold' : 'normal',
  padding: props?.selected ? 0 : 'var(--segmented-control-button-bg-inset)',
  height: '100%',
  width: '100%',

  '.segmentedControl-content': {
    alignItems: 'center',
    backgroundColor: props?.selected ? 'segmentedControl.button.bg' : 'transparent',
    borderColor: props?.selected ? 'segmentedControl.button.selected.border' : 'transparent',
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
      : 'calc(var(--segmented-control-button-inner-padding) - var(--segmented-control-button-bg-inset))',
  },

  svg: {
    fill: 'fg.muted',
  },

  ':hover .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'segmentedControl.button.hover.bg',
  },

  ':active .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'segmentedControl.button.active.bg',
  },

  // fixes an issue where the focus outline shows over the pseudo-element
  ':focus:focus-visible:not(:last-child):after': {
    width: 0,
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
      visibility: 'hidden',
    },
  },

  '@media (pointer: coarse)': {
    ':before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px',
    },
  },
})

export const getSegmentedControlListItemStyles = () => ({
  display: 'block',
  position: 'relative',
  flexGrow: 1,
  marginTop: '-1px',
  marginBottom: '-1px',
  ':not(:last-child)': borderedSegment,
  // Needed to hide the segment border when the button is focused. Without this, the segment border overlaps the focus outline.
  ':focus-within:has(:focus-visible)': {
    '--separator-color': 'transparent',
  },
  ...directChildLayoutAdjustments,
})
