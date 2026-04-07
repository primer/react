import type React from 'react'
import type {
  ActionListDescriptionProps,
  ActionListGroupHeadingProps,
  ActionListGroupProps,
  ActionListHeadingProps,
  ActionListItemProps,
  ActionListLinkItemProps,
  ActionListProps,
  ActionListTrailingActionProps,
} from '../ActionList'

export type DataActionListItemIds = {
  itemId: string
  labelId: string
  inlineDescriptionId: string
  blockDescriptionId: string
  trailingVisualId: string
}

export type DataActionListItemIndexes = {
  rowIndex: number
  itemIndex: number
  groupIndex?: number
  indexInGroup?: number
}

export type DataActionListRenderValue<Context> = React.ReactNode | ((context: Context) => React.ReactNode)

export type DataActionListDescription = {
  variant?: ActionListDescriptionProps['variant']
  truncate?: ActionListDescriptionProps['truncate']
  className?: ActionListDescriptionProps['className']
  content?: React.ReactNode
  render?: (context: DataActionListItemRenderContext) => React.ReactNode
}

export type DataActionListTrailingAction = Omit<ActionListTrailingActionProps, 'children'> & {
  render?: (context: DataActionListItemRenderContext) => React.ReactNode
}

export type DataActionListItemRow = {
  kind: 'item'
  key: string
  label: DataActionListRenderValue<DataActionListItemRenderContext>
  id?: ActionListItemProps['id']
  role?: ActionListItemProps['role']
  variant?: ActionListItemProps['variant']
  size?: ActionListItemProps['size']
  selected?: ActionListItemProps['selected']
  active?: ActionListItemProps['active']
  disabled?: ActionListItemProps['disabled']
  inactiveText?: ActionListItemProps['inactiveText']
  loading?: ActionListItemProps['loading']
  className?: ActionListItemProps['className']
  onSelect?: (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    context: DataActionListItemRenderContext,
  ) => void
  leadingVisual?: DataActionListRenderValue<DataActionListItemRenderContext>
  description?: DataActionListDescription
  trailingVisual?: DataActionListRenderValue<DataActionListItemRenderContext>
  trailingAction?: DataActionListTrailingAction
}

export type DataActionListLinkRow = {
  kind: 'link'
  key: string
  label: DataActionListRenderValue<DataActionListItemRenderContext>
  id?: string
  as?: React.ElementType
  href?: string
  download?: ActionListLinkItemProps['download']
  hrefLang?: ActionListLinkItemProps['hrefLang']
  media?: ActionListLinkItemProps['media']
  ping?: ActionListLinkItemProps['ping']
  rel?: ActionListLinkItemProps['rel']
  target?: ActionListLinkItemProps['target']
  type?: ActionListLinkItemProps['type']
  referrerPolicy?: ActionListLinkItemProps['referrerPolicy']
  variant?: ActionListLinkItemProps['variant']
  size?: ActionListLinkItemProps['size']
  active?: ActionListLinkItemProps['active']
  inactiveText?: ActionListLinkItemProps['inactiveText']
  className?: ActionListLinkItemProps['className']
  linkProps?: Record<string, unknown>
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, context: DataActionListItemRenderContext) => void
  leadingVisual?: DataActionListRenderValue<DataActionListItemRenderContext>
  description?: DataActionListDescription
  trailingVisual?: DataActionListRenderValue<DataActionListItemRenderContext>
}

export type DataActionListDividerRow = {
  kind: 'divider'
  key: string
  className?: string
  style?: React.CSSProperties
}

export type DataActionListGroupHeading = {
  as?: ActionListGroupHeadingProps['as']
  variant?: ActionListGroupHeadingProps['variant']
  auxiliaryText?: ActionListGroupHeadingProps['auxiliaryText']
  visuallyHidden?: ActionListGroupHeadingProps['visuallyHidden']
  headingWrapElement?: ActionListGroupHeadingProps['headingWrapElement']
  id?: string
  className?: string
  content?: React.ReactNode
  render?: (context: DataActionListGroupRenderContext) => React.ReactNode
}

export type DataActionListGroupRow = {
  kind: 'group'
  key: string
  rows: ReadonlyArray<DataActionListItemRow | DataActionListLinkRow | DataActionListDividerRow>
  className?: ActionListGroupProps['className']
  role?: ActionListGroupProps['role']
  selectionVariant?: ActionListGroupProps['selectionVariant']
  ariaLabel?: string
  heading?: DataActionListGroupHeading
}

export type DataActionListRow =
  | DataActionListItemRow
  | DataActionListLinkRow
  | DataActionListDividerRow
  | DataActionListGroupRow

export type DataActionListHeading = {
  as?: ActionListHeadingProps['as']
  size?: ActionListHeadingProps['size']
  visuallyHidden?: ActionListHeadingProps['visuallyHidden']
  id?: string
  className?: ActionListHeadingProps['className']
  content?: React.ReactNode
  render?: (context: DataActionListHeadingRenderContext) => React.ReactNode
}

export type DataActionListItemRenderContext = {
  item: DataActionListItemRow | DataActionListLinkRow
  indexes: DataActionListItemIndexes
  role?: ActionListItemProps['role']
  selected: boolean
  active: boolean
  disabled: boolean
  loading: boolean
  ids: DataActionListItemIds
}

export type DataActionListGroupRenderContext = {
  group: DataActionListGroupRow
  indexes: {
    rowIndex: number
    groupIndex: number
  }
  role?: ActionListProps['role']
}

export type DataActionListHeadingRenderContext = {
  role?: ActionListProps['role']
}

export type DataActionListProps = Omit<ActionListProps<'ul'>, 'children'> & {
  rows: ReadonlyArray<DataActionListRow>
  heading?: DataActionListHeading
}
