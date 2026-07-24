import {FormControl} from './FormControl'
export default {title: 'Forms/FormControl', component: FormControl}
export const Default = {
  render: () => (
    <FormControl>
      <FormControl.Label>Repository</FormControl.Label>
      <FormControl.Control placeholder="owner/repository" />
      <FormControl.Caption>Used to link the deployment.</FormControl.Caption>
    </FormControl>
  ),
}
export const Playground = {
  args: {layout: 'vertical', disabled: false},
  render: (args: React.ComponentProps<typeof FormControl>) => (
    <FormControl {...args}>
      <FormControl.Label>Repository</FormControl.Label>
      <FormControl.Control />
    </FormControl>
  ),
}
