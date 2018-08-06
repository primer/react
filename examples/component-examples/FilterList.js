import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, FilterList, FilterListItem} from '../../src'

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

const FilterListExample = {
  name: 'Filter List',
  element: (
    <div>
      <Block mb={3}>
        <LiveEditor code={filterListCode} scope={{FilterList, FilterListItem}} />
      </Block>
      <Block mb={3}>
        <LiveEditor code={filterListSmallCode} scope={{FilterList, FilterListItem}} />
      </Block>
    </div>
  )
}

export default FilterListExample
