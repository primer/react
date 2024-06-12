import styled from 'styled-components'
import type {SxProp} from '../../sx'
import sx from '../../sx'

/**
 * Provides an unstyled button that can be styled as-needed for components
 */
export const Button = styled.button<SxProp>`
  padding: 0;
  border: 0;
  margin: 0;
  display: inline-flex;
  padding: 0;
  border: 0;
  appearance: none;
  background: none;
  cursor: pointer;
  text-align: start;
  font: inherit;
  color: inherit;
  align-items: center;

  &::-moz-focus-inner {
    border: 0;
  }

  ${sx}
`
