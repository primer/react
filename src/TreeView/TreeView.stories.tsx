import React from 'react'
import {DiffAddedIcon, DiffModifiedIcon, DiffRemovedIcon, DiffRenamedIcon, FileIcon} from '@primer/octicons-react'
import {Meta, Story} from '@storybook/react'
import Box from '../Box'
import StyledOcticon from '../StyledOcticon'
import {TreeView} from './TreeView'

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
            <TreeView.DirectoryIcon />
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
                <TreeView.DirectoryIcon />
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
            <TreeView.DirectoryIcon />
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
          <TreeView.Item defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
              <TreeView.LinkItem href="#avatar-tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Avatar.tsx
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffAddedIcon} color="success.fg" />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.Item defaultExpanded>
                <TreeView.LeadingVisual>
                  <TreeView.DirectoryIcon />
                </TreeView.LeadingVisual>
                Button
                <TreeView.SubTree>
                  <TreeView.LinkItem href="#button-tsx" current>
                    <TreeView.LeadingVisual>
                      <FileIcon />
                    </TreeView.LeadingVisual>
                    Button.tsx
                    <TreeView.TrailingVisual>
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                  <TreeView.LinkItem href="#button-test-tsx">
                    <TreeView.LeadingVisual>
                      <FileIcon />
                    </TreeView.LeadingVisual>
                    Button.test.tsx
                    <TreeView.TrailingVisual>
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                </TreeView.SubTree>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            public
            <TreeView.SubTree>
              <TreeView.LinkItem href="#index-html">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                index.html
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffRenamedIcon} />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.LinkItem href="#favicon-ico">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                favicon.ico
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffRemovedIcon} color="danger.fg" />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.LinkItem href="#package-json">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            package.json
            <TreeView.TrailingVisual>
              <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
            </TreeView.TrailingVisual>
          </TreeView.LinkItem>
        </TreeView>
      </nav>
    </Box>
  )
}

export default meta
