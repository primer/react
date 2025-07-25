import {Box, FormControl, Heading, Stack} from '..'
import Textarea from '../Textarea'

export default {
  title: 'Components/Textarea/Features',
}

export const Disabled = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea disabled />
    </FormControl>
  </Box>
)

export const WithCaption = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <FormControl.Caption>This is a caption</FormControl.Caption>
      <Textarea />
    </FormControl>
  </Box>
)

export const VisuallyHiddenLabel = () => (
  <Box as="form">
    <Heading as="h2" variant="small">
      Primer form title
    </Heading>
    <FormControl>
      <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
      <Textarea />
      <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
    </FormControl>
  </Box>
)

export const Error = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Success = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="success">Success</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Block = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea block />
    </FormControl>
  </Box>
)

export const CustomHeight = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={3} />
    </FormControl>
  </Box>
)

export const CustomWidth = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea cols={60} />
    </FormControl>
  </Box>
)

export const CustomResizeBehavior = () => (
  <Stack as="form">
    <FormControl>
      <FormControl.Label>Resize in either direction (default)</FormControl.Label>
      <Textarea resize="both" />
    </FormControl>
    <FormControl>
      <FormControl.Label>No resize</FormControl.Label>
      <Textarea resize="none" />
    </FormControl>
    <FormControl>
      <FormControl.Label>Horizontal resize</FormControl.Label>
      <Textarea resize="horizontal" />
    </FormControl>
    <FormControl>
      <FormControl.Label>Vertical resize</FormControl.Label>
      <Textarea resize="vertical" />
    </FormControl>
  </Stack>
)

export const MinimumHeight = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={1} minHeight={100} />
    </FormControl>
  </Box>
)

export const MaximumHeight = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={20} maxHeight={200} />
    </FormControl>
  </Box>
)
