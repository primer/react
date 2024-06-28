import React from 'react'
import {useId} from '../hooks/useId'
import Box from '../Box'
import type {SxProp, BetterSystemStyleObject} from '../sx'
import {merge} from '../sx'
import {ListContext, type ActionListProps} from './shared'
import type {AriaRole} from '../utils/types'
import {default as Heading} from '../Heading'
import type {ActionListHeadingProps} from './Heading'
import {useSlots} from '../hooks/useSlots'
import {defaultSxProp} from '../utils/defaultSxProp'
import {invariant} from '../utils/invariant'

export type ActionListGroupProps = {
  /**
   * Style variations. Usage is discretionary.
   *
   * - `"filled"` - Superimposed on a background, offset from nearby content
   * - `"subtle"` - Relatively less offset from nearby content
   */
  variant?: 'subtle' | 'filled'
  /**
   * @deprecated (Use `ActionList.GroupHeading` instead. i.e. <ActionList.Group title="Group title"> → <ActionList.GroupHeading>Group title</ActionList.GroupHeading>)
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
          // Escape hatch: supports old API <ActionList.Group title="group title"> in a non breaking way
          <GroupHeading variant={variant} auxiliaryText={auxiliaryText} _internalBackwardCompatibleTitle={title} />
        ) : null}
        {/* Supports new API ActionList.GroupHeading */}
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

export type GroupHeadingProps = Pick<ActionListGroupProps, 'variant' | 'auxiliaryText'> &
  Omit<ActionListHeadingProps, 'as'> &
  SxProp &
  React.HTMLAttributes<HTMLElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    _internalBackwardCompatibleTitle?: string
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
  // We are not recommending this prop to be used, it should only be used internally for incremental rollout.
  _internalBackwardCompatibleTitle,
  auxiliaryText,
  children,
  sx = defaultSxProp,
  ...props
}) => {
  const {variant: listVariant, role: listRole} = React.useContext(ListContext)
  const {groupHeadingId} = React.useContext(GroupContext)
  // for list role, the headings are proper heading tags, for menu and listbox, they are just representational and divs
  const missingAsForList = (listRole === undefined || listRole === 'list') && children !== undefined && as === undefined
  const unnecessaryAsForListboxOrMenu =
    listRole !== undefined && listRole !== 'list' && children !== undefined && as !== undefined
  invariant(
    // 'as' prop is required for list roles. <GroupHeading as="h2">...</GroupHeading>
    !missingAsForList,
    `You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.`,
  )

  invariant(
    // 'as' prop on listbox or menu roles are not needed since they are rendered as divs and they could be misleading.
    !unnecessaryAsForListboxOrMenu,
    `Looks like you are trying to set a heading level to a ${listRole} role. Group headings for ${listRole} type action lists are for representational purposes, and rendered as divs. Therefore they don't need a heading level.`,
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
      {/* for listbox (SelectPanel) and menu (ActionMenu) roles, group titles are presentational. */}
      {listRole && listRole !== 'list' ? (
        <Box sx={styles} role="presentation" aria-hidden="true" {...props}>
          <span id={groupHeadingId}>{_internalBackwardCompatibleTitle ?? children}</span>
          {auxiliaryText && <span>{auxiliaryText}</span>}
        </Box>
      ) : (
        // for explicit (role="list" is passed as prop) and implicit list roles (ActionList ins rendered as list by default), group titles are proper heading tags.
        <>
          <Heading as={as || 'h3'} id={groupHeadingId} sx={merge<BetterSystemStyleObject>(styles, sx)} {...props}>
            {_internalBackwardCompatibleTitle ?? children}
          </Heading>
          {auxiliaryText && <span>{auxiliaryText}</span>}
        </>
      )}
    </>
  )
}
