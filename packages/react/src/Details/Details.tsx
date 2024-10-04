import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import React from 'react'

export const StyledDetails = styled.details<SxProp>`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${sx};
`

export const StyledSummary = styled.summary<SxProp>`
  ${sx};
`

const Root = React.forwardRef<HTMLDetailsElement, ComponentProps<typeof StyledDetails>>(
  ({children, ...props}: ComponentProps<typeof StyledDetails>, ref) => {
    const hasSummary = React.Children.toArray(children).some(child => {
      return (
        React.isValidElement(child) &&
        (child.type === Details.Summary || child.type === 'summary' || child.props?.as === 'summary')
      )
    })
    return (
      <StyledDetails {...props} ref={ref}>
        {/* Include default summary if summary is not provided */}
        {!hasSummary && <Details.Summary>{'See Details'}</Details.Summary>}
        {children}
      </StyledDetails>
    )
  },
)

Root.displayName = 'Details'

export type SummaryProps = {
  /**
   * HTML element to summary render as.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ElementType<React.PropsWithChildren<any>>
  children?: React.ReactNode
} & SxProp &
  ComponentProps<typeof StyledSummary>

export function Summary({as: Component = StyledSummary, children, ...props}: SummaryProps) {
  return (
    <Component as={Component === StyledSummary ? null : 'summary'} {...props}>
      {children}
    </Component>
  )
}

Summary.displayName = 'Summary'

const Details = Object.assign(Root, {
  Summary,
})

export type DetailsProps = ComponentProps<typeof Details>
export default Details
