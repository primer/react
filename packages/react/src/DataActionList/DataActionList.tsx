import {useMemo, type ReactNode} from 'react'
import {ActionList} from '../ActionList'
import {useId} from '../hooks/useId'
import {invariant} from '../utils/invariant'
import type {
  DataActionListGroupRenderContext,
  DataActionListGroupRow,
  DataActionListItemRenderContext,
  DataActionListItemRow,
  DataActionListLinkRow,
  DataActionListProps,
  DataActionListRenderValue,
  DataActionListRow,
} from './types'

const rolesWithTrailingActionRestriction = new Set(['menu', 'menubar', 'listbox'])
const selectableItemRoles = new Set(['menuitem', 'menuitemradio', 'menuitemcheckbox', 'option'])

function sanitizeKeySegment(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9_.:-]/g, '-')
}

function resolveRenderValue<Context>(value: DataActionListRenderValue<Context>, context: Context): ReactNode {
  if (typeof value === 'function') {
    return value(context)
  }

  return value
}

function resolveSelectionVariant(
  listSelectionVariant: DataActionListProps['selectionVariant'],
  groupSelectionVariant: DataActionListGroupRow['selectionVariant'],
): DataActionListProps['selectionVariant'] | undefined {
  if (typeof groupSelectionVariant !== 'undefined') {
    return groupSelectionVariant || undefined
  }

  return listSelectionVariant
}

function inferItemRole(
  listRole: DataActionListProps['role'],
  itemRole: DataActionListItemRow['role'],
  selectionVariant: DataActionListProps['selectionVariant'] | undefined,
): DataActionListItemRow['role'] {
  if (itemRole) {
    return itemRole
  }

  if (listRole === 'listbox') {
    return selectionVariant ? 'option' : undefined
  }

  if (listRole === 'tablist') {
    return 'tab'
  }

  if (listRole === 'menu' || listRole === 'menubar') {
    if (selectionVariant === 'multiple') return 'menuitemcheckbox'
    if (selectionVariant === 'single' || selectionVariant === 'radio') return 'menuitemradio'
    return 'menuitem'
  }

  return undefined
}

type RowMetadata = {
  itemByKey: Map<string, DataActionListItemRenderContext['indexes']>
  groupByKey: Map<string, DataActionListGroupRenderContext['indexes']>
}

function collectRowMetadata(rows: ReadonlyArray<DataActionListRow>): RowMetadata {
  const seenKeys = new Set<string>()
  const itemByKey = new Map<string, DataActionListItemRenderContext['indexes']>()
  const groupByKey = new Map<string, DataActionListGroupRenderContext['indexes']>()
  let itemIndex = 0
  let groupIndex = 0

  for (const [index, row] of rows.entries()) {
    const rowPath = `rows[${index}]`
    invariant(Boolean(row.key), `DataActionList row at ${rowPath} must include a non-empty key.`)
    invariant(
      !seenKeys.has(row.key),
      `DataActionList row key "${row.key}" is duplicated. Row keys must be unique across all rows and groups.`,
    )

    seenKeys.add(row.key)

    if (row.kind === 'item' || row.kind === 'link') {
      itemByKey.set(row.key, {
        rowIndex: index,
        itemIndex,
      })
      itemIndex += 1
      continue
    }

    if (row.kind === 'group') {
      const currentGroupIndex = groupIndex
      groupByKey.set(row.key, {
        rowIndex: index,
        groupIndex: currentGroupIndex,
      })
      groupIndex += 1

      for (const [indexInGroup, groupRow] of row.rows.entries()) {
        const groupPath = `${rowPath}.rows[${indexInGroup}]`
        invariant(Boolean(groupRow.key), `DataActionList row at ${groupPath} must include a non-empty key.`)
        invariant(
          !seenKeys.has(groupRow.key),
          `DataActionList row key "${groupRow.key}" is duplicated. Row keys must be unique across all rows and groups.`,
        )

        seenKeys.add(groupRow.key)

        if (groupRow.kind === 'item' || groupRow.kind === 'link') {
          itemByKey.set(groupRow.key, {
            rowIndex: index,
            itemIndex,
            groupIndex: currentGroupIndex,
            indexInGroup,
          })
          itemIndex += 1
        }
      }
    }
  }

  return {itemByKey, groupByKey}
}

function DataActionList({
  rows,
  heading,
  selectionVariant: listSelectionVariant,
  role: listRole,
  ...actionListProps
}: DataActionListProps) {
  const listId = useId()
  const rowMetadata = useMemo(() => collectRowMetadata(rows), [rows])

  const renderActionRow = (
    item: DataActionListItemRow | DataActionListLinkRow,
    groupSelectionVariant?: DataActionListGroupRow['selectionVariant'],
  ) => {
    const indexes = rowMetadata.itemByKey.get(item.key)
    invariant(Boolean(indexes), `DataActionList item key "${item.key}" is missing row metadata.`)
    const resolvedIndexes = indexes as DataActionListItemRenderContext['indexes']

    const resolvedItemId =
      item.id ?? `${listId}--${sanitizeKeySegment(item.key) || `item-${resolvedIndexes.itemIndex}`}`
    const context: DataActionListItemRenderContext = {
      item,
      indexes: resolvedIndexes,
      role: undefined,
      selected: item.kind === 'item' ? Boolean(item.selected) : false,
      active: Boolean(item.active),
      disabled: item.kind === 'item' ? Boolean(item.disabled) : false,
      loading: item.kind === 'item' ? Boolean(item.loading) : false,
      ids: {
        itemId: resolvedItemId,
        labelId: `${resolvedItemId}--label`,
        inlineDescriptionId: `${resolvedItemId}--inline-description`,
        blockDescriptionId: `${resolvedItemId}--block-description`,
        trailingVisualId: `${resolvedItemId}--trailing-visual`,
      },
    }

    const resolvedSelectionVariant = resolveSelectionVariant(listSelectionVariant, groupSelectionVariant)
    const resolvedItemRole =
      item.kind === 'item' ? inferItemRole(listRole, item.role, resolvedSelectionVariant) : undefined
    context.role = resolvedItemRole

    const leadingVisual = item.leadingVisual ? resolveRenderValue(item.leadingVisual, context) : undefined

    const descriptionContent = item.description
      ? item.description.render
        ? item.description.render(context)
        : item.description.content
      : undefined

    const trailingVisual = item.trailingVisual ? resolveRenderValue(item.trailingVisual, context) : undefined

    if (
      item.kind === 'item' &&
      item.trailingAction &&
      (Boolean(listRole && rolesWithTrailingActionRestriction.has(listRole)) ||
        Boolean(resolvedItemRole && selectableItemRoles.has(resolvedItemRole)))
    ) {
      invariant(
        false,
        'DataActionList trailingAction is not supported in menu, menubar, or listbox semantics. Remove trailingAction for these roles.',
      )
    }

    let trailingAction: ReactNode
    if (item.kind === 'item' && item.trailingAction) {
      if (item.trailingAction.render) {
        trailingAction = item.trailingAction.render(context)
      } else {
        const trailingActionProps = {
          as: item.trailingAction.as,
          href: item.trailingAction.href,
          className: item.trailingAction.className,
          icon: item.trailingAction.icon,
          label: item.trailingAction.label,
          loading: item.trailingAction.loading,
          style: item.trailingAction.style,
        }

        if (trailingActionProps.as === 'a') {
          if (!trailingActionProps.href) {
            throw new Error('DataActionList trailingAction with as="a" must include an href value.')
          }
          trailingAction = (
            <ActionList.TrailingAction
              as="a"
              href={trailingActionProps.href}
              className={trailingActionProps.className}
              icon={trailingActionProps.icon}
              label={trailingActionProps.label}
              style={trailingActionProps.style}
            />
          )
        } else {
          trailingAction = (
            <ActionList.TrailingAction
              as="button"
              className={trailingActionProps.className}
              icon={trailingActionProps.icon}
              label={trailingActionProps.label}
              loading={trailingActionProps.loading}
              style={trailingActionProps.style}
            />
          )
        }
      }
    }

    if (item.kind === 'link') {
      const linkProps = item.linkProps ?? {}
      const linkPropsOnClick = linkProps.onClick
      const composedOnClick =
        typeof linkPropsOnClick === 'function' || item.onClick
          ? (event: React.MouseEvent<HTMLAnchorElement>) => {
              if (typeof linkPropsOnClick === 'function') {
                linkPropsOnClick(event)
              }

              item.onClick?.(event, context)
            }
          : undefined

      return (
        <ActionList.LinkItem
          key={item.key}
          as={item.as}
          id={resolvedItemId}
          {...(typeof item.href !== 'undefined' ? {href: item.href} : {})}
          download={item.download}
          hrefLang={item.hrefLang}
          media={item.media}
          ping={item.ping}
          rel={item.rel}
          target={item.target}
          type={item.type}
          referrerPolicy={item.referrerPolicy}
          variant={item.variant}
          size={item.size}
          active={item.active}
          inactiveText={item.inactiveText}
          className={item.className}
          {...linkProps}
          onClick={composedOnClick}
        >
          {leadingVisual ? <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual> : null}
          {resolveRenderValue(item.label, context)}
          {descriptionContent ? (
            <ActionList.Description
              variant={item.description?.variant}
              truncate={item.description?.truncate}
              className={item.description?.className}
            >
              {descriptionContent}
            </ActionList.Description>
          ) : null}
          {trailingVisual ? <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual> : null}
        </ActionList.LinkItem>
      )
    }

    return (
      <ActionList.Item
        key={item.key}
        id={resolvedItemId}
        role={resolvedItemRole}
        variant={item.variant}
        size={item.size}
        selected={item.selected}
        active={item.active}
        disabled={item.disabled}
        inactiveText={item.inactiveText}
        loading={item.loading}
        className={item.className}
        onSelect={
          item.onSelect
            ? event => {
                item.onSelect?.(event, context)
              }
            : undefined
        }
      >
        {leadingVisual ? <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual> : null}
        {resolveRenderValue(item.label, context)}
        {descriptionContent ? (
          <ActionList.Description
            variant={item.description?.variant}
            truncate={item.description?.truncate}
            className={item.description?.className}
          >
            {descriptionContent}
          </ActionList.Description>
        ) : null}
        {trailingVisual ? <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual> : null}
        {trailingAction}
      </ActionList.Item>
    )
  }

  const renderGroupRow = (group: DataActionListGroupRow) => {
    const indexes = rowMetadata.groupByKey.get(group.key)
    invariant(Boolean(indexes), `DataActionList group key "${group.key}" is missing row metadata.`)
    const resolvedIndexes = indexes as DataActionListGroupRenderContext['indexes']

    const isListSemantics = !listRole || listRole === 'list'
    const groupHeadingContent = group.heading
      ? group.heading.render
        ? group.heading.render({
            group,
            indexes: resolvedIndexes,
            role: listRole,
          })
        : group.heading.content
      : undefined

    return (
      <ActionList.Group
        key={group.key}
        className={group.className}
        role={group.role}
        selectionVariant={group.selectionVariant}
        aria-label={group.ariaLabel}
      >
        {groupHeadingContent ? (
          <ActionList.GroupHeading
            as={isListSemantics ? (group.heading?.as ?? 'h3') : undefined}
            variant={group.heading?.variant}
            auxiliaryText={group.heading?.auxiliaryText}
            visuallyHidden={group.heading?.visuallyHidden}
            headingWrapElement={group.heading?.headingWrapElement}
            id={group.heading?.id}
            className={group.heading?.className}
          >
            {groupHeadingContent}
          </ActionList.GroupHeading>
        ) : null}

        {group.rows.map(groupRow => {
          if (groupRow.kind === 'divider') {
            return <ActionList.Divider key={groupRow.key} className={groupRow.className} style={groupRow.style} />
          }

          return renderActionRow(groupRow, group.selectionVariant)
        })}
      </ActionList.Group>
    )
  }

  const headingContent = heading ? (heading.render ? heading.render({role: listRole}) : heading.content) : undefined
  const headingProps = heading
    ? {
        as: heading.as ?? 'h3',
        size: heading.size,
        visuallyHidden: heading.visuallyHidden,
        id: heading.id,
        className: heading.className,
      }
    : undefined

  return (
    <ActionList {...actionListProps} role={listRole} selectionVariant={listSelectionVariant}>
      {headingContent && headingProps ? (
        <ActionList.Heading {...headingProps}>{headingContent}</ActionList.Heading>
      ) : null}

      {rows.map(row => {
        if (row.kind === 'divider') {
          return <ActionList.Divider key={row.key} className={row.className} style={row.style} />
        }

        if (row.kind === 'group') {
          return renderGroupRow(row)
        }

        return renderActionRow(row)
      })}
    </ActionList>
  )
}

export {DataActionList}
