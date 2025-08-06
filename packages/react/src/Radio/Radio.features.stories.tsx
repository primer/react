import {MarkGithubIcon} from '@primer/octicons-react'
import {Avatar, Box, FormControl, Radio} from '..'

export default {
  title: 'Components/Radio/Features',
  component: Radio,
}

export const WithLeadingVisual = () => {
  return (
    <Box as="form">
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
    </Box>
  )
}

export const Disabled = () => {
  return (
    <Box as="form">
      <FormControl disabled>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const WithCaption = () => {
  return (
    <Box as="form">
      <FormControl>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </Box>
  )
}
