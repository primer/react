import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {FormControl} from '../FormControl'
import {Heading} from '../Heading'
import {Select} from './Select'

const choices = (
  <>
    <Select.Option value="one">Choice one</Select.Option>
    <Select.Option value="two">Choice two</Select.Option>
    <Select.Option value="three">Choice three</Select.Option>
    <Select.Option value="four">Choice four</Select.Option>
    <Select.Option value="five">Choice five</Select.Option>
    <Select.Option value="six">Choice six</Select.Option>
  </>
)

const meta = {
  title: 'React Tailwind/Forms/Select/Features',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const WithOptionGroups: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select>
          <Select.OptGroup label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two">Choice two</Select.Option>
            <Select.Option value="three">Choice three</Select.Option>
            <Select.Option value="four">Choice four</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup disabled label="Group two">
            <Select.Option value="five">Choice five</Select.Option>
            <Select.Option value="six">Choice six</Select.Option>
          </Select.OptGroup>
        </Select>
      </FormControl>
    </form>
  ),
}

export const Disabled: Story = {
  render: () => (
    <form>
      <FormControl disabled>
        <FormControl.Label>Default label</FormControl.Label>
        <Select>{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const WithCaption: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select>{choices}</Select>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </form>
  ),
}

export const VisuallyHiddenLabel: Story = {
  render: () => (
    <form>
      <Heading as="h2" size="small">
        Primer form title
      </Heading>
      <FormControl>
        <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
        <Select>{choices}</Select>
        <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
      </FormControl>
    </form>
  ),
}

export const Error: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select validationStatus="error">{choices}</Select>
        <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
      </FormControl>
    </form>
  ),
}

export const Success: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select validationStatus="success">{choices}</Select>
        <FormControl.Validation variant="success">Success</FormControl.Validation>
      </FormControl>
    </form>
  ),
}

export const Block: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select block>{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const Small: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select size="small">{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const Large: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select size="large">{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const WithCustomStyling: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select className="rounded-lg border border-dashed border-[var(--fgColor-default)]">{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const WithPlaceholderOption: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select placeholder="No choice selected">{choices}</Select>
      </FormControl>
    </form>
  ),
}

export const Multiple: Story = {
  render: () => (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select defaultValue={['one', 'three']} multiple name="choices">
          {choices}
        </Select>
      </FormControl>
    </form>
  ),
}

export const KeyboardSelection: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Select defaultValue="one">{choices}</Select>
    </FormControl>
  ),
  play: async ({canvasElement}) => {
    const select = within(canvasElement).getByRole('combobox', {name: 'Default label'})
    await userEvent.selectOptions(select, 'two')
    await expect(select).toHaveValue('two')
  },
}
