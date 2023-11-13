import React from 'react'
import {useId} from '../hooks/useId'
import Box from '../Box'
import {SxProp, BetterSystemStyleObject, merge} from '../sx'
import {ListContext, ActionListProps} from './List'
import {AriaRole} from '../utils/types'
import {default as Heading} from '../Heading'
import type {ActionListHeadingProps} from './Heading'
import {useSlots} from '../hooks/useSlots'
import {defaultSxProp} from '../utils/defaultSxProp'
import {warning} from '../utils/warning'

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

type ContextProps = Pick<ActionListGroupProps, 'selectionVariant'> & {groupHeadingId: string | undefined}
export const GroupContext = React.createContext<ContextProps>({
  groupHeadingId: undefined,
  selectionVariant: undefined,
})

export const Group: React.FC<React.PropsWithChildren<ActionListGroupProps>> = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  const id = useId()
  const {role: listRole} = React.useContext(ListContext)

  const [slots, childrenWithoutSlots] = useSlots(props.children, {
    groupHeading: GroupHeading,
  })

  let groupHeadingId = undefined

  // ActionList.GroupHeading
  if (slots.groupHeading) {
    // If there is an id prop passed in the ActionList.GroupHeading, use it otherwise use the generated id.
    groupHeadingId = slots.groupHeading.props.id ?? id
  }
  // Supports the deprecated `title` prop
  if (title) {
    groupHeadingId = id
  }

  return (
    <Box
      as="li"
      role={listRole ? 'none' : undefined}
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
        ...sx,
      }}
      {...props}
    >
      <GroupContext.Provider value={{selectionVariant, groupHeadingId}}>
        {title && !slots.groupHeading ? (
          <GroupHeading title={title} variant={variant} auxiliaryText={auxiliaryText} />
        ) : null}
        {!title && slots.groupHeading ? React.cloneElement(slots.groupHeading) : null}
        <Box
          as="ul"
          sx={{paddingInlineStart: 0}}
          // if listRole is set (listbox or menu), we don't label the list with the groupHeadingId
          // because the heading is hidden from the accessibility tree and only used for presentation role.
          // We will instead use aria-label to label the list. See a line below.
          aria-labelledby={listRole ? undefined : groupHeadingId}
          aria-label={listRole ? title ?? (slots.groupHeading?.props.children as string) : undefined}
          role={role || (listRole && 'group')}
        >
          {slots.groupHeading ? childrenWithoutSlots : props.children}
        </Box>
      </GroupContext.Provider>
    </Box>
  )
}

export type GroupHeadingProps = Pick<ActionListGroupProps, 'variant' | 'title' | 'auxiliaryText'> &
  Omit<ActionListHeadingProps, 'as'> &
  SxProp &
  React.HTMLAttributes<HTMLElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

/**
 * Heading of  a `Group`.
 *
 * As default, the role of ActionList is "list" and therefore group heading is rendered as a proper heading tag.
 * If the role is "listbox" or "menu" (ActionMenu), the group heading is rendered as a div with presentation role and it is
 * hidden from the accessibility tree due to the limitation of listbox children. https://w3c.github.io/aria/#listbox
 * groups under menu or listbox are labelled by `aria-label`
 */
export const GroupHeading: React.FC<React.PropsWithChildren<GroupHeadingProps>> = ({
  as,
  variant,
  title,
  auxiliaryText,
  children,
  sx = defaultSxProp,
  ...props
}) => {
  const {variant: listVariant, role: listRole} = React.useContext(ListContext)
  const {groupHeadingId} = React.useContext(GroupContext)
  // for list role, the headings are proper heading tags, for menu and listbox, they are just representational and divs
  warning(
    listRole === undefined && children !== undefined && as === undefined,
    `You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.`,
  )

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
    <>
      {listRole ? (
        <Box sx={styles} role="presentation" aria-hidden="true" {...props}>
          <span id={groupHeadingId}>{title ?? children}</span>
          {auxiliaryText && <span>{auxiliaryText}</span>}
        </Box>
      ) : (
        <>
          <Heading as={as || 'h3'} id={groupHeadingId} sx={merge<BetterSystemStyleObject>(styles, sx)} {...props}>
            {title ?? children}
          </Heading>
          {auxiliaryText && <span>{auxiliaryText}</span>}
        </>
      )}
    </>
  )
}
