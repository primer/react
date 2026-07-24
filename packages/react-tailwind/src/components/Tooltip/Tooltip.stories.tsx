import {Button} from '../Button'
import {Tooltip} from './Tooltip'

export default {component: Tooltip, title: 'Components/Tooltip'}

export const Default = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>Save</Button>} />
      <Tooltip.Content>Save this file</Tooltip.Content>
    </Tooltip>
  ),
}
export const Playground = {
  render: () => (
    <Tooltip disableHoverablePopup>
      <Tooltip.Trigger>Info</Tooltip.Trigger>
      <Tooltip.Content side="right">Additional information</Tooltip.Content>
    </Tooltip>
  ),
}
export const WithArrow = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger>More</Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        More information
      </Tooltip.Content>
    </Tooltip>
  ),
}
