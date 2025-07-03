import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {StressTest} from '../utils/StressTest'
import {TableIcon} from '@primer/octicons-react'
import {ActionList} from '.'

export default {
  title: 'StressTests/Components/ActionList',
  component: ActionList,
} as Meta<ComponentProps<typeof ActionList>>

const totalIterations = 100

const projects = Array.from({length: totalIterations}, (_, i) => ({
  name: `Project ${i + 1}`,
  scope: `Scope ${i + 1}`,
}))

export const SingleSelect = () => {
  return (
    <StressTest
      componentName="ActionList"
      title="Single Select"
      description="Selecting a single item from a large list."
      totalIterations={totalIterations}
      renderIteration={count => {
        return (
          <>
            <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
              {projects.map((project, index) => (
                <ActionList.Item
                  key={index}
                  role="menuitemradio"
                  selected={index === count}
                  aria-checked={index === count}
                >
                  <ActionList.LeadingVisual>
                    <TableIcon />
                  </ActionList.LeadingVisual>
                  {project.name}
                  <ActionList.Description variant="block">{project.scope}</ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList>
          </>
        )
      }}
    />
  )
}
