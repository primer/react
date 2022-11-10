import React from 'react'
import {DiffAddedIcon, DiffModifiedIcon, FileIcon} from '@primer/octicons-react'
import {Meta, Story} from '@storybook/react'
import Box from '../Box'
import StyledOcticon from '../StyledOcticon'
import {TreeView} from './TreeView'

const meta: Meta = {
  title: 'Components/TreeView',
  component: TreeView,
  decorators: [
    Story => {
      return (
        <Box sx={{maxWidth: 400}}>
          <Story />
        </Box>
      )
    }
  ]
}

export const Default: Story = () => (
  <nav aria-label="Files changed">
    <TreeView aria-label="Files changed">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.LinkItem id="src/Avatar.tsx" href="#">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual>
              <StyledOcticon icon={DiffAddedIcon} color="success.fg" aria-label="added" />
            </TreeView.TrailingVisual>
          </TreeView.LinkItem>
          <TreeView.LinkItem id="src/Button.tsx" href="#" current>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Button.tsx
            <TreeView.TrailingVisual>
              <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" aria-label="modified" />
            </TreeView.TrailingVisual>
          </TreeView.LinkItem>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.LinkItem id="package.json" href="#">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        package.json
        <TreeView.TrailingVisual>
          <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" aria-label="modified" />
        </TreeView.TrailingVisual>
      </TreeView.LinkItem>
    </TreeView>
  </nav>
)

export default meta
