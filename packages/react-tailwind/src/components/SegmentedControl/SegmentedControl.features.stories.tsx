import {EyeIcon, FileCodeIcon, PeopleIcon, PlusIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
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
export const VariantSubtle: Story = {
  name: '[variant: subtle] Low emphasis',
  render: () => (
    <SegmentedControl defaultValue={['all']} aria-label="View" variant="subtle">
      <SegmentedControl.Button value="all" count={5}>
        All
      </SegmentedControl.Button>
      <SegmentedControl.Divider />
      <SegmentedControl.Button value="active" count={3}>
        Active
      </SegmentedControl.Button>
      <SegmentedControl.Button value="review-requests" count={10}>
        Review requests
      </SegmentedControl.Button>
      <SegmentedControl.Divider />
      <SegmentedControl.Button value="done" count={2}>
        Done
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
const initialViews = [
  {id: 'all', label: 'All'},
  {id: 'active', label: 'Active'},
  {id: 'review-requests', label: 'Review requests'},
  {id: 'done', label: 'Done'},
]
export const VariantNarrowActionMenuWithAction: Story = {
  name: '[variant: narrow] Action menu with trailing action',
  render: function VariantNarrowActionMenuWithActionStory() {
    const [views, setViews] = useState(initialViews)
    const [selectedViewId, setSelectedViewId] = useState(initialViews[0].id)

    const handleAddView = () => {
      setViews(currentViews => {
        const viewNumber = currentViews.length - 3
        return [...currentViews, {id: `new-view-${viewNumber}`, label: `New view ${viewNumber}`}]
      })
    }

    const handleReset = () => {
      setViews(initialViews)
      setSelectedViewId(initialViews[0].id)
    }

    return (
      <>
        <SegmentedControl
          aria-label="View"
          onValueChange={([nextSelectedViewId]) => {
            if (nextSelectedViewId) setSelectedViewId(nextSelectedViewId)
          }}
          value={[selectedViewId]}
          variant={{narrow: 'dropdown', regular: 'subtle', wide: 'subtle'}}
        >
          {views.flatMap(view => [
            ...(view.label === 'Active' ? [<SegmentedControl.Divider key={`${view.label}-divider`} />] : []),
            <SegmentedControl.Button key={view.id} value={view.id}>
              {view.label}
            </SegmentedControl.Button>,
          ])}
          <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={handleAddView} />
        </SegmentedControl>
        <Button className="mt-6 flex" size="small" onClick={handleReset}>
          Reset views
        </Button>
      </>
    )
  },
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
        <Text id="segmented-label" className="block text-md font-semibold leading-6">
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
export const CompactToolbar: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <SegmentedControl
        aria-label="File view"
        className="text-[length:var(--text-body-size-medium)] [&_button]:leading-[inherit]"
        defaultValue={['code']}
        size="small"
      >
        <SegmentedControl.Button value="code">Code</SegmentedControl.Button>
        <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
      </SegmentedControl>
      <Button size="small">Raw</Button>
    </div>
  ),
}
export const ConstrainedLabelOverflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The second example limits the first segment to show label truncation. Hover or focus it to reveal the full label. Prefer enough space to display labels in full.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col items-start gap-2">
        <Text className="block text-[length:var(--text-body-size-medium)] text-muted">Full label</Text>
        <SegmentedControl aria-label="File view, full label" defaultValue={['preview']}>
          <SegmentedControl.Button value="preview">Preview changes</SegmentedControl.Button>
          <SegmentedControl.Button value="code">Code</SegmentedControl.Button>
          <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
        </SegmentedControl>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Text className="block text-[length:var(--text-body-size-medium)] text-muted">Constrained label</Text>
        <SegmentedControl aria-label="File view, constrained label" defaultValue={['preview']}>
          <SegmentedControl.Button className="max-w-[120px]" value="preview">
            Preview changes
          </SegmentedControl.Button>
          <SegmentedControl.Button value="code">Code</SegmentedControl.Button>
          <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
        </SegmentedControl>
      </div>
    </div>
  ),
}
export const ConstrainedLabelOverflowStressTest: Story = {
  name: 'Constrained label overflow (stress test)',
  parameters: {
    docs: {
      description: {
        story:
          'Stress test of defensive label truncation, not a recommended layout. Keep labels short and provide enough space to show them in full. If labels regularly truncate, give the control more space, shorten the labels or use a different component.',
      },
    },
  },
  render: () => (
    <div className="flex w-[260px] flex-col items-start gap-4">
      {(['small', 'medium'] as const).flatMap(size =>
        (['default', 'subtle'] as const).map(variant => (
          <SegmentedControl
            key={`${size}-${variant}`}
            aria-label={`${size} ${variant}`}
            defaultValue={['preview']}
            fullWidth
            size={size}
            variant={variant}
          >
            <SegmentedControl.Button value="preview" leadingVisual={EyeIcon} count={5}>
              Preview changes before publishing
            </SegmentedControl.Button>
            <SegmentedControl.Button value="code">Code</SegmentedControl.Button>
            <SegmentedControl.Button value="blame" leadingVisual={PeopleIcon} count={2}>
              Blame
            </SegmentedControl.Button>
          </SegmentedControl>
        )),
      )}
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
