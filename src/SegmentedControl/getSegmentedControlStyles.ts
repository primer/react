import {SegmentedControlButtonProps} from './SegmentedControlButton'

const getSegmentedControlButtonStyles = (props?: SegmentedControlButtonProps) => ({
  '--segmented-control-button-inner-padding': '12px', // TODO: use primitive `primer.control.medium.paddingInline.normal` when it is available
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderRadius: 2,
  borderWidth: 0,
  color: 'currentColor',
  cursor: 'pointer',
  flexGrow: 1,
  fontWeight: props?.selected ? 'bold' : 'normal',
  marginTop: '-1px',
  marginBottom: '-1px',
  padding: props?.selected ? 0 : 'calc(var(--segmented-control-button-inner-padding) / 2)',
  position: 'relative',

  '.segmentedControl-content': {
    alignItems: 'center',
    backgroundColor: props?.selected ? 'btn.bg' : 'transparent',
    borderColor: props?.selected ? '#8c959f' : 'transparent', // TODO: use a functional primitive for the selected border color when it is available
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: props?.selected
      ? 'var(--segmented-control-button-inner-padding)'
      : 'calc(var(--segmented-control-button-inner-padding) / 2)',
    paddingRight: props?.selected
      ? 'var(--segmented-control-button-inner-padding)'
      : 'calc(var(--segmented-control-button-inner-padding) / 2)'
  },

  svg: {
    fill: 'fg.muted'
  },

  ':hover .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'rgba(0,0,0,0.08)'
  },

  ':active .segmentedControl-content': {
    backgroundColor: props?.selected ? undefined : 'rgba(0,0,0,0.12)'
  },

  ':first-child': {
    marginLeft: '-1px'
  },

  ':last-child': {
    marginRight: '-1px'
  },

  ':not(:last-child)': {
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
  }
})

export default getSegmentedControlButtonStyles
