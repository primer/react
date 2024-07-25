import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

/**
 * Button group renders a series of buttons.
 * @primerid button_group
 * @primerstatus alpha
 * @primera11yreviewed false
 */
const ButtonGroup = styled.div`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  && > *:not([data-loading-wrapper]) {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :first-child {
      border-top-left-radius: ${get('radii.2')};
      border-bottom-left-radius: ${get('radii.2')};
    }

    :last-child {
      border-top-right-radius: ${get('radii.2')};
      border-bottom-right-radius: ${get('radii.2')};
    }

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  // if child is loading button
  [data-loading-wrapper] {
    :first-child {
      button,
      a {
        border-top-left-radius: ${get('radii.2')};
        border-bottom-left-radius: ${get('radii.2')};
      }
    }

    :last-child {
      button,
      a {
        border-top-right-radius: ${get('radii.2')};
        border-bottom-right-radius: ${get('radii.2')};
      }
    }
  }

  [data-loading-wrapper] > * {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  ${sx};
`

// TODO: figure out how we can show available `div` props in the docs without
// having to manually add them and then omit them from `ComponentProps`
export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>
export default ButtonGroup
