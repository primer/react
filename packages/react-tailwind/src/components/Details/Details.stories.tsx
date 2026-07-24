import {Details} from './Details'
export default {title: 'Forms/Details', component: Details}
export const Default = {
  render: () => (
    <Details>
      <Details.Summary>More options</Details.Summary>
      <p>Additional content</p>
    </Details>
  ),
}
export const Playground = {
  args: {open: false},
  render: (args: React.ComponentProps<typeof Details>) => (
    <Details {...args}>
      <Details.Summary>More options</Details.Summary>
      <p>Additional content</p>
    </Details>
  ),
}
