import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {StressTest} from '../utils/StressTest'
import {Button} from '.'

export default {
  title: 'StressTests/Components/Button',
  component: Button,
} as Meta<ComponentProps<typeof Button>>

const totalIterations = 500

export const LabelUpdate = () => {
  return (
    <StressTest
      componentName="Button"
      title="Label update"
      description="Update the label a large number of times."
      totalIterations={totalIterations}
      renderIteration={count => (
        <div>
          <Button variant="primary" size="large" onClick={() => {}}>
            {`Button ${count + 1}`}
          </Button>
          <Button variant="default" size="medium" onClick={() => {}}>
            {`Button ${count + 1}`}
          </Button>
          <Button variant="danger" size="small" onClick={() => {}}>
            {`Button ${count + 1}`}
          </Button>
        </div>
      )}
    />
  )
}

export const CountUpdate = () => {
  return (
    <StressTest
      componentName="Button"
      title="Count update"
      description="Update the count a large number of times."
      totalIterations={totalIterations}
      renderIteration={count => (
        <div>
          <Button variant="primary" size="large" onClick={() => {}} count={count}>
            Button
          </Button>
          <Button variant="default" size="medium" onClick={() => {}} count={count}>
            Button
          </Button>
          <Button variant="danger" size="small" onClick={() => {}} count={count}>
            Button
          </Button>
        </div>
      )}
    />
  )
}
