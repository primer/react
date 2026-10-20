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
  padding: 'none' | 'condensed' | 'normal' | 'spacious'
  shadow: boolean
  borderRadius: 'medium' | 'large'
}

export const Playground: StoryFn<PlaygroundArgs> = ({
  showIcon,
  showMetadata,
  layout,
  padding,
  borderRadius,
  shadow,
}) => (
  <Card layout={layout} padding={padding} borderRadius={borderRadius} shadow={shadow}>
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
  shadow: true,
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
    options: ['none', 'condensed', 'normal', 'spacious'],
    description: 'Internal padding: none (0px), condensed (8px), normal (16px), spacious (24px)',
  },
  borderRadius: {
    control: {type: 'radio'},
    options: ['medium', 'large'],
    description: 'Controls the border radius of the Card',
  },
  shadow: {
    control: {type: 'boolean'},
    description: 'Show or hide the Card shadow',
  },
}
