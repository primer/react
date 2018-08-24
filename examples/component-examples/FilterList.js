import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, FilterList, FilterListItem} from '../../src'

const filterListCode = `<FilterList>
  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>
  <FilterListItem count='2' href='#bar'>Second Filter</FilterListItem>
  <FilterListItem href='#baz'>Third Filter</FilterListItem>
</FilterList>
`

const filterListSmallCode = `<FilterList small>
  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>
  <FilterListItem href='#bar'>Second Filter</FilterListItem>
  <FilterListItem href='#baz'>Third Filter</FilterListItem>
</FilterList>
`

export default {
  name: 'Filter List',
  element: (
    <div>
      <Box mb={3}>
        <LiveEditor code={filterListCode} scope={{FilterList, FilterListItem}} />
      </Box>
      <Box mb={3}>
        <LiveEditor code={filterListSmallCode} scope={{FilterList, FilterListItem}} />
      </Box>
    </div>
  )
}
