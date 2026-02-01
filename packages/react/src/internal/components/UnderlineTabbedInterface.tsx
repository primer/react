// Used for UnderlineNav and UnderlinePanels components

import React, {useState} from 'react'
import {type ForwardedRef, forwardRef, type FC, type PropsWithChildren, type ElementType} from 'react'
import {isElement} from 'react-is'
import type {IconProps} from '@primer/octicons-react'
import CounterLabel from '../../CounterLabel'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

import classes from './UnderlineTabbedInterface.module.css'
import {clsx} from 'clsx'

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
export const GAP = 8

// Helper to extract direct text content from children for the data-content attribute.
// This is used by CSS to reserve space for bold text (preventing layout shift).
// Only extracts strings/numbers, not text from nested React elements (e.g., Popovers).
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('')
  }
  // Skip React elements - we only want direct text content, not text from nested components
  return ''
}

type UnderlineWrapperProps<As extends React.ElementType> = {
  slot?: string
  as?: As
  className?: string
  ref?: React.Ref<HTMLElement>
}

export const UnderlineWrapper = forwardRef((props, ref) => {
  const {children, className, as: Component = 'div', ...rest} = props
  // Track hydration state: true on server and initial client render, false after hydration
  const [isSSR, setIsSSR] = useState(true)

  useIsomorphicLayoutEffect(() => {
    // After hydration, allow overflow to be visible
    setIsSSR(false)
  }, [])

  return (
    <Component
      className={clsx(classes.UnderlineWrapper, className)}
      ref={ref as ForwardedRef<HTMLDivElement>}
      data-ssr-hidden={isSSR ? 'true' : 'false'}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: FC<IconProps> | React.ReactElement<any>
  id?: string
  ref?: React.Ref<unknown>
} & React.ComponentPropsWithoutRef<As extends 'a' ? 'a' : As extends 'button' ? 'button' : As>

export const UnderlineItem = React.forwardRef((props, ref) => {
  const {as: Component = 'a', children, counter, icon: Icon, iconsVisible, loadingCounters, className, ...rest} = props
  const textContent = getTextContent(children)
  return (
    <Component {...rest} ref={ref} className={clsx(classes.UnderlineItem, className)}>
      {iconsVisible && Icon && <span data-component="icon">{isElement(Icon) ? Icon : <Icon />}</span>}
      {children && (
        <span data-component="text" data-content={textContent || undefined}>
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
