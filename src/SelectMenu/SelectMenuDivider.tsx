import styled, {css} from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ForwardRefComponent} from '../utils/polymorphic'

const defaultElement = 'div'

export type SelectMenuDividerProps = SystemCommonProps & SxProp

type SelectMenuDividerComponent = ForwardRefComponent<typeof defaultElement, SelectMenuDividerProps>

const dividerStyles = css`
  padding: ${get('space.1')} ${get('space.3')};
  margin: 0;
  font-size: ${get('fontSizes.0')};
  font-weight: ${get('fontWeights.bold')};
  color: ${get('colors.text.tertiary')};
  background-color: ${get('colors.bg.tertiary')};
  border-bottom: ${get('borderWidths.1')} solid ${get('colors.selectMenu.borderSecondary')};
`

const SelectMenuDivider = styled(defaultElement)<SelectMenuDividerProps>`
  ${dividerStyles}
  ${COMMON}
  ${sx};
` as SelectMenuDividerComponent

SelectMenuDivider.displayName = 'SelectMenu.Divider'

export default SelectMenuDivider
