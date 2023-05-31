import React from 'react'
import {ListContext} from './List'
import Box from '../Box'
import {get} from '../constants'
import {SxProp, merge} from '../sx'
import {useId} from '../hooks/useId'
import {defaultSxProp} from '../utils/defaultSxProp'

export type ActionListHeadingProps = {
  variant?: 'subtle' | 'filled'
  title: string
  subtitle?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
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
  as = 'h3',
  sx = defaultSxProp,
  ...props
}) => {
  const {variant: listVariant, headingId: headingId} = React.useContext(ListContext)

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

  const id = useId(headingId)

  const Title = (
    <Box
      as={as}
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
