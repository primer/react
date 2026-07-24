import {SegmentedControl} from './SegmentedControl'
export default {title: 'Forms/SegmentedControl', component: SegmentedControl}
export const Default = {
  render: () => (
    <SegmentedControl defaultValue={['list']}>
      <SegmentedControl.Button value="list">List</SegmentedControl.Button>
      <SegmentedControl.Button value="grid">Grid</SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const Playground = {args: {disabled: false}}
