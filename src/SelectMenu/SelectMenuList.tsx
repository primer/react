import styled, {css} from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const listStyles = css`
  position: relative;
  padding: 0;
  margin: 0;
  flex: auto;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${get('colors.canvas.overlay')};
  -webkit-overflow-scrolling: touch; // Adds momentum + bouncy scrolling

  @media (hover: hover) {
    .SelectMenuTab:focus {
      background-color: ${get('colors.selectMenu.tapFocusBg')};
    }

    .SelectMenuTab:not([aria-checked='true']):hover {
      color: ${get('colors.fg.default')};
      background-color: ${get('colors.canvas.subtle')};
    }

    .SelectMenuTab:not([aria-checked='true']):active {
      color: ${get('colors.fg.default')};
      background-color: ${get('colors.canvas.subtle')};
    }
  }
`

const SelectMenuList = styled.div<SxProp>`
  ${listStyles}
  ${sx};
`

SelectMenuList.displayName = 'SelectMenu.List'

export type SelectMenuListProps = ComponentProps<typeof SelectMenuList>
export default SelectMenuList
