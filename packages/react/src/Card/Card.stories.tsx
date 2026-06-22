import type {Meta, StoryFn} from '@storybook/react-vite'
import {PeopleIcon, RocketIcon} from '@primer/octicons-react'
import {Card} from './index'
import classes from './Card.stories.module.css'

const meta = {
  title: 'Experimental/Components/Card',
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

export const Default = () => {
  return (
    <Card>
      <Card.Icon icon={RocketIcon} />
      <Card.Heading>Card Heading</Card.Heading>
      <Card.Description>This is a description of the card providing supplemental information.</Card.Description>
      <Card.Metadata>
        <PeopleIcon size={16} />3 contributors
      </Card.Metadata>
    </Card>
  )
}

type PlaygroundArgs = {
  showIcon: boolean
  showMetadata: boolean
  layout: 'default' | 'compact'
  padding: 'none' | 'condensed' | 'normal'
  borderRadius: 'medium' | 'large'
}

export const Playground: StoryFn<PlaygroundArgs> = ({showIcon, showMetadata, layout, padding, borderRadius}) => (
  <Card layout={layout} padding={padding} borderRadius={borderRadius}>
    {showIcon && <Card.Icon icon={RocketIcon} />}
    <Card.Heading>Playground Card</Card.Heading>
    <Card.Description>Experiment with the Card component and its subcomponents.</Card.Description>
    {showMetadata && <Card.Metadata>Just now</Card.Metadata>}
  </Card>
)

Playground.args = {
  showIcon: true,
  showMetadata: true,
  layout: 'default',
  padding: 'normal',
  borderRadius: 'large',
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
  layout: {
    control: {type: 'radio'},
    options: ['default', 'compact'],
    description: 'Controls the layout of the Card',
  },
  padding: {
    control: {type: 'radio'},
    options: ['none', 'condensed', 'normal'],
    description: 'Controls the internal padding of the Card',
  },
  borderRadius: {
    control: {type: 'radio'},
    options: ['medium', 'large'],
    description: 'Controls the border radius of the Card',
  },
}
