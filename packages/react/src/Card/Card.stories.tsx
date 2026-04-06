import type {Meta} from '@storybook/react-vite'
import {RocketIcon} from '@primer/octicons-react'
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
