import Checkbox from '../Checkbox'
import FormControl from '../FormControl'
import {MarkGithubIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Checkbox/Features',
}

export const WithLeadingVisual = () => {
  return (
    <form>
      <FormControl>
        <FormControl.LeadingVisual>
          <MarkGithubIcon />
        </FormControl.LeadingVisual>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </form>
  )
}

export const Disabled = () => {
  return (
    <form>
      <FormControl disabled>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </form>
  )
}

export const WithCaption = () => {
  return (
    <form>
      <FormControl>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </form>
  )
}

export const Indeterminate = () => (
  <form>
    <FormControl>
      <Checkbox value="default" indeterminate />
      <FormControl.Label>Default label</FormControl.Label>
    </FormControl>
  </form>
)
