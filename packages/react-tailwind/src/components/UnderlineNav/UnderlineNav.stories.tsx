import {UnderlineNav} from './UnderlineNav'
export default {title: 'Navigation/UnderlineNav', component: UnderlineNav}
export const Default = () => (
  <UnderlineNav aria-label="Repository">
    <UnderlineNav.List>
      <UnderlineNav.Item href="#" aria-current="page">
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#" counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav.List>
  </UnderlineNav>
)
