import type {Meta, StoryObj} from '@storybook/react-vite'
import {IssueLabel} from './IssueLabel'

const meta = {
  title: 'React Tailwind/Content/IssueLabel/Examples',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta
type Story = StoryObj<typeof meta>

export const LabelList: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-2" aria-label="Issue labels">
      {[
        ['bug', 'red'],
        ['documentation', 'blue'],
        ['good first issue', 'green'],
        ['help wanted', 'yellow'],
      ].map(([text, variant]) => (
        <li key={text}>
          <IssueLabel variant={variant as 'red' | 'blue' | 'green' | 'yellow'}>{text}</IssueLabel>
        </li>
      ))}
    </ul>
  ),
}

export const InteractiveLabels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IssueLabel href="/issues?q=is%3Aopen" variant="red">
        bug
      </IssueLabel>
      <IssueLabel as="button" variant="blue" onClick={() => {}}>
        documentation
      </IssueLabel>
    </div>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IssueLabel fillColor="#0366d6">Link</IssueLabel>
      <IssueLabel fillColor="#D6F2DE">Light</IssueLabel>
      <IssueLabel fillColor="#573807">Dark</IssueLabel>
    </div>
  ),
}
