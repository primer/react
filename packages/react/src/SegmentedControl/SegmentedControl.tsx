import React, {useRef, useState} from 'react'
import type {SegmentedControlButtonProps} from './SegmentedControlButton'
import Button from './SegmentedControlButton'
import type {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'
import type {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import {isElement} from 'react-is'
import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {isSlot} from '../utils/is-slot'

export type SegmentedControlProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  /** Whether the control fills the width of its parent */
  fullWidth?: boolean | ResponsiveValue<boolean>
  /** The handler that gets called when a segment is selected */
  onChange?: (selectedIndex: number) => void
  /** The size of the buttons */
  size?: 'small' | 'medium'
  /** Configure alternative ways to render the control when it gets rendered in tight spaces */
  variant?: 'default' | Partial<Record<WidthOnlyViewportRangeKeys, 'hideLabels' | 'dropdown' | 'default'>>
  className?: string
}

const Root: React.FC<React.PropsWithChildren<SegmentedControlProps>> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  fullWidth,
  onChange,
  size,
  variant = 'default',
  className,
  ...rest
}) => {
  const segmentedControlContainerRef = useRef<HTMLUListElement>(null)
  const isUncontrolled =
    onChange === undefined ||
    React.Children.toArray(children).some(
      child => React.isValidElement<SegmentedControlButtonProps>(child) && child.props.defaultSelected !== undefined,
    )

  const selectedSegments = React.Children.toArray(children).map(
    child =>
      React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child) &&
      (child.props.defaultSelected || child.props.selected),
  )
  const hasSelectedButton = selectedSegments.some(isSelected => isSelected)
  const selectedIndexExternal = hasSelectedButton ? selectedSegments.indexOf(true) : 0
  const [selectedIndexInternalState, setSelectedIndexInternalState] = useState<number>(selectedIndexExternal)
  const selectedIndex = isUncontrolled ? selectedIndexInternalState : selectedIndexExternal
  const selectedChild = React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(
    React.Children.toArray(children)[selectedIndex],
  )
    ? React.Children.toArray(children)[selectedIndex]
    : undefined
  const getChildIcon = (childArg: React.ReactNode): React.ReactElement | null => {
    if (
      React.isValidElement<SegmentedControlButtonProps>(childArg) &&
      (childArg.type === Button || isSlot(childArg, Button))
    ) {
      // Use leadingVisual if provided, otherwise fall back to leadingIcon for backwards compatibility
      const leadingVisual = childArg.props.leadingVisual ?? childArg.props.leadingIcon
      if (leadingVisual) {
        if (isElement(leadingVisual)) {
          return leadingVisual
        } else {
          const LeadingVisual = leadingVisual
          return <LeadingVisual />
        }
      }
    }

    if (
      React.isValidElement<SegmentedControlIconButtonProps>(childArg) &&
      (childArg.type === SegmentedControlIconButton || isSlot(childArg, SegmentedControlIconButton))
    ) {
      if (isElement(childArg.props.icon)) {
        childArg.props.icon
      } else {
        const Icon = childArg.props.icon
        return <Icon />
      }
    }

    return null
  }
  const getChildText = (childArg: React.ReactNode) => {
    if (
      React.isValidElement<SegmentedControlButtonProps>(childArg) &&
      (childArg.type === Button || isSlot(childArg, Button))
    ) {
      return childArg.props.children
    }

    return React.isValidElement<SegmentedControlIconButtonProps>(childArg) ? childArg.props['aria-label'] : null
  }

  if (!ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use the `aria-label` or `aria-labelledby` prop to provide an accessible label for assistive technologies',
    )
  }

  // Check if dropdown variant is used at any breakpoint
  const hasDropdownVariant =
    variant === 'dropdown' ||
    (typeof variant === 'object' && variant !== null && Object.values(variant).includes('dropdown'))

  // Render dropdown variant if needed
  const dropdownContent = hasDropdownVariant && (
    <div className={classes.DropdownContainer} {...getResponsiveAttributes('variant', variant)}>
      <ActionMenu>
        {/*
          The aria-label is only provided as a backup when the designer or engineer neglects to show a label for the SegmentedControl.
          The best thing to do is to have a visual label who's id is referenced using the `aria-labelledby` prop.
        */}
        <ActionMenu.Button
          aria-label={ariaLabel && `${getChildText(selectedChild)}, ${ariaLabel}`}
          leadingVisual={getChildIcon(selectedChild)}
        >
          {getChildText(selectedChild)}
        </ActionMenu.Button>
        <ActionMenu.Overlay aria-labelledby={ariaLabelledby}>
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
                  onSelect={event => {
                    isUncontrolled && setSelectedIndexInternalState(index)
                    onChange && onChange(index)
                    child.props.onClick && child.props.onClick(event as React.MouseEvent<HTMLLIElement>)
                  }}
                >
                  {ChildIcon} {getChildText(child)}
                </ActionList.Item>
              )
            })}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </div>
  )

  // Render segmented control (default or hideLabels variant)
  const segmentedControlContent = (
    <ul
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      ref={segmentedControlContainerRef}
      className={clsx(classes.SegmentedControl, className)}
      {...getResponsiveAttributes('full-width', fullWidth)}
      {...getResponsiveAttributes('variant', variant)}
      data-size={size}
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
                isUncontrolled && setSelectedIndexInternalState(index)
                child.props.onClick && child.props.onClick(event)
              }
            : (event: React.MouseEvent<HTMLButtonElement>) => {
                child.props.onClick && child.props.onClick(event)
                isUncontrolled && setSelectedIndexInternalState(index)
              },
          selected: index === selectedIndex,
          style: {
            '--separator-color':
              index === selectedIndex || index === selectedIndex - 1 ? 'transparent' : 'var(--borderColor-default)',
            ...child.props.style,
          },
        }

        // Render the children as-is and add the shared child props
        return React.cloneElement(child, sharedChildProps)
      })}
    </ul>
  )

  // Return both variants when dropdown is used, otherwise just the segmented control
  return hasDropdownVariant ? (
    <>
      {dropdownContent}
      {segmentedControlContent}
    </>
  ) : (
    segmentedControlContent
  )
}

Root.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(Root, {
  __SLOT__: Symbol('SegmentedControl'),
  Button,
  IconButton: SegmentedControlIconButton,
})
