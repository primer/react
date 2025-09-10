import type {Meta} from '@storybook/react-vite'
import {Portal} from './Portal'
import classes from './Portal.stories.module.css'
import {clsx} from 'clsx'

export default {
  title: 'Behaviors/Portal',
  component: Portal,
} as Meta<typeof Portal>

export const Default = () => (
  <>
    Root position
    <div className={clsx(classes.PortalContainer, classes.OuterContainer)}>
      Outer container
      <div className={clsx(classes.PortalContainer, classes.InnerContainer)}>
        Inner container
        <Portal>
          Portaled content rendered at <code>&lt;BaseStyles&gt;</code> root.
        </Portal>
      </div>
    </div>
  </>
)
