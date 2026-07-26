import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Text} from '../Text'
import {SegmentedControl} from './SegmentedControl'

const meta = {title: 'React Tailwind/Forms/SegmentedControl/Features', component: SegmentedControl} satisfies Meta<
  typeof SegmentedControl
>
export default meta
type Story = StoryObj<typeof meta>

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.Button value="preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const WithCounterLabels: Story = {
  render: () => (
    <SegmentedControl defaultValue={['feature']} aria-label="Issues by label">
      <SegmentedControl.Button value="feature" count={5}>
        Feature
      </SegmentedControl.Button>
      <SegmentedControl.Button value="bug" count={3}>
        Bug
      </SegmentedControl.Button>
      <SegmentedControl.Button value="good-first-issue" count={10}>
        Good first issue
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState<string[]>(['preview'])
    return (
      <SegmentedControl value={value} onValueChange={setValue} aria-label="File view">
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
        <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
      </SegmentedControl>
    )
  },
}
export const IconOnly: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.IconButton value="preview" aria-label="Preview" icon={EyeIcon} />
      <SegmentedControl.IconButton value="raw" aria-label="Raw" icon={FileCodeIcon} />
      <SegmentedControl.IconButton value="blame" aria-label="Blame" icon={PeopleIcon} />
    </SegmentedControl>
  ),
}
export const VariantNarrowHideLabels: Story = {
  name: '[variant: narrow] Hide labels',
  render: () => (
    <SegmentedControl
      defaultValue={['preview']}
      aria-label="File view"
      variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}
    >
      <SegmentedControl.Button value="preview" aria-label="Preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" aria-label="Raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" aria-label="Blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const VariantNarrowActionMenu: Story = {
  name: '[variant: narrow] Action menu',
  render: () => (
    <SegmentedControl
      defaultValue={['preview']}
      aria-label="File view"
      variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}
    >
      <SegmentedControl.Button value="preview" aria-label="Preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" aria-label="Raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" aria-label="Blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const FullwidthNarrow: Story = {
  name: '[fullWidth: narrow]',
  render: () => (
    <SegmentedControl
      defaultValue={['preview']}
      aria-label="File view"
      fullWidth={{narrow: true, regular: false, wide: false}}
    >
      <SegmentedControl.Button value="preview" aria-label="Preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" aria-label="Raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" aria-label="Blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const FullwidthRegular: Story = {
  name: '[fullWidth: regular]',
  render: () => (
    <SegmentedControl
      defaultValue={['preview']}
      aria-label="File view"
      fullWidth={{narrow: false, regular: true, wide: false}}
    >
      <SegmentedControl.Button value="preview" aria-label="Preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" aria-label="Raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" aria-label="Blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const FullwidthAll: Story = {
  name: 'Full width',
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view" fullWidth>
      <SegmentedControl.Button value="preview" aria-label="Preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" aria-label="Raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" aria-label="Blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const AssociatedWithALabelAndCaption: Story = {
  name: '[Example] Associated with a label and caption',
  render: () => (
    <div className="flex w-full flex-col gap-1 md:flex-row">
      <div className="grow">
        <Text id="segmented-label" className="block text-base font-semibold leading-6">
          File view
        </Text>
        <Text id="segmented-caption" className="block text-sm text-muted">
          Change the way the file is viewed
        </Text>
      </div>
      <SegmentedControl
        aria-describedby="segmented-caption"
        aria-labelledby="segmented-label"
        defaultValue={['preview']}
      >
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
        <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
      </SegmentedControl>
    </div>
  ),
}
export const FocusVisible: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
    </SegmentedControl>
  ),
  play: async ({canvasElement}) => {
    const preview = within(canvasElement).getByRole('button', {name: 'Preview'})
    await userEvent.tab()
    await expect(preview).toHaveFocus()
  },
}
