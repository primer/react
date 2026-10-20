import {useState} from 'react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {KebabHorizontalIcon, PinIcon, RepoIcon, RepoForkedIcon, StarIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Button, IconButton} from '../Button'
import {VisuallyHidden} from '../VisuallyHidden'
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

export const WithLink = () => (
  <Card shadow={false} padding="regular">
    <Card.Icon icon={RepoIcon} />
    <Card.Heading>
      <Card.Link href="#primer-react">primer/react</Card.Link>
    </Card.Heading>
    <Card.Description>The entire card links to the repository. The Star action remains separate.</Card.Description>
    <Card.Metadata>
      <Button leadingVisual={StarIcon} size="small">
        Star <VisuallyHidden>primer/react</VisuallyHidden>
      </Button>
    </Card.Metadata>
    <Card.Action>
      <IconButton icon={KebabHorizontalIcon} aria-label="More options for primer/react" variant="invisible" />
    </Card.Action>
  </Card>
)

export const WithButton: StoryFn = () => {
  const [opened, setOpened] = useState(false)
  return (
    <div className={classes.CardList}>
      <Card layout="compact" padding="regular" shadow={false}>
        <Card.Icon icon={RepoIcon} />
        <Card.Heading>
          <Card.Button onClick={() => setOpened(true)}>Open repository details</Card.Button>
        </Card.Heading>
        <Card.Description>Use a button for an action that does not navigate to another page.</Card.Description>
      </Card>
      <Card>
        <Card.Heading>
          <Card.Button disabled>Repository details unavailable</Card.Button>
        </Card.Heading>
        <Card.Description>A disabled primary action cannot be activated.</Card.Description>
      </Card>
      {opened && (
        <section aria-label="Repository details">
          <h3>primer/react</h3>
          <p>{"React components for GitHub's Primer Design System."}</p>
          <Button onClick={() => setOpened(false)}>Close repository details</Button>
        </section>
      )}
    </div>
  )
}

WithButton.play = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByRole('button', {name: 'Open repository details'}))
  await expect(canvas.getByRole('region', {name: 'Repository details'})).toBeVisible()
  await userEvent.click(canvas.getByRole('button', {name: 'Close repository details'}))
  await expect(canvas.queryByRole('region', {name: 'Repository details'})).not.toBeInTheDocument()
}

export const CustomContent: StoryFn = () => {
  const [pinned, setPinned] = useState<string[]>([])
  return (
    <div className={classes.EqualHeightGrid}>
      {['primer/react', 'primer/primitives-with-a-long-unbroken-repository-name'].map((name, index) => (
        <Card key={name} padding="regular" borderRadius="medium" shadow={false}>
          <div className={classes.ComposedBody}>
            <div className={classes.ComposedHeader}>
              <Card.Heading className={classes.ComposedHeading}>
                <Card.Link href={`#${name}`}>{name}</Card.Link>
              </Card.Heading>
              <IconButton
                icon={PinIcon}
                variant="invisible"
                size="small"
                aria-label={`Pin ${name}`}
                aria-pressed={pinned.includes(name)}
                onClick={() =>
                  setPinned(value => (value.includes(name) ? value.filter(item => item !== name) : [...value, name]))
                }
              />
            </div>
            <Card.Description>
              {index === 0
                ? 'React components.'
                : 'Design tokens for color, spacing, typography, and motion, shared across GitHub interfaces.'}
            </Card.Description>
            <div className={classes.ComposedFooter}>
              <Button size="small" leadingVisual={StarIcon}>
                Star <VisuallyHidden>{name}</VisuallyHidden>
              </Button>
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton
                    icon={KebabHorizontalIcon}
                    variant="invisible"
                    size="small"
                    aria-label={`More options for ${name}`}
                  />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                  <ActionList>
                    <ActionList.LinkItem href={`#settings-${name}`}>Repository settings</ActionList.LinkItem>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

CustomContent.play = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  const pin = canvas.getByRole('button', {name: 'Pin primer/react'})
  await userEvent.click(pin)
  await expect(pin).toHaveAttribute('aria-pressed', 'true')
}

export const WithImage = () => {
  return (
    <Card>
      <Card.Image src="https://github.com/octocat.png" alt="Octocat" />
      <Card.Heading>Card with Image</Card.Heading>
      <Card.Description>This card uses an edge-to-edge image instead of an icon.</Card.Description>
    </Card>
  )
}

export const Compact = () => {
  return (
    <Card layout="compact">
      <Card.Icon icon={RepoIcon} />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>
        The compact layout uses tighter spacing, an icon without a background container, and a smaller title.
      </Card.Description>
      <Card.Metadata>
        <StarIcon size={16} />
        1.2k stars
      </Card.Metadata>
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
