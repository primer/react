import type {Meta} from '@storybook/react'

import TestComponent, {type TestComponentProps} from './TestComponent'

const meta: Meta<typeof TestComponent> = {
  component: TestComponent,
  parameters: {controls: {expanded: true, sort: 'requiredFirst'}},
}

export const DefaultTestComponent = (args: TestComponentProps) => <TestComponent {...args} />

DefaultTestComponent.args = {
  color: 'blue',
}

export default meta
