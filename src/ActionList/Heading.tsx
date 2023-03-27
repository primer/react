import React from 'react'
import {ListContext} from './List'
import Box from '../Box'
import {get} from '../constants'
import {SxProp} from '../sx'
import {merge} from 'lodash'

export type ActionListHeadingProps = {
  variant?: 'subtle' | 'filled'
  title: string
  subtitle?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
} & SxProp

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
  id,
  sx,
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

  const Title = (
    <Box
      as={tag}
      sx={{
        color: get('colors.fg.muted'),
        fontSize: get('fontSizes.0'),
        fontWeight: get('fontWeights.bold'),
        marginBottom: 0,
        marginTop: 0,
      }}
      id={id}
    >
      {title}
    </Box>
  )

  const Subtitle = (
    <Box
      as="span"
      sx={{
        color: get('colors.fg.muted'),
        fontSize: get('fontSizes.0'),
        fontWeight: get('fontWeights.normal'),
      }}
    >
      {subtitle}
    </Box>
  )

  return (
    <Box as="div" sx={merge(styles, sx as SxProp)} {...props}>
      {Title}
      {subtitle && Subtitle}
    </Box>
  )
}
