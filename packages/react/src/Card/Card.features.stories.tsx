import type {Meta} from '@storybook/react-vite'
import {RepoIcon, StarIcon} from '@primer/octicons-react'
import {Card} from './index'

const meta = {
  title: 'Experimental/Components/Card/Features',
  component: Card,
} satisfies Meta<typeof Card>

export default meta

export const WithImage = () => {
  return (
    <div style={{maxWidth: '400px'}}>
      <Card>
        <Card.Image src="https://github.com/octocat.png" alt="Octocat" />
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
