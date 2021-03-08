import styled, {css} from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const listStyles = css`
  position: relative;
  padding: 0;
  margin: 0;
  flex: auto;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${get('colors.bg.overlay')};
  -webkit-overflow-scrolling: touch; // Adds momentum + bouncy scrolling

  @media (hover: hover) {
    .SelectMenuTab:focus {
      background-color: ${get('colors.selectMenu.tapFocusBg')};
    }

    .SelectMenuTab:not([aria-checked='true']):hover {
      color: ${get('colors.text.primary')};
      background-color: ${get('colors.bg.tertiary')};
    }

    .SelectMenuTab:not([aria-checked='true']):active {
      color: ${get('colors.text.primary')};
      background-color: ${get('colors.bg.tertiary')};
    }
  }
`

const SelectMenuList = styled.div<SystemCommonProps & SxProp>`
  ${listStyles}
  ${COMMON}
  ${sx};
`

SelectMenuList.displayName = 'SelectMenu.List'

export type SelectMenuListProps = ComponentProps<typeof SelectMenuList>
export default SelectMenuList
