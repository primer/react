import type {Meta} from '@storybook/react-vite'

import {Portal} from './Portal'
import styles from './Portal.stories.module.css'

export default {
  title: 'Behaviors/Portal',
  component: Portal,
} as Meta<typeof Portal>

export const Default = () => (
  <>
    Root position
    <div className={styles.RedContainer}>
      Outer container
      <div className={styles.GreenContainer}>
        Inner container
        <Portal>
          Portaled content rendered at <code>&lt;BaseStyles&gt;</code> root.
        </Portal>
      </div>
    </div>
  </>
)
