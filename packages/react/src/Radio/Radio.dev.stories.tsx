import {FormControl, Radio} from '..'

export default {
  title: 'Components/Radio/Dev',
  component: Radio,
}

export const Default = () => {
  return (
    <form>
      <FormControl>
        <Radio name="default-radio-name" value="default" />
        <FormControl.Label>Label</FormControl.Label>
      </FormControl>
    </form>
  )
}
