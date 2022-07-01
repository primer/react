import React from 'react'
import Button, {SegmentedControlButtonProps} from './SegmentedControlButton'
import SegmentedControlIconButton, {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import {ActionList, ActionMenu, Box, useTheme} from '..'
import {merge, SxProp} from '../sx'
import useMatchMedia from '../hooks/useMatchMedia'
import {ViewportRangeKeys} from '../utils/types/ViewportRangeKeys'

type SegmentedControlProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  /** Whether the control fills the width of its parent */
  fullWidth?: boolean
  /** The handler that gets called when a segment is selected */
  onChange?: (selectedIndex: number) => void // TODO: consider making onChange required if we force this component to be controlled
  variant?: Partial<Record<ViewportRangeKeys, 'hideLabels' | 'dropdown' | 'none'>>
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

// TODO: log a warning if no `ariaLabel` or `ariaLabelledBy` prop is passed
// TODO: implement keyboard behavior to move focus using the arrow keys
const Root: React.FC<SegmentedControlProps> = ({children, fullWidth, onChange, sx: sxProp = {}, variant, ...rest}) => {
  const {theme} = useTheme()
  const mediaQueryMatches = useMatchMedia(Object.keys(variant || {}) as ViewportRangeKeys[])
  const mediaQueryMatchesKeys = mediaQueryMatches
    ? (Object.keys(mediaQueryMatches) as ViewportRangeKeys[]).filter(
        viewportRangeKey => typeof mediaQueryMatches === 'object' && mediaQueryMatches[viewportRangeKey]
      )
    : []
  // const mediaQueryMatchesKeys = mediaQueryMatches ? (Object.keys(mediaQueryMatches) as ViewportRangeKeys[]) : []
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

  const sx = merge(
    getSegmentedControlStyles({
      fullWidth
    }),
    sxProp as SxProp
  )

  // Since we can have multiple media query matches for `variant` (e.g.: 'regular' and 'wide'),
  // we need to pick which variant we actually show.
  const getVariantToRender = () => {
    // If no variant was passed, return 'none'
    if (!variant) {
      return 'none'
    }

    // Prioritize viewport range keys that override the 'regular' range in order of
    // priorty from lowest to highest
    // Orientation keys beat 'wide' because they are more specific.
    const viewportRangeKeysByPriority: ViewportRangeKeys[] = ['wide', 'portrait', 'landscape']

    // Filter the viewport range keys to only include those that:
    // - are in the priority list
    // - have a variant set
    const variantPriorityKeys = mediaQueryMatchesKeys.filter(key => {
      return viewportRangeKeysByPriority.includes(key) && variant[key]
    })

    // If we have to pick from multiple variants and one or more of them overrides 'regular',
    // use the last key from the filtered list.
    if (mediaQueryMatchesKeys.length > 1 && variantPriorityKeys.length) {
      return variant[variantPriorityKeys[variantPriorityKeys.length - 1]]
    }

    // Otherwise, use the variant for the first matching media query
    return typeof mediaQueryMatches === 'object' && variant[mediaQueryMatchesKeys[0]]
  }

  return getVariantToRender() === 'dropdown' ? (
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
    <Box role="toolbar" sx={sx} {...rest}>
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
          getVariantToRender() === 'hideLabels' &&
          React.isValidElement<SegmentedControlButtonProps>(child) &&
          child.type === Button
        ) {
          const {'aria-label': ariaLabel, leadingIcon, children: childPropsChildren, ...restChildProps} = child.props
          if (!leadingIcon) {
            // eslint-disable-next-line no-console
            console.warn('A `leadingIcon` prop is required when hiding visible labels')
          } else {
            return (
              <SegmentedControlIconButton
                aria-label={ariaLabel || childPropsChildren}
                icon={leadingIcon}
                sx={
                  {
                    '--separator-color':
                      index === selectedIndex || index === selectedIndex - 1
                        ? 'transparent'
                        : theme?.colors.border.default
                  } as React.CSSProperties
                }
                {...restChildProps}
              />
            )
          }
        }

        // Render the children as-is and add the shared child props
        return React.cloneElement(child, sharedChildProps)
      })}
    </Box>
  )
}

Root.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(Root, {
  Button,
  IconButton: SegmentedControlIconButton
})
