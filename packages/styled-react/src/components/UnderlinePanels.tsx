import {
  UnderlinePanels as PrimerUnderlinePanels,
  type UnderlinePanelsProps as PrimerUnderlinePanelsProps,
  type UnderlinePanelsPanelProps,
  type UnderlinePanelsTabProps,
} from '@primer/react/experimental'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'

type UnderlinePanelsProps = PrimerUnderlinePanelsProps & SxProp

const StyledUnderlinePanels = styled(PrimerUnderlinePanels).withConfig<UnderlinePanelsProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

// @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
const UnderlinePanelsImpl = ({as, ...props}: UnderlinePanelsProps) => (
  <StyledUnderlinePanels forwardedAs={as} {...props} />
)

UnderlinePanelsImpl.displayName = 'UnderlinePanels'

const UnderlinePanels = Object.assign(UnderlinePanelsImpl, {
  Tab: PrimerUnderlinePanels.Tab,
  Panel: PrimerUnderlinePanels.Panel,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
UnderlinePanelsImpl.__SLOT__ = PrimerUnderlinePanels.__SLOT__

export {UnderlinePanels, type UnderlinePanelsProps, type UnderlinePanelsTabProps, type UnderlinePanelsPanelProps}
