import type {ReactNode} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SplitPageLayout} from './SplitPageLayout'

const meta = {
  title: 'React Tailwind/Layout/SplitPageLayout/Examples',
  component: SplitPageLayout,
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof SplitPageLayout>
export default meta
type Story = StoryObj<typeof meta>

const Section = ({title, children}: {title: string; children: ReactNode}) => (
  <section>
    <h2 className="mt-0">{title}</h2>
    {children}
  </section>
)

export const SettingsWorkspace: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Header>
        <strong>Repository settings</strong>
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane>
        <nav aria-label="Settings">
          <a href="#general" aria-current="page" className="block p-2">
            General
          </a>
          <a href="#access" className="block p-2">
            Access
          </a>
          <a href="#webhooks" className="block p-2">
            Webhooks
          </a>
        </nav>
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Section title="General">
          <p>Manage the repository name, visibility, and default branch.</p>
          <p className="max-w-xl">The content pane owns the main reading flow while navigation remains available.</p>
        </Section>
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <small>Last saved a few seconds ago</small>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}
