import React from 'react'
import nanoid from 'nanoid'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

const Count = ({count, ...rest}) => <span {...rest} title="results">{count}</span>
const StyledCount = styled(Count)`
  float: right;
  font-weight: ${get('fontWeights.bold')};
`

function ItemBase({children, count, theme, is: Tag, ...rest}) {
  return (
    <a key={nanoid()} {...rest}>
      {count && <StyledCount count={count}/>}
      {children}
    </a>
  )
}

const Item = styled(ItemBase)`
  position: relative;
  display: block;
  padding: ${get('space.2')}px 10px;
  margin-bottom: 5px;
  overflow: hidden;
  font-size: ${get('fontSizes.1')}px;
  color: ${props => props.selected ? get('colors.white') : get('colors.gray.6')};
  background-color: ${props => props.selected ? get('colors.blue.5') : ''}!important;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${get('radii.1')}px;
  &:hover {
    text-decoration: none;
    background-color: ${get('colors.filterList.hoverBg')};
  }
  ${COMMON};
`

const FilterListBase = ({children, theme, ...rest}) => {
  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <ul {...rest}>{items}</ul>
}

const FilterList = styled(FilterListBase)`
  list-style-type: none;
  ${COMMON}
`

FilterList.defaultProps = {
  theme,
  m: 0,
  p: 0
}

FilterList.propTypes = {
  children: PropTypes.node,
  small: PropTypes.bool,
  ...COMMON.propTypes
}

FilterList.Item = Item

FilterList.Item.defaultProps = {
  theme,
  is: 'a'
}

FilterList.Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default FilterList
