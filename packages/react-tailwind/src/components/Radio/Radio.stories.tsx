import {Radio} from './Radio'
export default {title: 'Forms/Radio', component: Radio}
export const Default = {
  render: () => (
    <span className="flex gap-2">
      <Radio id="one" value="one" />
      <label htmlFor="one">One</label>
    </span>
  ),
}
export const Playground = {args: {value: 'one', disabled: false}}
