import React from 'react'
import {useId} from '../hooks/useId'
import Box from '../Box'
import {SxProp} from '../sx'
import {ListContext, ActionListProps} from './List'
import {AriaRole} from '../utils/types'
import {GroupHeading} from './Heading'
import {useSlots} from '../hooks/useSlots'

export type ActionListGroupProps = {
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
    selectionVariant?: ActionListProps['selectionVariant'] | false
  }

type ContextProps = Pick<ActionListGroupProps, 'selectionVariant'> & {groupHeadingId: string}
export const GroupContext = React.createContext<ContextProps>({})

export const Group: React.FC<React.PropsWithChildren<ActionListGroupProps>> = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  const labelId = useId()
  const {role: listRole} = React.useContext(ListContext)

  const [slots, childrenWithoutSlots] = useSlots(props.children, {
    groupHeading: GroupHeading,
  })

  const ariaLabelledBy = slots.groupHeading ? slots.groupHeading.props.id ?? labelId : title ? labelId : undefined

  const isOtherThanList = listRole && listRole !== 'list'

  // intentionally not using as prop to be able to render the box as div
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {children, id, as, ...headingProps} = slots.groupHeading?.props ?? {}

  return (
    <Box
      as="li"
      role={listRole ? role || 'group' : undefined} // if listRole is specified, set the role either to the role prop or to 'group' otherwise don't render role because li will set the right semantics
      aria-labelledby={listRole ? ariaLabelledBy : undefined} // if listRole is specified, set aria-labelledby to the labelId or to undefined otherwise don't render aria-labelledby because li will set the right semantics
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
        ...sx,
      }}
      {...props}
    >
      <GroupContext.Provider value={{selectionVariant, groupHeadingId: labelId}}>
        {/* Group Heading */}
        {/* If ActionList.GroupHeading exists, render it; if not, fall back to rendering the title prop - title prop will be deprecated in v37 */}
        {slots.groupHeading
          ? slots.groupHeading
          : title && <Header title={title} variant={variant} auxiliaryText={auxiliaryText} labelId={labelId} />}
        {/* Group items */}
        {isOtherThanList ? (
          childrenWithoutSlots
        ) : (
          <Box as="ul" sx={{paddingInlineStart: 0}} aria-labelledby={ariaLabelledBy} role={role}>
            {childrenWithoutSlots}
          </Box>
        )}
      </GroupContext.Provider>
    </Box>
  )
}

export type HeaderProps = Pick<ActionListGroupProps, 'variant' | 'title' | 'auxiliaryText'> & {
  labelId: string
}

/**
 * Displays the name and description of a `Group`.
 *
 * For visual presentation only. It's hidden from screen readers.
 */
const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({variant, title, auxiliaryText, labelId, ...props}) => {
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
      borderColor: 'neutral.muted',
    }),
  }

  return (
    <Box sx={styles} role="presentation" aria-hidden="true" {...props}>
      <span id={labelId}>{title}</span>
      {auxiliaryText && <span>{auxiliaryText}</span>}
    </Box>
  )
}
