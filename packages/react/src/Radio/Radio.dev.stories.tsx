import {FormControl, Radio} from '..'

export default {
  title: 'Components/Radio/Dev',
  component: Radio,
}

export const SxProp = () => {
  return (
    <form>
      <FormControl>
        <Radio name="default-radio-name" value="default" sx={{backgroundColor: 'red'}} />
        <FormControl.Label>Label</FormControl.Label>
      </FormControl>
    </form>
  )
}
