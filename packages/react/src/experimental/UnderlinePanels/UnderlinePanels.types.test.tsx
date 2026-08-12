import UnderlinePanels from './UnderlinePanels'

export function panelDoesNotAcceptControlledAttributes() {
  return (
    <UnderlinePanels aria-label="Example">
      <UnderlinePanels.Tab>Tab</UnderlinePanels.Tab>
      {/* @ts-expect-error UnderlinePanels controls the panel's accessible relationship */}
      <UnderlinePanels.Panel aria-labelledby="custom-tab">Panel</UnderlinePanels.Panel>
      {/* @ts-expect-error UnderlinePanels controls the panel's selected state */}
      <UnderlinePanels.Panel data-selected="forced">Panel</UnderlinePanels.Panel>
      {/* @ts-expect-error UnderlinePanels controls panel visibility */}
      <UnderlinePanels.Panel hidden>Panel</UnderlinePanels.Panel>
      {/* @ts-expect-error UnderlinePanels controls the panel ID */}
      <UnderlinePanels.Panel id="custom-panel">Panel</UnderlinePanels.Panel>
      {/* @ts-expect-error UnderlinePanels controls the panel role */}
      <UnderlinePanels.Panel role="region">Panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}
