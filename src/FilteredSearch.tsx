import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const FilteredSearch = styled.div<SystemCommonProps & SxProp>`
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

  ${sx}
`

export type FilteredSearchProps = ComponentProps<typeof FilteredSearch>
export default FilteredSearch
