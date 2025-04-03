// Used for UnderlineNav and UnderlinePanels components

import React, {forwardRef, type FC, type PropsWithChildren} from 'react'
import {isElement} from 'react-is'
import type {IconProps} from '@primer/octicons-react'
import CounterLabel from '../../CounterLabel'
import {type SxProp} from '../../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import {defaultSxProp} from '../../utils/defaultSxProp'

import {toggleSxComponent} from '../utils/toggleSxComponent'
import classes from './UnderlineTabbedInterface.module.css'
import {clsx} from 'clsx'

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
export const GAP = 8

type UnderlineWrapperProps = {
  slot?: string
  as?: React.ElementType
  className?: string
  ref?: React.Ref<unknown>
} & SxProp

const UnderlineWrapperComponent = toggleSxComponent('div') as React.ComponentType<
  PropsWithChildren<UnderlineWrapperProps>
>

export const UnderlineWrapper = forwardRef(
  (
    {children, className, sx: sxProp = defaultSxProp, ...rest}: PropsWithChildren<UnderlineWrapperProps>,
    forwardedRef,
  ) => {
    return (
      <UnderlineWrapperComponent
        className={clsx(classes.UnderlineWrapper, className)}
        ref={forwardedRef}
        sx={sxProp}
        {...rest}
      >
        {children}
      </UnderlineWrapperComponent>
    )
  },
)

export const UnderlineItemList = forwardRef(({children, ...rest}: PropsWithChildren, forwardedRef) => {
  return (
    <ul className={classes.UnderlineItemList} ref={forwardedRef} {...rest}>
      {children}
    </ul>
  )
}) as PolymorphicForwardRefComponent<'ul'>

export const LoadingCounter = () => {
  return <span className={classes.LoadingCounter} />
}

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
  className?: string
  iconsVisible?: boolean
  loadingCounters?: boolean
  counter?: number | string
  icon?: FC<IconProps> | React.ReactElement
  id?: string
  ref?: React.Ref<unknown>
} & SxProp

const UnderlineComponent = toggleSxComponent('a') as React.ComponentType<PropsWithChildren<UnderlineItemProps>>

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
      <UnderlineComponent ref={forwardedRef} as={as} sx={sxProp} className={classes.UnderlineItem} {...rest}>
        {iconsVisible && Icon && <span data-component="icon">{isElement(Icon) ? Icon : <Icon />}</span>}
        {children && (
          <span data-component="text" data-content={children}>
            {children}
          </span>
        )}
        {counter !== undefined ? (
          loadingCounters ? (
            <span data-component="counter">
              <LoadingCounter />
            </span>
          ) : (
            <span data-component="counter">
              <CounterLabel>{counter}</CounterLabel>
            </span>
          )
        ) : null}
      </UnderlineComponent>
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineItemProps>
