import React, {useRef, useState} from 'react'
import Button, {SegmentedControlButtonProps} from './SegmentedControlButton'
import SegmentedControlIconButton, {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {useTheme} from '../ThemeProvider'
import sx, {SxProp} from '../sx'
import {ResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import styled from 'styled-components'
import {defaultSxProp} from '../utils/defaultSxProp'
import {get} from '../constants'

const StyledSegmentedControlList = styled.ul`
  --segmentedControl-item-padding: var(--control-small-paddingBlock);

  background-color: var(--controlTrack-bgColor-rest, ${get('colors.segmentedControl.bg')});
  border-radius: var(--borderRadius-medium);
  display: inline-flex;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 100%;

  &[data-icon-only='true'] {
    [data-component='SegmentedControlButton'] {
      width: 100%;
      padding-inline: 0 !important;
    }
  }

  /* sizes */

  &[data-size='small'] {
    --segmentedControl-item-padding: var(--control-xsmall-paddingBlock);
    height: var(--control-small-size);

    [data-component='SegmentedControlItem'] [data-component='SegmentedControlButton'] {
      padding-inline: calc(var(--control-xsmall-paddingInline-normal) - var(--segmentedControl-item-padding));
    }

    &[data-icon-only='true'] [data-component='SegmentedControlItem'] {
      width: var(--control-small-size);
    }

    [data-component='SegmentedControlLeadingVisual'] {
      margin-right: var(--control-small-gap, 0.25rem);
    }
  }

  &[data-size='medium'] {
    height: var(--control-medium-size);

    &[data-icon-only='true'] [data-component='SegmentedControlItem'] {
      width: var(--control-medium-size);
    }

    [data-component='SegmentedControlLeadingVisual'] {
      margin-right: var(--control-medium-gap, 0.5rem);
    }
  }

  /* item */

  [data-component='SegmentedControlItem'] {
    position: relative;
    display: inline-flex;
    justify-content: center;
    border: var(--borderWidth-thin) solid transparent;
    border-radius: var(--borderRadius-medium);
    padding: var(--segmentedControl-item-padding);
    flex: 0 1 auto;
    min-width: 0;

    /* button color overrides */
    [data-component='SegmentedControlButton'] {
      &:hover:not(:disabled) {
        background-color: var(--controlTrack-bgColor-hover, ${get('colors.segmentedControl.button.hover.bg')});
      }

      &:active:not(:disabled) {
        background-color: var(--controlTrack-bgColor-active, ${get('colors.segmentedControl.button.active.bg')});
      }
    }

    /* Selected ---------------------------------------- */
    &[data-selected='true'] {
      background-color: var(--controlKnob-bgColor-rest, ${get('colors.segmentedControl.button.bg')});
      border-color: var(--controlKnob-borderColor-rest, ${get('colors.segmentedControl.button.selected.border')});

      [data-component='SegmentedControlButton'] {
        font-weight: var(--base-text-weight-semibold);

        &:hover:not(:disabled) {
          background-color: transparent;
        }
      }

      &::before {
        border-color: transparent !important;
      }

      & + [data-component='SegmentedControlItem']::before {
        border-color: transparent;
      }
    }

    /* renders a visibly hidden "copy" of the text in bold, reserving box space for when text becomes bold on selected */
    [data-component='SegmentedControlLabel'][data-content]::before {
      display: block;
      height: 0;
      font-weight: var(--base-text-weight-semibold);
      visibility: hidden;
      content: attr(data-content);
    }

    /* Separator lines */
    &:not(:first-child) {
      &::before {
        position: absolute;
        inset: 0 0 0 -1px;
        margin-top: var(--control-medium-paddingBlock);
        margin-bottom: var(--control-medium-paddingBlock);
        content: '';
        border-left: var(--borderWidth-thin) solid var(--borderColor-default, ${get('colors.border.default')});
      }
    }

    /* Button ----------------------------------------- */
    [data-component='SegmentedControlButton'] {
      background-color: transparent;
      min-height: 100%;
      min-width: 100%;
      border: 0;
      font-weight: var(--base-text-weight-normal);
      border-radius: calc(var(--borderRadius-medium) - var(--segmentedControl-item-padding) / 2);
      padding-inline: calc(var(--control-medium-paddingInline-normal) - var(--segmentedControl-item-padding));
      cursor: pointer;
      z-index: 1;

      &:focus-visible {
        outline-offset: calc(var(--segmentedControl-item-padding) - var(--borderWidth-thin));
        border-radius: calc(var(--borderRadius-medium) - var(--segmentedControl-item-padding) / 1);
      }

      svg {
        fill: var(--fgColor-muted, ${get('colors.fg.muted')});
      }

      &:hover:not(:disabled) {
        background-color: var(--controlTrack-bgColor-hover, ${get('colors.segmentedControl.button.hover.bg')});

        svg {
          fill: var(--fgColor-default, ${get('colors.fg.default')});
        }
      }
    }

    [data-component='SegmentedControlButtonContent'] {
      align-items: center;
      display: flex;
    }

    [data-component='SegmentedControlLabel'] {
      color: var(--button-default-fgColor-rest, ${get('colors.btn.text')});
      /* use ellipsis with the assumption that icon only variant will be used when not enough space is available */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* fullWidth */
  &[data-full-width='true'] {
    display: flex;

    [data-component='SegmentedControlItem'] {
      flex: 1;
      justify-content: center;
    }

    [data-component='SegmentedControlButtonContent'] {
      justify-content: center;
    }
  }

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
  /** The size of the buttons */
  size?: 'small' | 'medium'
  /** Configure alternative ways to render the control when it gets rendered in tight spaces */
  variant?: 'default' | Partial<Record<WidthOnlyViewportRangeKeys, 'hideLabels' | 'dropdown' | 'default'>>
} & SxProp

const Root: React.FC<React.PropsWithChildren<SegmentedControlProps>> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  fullWidth,
  onChange,
  size = 'medium',
  sx: listSxProp = defaultSxProp,
  variant = 'default',
  ...rest
}) => {
  const segmentedControlContainerRef = useRef<HTMLUListElement>(null)
  const {theme} = useTheme()
  const isUncontrolled =
    onChange === undefined ||
    React.Children.toArray(children).some(
      child => React.isValidElement<SegmentedControlButtonProps>(child) && child.props.defaultSelected !== undefined,
    )
  const responsiveVariant = useResponsiveValue(variant, 'default')
  const isFullWidth = useResponsiveValue(fullWidth, false)
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
  const onlyIconButtonChildren = React.Children.toArray(children).every(
    child => React.isValidElement<SegmentedControlIconButtonProps>(child) && child.type === SegmentedControlIconButton,
  )

  if (!ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use the `aria-label` or `aria-labelledby` prop to provide an accessible label for assistive technologies',
    )
  }

  return responsiveVariant === 'dropdown' ? (
    // Render the 'dropdown' variant of the SegmentedControlButton or SegmentedControlIconButton
    <>
      <ActionMenu>
        {/*
          The aria-label is only provided as a backup when the designer or engineer neglects to show a label for the SegmentedControl.
          The best thing to do is to have a visual label who's id is referenced using the `aria-labelledby` prop.
        */}
        <ActionMenu.Button aria-label={ariaLabel} leadingVisual={getChildIcon(selectedChild)}>
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
                  onSelect={(event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => {
                    isUncontrolled && setSelectedIndexInternalState(index)
                    onChange && onChange(index)
                    child.props.onClick && child.props.onClick(event as React.MouseEvent<HTMLLIElement>)
                  }}
                >
                  {ChildIcon && <ChildIcon />} {getChildText(child)}
                </ActionList.Item>
              )
            })}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  ) : (
    // Render a segmented control
    <StyledSegmentedControlList
      sx={listSxProp}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      ref={segmentedControlContainerRef}
      data-icon-only={onlyIconButtonChildren || responsiveVariant === 'hideLabels'}
      data-size={size}
      data-full-width={isFullWidth}
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
          sx: {
            '--separator-color':
              index === selectedIndex || index === selectedIndex - 1 ? 'transparent' : theme?.colors.border.default,
            ...child.props.sx,
          },
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

          if (!leadingIcon) {
            // eslint-disable-next-line no-console
            console.warn('A `leadingIcon` prop is required when hiding visible labels')
          } else {
            return (
              <SegmentedControlIconButton
                aria-label={childAriaLabel || childPropsChildren}
                icon={leadingIcon}
                data-component="SegmentedControlButton"
                {...sharedChildProps}
                {...restChildProps}
              />
            )
          }
        }

        // Render the children as-is and add the shared child props
        return React.cloneElement(child, sharedChildProps)
      })}
    </StyledSegmentedControlList>
  )
}

Root.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(Root, {
  Button,
  IconButton: SegmentedControlIconButton,
})
