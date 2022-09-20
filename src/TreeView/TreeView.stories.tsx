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
        <TreeView.LinkItem href="#src">
          src
          <TreeView.SubTree>
            <TreeView.LinkItem href="#avatar-tsx">Avatar.tsx</TreeView.LinkItem>
            <TreeView.LinkItem href="#button">
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#button-tsx">Button.tsx</TreeView.LinkItem>
                <TreeView.LinkItem href="#button-test-tsx">Button.test.tsx</TreeView.LinkItem>
              </TreeView.SubTree>
            </TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem
          href="#public"
          // eslint-disable-next-line no-console
          onToggle={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
        >
          public
          <TreeView.SubTree>
            <TreeView.LinkItem href="#index-html">index.html</TreeView.LinkItem>
            <TreeView.LinkItem href="#favicon-ico">favicon.ico</TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem href="#package-json">package.json</TreeView.LinkItem>
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
            <TreeView.LinkItem href="#avatar-tsx">Avatar.tsx</TreeView.LinkItem>
            <TreeView.Item>
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#button-tsx">Button.tsx</TreeView.LinkItem>
                <TreeView.LinkItem href="#button-test-tsx">Button.test.tsx</TreeView.LinkItem>
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
            <TreeView.LinkItem href="#index-html">index.html</TreeView.LinkItem>
            <TreeView.LinkItem href="#favicon-ico">favicon.ico</TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.LinkItem href="#package-json">package.json</TreeView.LinkItem>
      </TreeView>
    </nav>
  </Box>
)

export default meta
