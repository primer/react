import {GrabberIcon, IssueClosedIcon, IssueOpenedIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import Link from '../Link'
import {Banner} from '../Banner'
import {IconButton} from '../Button'
import Octicon from '../Octicon'
import {TreeView} from './TreeView'
import classes from './TreeViewStories.module.css'

const meta: Meta = {
  title: 'Private/Components/TreeViewWithLeadingAction',
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

export const LeadingAction: StoryFn = () => {
  return (
    <div>
      <Banner
        title="High-risk feature"
        description={
          <p>
            Usage of LeadingAction is discouraged due to high-accessibility risk. See{' '}
            <Link inline={true} href="https://github.com/github/primer/issues/3446">
              audit issue (staff only)
            </Link>
            .
          </p>
        }
        variant="warning"
      />
      <TreeView aria-label="Issues">
        <TreeView.Item id="item-0">
          <TreeView.LeadingAction>
            <IconButton icon={GrabberIcon} aria-label="Reorder item 1" variant="invisible" />
          </TreeView.LeadingAction>
          <TreeView.LeadingVisual label="Issue closed">
            <Octicon icon={IssueClosedIcon} sx={{color: 'done.fg'}} />
          </TreeView.LeadingVisual>
          Item 1
        </TreeView.Item>
        <TreeView.Item id="item-2">
          <TreeView.LeadingAction>
            <IconButton icon={GrabberIcon} aria-label="Reorder item 2" variant="invisible" />
          </TreeView.LeadingAction>
          <TreeView.LeadingVisual label="Issue opened">
            <Octicon icon={IssueOpenedIcon} sx={{color: 'open.fg'}} />
          </TreeView.LeadingVisual>
          Item 2
          <TreeView.SubTree>
            <TreeView.Item id="item-2-sub-task-1">
              <TreeView.LeadingVisual label="Issue opened">
                <Octicon icon={IssueOpenedIcon} sx={{color: 'open.fg'}} />
              </TreeView.LeadingVisual>
              sub task 1
            </TreeView.Item>
            <TreeView.Item id="item-2-sub-task-2">
              <TreeView.LeadingVisual label="Issue opened">
                <Octicon icon={IssueOpenedIcon} sx={{color: 'open.fg'}} />
              </TreeView.LeadingVisual>
              sub task 2
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="item-3">
          <TreeView.LeadingAction>
            <IconButton icon={GrabberIcon} aria-label="Reorder item 3" variant="invisible" />
          </TreeView.LeadingAction>
          <TreeView.LeadingVisual label="Issue opened">
            <Octicon icon={IssueOpenedIcon} sx={{color: 'open.fg'}} />
          </TreeView.LeadingVisual>
          Item 3
        </TreeView.Item>
      </TreeView>
    </div>
  )
}

export default meta
