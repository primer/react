import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {StressTest} from '../utils/StressTest'
import {TreeView} from './TreeView'
import {FileIcon, DiffAddedIcon} from '@primer/octicons-react'
import Octicon from '../Octicon'

import classes from './Treeview.stress.dev.stories.module.css'

export default {
  title: 'StressTests/Components/TreeView',
  component: TreeView,
} as Meta<ComponentProps<typeof TreeView>>

const totalIterations = 100

const Files = Array.from({length: totalIterations}, (_, i) => ({
  name: `File_${i + 1}.tsx`,
}))

export const CurrentUpdate = () => {
  return (
    <StressTest
      componentName="TreeView"
      title="Simple current update"
      description="Marking a file as current from a large list."
      totalIterations={totalIterations}
      renderIteration={count => (
        <TreeView aria-label="Files changed">
          <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
              {Files.map((file, index) => (
                <TreeView.Item key={index} id={`src/${file.name}`} current={index === count}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  {file.name}
                  <TreeView.TrailingVisual label="Added">
                    <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
                  </TreeView.TrailingVisual>
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )}
    />
  )
}
