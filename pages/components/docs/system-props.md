import {COMMON, LAYOUT, BORDER, TYPOGRAPHY, FLEX_CONTAINER, FLEX_ITEM, POSITION} from '../../../src/constants.js'
import {PropsList} from '../../doc-components'

# System Props


Primer Components utilize what we call "system props" to apply a standard set of props to each component. Using [styled-system](https://github.com/jxnblk/styled-system), groups of props are automatically applied to each component. Most components get the `COMMON` set of props which give the component access to color and space props (margin, padding, color and background color). These groups correspond to the `color` and `space` functions from `styled-system` which can be referenced in the styled system [table of style functions](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core).

To check which system props each component includes, check the documentation for that component.



### System Prop Categories

| Category       | Included Props           | styled-system docs  |
|-----|--------|--------|
| `COMMON`| <PropsList systemProps={COMMON}/>| [styled-system core docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core) |
| `TYPOGRAPHY`| <PropsList systemProps={TYPOGRAPHY}/> | [styled-system typography docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#typography) |
| `BORDER`| <PropsList systemProps={BORDER}/> | [styled-system border docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `LAYOUT` | <PropsList systemProps={LAYOUT}/>| [styled-system layout docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#layout) <br/> [styled-system misc docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `POSITION` | <PropsList systemProps={POSITION}/>| [styled-system position docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#position)
| `FLEX_CONTAINER` | <PropsList systemProps={FLEX_CONTAINER}/> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
| `FLEX_ITEM` | <PropsList systemProps={FLEX_ITEM}/> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
