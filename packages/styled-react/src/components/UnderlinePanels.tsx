import {
  UnderlinePanels as PrimerUnderlinePanels,
  type UnderlinePanelsProps as PrimerUnderlinePanelsProps,
  type UnderlinePanelsPanelProps as PrimerUnderlinePanelsPanelProps,
  type UnderlinePanelsTabProps as PrimerUnderlinePanelsTabProps,
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

type UnderlinePanelsPanelProps = PrimerUnderlinePanelsPanelProps & SxProp

const StyledUnderlinePanelsPanel = styled(PrimerUnderlinePanels.Panel).withConfig<UnderlinePanelsPanelProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

// @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
const UnderlinePanelsPanel = ({as, ...props}: UnderlinePanelsPanelProps) => {
  return <StyledUnderlinePanelsPanel forwardedAs={as} {...props} />
}

UnderlinePanelsPanel.displayName = 'UnderlinePanels.Panel'

type UnderlinePanelsTabProps = PrimerUnderlinePanelsTabProps & SxProp

const StyledUnderlinePanelsTab = styled(PrimerUnderlinePanels.Tab).withConfig<UnderlinePanelsTabProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`
// @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
const UnderlinePanelsTab = ({as, ...props}: UnderlinePanelsTabProps) => (
  <StyledUnderlinePanelsTab forwardedAs={as} {...props} />
)

UnderlinePanelsTab.displayName = 'UnderlinePanels.Tab'

const UnderlinePanels = Object.assign(UnderlinePanelsImpl, {
  Tab: UnderlinePanelsTab,
  Panel: UnderlinePanelsPanel,
})

export {UnderlinePanels, type UnderlinePanelsProps, type UnderlinePanelsTabProps, type UnderlinePanelsPanelProps}
