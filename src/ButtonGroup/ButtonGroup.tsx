import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import {ComponentProps} from '../utils/types'

const ButtonGroup = styled.div`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  && > button {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :first-of-type {
      border-top-left-radius: ${get('radii.2')};
      border-bottom-left-radius: ${get('radii.2')};
    }

    :last-of-type {
      border-top-right-radius: ${get('radii.2')};
      border-bottom-right-radius: ${get('radii.2')};
    }

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  && > span {
    & > button {
      margin-inline-end: -1px;
      position: relative;
      border-radius: 0;

      :focus,
      :active,
      :hover {
        z-index: 1;
      }
    }

    :first-of-type > button {
      border-top-left-radius: ${get('radii.2')};
      border-bottom-left-radius: ${get('radii.2')};
    }

    :last-of-type > button {
      border-top-right-radius: ${get('radii.2')};
      border-bottom-right-radius: ${get('radii.2')};
    }
  }

  ${sx};
`

export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>
export default ButtonGroup
