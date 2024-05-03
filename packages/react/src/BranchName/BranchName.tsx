import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const BranchName = styled.a<SxProp>`
  display: inline-block;
  padding: 2px 6px;
  font-size: var(--text-body-size-small, ${get('fontSizes.0')});
  font-family: var(--fontStack-monospace, ${get('fonts.mono')});
  color: var(--fgColor-link, ${get('colors.accent.fg')});
  background-color: var(--bgColor-accent-muted, ${get('colors.accent.subtle')});
  border-radius: var(--borderRadius-medium, ${get('radii.2')});
  text-decoration: none;
  &:is(:not(a)) {
    color: var(--fgColor-muted);
  }
  ${sx};
`

export type BranchNameProps = ComponentProps<typeof BranchName>
export default BranchName
