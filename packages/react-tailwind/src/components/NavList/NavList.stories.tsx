import {NavList} from './NavList'
export default {title: 'Navigation/NavList', component: NavList}
export const Default = () => (
  <NavList aria-labelledby="repo-nav">
    <NavList.Heading id="repo-nav">Repository</NavList.Heading>
    <NavList.List>
      <NavList.Item href="#" aria-current="page">
        Overview
      </NavList.Item>
      <NavList.Item href="#">Settings</NavList.Item>
    </NavList.List>
  </NavList>
)
