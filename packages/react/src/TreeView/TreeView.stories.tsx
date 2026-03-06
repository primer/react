import {DiffAddedIcon, DiffModifiedIcon, FileIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import Octicon from '../Octicon'
import {TreeView} from './TreeView'
import classes from './TreeView.stories.module.css'

const meta: Meta = {
  title: 'Components/TreeView',
  component: TreeView,
  decorators: [
    Story => {
      return (
        <div className={classes.WidthContraintContainer}>
          <Story />
        </div>
      )
    },
  ],
}

export const Default: StoryFn = () => (
  <nav aria-label="Files changed">
    <TreeView aria-label="Files changed">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
          <TreeView.Item id="src/Button.tsx" current>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Button.tsx
            <TreeView.TrailingVisual label="Modified">
              <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="package.json">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        package.json
        <TreeView.TrailingVisual label="Modified">
          <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
        </TreeView.TrailingVisual>
      </TreeView.Item>
    </TreeView>
  </nav>
)

export default meta
