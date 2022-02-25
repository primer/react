import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import Box from '../Box'
import {SxProp} from '../sx'
import {ListContext, ListProps} from './List'
import {AriaRole} from '../utils/types'

export type GroupProps = {
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
  /**
   * The ARIA role describing the function of the list inside `Group` component. `listbox` or `menu` are a common values.
   */
  role?: AriaRole
} & SxProp & {
    /**
     * Whether multiple Items or a single Item can be selected in the Group. Overrides value on ActionList root.
     */
    selectionVariant?: ListProps['selectionVariant'] | false
  }

type ContextProps = Pick<GroupProps, 'selectionVariant'>
export const GroupContext = React.createContext<ContextProps>({})

export const Group: React.FC<GroupProps> = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  const labelId = useSSRSafeId()
  const {role: listRole} = React.useContext(ListContext)

  return (
    <Box
      as="li"
      role="none"
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
        ...sx
      }}
      {...props}
    >
      {title && <Header title={title} variant={variant} auxiliaryText={auxiliaryText} labelId={labelId} />}
      <GroupContext.Provider value={{selectionVariant}}>
        <Box
          as="ul"
          sx={{paddingInlineStart: 0}}
          aria-labelledby={title ? labelId : undefined}
          role={role || (listRole && 'group')}
        >
          {props.children}
        </Box>
      </GroupContext.Provider>
    </Box>
  )
}

export type HeaderProps = Pick<GroupProps, 'variant' | 'title' | 'auxiliaryText'> & {
  labelId: string
}

/**
 * Displays the name and description of a `Group`.
 *
 * For visual presentation only. It's hidden from screen readers.
 */
const Header: React.FC<HeaderProps> = ({variant, title, auxiliaryText, labelId, ...props}) => {
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
    })
  }

  return (
    <Box sx={styles} role="presentation" aria-hidden="true" {...props}>
      <span id={labelId}>{title}</span>
      {auxiliaryText && <span>{auxiliaryText}</span>}
    </Box>
  )
}
