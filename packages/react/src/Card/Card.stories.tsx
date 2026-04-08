import type {Meta, StoryFn} from '@storybook/react-vite'
import {RocketIcon} from '@primer/octicons-react'
import {Card} from './index'

const meta = {
  title: 'Experimental/Components/Card',
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
  padding: 'normal' | 'none'
}

export const Playground: StoryFn<PlaygroundArgs> = ({showIcon, showMetadata, padding}) => (
  <div style={{maxWidth: '400px'}}>
    <Card padding={padding}>
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
  padding: 'normal',
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
  padding: {
    control: {type: 'radio'},
    options: ['none', 'condensed', 'normal'],
    description: 'Controls the internal padding of the Card',
  },
}
