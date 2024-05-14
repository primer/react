// Used for UnderlineNav and UnderlinePanels components

import React, {forwardRef, type FC, type PropsWithChildren} from 'react'
import type {IconProps} from '@primer/octicons-react'
import styled, {keyframes} from 'styled-components'
import CounterLabel from '../../CounterLabel'
import sx, {type SxProp} from '../../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import {defaultSxProp} from '../../utils/defaultSxProp'

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
export const GAP = 8

export const StyledUnderlineWrapper = styled.div`
  display: flex;
  padding-inline: var(--stack-padding-normal);
  justify-content: flex-start;
  align-items: center;
  /* make space for the underline */
  min-height: var(--control-xlarge-size);
  /* using a box-shadow instead of a border to accomodate 'overflow-y: hidden' on UnderlinePanels */
  box-shadow: inset 0px -1px var(--borderColor-muted);

  ${sx};
`

export const StyledUnderlineItemList = styled.ul`
  display: flex;
  list-style: none;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  align-items: center;
  gap: ${GAP}px;
  position: relative;
`

export const StyledUnderlineItem = styled.div`
  /* button resets */
  appearance: none;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;

  /* underline tab specific styles */
  position: relative;
  display: inline-flex;
  color: var(--fgColor-default);
  text-align: center;
  text-decoration: none;
  line-height: var(--text-body-lineHeight-medium);
  border-radius: var(--borderRadius-medium);
  font-size: var(--text-body-size-medium);
  padding-inline: var(--control-medium-paddingInline-condensed);
  padding-block: var(--control-medium-paddingBlock);
  align-items: center;

  @media (hover: hover) : {
    &:hover {
      background-color: var(--bgColor-neutral-muted);
      transition: background 0.12s ease-out;
      text-decoration: none;
    }
  }

  &:focus: {
    outline: 2px solid transparent;
    box-shadow: inset 0 0 0 2px var(--fgColor-accent);

    /* where focus-visible is supported, remove the focus box-shadow */
    &:not(:focus-visible) {
      box-shadow: none;
    }
  }

  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: inset 0 0 0 2px var(--fgColor-accent);
  }

  /* renders a visibly hidden "copy" of the label in bold, reserving box space for when label becomes bold on selected */
  [data-content]::before {
    content: attr(data-content);
    display: block;
    height: 0;
    font-weight: var(--base-text-weight-semibold);
    visibility: hidden;
    white-space: nowrap;
  }

  [data-component='icon'] {
    color: var(--fgColor-muted);
    align-items: center;
    display: inline-flex;
    margin-inline-end: var(--control-medium-gap);
  }

  [data-component='counter'] {
    margin-inline-start: var(--control-medium-gap);
    display: flex;
    align-items: center;
  }

  /* selected state styles */
  &::after {
    position: absolute;
    right: 50%;
    /* TODO: see if we can simplify this positioning */
    /* 48px total height / 2 (24px) + 1px */
    bottom: calc(50% - calc(var(--control-xlarge-size) / 2 + 1px));
    width: 100%;
    height: 2px;
    content: '';
    background-color: transparent;
    border-radius: 0;
    transform: translate(50%, -50%);
  }

  &[aria-current]:not([aria-current='false']),
  &[aria-selected='true'] {
    [data-component='text'] {
      font-weight: var(--base-text-weight-semibold);
    }

    &::after {
      background-color: var(--underlineNav-borderColor-active, var(--color-primer-border-active, #fd8c73));
    }
  }

  @media (forced-colors: active) {
    &[aria-current]:not([aria-current='false']),
    &[aria-selected='true'] {
      ::after {
        // Support for Window Force Color Mode https://learn.microsoft.com/en-us/fluent-ui/web-components/design-system/high-contrast
        background-color: LinkText;
      }
    }
  }
  ${sx};
`

const loadingKeyframes = keyframes`
  from { opacity: 1; }
  to { opacity: 0.2; }
`

export const LoadingCounter = styled.span`
  animation: ${loadingKeyframes} 1.2s ease-in-out infinite alternate;
  background-color: var(--bgColor-neutral-muted);
  border-color: var(--borderColor-default);
  width: 1.5rem;
  height: 1rem; /*16px*/
  display: inline-block;
  border-radius: 20px;
`

// We can uncomment these when/if we add overflow behavior
// to the UnderlinePanels component
//
// export const StyledMoreButton = styled(Button)`
//   margin: 0;
//   border: 0;
//   background: transparent;
//   font-weight: normal;
//   box-shadow: none;
//   padding-block: var(--control-small-paddingBlock);
//   padding-inline: var(--control-small-paddingInline-condensed);

//   > span[data-component='trailingVisual'] {
//     margin-left: 0;
//   }
// `

// export const StyledOverflowDivider = styled.span`
//   display: inline-block;
//   border-left: 1px solid var(--borderColor-muted);
//   width: 1px;
//   margin-right: var(--control-xsmall-gap);
//   /* The height of the divider - reference from Figma */
//   height: 24px;
// `

// export const StyledMoreMenuListItem = styled.li`
//   display: flex;
//   align-items: center;
//   height: 45px;
// `

export type UnderlineItemProps = {
  as?: React.ElementType | 'a' | 'button'
  iconsVisible?: boolean
  loadingCounters?: boolean
  counter?: number | string
  icon?: FC<IconProps>
  id?: string
} & SxProp

export const UnderlineItem = forwardRef(
  (
    {
      as = 'a',
      children,
      counter,
      icon: Icon,
      iconsVisible,
      loadingCounters,
      sx: sxProp = defaultSxProp,
      ...rest
    }: PropsWithChildren<UnderlineItemProps>,
    forwardedRef,
  ) => {
    return (
      <StyledUnderlineItem ref={forwardedRef} as={as} sx={sxProp} {...rest}>
        {iconsVisible && Icon && (
          <span data-component="icon">
            <Icon />
          </span>
        )}
        {children && (
          <span data-component="text" data-content={children}>
            {children}
          </span>
        )}
        {loadingCounters ? (
          <span data-component="counter">
            <LoadingCounter />
          </span>
        ) : (
          counter !== undefined && (
            <span data-component="counter">
              <CounterLabel>{counter}</CounterLabel>
            </span>
          )
        )}
      </StyledUnderlineItem>
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineItemProps>
