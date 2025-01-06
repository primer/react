import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'

/**
 * @deprecated A new filter component is in progress.
 * Until the new filter component is ready, you can use Button + TextInput + ActionList to reproduce this pattern.
 */
const FilteredSearch = styled.div<SxProp>`
  display: flex;
  align-items: stretch;

  summary,
  > button {
    border-radius: 0;
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-right: 0;
  }
  .TextInput-wrapper {
    border-radius: 0;
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  ${sx}
`

export type FilteredSearchProps = ComponentProps<typeof FilteredSearch>
export default FilteredSearch
