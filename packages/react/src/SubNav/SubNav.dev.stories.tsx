import type {Meta} from '@storybook/react-vite'
import SubNav from './SubNav'
import type {ComponentProps} from '../utils/types'

import styles from './SubNav.dev.module.css'

export default {
  title: 'Components/SubNav/Dev',
  component: SubNav,
  subcomponents: {
    'SubNav.Link': SubNav.Link,
  },
} as Meta<ComponentProps<typeof SubNav>>

export const WithCss = () => (
  <SubNav aria-label="Main" className={styles.SubNavDev}>
    <SubNav.Links className={styles.SubNavLinksDev}>
      <SubNav.Link href="#home" selected className={styles.SubNavLinkDev}>
        Home
      </SubNav.Link>
      <SubNav.Link href="#documentation" className={styles.SubNavLinkDev}>
        Documentation
      </SubNav.Link>
      <SubNav.Link href="#support" className={styles.SubNavLinkDev}>
        Support
      </SubNav.Link>
    </SubNav.Links>
  </SubNav>
)
