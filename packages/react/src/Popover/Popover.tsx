import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledPopoverProps = {
  relative?: boolean
  open?: boolean
} & SxProp

const Popover = styled.div.attrs<StyledPopoverProps>(({className}) => {
  return {
    className,
  }
})<StyledPopoverProps>`
  position: ${props => (props.relative ? 'relative' : 'absolute')};
  z-index: 100;
  display: ${props => (props.open ? 'block' : 'none')};
  ${sx};
`

const PopoverContent = styled.div<SxProp>`
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  position: relative;
  width: 232px;
  margin-right: auto;
  margin-left: auto;
  padding: ${get('space.4')};
  background-color: ${get('colors.canvas.overlay')};
  ${sx};
`

PopoverContent.displayName = 'Popover.Content'

export type PopoverProps = ComponentProps<typeof Popover>
export type PopoverContentProps = ComponentProps<typeof PopoverContent>
export default Object.assign(Popover, {Content: PopoverContent})
