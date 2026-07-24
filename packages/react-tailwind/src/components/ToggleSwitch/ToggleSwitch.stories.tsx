import {ToggleSwitch} from './ToggleSwitch'
export default {title: 'Forms/ToggleSwitch', component: ToggleSwitch}
export const Default = {
  render: () => (
    <span className="flex gap-2">
      <ToggleSwitch id="enable-notifications" />
      <label htmlFor="enable-notifications">Enable notifications</label>
    </span>
  ),
}
export const Playground = {args: {'aria-label': 'Enable notifications', size: 'medium', defaultChecked: false}}
