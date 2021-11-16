import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {ListContext} from './List'

/**
 * Contract for props passed to the `Header` component.
 */
export type HeaderProps = {
  /**
   * Style variations. Usage is discretionary.
   *
   * - `"filled"` - Superimposed on a background, offset from nearby content
   * - `"subtle"` - Relatively less offset from nearby content
   */
  variant?: 'subtle' | 'filled'

  /**
   * Primary text which names a `Group`.
   */
  title?: string

  /**
   * Secondary text which provides additional information about a `Group`.
   */
  auxiliaryText?: string
} & SxProp

/**
 * Displays the name and description of a `Group`.
 */
export const Header = ({variant = 'subtle', title, auxiliaryText, sx = {}, ...props}: HeaderProps): JSX.Element => {
  const {variant: listVariant} = React.useContext(ListContext)

  const styles = {
    paddingY: '6px',
    paddingX: listVariant === 'full' ? 2 : 3,
    fontSize: 0,
    fontWeight: 'bold',
    color: 'fg.muted',
    ...(variant === 'filled' && {
      backgroundColor: 'canvas.subtle',
      marginX: 0,
      marginBottom: 2,
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'neutral.muted'
    }),
    ...sx
  }

  return (
    <Box sx={styles} role="heading" {...props}>
      {title}
      {auxiliaryText && <span>{auxiliaryText}</span>}
    </Box>
  )
}
