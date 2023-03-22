import React from 'react'
import {Button} from '.'

export default {
  title: 'Drafts/Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const Outline = () => <Button variant="outline">Outline</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => <Button disabled>Default</Button>

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>
