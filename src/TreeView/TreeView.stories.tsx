import {Meta, Story} from '@storybook/react'
import {TreeView} from './TreeView'
import React from 'react'
import Box from '../Box'
import {DiffAddedIcon, FileDirectoryFillIcon, FileIcon} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Composite components/TreeView',
  component: TreeView,
  parameters: {
    layout: 'fullscreen'
  }
}

export const FileTreeWithDirectoryLinks: Story = () => (
  <Box p={3} maxWidth={360}>
    <nav aria-label="File navigation">
      <TreeView aria-label="File navigation">
        <TreeView.LinkItem href="#src">
          <TreeView.LeadingVisual>
            <FileDirectoryFillIcon />
          </TreeView.LeadingVisual>
          src
          <TreeView.SubTree>
            <TreeView.LinkItem href="#avatar-tsx">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Avatar.tsx
            </TreeView.LinkItem>
            <TreeView.LinkItem href="#button" current>
              <TreeView.LeadingVisual>
                <FileDirectoryFillIcon />
              </TreeView.LeadingVisual>
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#button-tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.tsx
                </TreeView.LinkItem>
                <TreeView.LinkItem href="#button-test-tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.test.tsx
                </TreeView.LinkItem>
              </TreeView.SubTree>
            </TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem
          href="#public"
          // eslint-disable-next-line no-console
          onToggle={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
        >
          <TreeView.LeadingVisual>
            <FileDirectoryFillIcon />
          </TreeView.LeadingVisual>
          public
          <TreeView.SubTree>
            <TreeView.LinkItem href="#index-html">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              index.html
            </TreeView.LinkItem>
            <TreeView.LinkItem href="#favicon-ico">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              favicon.ico
            </TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem href="#package-json">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          package.json
        </TreeView.LinkItem>
      </TreeView>
    </nav>
  </Box>
)

export const FileTreeWithoutDirectoryLinks: Story = () => {
  return (
    <Box p={3} maxWidth={360}>
      <nav aria-label="File navigation">
        <TreeView aria-label="File navigation">
          <TreeView.Item>
            src
            <TreeView.SubTree>
              <TreeView.LinkItem href="#avatar-tsx">
                Avatar.tsx
                <TreeView.TrailingVisual>
                  <DiffAddedIcon />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.Item>
                Button
                <TreeView.SubTree>
                  <TreeView.LinkItem href="#button-tsx" current>
                    Button.tsx
                  </TreeView.LinkItem>
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
}

export default meta
