import type {Meta} from '@storybook/react-vite'
import {KebabHorizontalIcon, RepoIcon, StarIcon} from '@primer/octicons-react'
import {ActionList, ActionMenu, IconButton} from '..'
import {Card} from './index'
import classes from './Card.stories.module.css'

const meta = {
  title: 'Experimental/Components/Card/Features',
  component: Card,
  decorators: [
    Story => (
      <div className={classes.WidthConstraintContainer}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta

export const WithImage = () => {
  return (
    <Card>
      <Card.Image src="https://github.com/octocat.png" alt="Octocat" />
      <Card.Heading>Card with Image</Card.Heading>
      <Card.Description>This card uses an edge-to-edge image instead of an icon.</Card.Description>
    </Card>
  )
}

export const WithMetadata = () => {
  return (
    <Card>
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        {"GitHub's design system implemented as React components for building consistent user interfaces."}
      </Card.Description>
      <Card.Metadata>
        <StarIcon size={16} />
        1.2k stars
      </Card.Metadata>
    </Card>
  )
}

export const WithMenu = () => {
  return (
    <Card>
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        {"GitHub's design system implemented as React components for building consistent user interfaces."}
      </Card.Description>
      <Card.Menu>
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton icon={KebabHorizontalIcon} aria-label="More options for primer/react" variant="invisible" />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>Star</ActionList.Item>
              <ActionList.Item>Watch</ActionList.Item>
              <ActionList.Item>Fork</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Card.Menu>
    </Card>
  )
}

export const CustomContent = () => (
  <Card>
    <div className={classes.CustomContentLayout}>
      <h3>Custom Content Card</h3>
      <p>This card uses arbitrary custom content instead of the built-in subcomponents.</p>
      <ul>
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
    </div>
  </Card>
)
