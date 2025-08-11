import type {Meta} from '@storybook/react-vite'
import {Hidden} from './Hidden'
import {Button} from '..'

export default {
  title: 'Experimental/Components/Hidden/Features',
  component: Hidden,
} as Meta<typeof Hidden>

export const HideContent = () => (
  <div>
    <Hidden when="narrow"> This value is shown in regular and wide viewports</Hidden>
    <Hidden when="regular"> This value is shown in narrow and wide viewports</Hidden>
    <Hidden when="wide"> This value is shown in narrow and regular viewports</Hidden>
  </div>
)

export const RenderContentResponsively = () => (
  <div>
    <Hidden when="narrow">
      <Button variant="primary">I am visible when the viewport is regular or wide viewport</Button>
    </Hidden>

    <Hidden when={['regular', 'wide']}>
      <Button variant="primary">I am visible when the viewport is narrow</Button>
    </Hidden>
  </div>
)
