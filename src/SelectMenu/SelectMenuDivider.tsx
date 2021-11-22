import styled, {css} from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const dividerStyles = css`
  padding: ${get('space.1')} ${get('space.3')};
  margin: 0;
  font-size: ${get('fontSizes.0')};
  font-weight: ${get('fontWeights.bold')};
  color: ${get('colors.fg.muted')};
  background-color: ${get('colors.canvas.subtle')};
  border-bottom: ${get('borderWidths.1')} solid ${get('colors.border.muted')};
`

const SelectMenuDivider = styled.div<SxProp>`
  ${dividerStyles}
  ${sx};
`

SelectMenuDivider.displayName = 'SelectMenu.Divider'

export type SelectMenuDividerProps = ComponentProps<typeof SelectMenuDivider>
export default SelectMenuDivider
