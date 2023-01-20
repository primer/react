import {HeartIcon, ChevronDownIcon, ChevronUpIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'
import {Button} from '../Button'

export default {
  title: 'Components/IconButton/Features',
}

export const Default = () => <IconButton icon={HeartIcon} aria-label="Default" />

export const Primary = () => <IconButton icon={HeartIcon} variant="primary" aria-label="Primary" />

export const Danger = () => <IconButton icon={HeartIcon} variant="danger" aria-label="Danger" />

export const Invisible = () => <IconButton icon={HeartIcon} variant="invisible" aria-label="Invisible" />

export const Disabled = () => <IconButton disabled icon={HeartIcon} aria-label="Disabled" />

export const Small = () => <IconButton size="small" icon={HeartIcon} aria-label="Default" />

export const Medium = () => <IconButton size="medium" icon={HeartIcon} aria-label="Default" />

export const Large = () => <IconButton size="large" icon={HeartIcon} aria-label="Default" />

export const ChevronTest = () => (
  <>
    <div style={{marginBottom: '2rem'}}>
      <IconButton size="medium" variant="invisible" icon={ChevronDownIcon} aria-label="Default" />
      <IconButton size="medium" variant="invisible" icon={ChevronUpIcon} aria-label="Default" />
    </div>
    <div style={{marginBottom: '2rem'}}>
      <IconButton size="medium" variant="default" icon={ChevronDownIcon} aria-label="Default" />
      <IconButton size="medium" variant="default" icon={ChevronUpIcon} aria-label="Default" />
    </div>
    <div style={{marginBottom: '2rem'}}>
      <IconButton size="medium" variant="default" icon={ChevronDownIcon} aria-label="Default" />
    </div>
    <div style={{marginBottom: '2rem'}}>
      <IconButton size="medium" variant="default" icon={ChevronUpIcon} aria-label="Default" />
    </div>
    <div style={{marginBottom: '2rem'}}>
      <Button size="medium" variant="default" trailingIcon={ChevronDownIcon}>
        Button
      </Button>
    </div>
  </>
)
