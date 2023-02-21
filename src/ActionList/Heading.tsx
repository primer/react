import React from 'react'
import {ListContext} from './List'
import Box from '../Box'
import styled from 'styled-components'
import {get} from '../constants'

export type ActionListHeadingProps = {
  variant?: 'subtle' | 'filled'
  title: string
  subtitle?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Displays the name and description of the ActionList.
 *
 * For visual presentation only. It's hidden from screen readers.
 */
export const Heading: React.FC<React.PropsWithChildren<ActionListHeadingProps>> = ({
  variant,
  title,
  subtitle,
  headingLevel = 3,
  ...props
}) => {
  const {variant: listVariant} = React.useContext(ListContext)

  const styles = {
    paddingY: '6px',
    paddingX: listVariant === 'full' ? 2 : 3,
    fontSize: 0,
    fontWeight: 'bold',
    color: 'fg.muted',
    listStyle: 'none',
    ...(variant === 'filled' && {
      backgroundColor: 'canvas.subtle',
      marginX: 0,
      marginBottom: 2,
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'neutral.muted',
    }),
  }

  const tag = `h${headingLevel}` as keyof JSX.IntrinsicElements

  const Title = styled(tag)`
    color: ${get('colors.fg.muted')};
    font-size: ${get('fontSizes.0')};
    font-weight: ${get('fontWeights.semibold')};
    margin-bottom: 0;
    margin-top: 0;
  `

  const Subtitle = styled.span`
    color: ${get('colors.fg.muted')};
    font-size: ${get('fontSizes.0')};
    font-weight: ${get('fontWeights.normal')};
  `

  return (
    <Box as="div" sx={styles} role="presentation" aria-hidden="true" {...props}>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Box>
  )
}
