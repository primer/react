import {COMMON_LIST, LAYOUT_LIST, BORDER_LIST, TYPOGRAPHY_LIST, FLEX_CONTAINER_LIST, FLEX_ITEM_LIST, POSITION_LIST} from '../../../src/constants.js'
import {PropsList} from '../../doc-components'

# System Props


Primer Components utilize what we call "system props" to apply a standard set of props to each component. Using [styled-system](https://github.com/jxnblk/styled-system), groups of props are automatically applied to each component. Most components get the `COMMON` set of props which give the component access to color and space props (margin, padding, color and background color). These groups correspond to the `color` and `space` functions from `styled-system` which can be referenced in the styled system [table of style functions](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core).

To check which system props each component includes, check the documentation for that component.



### System Prop Categories

| Category       | Included Props           | styled-system docs  |
|-----|--------|--------|
| `COMMON`| <PropsList systemProps={COMMON_LIST}/>| [styled-system core docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core) |
| `TYPOGRAPHY`| <PropsList systemProps={TYPOGRAPHY_LIST}/> | [styled-system typography docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#typography) |
| `BORDER`| <PropsList systemProps={BORDER_LIST}/> | [styled-system border docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `LAYOUT` | <PropsList systemProps={LAYOUT_LIST}/>| [styled-system layout docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#layout) <br/> [styled-system misc docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `POSITION` | <PropsList systemProps={POSITION_LIST}/>| [styled-system position docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#position)
| `FLEX_CONTAINER` | <PropsList systemProps={FLEX_CONTAINER_LIST}/> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
| `FLEX_ITEM` | <PropsList systemProps={FLEX_ITEM_LIST}/> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
