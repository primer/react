import type {Meta, StoryFn} from '@storybook/react-vite'
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

type PlaygroundArgs = {
  showIcon: boolean
  showMetadata: boolean
}

export const Playground: StoryFn<PlaygroundArgs> = ({showIcon, showMetadata}) => (
  <div style={{maxWidth: '400px'}}>
    <Card>
      {showIcon && <Card.Icon icon={RocketIcon} />}
      <Card.Heading>Playground Card</Card.Heading>
      <Card.Description>Experiment with the Card component and its subcomponents.</Card.Description>
      {showMetadata && <Card.Metadata>Just now</Card.Metadata>}
    </Card>
  </div>
)

Playground.args = {
  showIcon: true,
  showMetadata: true,
}

Playground.argTypes = {
  showIcon: {
    control: {type: 'boolean'},
    description: 'Show or hide the Card.Icon subcomponent',
  },
  showMetadata: {
    control: {type: 'boolean'},
    description: 'Show or hide the Card.Metadata subcomponent',
  },
}

export const CustomContent = () => (
  <div style={{maxWidth: '400px'}}>
    <Card>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <strong>Custom Content Card</strong>
        <p style={{margin: 0}}>This card uses arbitrary custom content instead of the built-in subcomponents.</p>
        <ul style={{margin: 0, paddingLeft: '16px'}}>
          <li>Item one</li>
          <li>Item two</li>
          <li>Item three</li>
        </ul>
      </div>
    </Card>
  </div>
)
