import {MarkGithubIcon} from '@primer/octicons-react'
import {Avatar, FormControl, Radio} from '..'

export default {
  title: 'Components/Radio/Features',
  component: Radio,
}

export const WithLeadingVisual = () => {
  return (
    <form>
      <FormControl>
        <FormControl.LeadingVisual>
          <MarkGithubIcon />
        </FormControl.LeadingVisual>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
      <FormControl>
        <FormControl.LeadingVisual>
          <Avatar src={`https://github.com/lukasoppermann.png`} />
        </FormControl.LeadingVisual>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </form>
  )
}

export const Disabled = () => {
  return (
    <form>
      <FormControl disabled>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </form>
  )
}

export const WithCaption = () => {
  return (
    <form>
      <FormControl>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </form>
  )
}
