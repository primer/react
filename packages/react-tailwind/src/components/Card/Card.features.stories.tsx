import type {Meta, StoryObj} from '@storybook/react-vite'
import {KebabHorizontalIcon, RepoIcon, RepoForkedIcon, StarIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {VisuallyHidden} from '../VisuallyHidden'
import {Card as CardRoot, CardAction, CardDescription, CardHeading, CardIcon, CardImage, CardMetadata} from './Card'

const Card = Object.assign(CardRoot, {
  Action: CardAction,
  Description: CardDescription,
  Heading: CardHeading,
  Icon: CardIcon,
  Image: CardImage,
  Metadata: CardMetadata,
})

const meta = {
  title: 'React Tailwind/Content/Card/Features',
  component: Card,
  decorators: [
    Story => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<Record<string, never>>

export const WithImage: Story = {
  render: () => (
    <Card>
      <Card.Image src="https://github.com/octocat.png" alt="Octocat" />
      <Card.Heading>Card with Image</Card.Heading>
      <Card.Description>This card uses an edge-to-edge image instead of an icon.</Card.Description>
    </Card>
  ),
}

export const Compact: Story = {
  render: () => (
    <Card layout="compact">
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        The compact layout uses tighter spacing, an icon without a background container, and a smaller title.
      </Card.Description>
      <Card.Metadata>
        <StarIcon size={16} /> 1.2k stars
      </Card.Metadata>
    </Card>
  ),
}

export const WithMetadata: Story = {
  render: () => (
    <Card>
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        {"GitHub's design system implemented as React components for building consistent user interfaces."}
      </Card.Description>
      <Card.Metadata>
        <StarIcon size={16} /> 1.2k stars
      </Card.Metadata>
    </Card>
  ),
}

export const WithMenu: Story = {
  render: () => (
    <Card>
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        {"GitHub's design system implemented as React components for building consistent user interfaces."}
      </Card.Description>
      <Card.Action>
        <ActionMenu>
          <ActionMenu.Trigger
            render={
              <IconButton icon={KebabHorizontalIcon} aria-label="More options for primer/react" variant="invisible" />
            }
          />
          <ActionMenu.Content>
            <ActionList>
              <ActionList.Item>Star</ActionList.Item>
              <ActionList.Item>Watch</ActionList.Item>
              <ActionList.Item>Fork</ActionList.Item>
            </ActionList>
          </ActionMenu.Content>
        </ActionMenu>
      </Card.Action>
    </Card>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Card>
      <div className="flex flex-col gap-2">
        <h3 className="m-0">Custom Content Card</h3>
        <p className="m-0">This card uses arbitrary custom content instead of the built-in subcomponents.</p>
        <ul className="m-0 pl-4">
          <li>Item one</li>
          <li>Item two</li>
          <li>Item three</li>
        </ul>
      </div>
    </Card>
  ),
}

export const StandaloneSection: Story = {
  render: () => (
    <Card as="section">
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        {
          'Standalone cards render as a labelled <section> landmark. aria-labelledby is automatically wired to Card.Heading.'
        }
      </Card.Description>
    </Card>
  ),
}

export const InList: Story = {
  render: () => (
    <ul className="m-0 flex list-none flex-col gap-2 p-0" aria-label="Repositories">
      {['primer/react', 'primer/css', 'primer/octicons'].map((repo, index) => (
        <li key={repo}>
          <Card>
            <Card.Icon icon={RepoIcon} />
            <Card.Description>{repo}</Card.Description>
            <Card.Metadata>
              <StarIcon size={16} /> {index === 0 ? '1.2k' : index === 1 ? '850' : '2.1k'} stars
            </Card.Metadata>
          </Card>
        </li>
      ))}
    </ul>
  ),
}

export const InteractiveContent: Story = {
  render: () => (
    <ul className="m-0 flex list-none flex-col gap-2 p-0" aria-label="Repositories">
      {['primer/react', 'primer/css', 'primer/octicons'].map(repo => (
        <li key={repo}>
          <Card>
            <Card.Icon icon={RepoIcon} />
            <Card.Description>{repo}</Card.Description>
            <Card.Metadata>
              <Button leadingVisual={<StarIcon size={16} />} size="small">
                Star <VisuallyHidden>{repo}</VisuallyHidden>
              </Button>
              <Button leadingVisual={<RepoForkedIcon size={16} />} size="small">
                Fork <VisuallyHidden>{repo}</VisuallyHidden>
              </Button>
            </Card.Metadata>
          </Card>
        </li>
      ))}
    </ul>
  ),
}

export const BorderRadius: Story = {
  render: () => (
    <div className="flex gap-3">
      <Card borderRadius="medium" padding="condensed">
        <Card.Heading>Medium</Card.Heading>
      </Card>
      <Card borderRadius="large" padding="condensed">
        <Card.Heading>Large</Card.Heading>
      </Card>
    </div>
  ),
}
