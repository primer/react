import {withSystemProps} from './system-props'
import {borders, borderColor, fontSize, borderRadius, boxShadow} from 'styled-system'
import styled from 'styled-components'
import theme, {colors} from './theme'
import Box from './Box'

const BorderBox = styled(Box)`
 ${borders}
 ${borderColor}
 ${borderRadius}
 ${boxShadow}
`

// set default props in defaultProps instead of in call to withSystemProps
BorderBox.defaultProps = {
  border: theme.borders[1],
  borderColor: colors.gray[2],
  borderRadius: theme.radii[1],
  theme // set our theme to the default if no theme is provided
}

// spread prop types here
BorderBox.propTypes = {
  ...Box.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
}

export default BorderBox
