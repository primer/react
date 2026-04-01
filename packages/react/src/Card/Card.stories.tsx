import type {Meta} from '@storybook/react-vite'
import {RocketIcon, RepoIcon, StarIcon} from '@primer/octicons-react'
import {Card} from './index'

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta

export const Default = () => {
  return (
    <div style={{maxWidth: '400px'}}>
      <Card>
        <Card.Icon icon={RocketIcon} />
        <Card.Heading>Card Heading</Card.Heading>
        <Card.Description>This is a description of the card providing supplemental information.</Card.Description>
        <Card.Metadata>Updated 2 hours ago</Card.Metadata>
      </Card>
    </div>
  )
}

export const WithImage = () => {
  return (
    <div style={{maxWidth: '400px'}}>
      <Card>
        <Card.Image src="https://via.placeholder.com/400x200" alt="Placeholder" />
        <Card.Heading>Card with Image</Card.Heading>
        <Card.Description>This card uses an edge-to-edge image instead of an icon.</Card.Description>
      </Card>
    </div>
  )
}

export const WithMetadata = () => {
  return (
    <div style={{maxWidth: '400px'}}>
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
    </div>
  )
}

export const Playground = {
  render: () => (
    <div style={{maxWidth: '400px'}}>
      <Card>
        <Card.Icon icon={RocketIcon} />
        <Card.Heading>Playground Card</Card.Heading>
        <Card.Description>Experiment with the Card component and its subcomponents.</Card.Description>
        <Card.Metadata>Just now</Card.Metadata>
      </Card>
    </div>
  ),
}
