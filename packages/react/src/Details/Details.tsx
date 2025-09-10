import React, {useEffect, useState, type ComponentPropsWithoutRef, type ReactElement} from 'react'
import {clsx} from 'clsx'
import classes from './Details.module.css'
import {useMergedRefs} from '../internal/hooks/useMergedRefs'

const Root = React.forwardRef<HTMLDetailsElement, DetailsProps>(
  ({className, children, ...rest}, forwardRef): ReactElement => {
    const detailsRef = React.useRef<HTMLDetailsElement>(null)
    const ref = useMergedRefs(forwardRef, detailsRef)
    const [hasSummary, setHasSummary] = useState(false)

    useEffect(() => {
      const {current: details} = detailsRef
      if (!details) {
        return
      }

      const updateSummary = () => {
        const summary = details.querySelector('summary:not([data-default-summary])')
        setHasSummary(!!summary)
      }

      // Update summary on mount
      updateSummary()

      const observer = new MutationObserver(() => {
        updateSummary()
      })

      observer.observe(details, {
        childList: true,
        subtree: true,
      })

      return () => {
        observer.disconnect()
      }
    }, [])

    return (
      <details className={clsx(className, classes.Details)} {...rest} ref={ref}>
        {/* Include default summary if summary is not provided */}
        {!hasSummary && <Details.Summary data-default-summary>{'See Details'}</Details.Summary>}
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
