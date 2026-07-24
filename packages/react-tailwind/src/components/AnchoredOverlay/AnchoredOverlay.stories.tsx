import {AnchoredOverlay} from './AnchoredOverlay'

export default {component: AnchoredOverlay, title: 'Components/AnchoredOverlay'}

export const Default = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger>Open overlay</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>Anchored content</AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const Playground = {
  render: () => (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger>Open</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>
        <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const WithArrow = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger>More</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>
        <AnchoredOverlay.Arrow />
        Positioned overlay
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
