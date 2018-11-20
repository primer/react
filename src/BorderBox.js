import {withSystemProps} from './system-props'
import {borders, borderColor, fontSize, borderRadius, boxShadow, themeGet} from 'styled-system'
import styled from 'styled-components'
import theme, {colors} from './theme'
import Box from './Box'

const BorderBox = styled(Box)`
 border: ${themeGet('borders.1'), theme.borders[1]};
 border-color: ${themeGet('colors.gray.2', colors.gray[2])};
 border-radius: ${themeGet('radii.1', `${theme.radii[1]}px`)}
 ${borders}
 ${borderColor}
 ${borderRadius}
 ${boxShadow}
`

// spread prop types here
BorderBox.propTypes = {
  ...Box.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...boxShadow.propTypes,
}

export default BorderBox
