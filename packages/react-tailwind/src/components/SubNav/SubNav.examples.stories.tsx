import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {SubNav} from './SubNav'

const meta = {title: 'React Tailwind/Navigation/SubNav/Examples', component: SubNav} satisfies Meta<typeof SubNav>
export default meta
type Story = StoryObj<typeof meta>

const sections = ['Overview', 'Deployments', 'Activity']

export const ProjectSections: Story = {
  render: () => {
    const [selected, setSelected] = useState(sections[0])
    return (
      <SubNav aria-label="Project sections">
        <SubNav.Links>
          {sections.map(section => (
            <SubNav.Link
              key={section}
              href={`#${section.toLowerCase()}`}
              selected={selected === section}
              onClick={event => {
                event.preventDefault()
                setSelected(section)
              }}
            >
              {section}
            </SubNav.Link>
          ))}
        </SubNav.Links>
      </SubNav>
    )
  },
  play: async ({canvasElement}) => {
    const deployments = within(canvasElement).getByRole('link', {name: 'Deployments'})
    await userEvent.click(deployments)
    await expect(deployments).toHaveAttribute('data-selected', 'true')
  },
}
