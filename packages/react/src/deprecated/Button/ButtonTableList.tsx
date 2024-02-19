import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'

const ButtonTableList = styled.summary<SxProp>`
  display: inline-block;
  padding: 0;
  font-size: ${get('fontSizes.1')};
  color: ${get('colors.fg.muted')};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 0;
  appearance: none; // Corrects inability to style clickable input types in iOS.

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    &,
    &:hover {
      color: ${get('colors.primer.fg.disabled')};
      cursor: default;
    }
  }

  &:after {
    display: inline-block;
    margin-left: ${get('space.1')};
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: '';
    border: 4px solid transparent;
    border-top-color: currentcolor;
  }
  ${sx};
`

export type ButtonTableListProps = ComponentProps<typeof ButtonTableList>
export default ButtonTableList
