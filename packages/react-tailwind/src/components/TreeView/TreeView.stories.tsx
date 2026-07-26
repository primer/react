import {DiffAddedIcon, DiffModifiedIcon, FileIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {TreeView} from './TreeView'
const meta = {
  title: 'React Tailwind/Navigation/TreeView',
  component: TreeView,
  args: {flat: false, truncate: true},
  argTypes: {
    flat: {control: 'boolean'},
    truncate: {control: 'boolean'},
  },
  parameters: {controls: {include: ['flat', 'truncate']}},
  decorators: [
    Story => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <TreeView aria-label="Files">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="avatar">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="added" className="text-success">
              <DiffAddedIcon />
            </TreeView.TrailingVisual>
          </TreeView.Item>
          <TreeView.Item id="button" current>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Button.tsx
            <TreeView.TrailingVisual label="modified" className="text-attention">
              <DiffModifiedIcon />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="package">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        package.json
        <TreeView.TrailingVisual label="modified" className="text-attention">
          <DiffModifiedIcon />
        </TreeView.TrailingVisual>
      </TreeView.Item>
    </TreeView>
  ),
}

export const Playground: Story = {
  render: args => (
    <TreeView {...args} aria-label="Files">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="index">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            index.ts
          </TreeView.Item>
          <TreeView.Item id="components">
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            components
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="readme" current>
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        README.md
      </TreeView.Item>
    </TreeView>
  ),
}
