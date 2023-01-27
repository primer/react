import {HeartIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'

export default {
  title: 'Components/IconButton/Features',
}

export const Primary = () => <IconButton icon={HeartIcon} variant="primary" aria-label="Primary" />

export const Danger = () => <IconButton icon={HeartIcon} variant="danger" aria-label="Danger" />

export const Invisible = () => <IconButton icon={HeartIcon} variant="invisible" aria-label="Invisible" />

export const Disabled = () => <IconButton disabled icon={HeartIcon} aria-label="Disabled" />

export const Small = () => <IconButton size="small" icon={HeartIcon} aria-label="Default" />

export const Medium = () => <IconButton size="medium" icon={HeartIcon} aria-label="Default" />

export const Large = () => <IconButton size="large" icon={HeartIcon} aria-label="Default" />
