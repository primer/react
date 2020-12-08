import styled, {css} from 'styled-components'
import {COMMON, get} from '../constants'
import theme from '../theme'
import sx from '../sx'

const footerStyles = css`
  margin-top: -1px;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  color: ${get('colors.text.grayLight')};
  text-align: center;
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.1')} ${get('space.2')};
  }
`

const SelectMenuFooter = styled.footer`
  ${footerStyles}
  ${COMMON}
  ${sx};
`

SelectMenuFooter.defaultProps = {
  theme,
}

SelectMenuFooter.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
}

SelectMenuFooter.displayName = 'SelectMenu.Footer'

export default SelectMenuFooter
