import type React from 'react'
import type {SxProp} from '../../sx'
import type {HeaderProps} from './Header'
import {Header} from './Header'

/**
 * Contract for props passed to the `Group` component.
 */
export interface GroupProps extends React.ComponentPropsWithoutRef<'div'>, SxProp {
  /**
   * Props for a `Header` to render in the `Group`.
   */
  header?: HeaderProps

  /**
   * The id of the group.
   */
  groupId?: string

  /**
   * `Items` to render in the `Group`.
   */
  items?: JSX.Element[]

  /**
   * Whether to display a divider above each `Item` in this `Group` when it does not follow a `Header` or `Divider`.
   */
  showItemDividers?: boolean
}

/**
 * Collects related `Items` in an `ActionList`.
 */
export function Group({header, items, ...props}: GroupProps): JSX.Element {
  return (
    <div {...props}>
      {header && <Header {...header} />}
      {items}
    </div>
  )
}
