import React, {RefObject, useRef} from 'react'
import Button, {SegmentedControlButtonProps} from './SegmentedControlButton'
import SegmentedControlIconButton, {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import {Box, useTheme} from '..'
import {merge, SxProp} from '../sx'
import {FocusKeys, FocusZoneHookSettings, useFocusZone} from '../hooks/useFocusZone'

type SegmentedControlProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  /** Whether the control fills the width of its parent */
  fullWidth?: boolean
  /** The handler that gets called when a segment is selected */
  onChange?: (selectedIndex: number) => void // TODO: consider making onChange required if we force this component to be controlled
} & SxProp

const getSegmentedControlStyles = (props?: SegmentedControlProps) => ({
  // TODO: update color primitive name(s) to use different primitives:
  // - try to use general 'control' primitives (e.g.: https://primer.style/primitives/spacing#ui-control)
  // - when that's not possible, use specific to segmented controls
  backgroundColor: 'switchTrack.bg', // TODO: update primitive when it is available
  borderColor: 'border.default',
  borderRadius: 2,
  borderStyle: 'solid',
  borderWidth: 1,
  display: props?.fullWidth ? 'flex' : 'inline-flex',
  height: '32px' // TODO: use primitive `primer.control.medium.size` when it is available
})

// TODO: implement `variant` prop for responsive behavior
const Root: React.FC<SegmentedControlProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  fullWidth,
  onChange,
  sx: sxProp = {},
  ...rest
}) => {
  const segmentedControlContainerRef = useRef<HTMLSpanElement>(null)
  const {theme} = useTheme()
  const selectedChildren = React.Children.toArray(children).map(
    child =>
      React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child) && child.props.selected
  )
  const hasSelectedButton = selectedChildren.some(isSelected => isSelected)
  const selectedIndex = hasSelectedButton ? selectedChildren.indexOf(true) : 0
  const sx = merge(
    getSegmentedControlStyles({
      fullWidth
    }),
    sxProp as SxProp
  )

  const focusInStrategy: FocusZoneHookSettings['focusInStrategy'] = () => {
    if (segmentedControlContainerRef.current) {
      // we need to use type assertion because querySelector returns "Element", not "HTMLElement"
      type SelectedButton = HTMLButtonElement | undefined

      const selectedButton = segmentedControlContainerRef.current.querySelector(
        'button[aria-current="true"]'
      ) as SelectedButton

      return selectedButton
    }
  }

  useFocusZone({
    containerRef: segmentedControlContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy
  })

  if (!ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use the `aria-label` or `aria-labelledby` prop to provide an accessible label for assistive technology'
    )
  }

  return (
    <Box
      role="toolbar"
      sx={sx}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      ref={segmentedControlContainerRef as RefObject<HTMLDivElement>}
      {...rest}
    >
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child)) {
          return React.cloneElement(child, {
            onClick: onChange
              ? (e: React.MouseEvent<HTMLButtonElement>) => {
                  onChange(i)
                  child.props.onClick && child.props.onClick(e)
                }
              : child.props.onClick,
            selected: i === selectedIndex,
            sx: {
              '--separator-color':
                i === selectedIndex || i === selectedIndex - 1 ? 'transparent' : theme?.colors.border.default
            } as React.CSSProperties
          })
        }
      })}
    </Box>
  )
}

Root.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(Root, {
  Button,
  IconButton: SegmentedControlIconButton
})
