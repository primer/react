import {printProps, COMMON, LAYOUT, TYPOGRAPHY, FLEX_CONTAINER, FLEX_ITEM, POSITION} from '../../../src/system-props.js'
import {Text} from '../../..'

# System Props


Primer Components utilize what we call "system props" to apply a standard set of props to each component. Using [styled-system](https://github.com/jxnblk/styled-system), groups of props are automatically applied to each component. Most components get the `COMMON` set of props which give the component access to color and space props (margin, padding, color and background color). These groups correspond to the `color` and `space` functions from `styled-system` which can be referenced in the styled system [table of style functions](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core).

To check which system props each component includes, check the documentation for that component.



### System Prop Categories

| Category       | Included Props           | styled-system docs  |
|-----|--------|--------|
| `COMMON`| <Text children={printProps(COMMON)} /> | [styled-system core docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core) |
| `TYPOGRAPHY`| <Text children={printProps(TYPOGRAPHY)} /> | [styled-system typography docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#typography) |
| `LAYOUT` | <Text children={printProps(LAYOUT)} /> | [styled-system layout docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#layout) <br/> [styled-system misc docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `POSITION` | <Text children={printProps(POSITION)} />| [styled-system position docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#position)
| `FLEX_CONTAINER` | <Text children={printProps(FLEX_CONTAINER)} /> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
| `FLEX_ITEM` | <Text children={printProps(FLEX_ITEM)} /> | [styled-system flexbox docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#flexbox) |
