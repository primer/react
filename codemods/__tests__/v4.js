import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import v4 from '../v4'

defineInlineTest(
  v4,
  {},
  `
import {FlexContainer, FlexItem} from '@primer/components'
export default () => (
  <FlexContainer>
    <FlexItem />
  </FlexContainer>
)
`.trim(),
  `
import {Flex} from '@primer/components'
export default () => (
  <Flex>
    <Flex.Item />
  </Flex>
)
`.trim(),
  'v4',
)

defineInlineTest(
  v4,
  {},
  `
import {UnderlineNav, UnderlineNavItem} from '@primer/components'
export default () => (
  <UnderlineNav>
    <UnderlineNavItem />
  </UnderlineNav>
)
`.trim(),
  `
import {UnderlineNav} from '@primer/components'
export default () => (
  <UnderlineNav>
    <UnderlineNav.Item />
  </UnderlineNav>
)
`.trim(),
  'v4',
)

defineInlineTest(
  v4,
  {},
  `
import {FilterList, FilterListItem} from '@primer/components'
export default () => (
  <FilterList>
    <FilterListItem />
  </FilterList>
)
`.trim(),
  `
import {FilterList} from '@primer/components'
export default () => (
  <FilterList>
    <FilterList.Item />
  </FilterList>
)
`.trim(),
  'v4',
)
