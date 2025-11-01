import type {Meta, StoryFn} from '@storybook/react-vite'
import {ListPanels} from './ListPanels'
import {Dialog} from '../../Dialog/Dialog'

const meta: Meta<typeof ListPanels> = {
  title: 'Experimental/Components/ListPanels',
  component: ListPanels,
  parameters: {
    controls: {
      expanded: true,
    },
  },
}
export default meta

export const Default: StoryFn<typeof ListPanels> = () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']

  return (
    <ListPanels aria-label="Select a tab">
      <ListPanels.Tabs>
        {tabs.map((tab: string, index: number) => (
          <ListPanels.Tab key={index} id={`tab-${index}`}>
            {tab}
          </ListPanels.Tab>
        ))}
      </ListPanels.Tabs>
      {panels.map((panel: string, index: number) => (
        <ListPanels.Panel key={index} aria-labelledby={`tab-${index}`}>
          <div>
            <h2>{panel}</h2>
            <p>This is the content for {panel}.</p>

            <button type="button">Click me</button>
          </div>
        </ListPanels.Panel>
      ))}
    </ListPanels>
  )
}

export const InDialog: StoryFn<typeof ListPanels> = () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']
  const panels = ['Panel 1', 'Panel 2', 'Panel 3']
  return (
    <Dialog onClose={() => {}} width="xlarge" height="large" title="ListPanels in a Dialog">
      <Dialog.Body>
        <div>
          <ListPanels aria-label="Select a tab">
            <ListPanels.Tabs>
              {tabs.map((tab: string, index: number) => (
                <ListPanels.Tab key={index} id={`tab-${index}`}>
                  {tab}
                </ListPanels.Tab>
              ))}
            </ListPanels.Tabs>
            {panels.map((panel: string, index: number) => (
              <ListPanels.Panel key={index} aria-labelledby={`tab-${index}`}>
                <div>
                  <h2>{panel}</h2>
                  <p>This is the content for {panel}.</p>

                  <button type="button">Click me</button>
                </div>
              </ListPanels.Panel>
            ))}
          </ListPanels>
        </div>
      </Dialog.Body>
    </Dialog>
  )
}
