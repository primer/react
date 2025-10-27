// Used for UnderlineNav and UnderlinePanels components

/* eslint-disable primer-react/spread-props-first */
import React from 'react'
import {type ForwardedRef, forwardRef, type FC, type PropsWithChildren, type ElementType} from 'react'
import {isElement} from 'react-is'
import type {IconProps} from '@primer/octicons-react'
import CounterLabel from '../../CounterLabel'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'

import classes from './UnderlineTabbedInterface.module.css'
import {clsx} from 'clsx'

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
export const GAP = 8

type UnderlineWrapperProps<As extends React.ElementType> = {
  slot?: string
  as?: As
  className?: string
  ref?: React.Ref<HTMLElement>
}

export const UnderlineWrapper = forwardRef((props, ref) => {
  const {children, className, as: Component = 'nav', ...rest} = props
  return (
    <Component
      className={clsx(classes.UnderlineWrapper, className)}
      ref={ref as ForwardedRef<HTMLDivElement>}
      {...rest}
    >
      {children}
    </Component>
  )
}) as PolymorphicForwardRefComponent<ElementType, UnderlineWrapperProps<ElementType>>

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

export type UnderlineItemProps<As extends React.ElementType> = {
  as?: As | 'a' | 'button'
  className?: string
  iconsVisible?: boolean
  loadingCounters?: boolean
  counter?: number | string
  icon?: FC<IconProps> | React.ReactElement
  id?: string
  ref?: React.Ref<unknown>
} & React.ComponentPropsWithoutRef<As extends 'a' ? 'a' : As extends 'button' ? 'button' : As>

export const UnderlineItem = React.forwardRef((props, ref) => {
  const {as: Component = 'a', children, counter, icon: Icon, iconsVisible, loadingCounters, className, ...rest} = props
  return (
    <Component {...rest} ref={ref} className={clsx(classes.UnderlineItem, className)}>
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
    </Component>
  )
}) as PolymorphicForwardRefComponent<ElementType, UnderlineItemProps<ElementType>>
