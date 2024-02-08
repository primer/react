import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import {ComponentProps} from '../utils/types'

const ButtonGroup = styled.div`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  && > [type='button'],
  /* this specific selection is required to cover for tooltip. Because the buttons are wrapped with the tooltip span */
  && > span[role='tooltip'] > [type='button'] {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  && > [type='button']:first-child,
  && > span[role='tooltip']:first-of-type > [type='button'] {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  && > [type='button']:last-of-type,
  && > span[role='tooltip']:last-of-type > [type='button'] {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  ${sx};
`

export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>
export default ButtonGroup
