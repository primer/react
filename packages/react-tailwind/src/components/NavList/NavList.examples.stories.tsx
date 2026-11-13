import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {NavList} from './NavList'

const meta = {title: 'React Tailwind/Navigation/NavList/Examples', component: NavList} satisfies Meta<typeof NavList>
export default meta
type Story = StoryObj<typeof meta>

export const SettingsNavigation: Story = {
  render: () => (
    <NavList aria-label="Settings navigation">
      <NavList.List>
        <NavList.Item href="#general" aria-current="page">
          General
        </NavList.Item>
        <NavList.SubNav>
          <NavList.SubNav.Trigger>Project</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#branches">Branches</NavList.Item>
            <NavList.Item href="#access">Access</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#notifications">Notifications</NavList.Item>
      </NavList.List>
    </NavList>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const project = canvas.getByRole('button', {name: 'Project'})
    await expect(project).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(project)
    await expect(project).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByRole('link', {name: 'Branches'})).toBeVisible()
  },
}
