import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const FilterListBase = styled.ul<SystemCommonProps & SxProp>`
  list-style-type: none;
  ${COMMON};
  ${sx};
`

export type FilterListProps = ComponentProps<typeof FilterListBase>

const FilterList = ({children, ...rest}: React.PropsWithChildren<FilterListProps>) => {
  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <FilterListBase {...rest}>{items}</FilterListBase>
}

type StyledFilterListItemBaseProps = {
  small?: boolean
  selected?: boolean
} & SystemCommonProps &
  SxProp

const FilterListItemBase = styled.a<StyledFilterListItemBaseProps>`
  position: relative;
  display: block;
  padding: ${props => (props.small ? `${get('space.1')(props)} 10px` : `${get('space.2')(props)} 11px`)};
  margin: ${props => (props.small ? '0 0 2px' : '0 0 5px 0')};
  overflow: hidden;
  font-size: ${get('fontSizes.1')};
  color: ${props => (props.selected ? get('colors.fg.onEmphasis') : get('colors.fg.muted'))};
  background-color: ${props => (props.selected ? get('colors.accent.emphasis') : '')}!important;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${get('radii.1')};
  &:hover {
    text-decoration: none;
    background-color: ${get('colors.canvas.subtle')};
  }
  &:active {
    color: ${get('colors.fg.onEmphasis')};
    background-color: ${get('colors.accent.emphasis')};
  }
  .count {
    float: right;
    font-weight: ${get('fontWeights.bold')};
  }
  ${COMMON};
  ${sx};
`

export type FilterListItemProps = {count?: number} & ComponentProps<typeof FilterListItemBase>

function FilterListItem({children, count, ...rest}: React.PropsWithChildren<FilterListItemProps>) {
  return (
    <FilterListItemBase {...rest}>
      {count && (
        <span title="results" className="count">
          {count}
        </span>
      )}
      {children}
    </FilterListItemBase>
  )
}

FilterList.defaultProps = {
  m: 0,
  p: 0
}

FilterListItem.displayName = 'FilterList.Item'

export default Object.assign(FilterList, {Item: FilterListItem})
