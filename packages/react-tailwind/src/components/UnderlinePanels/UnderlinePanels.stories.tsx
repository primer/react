import {UnderlinePanels} from './UnderlinePanels'
export default {title: 'Navigation/UnderlinePanels', component: UnderlinePanels}
export const Default = () => (
  <UnderlinePanels defaultValue="one">
    <UnderlinePanels.List aria-label="Sections">
      <UnderlinePanels.Tab value="one">One</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="two">Two</UnderlinePanels.Tab>
    </UnderlinePanels.List>
    <UnderlinePanels.Panel value="one">First panel</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="two">Second panel</UnderlinePanels.Panel>
  </UnderlinePanels>
)
