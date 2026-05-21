import type {Meta} from '@storybook/react-vite'
import {KebabHorizontalIcon, RepoIcon, RepoForkedIcon, StarIcon} from '@primer/octicons-react'
import {ActionList, ActionMenu, Button, IconButton, VisuallyHidden} from '..'
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
      <Card.Action>
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
      </Card.Action>
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

export const StandaloneSection = () => (
  <Card as="section">
    <Card.Icon icon={RepoIcon} />
    <Card.Heading>primer/react</Card.Heading>
    <Card.Description>
      {
        'Standalone cards render as a labelled <section> landmark. aria-labelledby is automatically wired to Card.Heading.'
      }
    </Card.Description>
  </Card>
)

export const InList = () => (
  <ul className={classes.CardList} aria-label="Repositories">
    <li>
      <Card>
        <Card.Icon icon={RepoIcon} />
        <Card.Description>primer/react</Card.Description>
        <Card.Metadata>
          <StarIcon size={16} />
          1.2k stars
        </Card.Metadata>
      </Card>
    </li>
    <li>
      <Card>
        <Card.Icon icon={RepoIcon} />
        <Card.Description>primer/css</Card.Description>
        <Card.Metadata>
          <StarIcon size={16} />
          850 stars
        </Card.Metadata>
      </Card>
    </li>
    <li>
      <Card>
        <Card.Icon icon={RepoIcon} />
        <Card.Description>primer/octicons</Card.Description>
        <Card.Metadata>
          <StarIcon size={16} />
          2.1k stars
        </Card.Metadata>
      </Card>
    </li>
  </ul>
)

/**
 * When several Cards share the same interactive controls (for example "Star"
 * or "Fork" buttons in a list of repositories), the controls' accessible
 * names must include enough context to distinguish one card's action from
 * another's. This story uses `VisuallyHidden` to append the repo name to
 * each button's accessible name — a common pattern across GitHub.
 */
export const InteractiveContent = () => {
  const repos = [{name: 'primer/react'}, {name: 'primer/css'}, {name: 'primer/octicons'}]

  return (
    <ul className={classes.CardList} aria-label="Repositories">
      {repos.map(repo => (
        <li key={repo.name}>
          <Card>
            <Card.Icon icon={RepoIcon} />
            <Card.Description>{repo.name}</Card.Description>
            <Card.Metadata>
              <Button leadingVisual={StarIcon} size="small">
                Star <VisuallyHidden>{repo.name}</VisuallyHidden>
              </Button>
              <Button leadingVisual={RepoForkedIcon} size="small">
                Fork <VisuallyHidden>{repo.name}</VisuallyHidden>
              </Button>
            </Card.Metadata>
          </Card>
        </li>
      ))}
    </ul>
  )
}
