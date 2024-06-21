import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import type {ActionListGroupProps} from './Group'
import {GroupContext} from './Group'
import {type ActionListProps, type ActionListItemProps, ListContext} from './shared'
import {LeadingVisualContainer} from './Visuals'
import Box from '../Box'

type SelectionProps = Pick<ActionListItemProps, 'selected'>
export const Selection: React.FC<React.PropsWithChildren<SelectionProps>> = ({selected}) => {
  const {selectionVariant: listSelectionVariant, role: listRole} = React.useContext(ListContext)
  const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)

  /** selectionVariant in Group can override the selectionVariant in List root */
  /** fallback to selectionVariant from container menu if any (ActionMenu, SelectPanel ) */
  let selectionVariant: ActionListProps['selectionVariant'] | ActionListGroupProps['selectionVariant']
  if (typeof groupSelectionVariant !== 'undefined') selectionVariant = groupSelectionVariant
  else selectionVariant = listSelectionVariant

  if (!selectionVariant) {
    // if selectionVariant is not set on List, but Item is selected
    // fail loudly instead of silently ignoring
    if (selected) {
      throw new Error(
        'For Item to be selected, ActionList or ActionList.Group needs to have a selectionVariant defined',
      )
    } else {
      return null
    }
  }

  if (selectionVariant === 'single' || listRole === 'menu') {
    return (
      <LeadingVisualContainer data-component="ActionList.Selection">{selected && <CheckIcon />}</LeadingVisualContainer>
    )
  }

  /**
   * selectionVariant is multiple
   * we use a styled div instead of an input because there should not
   * be an interactive element inside an option
   */
  const checkmarkIn = {
    from: {
      clipPath: 'inset(var(--base-size-16, 16px) 0 0 0)',
    },

    to: {
      clipPath: 'inset(0 0 0 0)',
    },
  }

  const checkmarkOut = {
    from: {
      clipPath: 'inset(0 0 0 0)',
    },

    to: {
      clipPath: 'inset(var(--base-size-16, 16px) 0 0 0)',
    },
  }

  return (
    <LeadingVisualContainer data-component="ActionList.Selection">
      <Box
        sx={{
          borderColor: selected ? 'accent.fg' : 'neutral.emphasis',
          borderStyle: 'solid',
          borderWidth: '1',
          borderRadius: '1',
          cursor: 'pointer',
          display: 'grid',
          height: 'var(--base-size-16, 16px)',
          margin: '0',
          placeContent: 'center',
          width: 'var(--base-size-16, 16px)',
          backgroundColor: selected ? 'accent.fg' : 'canvas.default',
          transition: selected
            ? 'background-color, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1)'
            : 'background-color, border-color 80ms cubic-bezier(0.32, 0, 0.67, 0) 0ms',
          '::before': {
            width: 'var(--base-size-16, 16px)',
            height: 'var(--base-size-16, 16px)',
            visibility: selected ? 'visible' : 'hidden',
            content: '""',
            backgroundColor: 'fg.onEmphasis',
            transition: selected ? 'visibility 0s linear 0s' : 'visibility 0s linear 230ms',
            clipPath: 'inset(var(--base-size-16, 16px) 0 0 0)',
            maskImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzgwMyAwLjIxOTYyNUMxMS45MjEgMC4zNjA0MjcgMTIgMC41NTEzMDUgMTIgMC43NTAzMTNDMTIgMC45NDkzMjEgMTEuOTIxIDEuMTQwMTkgMTEuNzgwMyAxLjI4MUw0LjUxODYgOC41NDA0MkM0LjM3Nzc1IDguNjgxIDQuMTg2ODIgOC43NiAzLjk4Nzc0IDguNzZDMy43ODg2NyA4Ljc2IDMuNTk3NzMgOC42ODEgMy40NTY4OSA4LjU0MDQyTDAuMjAxNjIyIDUuMjg2MkMwLjA2ODkyNzcgNS4xNDM4MyAtMC4wMDMzMDkwNSA0Ljk1NTU1IDAuMDAwMTE2NDkzIDQuNzYwOThDMC4wMDM1NTIwNSA0LjU2NjQzIDAuMDgyMzg5NCA0LjM4MDgxIDAuMjIwMDMyIDQuMjQzMjFDMC4zNTc2NjUgNC4xMDU2MiAwLjU0MzM1NSA0LjAyNjgxIDAuNzM3OTcgNC4wMjMzOEMwLjkzMjU4NCA0LjAxOTk0IDEuMTIwOTMgNC4wOTIxNyAxLjI2MzM0IDQuMjI0ODJMMy45ODc3NCA2Ljk0ODM1TDEwLjcxODYgMC4yMTk2MjVDMTAuODU5NSAwLjA3ODk5MjMgMTEuMDUwNCAwIDExLjI0OTUgMEMxMS40NDg1IDAgMTEuNjM5NSAwLjA3ODk5MjMgMTEuNzgwMyAwLjIxOTYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=')",
            maskSize: '75%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            animation: selected
              ? 'checkmarkIn 80ms cubic-bezier(0.65, 0, 0.35, 1) forwards 80ms'
              : 'checkmarkOut 80ms cubic-bezier(0.65, 0, 0.35, 1) forwards',
            '@keyframes checkmarkIn': checkmarkIn,
            '@keyframes checkmarkOut': checkmarkOut,
          },
        }}
        data-component="ActionList.Checkbox"
      />
    </LeadingVisualContainer>
  )
}
