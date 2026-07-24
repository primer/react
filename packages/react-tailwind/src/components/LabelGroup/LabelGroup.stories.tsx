import {LabelGroup} from './LabelGroup'
import {Label} from '../Label'

export default {title: 'Display/LabelGroup', component: LabelGroup}
export const Default = {
  render: () => (
    <LabelGroup>
      <Label>bug</Label>
      <Label>help wanted</Label>
    </LabelGroup>
  ),
}
export const Playground = {args: {as: 'ul'}}
