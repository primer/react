import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs/Features',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const Overflow = () => (
  <Breadcrumbs overflow>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
