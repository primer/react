import React, {useContext} from 'react'
import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import SelectMenuItem from './SelectMenuItem'
import PropTypes from 'prop-types'
import theme from './theme'
import {MenuContext} from './SelectMenuModal'
import uuid from 'uuid'

const List = ({items, hasTabs}) => {
  const menuContext = useContext(MenuContext);
  if (!hasTabs) {
    menuContext.setItems(items)
  }
  const itemSource = menuContext.isFiltering ? menuContext.results : menuContext.items
  return (
    <>
      {itemSource.map(item => {
        return <SelectMenuItem key={uuid()} href={item.url}>{item.title}</SelectMenuItem>
      })}
    </>
  )
}

const SelectMenuList = styled(List)`
  ${listStyles}
`
SelectMenuList.defaultProps = {
  theme,
  hasTabs: false
}

SelectMenuList.propTypes = {
  hasTabs: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({title: PropTypes.string, url: PropTypes.string}))
}

export default SelectMenuList
