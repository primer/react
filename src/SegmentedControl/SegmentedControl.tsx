import React, {useRef} from 'react'
import Button, {SegmentedControlButtonProps} from './SegmentedControlButton'
import SegmentedControlIconButton, {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import {ActionList, ActionMenu, useTheme} from '..'
import sx, {merge, SxProp} from '../sx'
import {ResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import {ViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import styled from 'styled-components'

type WidthOnlyViewportRangeKeys = Exclude<ViewportRangeKeys, 'narrowLandscape' | 'portrait' | 'landscape'>

// Needed because passing a ref to `Box` causes a type error
const SegmentedControlList = styled.ul`
  ${sx};
`

type SegmentedControlProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  /** Whether the control fills the width of its parent */
  fullWidth?: boolean | ResponsiveValue<boolean>
  /** The handler that gets called when a segment is selected */
  onChange?: (selectedIndex: number) => void
  /** Configure alternative ways to render the control when it gets rendered in tight spaces */
  variant?: 'default' | Partial<Record<WidthOnlyViewportRangeKeys, 'hideLabels' | 'dropdown' | 'default'>>
} & SxProp

const getSegmentedControlStyles = (isFullWidth?: boolean) => ({
  backgroundColor: 'segmentedControl.bg',
  borderColor: 'border.default',
  borderRadius: 2,
  borderStyle: 'solid',
  borderWidth: 1,
  display: isFullWidth ? 'flex' : 'inline-flex',
  height: '32px', // TODO: use primitive `control.medium.size` when it is available
  margin: 0,
  padding: 0,
  width: isFullWidth ? '100%' : undefined
})

const Root: React.FC<React.PropsWithChildren<SegmentedControlProps>> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  fullWidth,
  onChange,
  sx: sxProp = {},
  variant,
  ...rest
}) => {
  const segmentedControlContainerRef = useRef<HTMLUListElement>(null)
  const {theme} = useTheme()
  const responsiveVariant = useResponsiveValue(variant, 'default')
  const isFullWidth = useResponsiveValue(fullWidth, false)
  const selectedSegments = React.Children.toArray(children).map(
    child =>
      React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child) && child.props.selected
  )
  const hasSelectedButton = selectedSegments.some(isSelected => isSelected)
  const selectedIndex = hasSelectedButton ? selectedSegments.indexOf(true) : 0
  const selectedChild = React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(
    React.Children.toArray(children)[selectedIndex]
  )
    ? React.Children.toArray(children)[selectedIndex]
    : undefined
  const getChildIcon = (childArg: React.ReactNode) => {
    if (
      React.isValidElement<SegmentedControlButtonProps>(childArg) &&
      childArg.type === Button &&
      childArg.props.leadingIcon
    ) {
      return childArg.props.leadingIcon
    }

    return React.isValidElement<SegmentedControlIconButtonProps>(childArg) ? childArg.props.icon : null
  }
  const getChildText = (childArg: React.ReactNode) => {
    if (React.isValidElement<SegmentedControlButtonProps>(childArg) && childArg.type === Button) {
      return childArg.props.children
    }

    return React.isValidElement<SegmentedControlIconButtonProps>(childArg) ? childArg.props['aria-label'] : null
  }
  const listSx = merge(getSegmentedControlStyles(isFullWidth), sxProp as SxProp)

  if (!ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use the `aria-label` or `aria-labelledby` prop to provide an accessible label for assistive technology'
    )
  }

  return responsiveVariant === 'dropdown' ? (
    // Render the 'dropdown' variant of the SegmentedControlButton or SegmentedControlIconButton
    <ActionMenu>
      <ActionMenu.Button leadingIcon={getChildIcon(selectedChild)}>{getChildText(selectedChild)}</ActionMenu.Button>
      <ActionMenu.Overlay>
        <ActionList selectionVariant="single">
          {React.Children.map(children, (child, index) => {
            const ChildIcon = getChildIcon(child)
            // Not a valid child element - skip rendering
            if (!React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child)) {
              return null
            }

            return (
              <ActionList.Item
                key={`segmented-control-action-btn-${index}`}
                selected={index === selectedIndex}
                onSelect={
                  onChange
                    ? (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => {
                        onChange(index)
                        // TODO: figure out a way around the typecasting
                        child.props.onClick && child.props.onClick(event as React.MouseEvent<HTMLLIElement>)
                      }
                    : // TODO: figure out a way around the typecasting
                      (child.props.onClick as (
                        event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
                      ) => void)
                }
              >
                {ChildIcon && <ChildIcon />} {getChildText(child)}
              </ActionList.Item>
            )
          })}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  ) : (
    // Render a segmented control
    <SegmentedControlList
      sx={listSx}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      ref={segmentedControlContainerRef}
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        // Not a valid child element - skip rendering child
        if (!React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child)) {
          return null
        }
        const sharedChildProps = {
          onClick: onChange
            ? (event: React.MouseEvent<HTMLButtonElement>) => {
                onChange(index)
                child.props.onClick && child.props.onClick(event)
              }
            : child.props.onClick,
          selected: index === selectedIndex,
          sx: {
            '--separator-color':
              index === selectedIndex || index === selectedIndex - 1 ? 'transparent' : theme?.colors.border.default
          } as React.CSSProperties
        }

        // Render the 'hideLabels' variant of the SegmentedControlButton
        if (
          responsiveVariant === 'hideLabels' &&
          React.isValidElement<SegmentedControlButtonProps>(child) &&
          child.type === Button
        ) {
          const {
            'aria-label': childAriaLabel,
            leadingIcon,
            children: childPropsChildren,
            ...restChildProps
          } = child.props
          const {sx: sharedSxProp, ...restSharedChildProps} = sharedChildProps
          if (!leadingIcon) {
            // eslint-disable-next-line no-console
            console.warn('A `leadingIcon` prop is required when hiding visible labels')
          } else {
            return (
              <SegmentedControlIconButton
                aria-label={childAriaLabel || childPropsChildren}
                icon={leadingIcon}
                sx={
                  {
                    ...sharedSxProp,
                    // setting width here avoids having to pass `isFullWidth` directly to child components
                    width: !isFullWidth ? '32px' : '100%' // TODO: use primitive `control.medium.size` when it is available instead of '32px'
                  } as React.CSSProperties
                }
                {...restSharedChildProps}
                {...restChildProps}
              />
            )
          }
        }

        // Render the children as-is and add the shared child props
        return React.cloneElement(child, sharedChildProps)
      })}
    </SegmentedControlList>
  )
}

Root.displayName = 'SegmentedControl'

Root.defaultProps = {
  variant: 'default'
}

export const SegmentedControl = Object.assign(Root, {
  Button,
  IconButton: SegmentedControlIconButton
})
