import React from 'react'
import {ComponentMeta} from '@storybook/react'
import ProgressBar from './ProgressBar'

export default {
  title: 'Components/ProgressBar/Features',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>

export const ProgressZero = () => <ProgressBar progress="0" />
export const ProgressHalf = () => <ProgressBar progress="50" />
export const ProgressDone = () => <ProgressBar progress="100" />

export const SizeSmall = () => <ProgressBar progress="66" barSize="small" />
export const SizeLarge = () => <ProgressBar progress="66" barSize="large" />

export const Inline = () => <ProgressBar inline progress="66" sx={{width: '100px'}} />

export const Color = () => <ProgressBar progress="66" bg="done.emphasis" />
