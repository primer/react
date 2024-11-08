import React, {useEffect, useState, type ComponentPropsWithoutRef, type ReactElement} from 'react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import {clsx} from 'clsx'
import classes from './Details.module.css'
import {useMergedRefs} from '../internal/hooks/useMergedRefs'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const StyledDetails = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'details',
  styled.details<SxProp>`
    & > summary {
      list-style: none;
    }
    & > summary::-webkit-details-marker {
      display: none;
    }

    ${sx};
  `,
)

/**
 * Details is a styled component to enhance the native behaviors of the <details> element.
 * @primerid details
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const Root = React.forwardRef<HTMLDetailsElement, DetailsProps>(
  ({className, children, ...rest}, forwardRef): ReactElement => {
    const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
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
      <StyledDetails className={clsx(className, {[classes.Details]: enabled})} {...rest} ref={ref}>
        {/* Include default summary if summary is not provided */}
        {!hasSummary && <Summary data-default-summary>{'See Details'}</Summary>}
        {children}
      </StyledDetails>
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

export function Summary<As extends React.ElementType>({as, children, ...props}: SummaryProps<As>) {
  const Component = as ?? 'summary'
  return (
    <Component as={Component === 'summary' ? null : 'summary'} {...props}>
      {children}
    </Component>
  )
}
Summary.displayName = 'Summary'

export type DetailsProps = ComponentPropsWithoutRef<'details'> & SxProp
