import {
  color,
  space,
  display,
  size,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  overflow,
  verticalAlign
} from 'styled-system'
import styled from 'styled-components'

const Box = styled.div`
 ${color}
 ${space}
 ${display}
 ${size}
 ${width}
 ${height}
 ${minWidth}
 ${minHeight}
 ${maxWidth}
 ${maxHeight}
 ${overflow}
 ${verticalAlign}
`

Box.propTypes = {
  ...color.propTypes,
  ...space.propTypes,
  ...display.propTypes,
  ...size.propTypes,
  ...width.propTypes,
  ...height.propTypes,
  ...minWidth.propTypes,
  ...minHeight.propTypes,
  ...maxWidth.propTypes,
  ...maxHeight.propTypes,
  ...overflow.propTypes,
  ...verticalAlign.propTypes
}

export default Box
