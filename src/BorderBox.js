import {withSystemProps} from './system-props'
import {borders, borderColor, fontSize, borderRadius, boxShadow, themeGet} from 'styled-system'
import styled from 'styled-components'
import theme, {colors} from './theme'
import Box from './Box'

const BorderBox = styled(Box)`
 ${borders}
 ${borderColor}
 ${borderRadius}
 ${boxShadow}
`

BorderBox.defaultProps = {
    theme,
    border: '1px solid',
    borderColor: 'gray.2',
    borderRadius: 1,
}

// spread prop types here
BorderBox.propTypes = {
  ...Box.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
}

export default BorderBox
