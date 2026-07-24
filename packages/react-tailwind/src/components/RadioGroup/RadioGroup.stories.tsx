import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'
export default {title: 'Forms/RadioGroup', component: RadioGroup}
export const Default = {
  render: () => (
    <RadioGroup name="view">
      <span>
        <Radio id="view-list" value="list" />
        <label htmlFor="view-list"> List</label>
      </span>
      <span>
        <Radio id="view-grid" value="grid" />
        <label htmlFor="view-grid"> Grid</label>
      </span>
    </RadioGroup>
  ),
}
export const Playground = {args: {name: 'view', defaultValue: 'list'}}
