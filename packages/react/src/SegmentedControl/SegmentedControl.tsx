import React, {useRef, useState} from 'react'
import type {SegmentedControlButtonProps} from './SegmentedControlButton'
import Button from './SegmentedControlButton'
import type {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import Action from './SegmentedControlAction'
import Divider from './SegmentedControlDivider'
import {SegmentedControlActionContext} from './SegmentedControlActionContext'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {useSlots} from '../hooks/useSlots'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'
import type {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import {isElement} from 'react-is'
import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {isSlot} from '../utils/is-slot'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

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
  variant?:
    | 'default'
    | 'subtle'
    | Partial<Record<WidthOnlyViewportRangeKeys, 'hideLabels' | 'dropdown' | 'default' | 'subtle'>>
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
  const [slots, segmentChildren] = useSlots(children, {action: Action})
  const actionChild = slots.action
  const segments = segmentChildren.filter(
    child => React.isValidElement(child) && !isSlot(child, Divider),
  ) as React.ReactElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>[]
  const segmentIndices = new Map(segments.map((segment, index) => [segment, index]))
  const segmentCount = segments.length
  const previousSegmentCount = useRef(segmentCount)

  useIsomorphicLayoutEffect(() => {
    if (previousSegmentCount.current === segmentCount) return

    const segmentedControl = segmentedControlContainerRef.current
    segmentedControl?.setAttribute('data-disable-knob-transition', '')
    previousSegmentCount.current = segmentCount

    const animationFrame = requestAnimationFrame(() => {
      segmentedControl?.removeAttribute('data-disable-knob-transition')
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [segmentCount])

  const isUncontrolled =
    onChange === undefined ||
    segments.some(
      child => React.isValidElement<SegmentedControlButtonProps>(child) && child.props.defaultSelected !== undefined,
    )

  const selectedSegments = segments.map(
    child =>
      React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child) &&
      (child.props.defaultSelected || child.props.selected),
  )
  const hasSelectedButton = selectedSegments.some(isSelected => isSelected)
  const selectedIndexExternal = hasSelectedButton ? selectedSegments.indexOf(true) : 0
  const [selectedIndexInternalState, setSelectedIndexInternalState] = useState<number>(selectedIndexExternal)
  const selectedIndex = isUncontrolled ? selectedIndexInternalState : selectedIndexExternal
  const selectedChild = React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(
    segments[selectedIndex],
  )
    ? segments[selectedIndex]
    : undefined
  const getChildIcon = (childArg: React.ReactNode): React.ReactElement | null => {
    if (
      React.isValidElement<SegmentedControlButtonProps>(childArg) &&
      (childArg.type === Button || isSlot(childArg, Button))
    ) {
      // Use leadingVisual if provided, otherwise fall back to leadingIcon for backwards compatibility
      const leadingVisual = childArg.props.leadingVisual ?? childArg.props.leadingIcon
      if (leadingVisual) {
        if (isElement(leadingVisual)) return leadingVisual

        const LeadingVisual = leadingVisual
        return <LeadingVisual />
      }
    }

    if (
      React.isValidElement<SegmentedControlIconButtonProps>(childArg) &&
      (childArg.type === SegmentedControlIconButton || isSlot(childArg, SegmentedControlIconButton))
    ) {
      if (isElement(childArg.props.icon)) return childArg.props.icon

      const Icon = childArg.props.icon
      return <Icon />
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
  const responsiveVariant = typeof variant === 'object' ? variant : undefined
  const hasDropdownVariant = responsiveVariant ? Object.values(responsiveVariant).includes('dropdown') : false

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
            {segmentChildren.map((child, index) => {
              if (React.isValidElement(child) && isSlot(child, Divider)) {
                return (
                  <ActionList.Divider
                    key={child.key ?? `segmented-control-divider-${index}`}
                    className={child.props.className}
                    style={child.props.style}
                  />
                )
              }

              const ChildIcon = getChildIcon(child)
              // Not a valid child element - skip rendering
              if (!React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child)) {
                return null
              }

              const segmentIndex = segmentIndices.get(child) ?? -1
              return (
                <ActionList.Item
                  key={`segmented-control-action-btn-${index}`}
                  selected={segmentIndex === selectedIndex}
                  onSelect={event => {
                    isUncontrolled && setSelectedIndexInternalState(segmentIndex)
                    onChange && onChange(segmentIndex)
                    child.props.onClick && child.props.onClick(event as React.MouseEvent<HTMLLIElement>)
                  }}
                >
                  {ChildIcon} {getChildText(child)}
                </ActionList.Item>
              )
            })}
            {actionChild && (
              <SegmentedControlActionContext.Provider value="menu">
                {actionChild}
              </SegmentedControlActionContext.Provider>
            )}
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
      data-component="SegmentedControl"
    >
      {segmentChildren.map((child, index) => {
        if (React.isValidElement(child) && isSlot(child, Divider)) {
          return React.cloneElement(child, {key: child.key ?? `segmented-control-divider-${index}`})
        }

        // Not a valid child element - skip rendering child
        if (!React.isValidElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>(child)) {
          return null
        }
        const segmentIndex = segmentIndices.get(child) ?? -1
        const sharedChildProps = {
          onClick: onChange
            ? (event: React.MouseEvent<HTMLButtonElement>) => {
                const isDisabled =
                  child.props.disabled === true ||
                  child.props['aria-disabled'] === 'true' ||
                  child.props['aria-disabled'] === true
                if (!isDisabled) {
                  onChange(segmentIndex)
                  isUncontrolled && setSelectedIndexInternalState(segmentIndex)
                  child.props.onClick && child.props.onClick(event)
                }
              }
            : (event: React.MouseEvent<HTMLButtonElement>) => {
                const isDisabled =
                  child.props.disabled === true ||
                  child.props['aria-disabled'] === 'true' ||
                  child.props['aria-disabled'] === true
                if (!isDisabled) {
                  child.props.onClick && child.props.onClick(event)
                  isUncontrolled && setSelectedIndexInternalState(segmentIndex)
                }
              },
          selected: segmentIndex === selectedIndex,
          style: {
            '--separator-color':
              segmentIndex === selectedIndex || segmentIndex === selectedIndex - 1
                ? 'transparent'
                : 'var(--borderColor-default)',
            ...child.props.style,
          },
        }

        // Render the children as-is and add the shared child props
        return React.cloneElement(child, {key: child.key ?? `segmented-control-item-${index}`, ...sharedChildProps})
      })}
    </ul>
  )

  const inlineActionContent = actionChild && (
    <div className={classes.InlineAction} {...getResponsiveAttributes('variant', variant)}>
      <SegmentedControlActionContext.Provider value="inline">{actionChild}</SegmentedControlActionContext.Provider>
    </div>
  )

  return hasDropdownVariant || actionChild ? (
    <div className={classes.DropdownGroup} data-size={size} {...getResponsiveAttributes('full-width', fullWidth)}>
      {dropdownContent}
      {segmentedControlContent}
      {inlineActionContent}
    </div>
  ) : (
    segmentedControlContent
  )
}

Root.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(Root, {
  Button,
  IconButton: SegmentedControlIconButton,
  Divider,
  Action,
})
