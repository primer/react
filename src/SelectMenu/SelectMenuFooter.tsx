import styled, {css} from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const footerStyles = css`
  margin-top: -1px;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  color: ${get('colors.fg.muted')};
  text-align: center;
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.muted')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.1')} ${get('space.2')};
  }
`

const SelectMenuFooter = styled.footer<SystemCommonProps & SxProp>`
  ${footerStyles}
  ${COMMON}
  ${sx};
`

SelectMenuFooter.displayName = 'SelectMenu.Footer'

export type SelectMenuFooterProps = ComponentProps<typeof SelectMenuFooter>
export default SelectMenuFooter
