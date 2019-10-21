import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {COMMON, get} from './constants'

const FilteredSearchBase = props => {
  return <div {...props}>{props.children}</div>
}

const FilteredSearch = styled(FilteredSearchBase)`
  ${COMMON};
  display: flex;
  align-items: stretch;

  .Dropdown-button {
    border-radius: 0;
    border-top-left-radius: ${get('radii.1')}px;
    border-bottom-left-radius: ${get('radii.1')}px;
  }
  .TextInput-wrapper {
    border-radius: 0;
    border-top-right-radius: ${get('radii.1')}px;
    border-bottom-right-radius: ${get('radii.1')}px;
    border-left: 0;
  }
`

FilteredSearch.defaultProps = {
  theme
}

FilteredSearch.propTypes = {
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default FilteredSearch
