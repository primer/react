import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {COMMON, get} from './constants'

const FilteredSearch = styled.div`
  ${COMMON};
  display: flex;
  align-items: stretch;

  summary {
    border-radius: 0;
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-right: 0;
  }
  .TextInput-wrapper {
    border-radius: 0;
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
    z-index: 1; // Allows the focus outline to show on top of the dropdown.
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
