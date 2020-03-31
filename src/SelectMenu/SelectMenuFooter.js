import styled, {css} from 'styled-components'
import {COMMON, get} from '../constants'
import theme from '../theme'


const footerStyles = css`
  margin-top: -1px;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  color: ${get('colors.text.grayLight')};
  text-align: center;
  border-top: ${get('borders.1')} ${get('colors.border.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.1')} ${get('space.2')};
  }
`

const SelectMenuFooter = styled.footer`
  ${footerStyles}
  ${COMMON}
`

SelectMenuFooter.defaultProps = {
  theme
}

SelectMenuFooter.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuFooter
