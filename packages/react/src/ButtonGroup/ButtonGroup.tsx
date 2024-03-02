import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const ButtonGroup = styled.div`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  /* apply these styles to all buttons and links under the group */
  && :is(button, a) {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  /* apply the top left and bottom left border styles to the first button or link element (covers elements that use tooltip v2 as well ) */
  && > :first-child:is(button, a),
  /* This is needed to select the first button or link element if they are using tooltip v1 */
  && > span[role='tooltip']:first-of-type > :is(button, a) {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  /* apply the top right and bottom right border styles to the last button or link element  */
  && > :last-child:is(button, a),
  /* This is needed to select the last button or link element if they are using tooltip v2 */
  && > :nth-last-child(2):has(+ div[popover='auto']),
  /* This is needed to select the last button or link element if they are using tooltip v1 */
  && > span[role='tooltip']:last-of-type > :is(button, a) {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  ${sx};
`

export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>
export default ButtonGroup
