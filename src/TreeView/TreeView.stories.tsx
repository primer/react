import {Meta, Story} from '@storybook/react'
import {TreeView} from './TreeView'
import React from 'react'
import Box from '../Box'

const meta: Meta = {
  title: 'Composite components/TreeView',
  component: TreeView,
  parameters: {
    layout: 'fullscreen'
  }
}

export const FileTreeWithDirectoryLinks: Story = () => (
  <Box p={3}>
    <nav aria-label="File navigation">
      <TreeView aria-label="File navigation">
        <TreeView.LinkItem href="#">
          src
          <TreeView.SubTree>
            <TreeView.LinkItem href="#">Avatar.tsx</TreeView.LinkItem>
            <TreeView.LinkItem href="#">
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#">Button.tsx</TreeView.LinkItem>
                <TreeView.LinkItem href="#">Button.test.tsx</TreeView.LinkItem>
              </TreeView.SubTree>
            </TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem
          href="#"
          // eslint-disable-next-line no-console
          onToggle={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
        >
          public
          <TreeView.SubTree>
            <TreeView.LinkItem href="#">index.html</TreeView.LinkItem>
            <TreeView.LinkItem href="#">favicon.ico</TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem href="#">package.json</TreeView.LinkItem>
      </TreeView>
    </nav>
  </Box>
)

export const FileTreeWithoutDirectoryLinks: Story = () => (
  <Box p={3}>
    <nav aria-label="File navigation">
      <TreeView aria-label="File navigation">
        <TreeView.Item>
          src
          <TreeView.SubTree>
            <TreeView.LinkItem href="#">Avatar.tsx</TreeView.LinkItem>
            <TreeView.Item>
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#">Button.tsx</TreeView.LinkItem>
                <TreeView.LinkItem href="#">Button.test.tsx</TreeView.LinkItem>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item
          // eslint-disable-next-line no-console
          onToggle={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
        >
          public
          <TreeView.SubTree>
            <TreeView.LinkItem href="#">index.html</TreeView.LinkItem>
            <TreeView.LinkItem href="#">favicon.ico</TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.LinkItem href="#">package.json</TreeView.LinkItem>
      </TreeView>
    </nav>
  </Box>
)

export default meta
