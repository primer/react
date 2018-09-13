# System Props


Primer Components utilize what we call "system props" to apply a standard set of props to each component. Using [styled-system](https://github.com/jxnblk/styled-system), groups of props are automatically applied to each component. Most components get the `COMMON` set of props which give the component access to color and space props (margin, padding, color and background color). These groups correspond to the `color` and `space` functions from `styled-system` which can be referenced in the styled system [table of style functions](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core).

To check which system props each component includes, check the documentation for that component.

### System Prop Categories

| Category       | Included Props           | styled-system docs  |
|-----|--------|--------|
| `COMMON`| space, color | [styled-system core docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#core) |
| `TYPOGRAPHY`| fontFamily, fontSize, fontWeight, lineHeight & all `COMMON` props | [styled-system typography docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#typography) |
| `LAYOUT` | borders, borderColor, borderRadius, boxShadow, <br/> display, size, width, height, minWidth, minHeight, <br/> maxWidth, maxHeight, verticalAlign & all `COMMON` props      | [styled-system layout docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#layout) <br/> [styled-system misc docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#misc) |
| `POSITION` | position, zIndex, top, right, bottom, left | [styled-system position docs](https://github.com/jxnblk/styled-system/blob/master/docs/table.md#position)
