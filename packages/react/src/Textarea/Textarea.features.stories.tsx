import {FormControl, Heading, Stack} from '..'
import Textarea from '../Textarea'

export default {
  title: 'Components/Textarea/Features',
}

export const Disabled = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea disabled />
    </FormControl>
  </form>
)

export const WithCaption = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <FormControl.Caption>This is a caption</FormControl.Caption>
      <Textarea />
    </FormControl>
  </form>
)

export const VisuallyHiddenLabel = () => (
  <form>
    <Heading as="h2" variant="small">
      Primer form title
    </Heading>
    <FormControl>
      <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
      <Textarea />
      <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
    </FormControl>
  </form>
)

export const Error = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  </form>
)

export const Success = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="success">Success</FormControl.Validation>
    </FormControl>
  </form>
)

export const Block = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea block />
    </FormControl>
  </form>
)

export const CustomHeight = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={3} />
    </FormControl>
  </form>
)

export const CustomWidth = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea cols={60} />
    </FormControl>
  </form>
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
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={1} minHeight={100} />
    </FormControl>
  </form>
)

export const MaximumHeight = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea rows={20} maxHeight={200} />
    </FormControl>
  </form>
)
