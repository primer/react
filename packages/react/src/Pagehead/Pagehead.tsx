import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

/**
 * Pagehead denotes the title and start of a given section.
 * @primerid pagehead
 * @primerstatus alpha
 * @primera11yreviewed false
 */
const Pagehead = styled.div<SxProp>`
  position: relative;
  padding-top: ${get('space.4')};
  padding-bottom: ${get('space.4')};
  margin-bottom: ${get('space.4')};
  border-bottom: 1px solid ${get('colors.border.default')};
  ${sx};
`

export type PageheadProps = ComponentProps<typeof Pagehead>
export default Pagehead
