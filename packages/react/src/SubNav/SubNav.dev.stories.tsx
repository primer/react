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

export const WithSx = () => (
  <SubNav aria-label="Main" sx={{p: 1, display: 'flex', border: '2px solid', borderColor: 'border.default'}}>
    <SubNav.Links sx={{m: 2}}>
      <SubNav.Link
        href="#home"
        selected
        sx={{color: 'accent.fg', fontWeight: 'bold', '&:is([data-selected])': {backgroundColor: 'danger.fg'}}}
      >
        Home
      </SubNav.Link>
      <SubNav.Link href="#documentation" sx={{color: 'accent.fg', fontWeight: 'bold'}}>
        Documentation
      </SubNav.Link>
      <SubNav.Link href="#support" sx={{color: 'accent.fg', fontWeight: 'bold'}}>
        Support
      </SubNav.Link>
    </SubNav.Links>
  </SubNav>
)

export const WithSxAndCSS = () => (
  <SubNav
    aria-label="Main"
    sx={{p: 1, display: 'flex', border: '2px solid', borderColor: 'border.default'}}
    className={styles.SubNavDev}
  >
    <SubNav.Links sx={{m: 2}} className={styles.SubNavLinksDev}>
      <SubNav.Link
        href="#home"
        selected
        className={styles.SubNavLinkDev}
        sx={{'&:is([data-selected])': {backgroundColor: 'danger.fg'}}}
      >
        Home
      </SubNav.Link>
      <SubNav.Link href="#documentation" className={styles.SubNavLinkDev}>
        Documentation
      </SubNav.Link>
      <SubNav.Link href="#support" sx={{color: 'accent.fg', fontWeight: 'bold'}} className={styles.SubNavLinkDev}>
        Support
      </SubNav.Link>
    </SubNav.Links>
  </SubNav>
)
