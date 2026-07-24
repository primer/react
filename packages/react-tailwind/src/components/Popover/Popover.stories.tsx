import {Button} from '../Button'
import {Popover} from './Popover'

export default {component: Popover, title: 'Components/Popover'}

export const Default = {
  render: () => (
    <Popover>
      <Popover.Button>Open popover</Popover.Button>
      <Popover.Content>Popover content</Popover.Content>
    </Popover>
  ),
}
export const Playground = {
  render: () => (
    <Popover modal>
      <Popover.Trigger render={<Button>Open modal popover</Button>} />
      <Popover.Content>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover>
  ),
}
export const WithArrow = {
  render: () => (
    <Popover>
      <Popover.Button>More</Popover.Button>
      <Popover.Content>
        <Popover.Arrow />
        Positioned content
      </Popover.Content>
    </Popover>
  ),
}
