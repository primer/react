import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import {ComponentProps} from '../utils/types'

const ButtonGroup = styled.div`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  && > button,
  /* this specific selection is required to cover for tooltip. Because the buttons are wrapped with the tooltip span */
  && > span > button {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  && > button:first-of-type,
  && > span:first-of-type > button {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  && > button:last-of-type,
  && > span:last-of-type > button {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  ${sx};
`

export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>
export default ButtonGroup
