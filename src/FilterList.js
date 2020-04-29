import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

function ItemBase({children, count, theme, ...rest}) {
  return (
    <a {...rest}>
      {count && (
        <span title="results" className="count">
          {count}
        </span>
      )}
      {children}
    </a>
  )
}

const Item = styled(ItemBase)`
  position: relative;
  display: block;
  padding: ${props => (props.small ? `${get('space.1')(props)} 10px` : `${get('space.2')(props)} 11px`)};
  margin: ${props => (props.small ? '0 0 2px' : '0 0 5px 0')};
  overflow: hidden;
  font-size: ${get('fontSizes.1')};
  color: ${props => (props.selected ? get('colors.white') : get('colors.gray.6'))};
  background-color: ${props => (props.selected ? get('colors.blue.5') : '')}!important;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${get('radii.1')};
  &:hover {
    text-decoration: none;
    background-color: ${get('colors.filterList.hoverBg')};
  }
  &:active {
    color: ${get('colors.white')};
    background-color: ${get('colors.blue.5')};
  }
  .count {
    float: right;
    font-weight: ${get('fontWeights.bold')};
  }
  ${COMMON}: ;
`

const FilterListBase = ({children, theme, ...rest}) => {
  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <ul {...rest}>{items}</ul>
}

const FilterList = styled(FilterListBase)`
  list-style-type: none;
  ${COMMON};
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
  theme
}

FilterList.Item.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  count: PropTypes.string,
  selected: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default FilterList
