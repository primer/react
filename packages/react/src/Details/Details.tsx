/* eslint-disable primer-react/spread-props-first */
import React, {useEffect, type ComponentPropsWithoutRef, type ReactElement} from 'react'
import {warning} from '../utils/warning'
import {clsx} from 'clsx'
import classes from './Details.module.css'
import {useMergedRefs} from '../internal/hooks/useMergedRefs'

const Root = React.forwardRef<HTMLDetailsElement, DetailsProps>(
  ({className, children, ...rest}, forwardRef): ReactElement => {
    const detailsRef = React.useRef<HTMLDetailsElement>(null)
    const ref = useMergedRefs(forwardRef, detailsRef)

    useEffect(() => {
      if (!__DEV__) {
        return
      }

      const {current: details} = detailsRef
      if (!details) {
        return
      }
      const summary = details.querySelector('summary:not([data-default-summary])')
      warning(
        summary === null,
        'The <Details> component must have a <summary> child component. You can either use <Details.Summary> or a native <summary> element.',
      )
    }, [])

    return (
      <details className={clsx(className, classes.Details)} {...rest} ref={ref}>
        {children}
      </details>
    )
  },
)

Root.displayName = 'Details'

export type SummaryProps<As extends React.ElementType> = {
  /**
   * HTML element to render summary as.
   */
  as?: As
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<React.ElementType extends As ? As : 'summary'>

function Summary<As extends React.ElementType>({as, children, ...props}: SummaryProps<As>) {
  const Component = as ?? 'summary'
  return (
    <Component as={Component === 'summary' ? null : 'summary'} {...props}>
      {children}
    </Component>
  )
}
Summary.displayName = 'Summary'

export {Summary}

const Details = Object.assign(Root, {
  Summary,
})

export type DetailsProps = ComponentPropsWithoutRef<'details'>
export default Details
