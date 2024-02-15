import React from 'react'
import type {Meta} from '@storybook/react'
import {ProgressBar} from '..'

export default {
  title: 'Components/ProgressBar/Features',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const ProgressZero = () => <ProgressBar progress="0" aria-label="Upload test.png" />
export const ProgressHalf = () => <ProgressBar progress="50" aria-label="Upload test.png" />
export const ProgressDone = () => <ProgressBar progress="100" aria-label="Upload test.png" />

export const SizeSmall = () => <ProgressBar progress="66" barSize="small" aria-label="Upload test.png" />
export const SizeLarge = () => <ProgressBar progress="66" barSize="large" aria-label="Upload test.png" />

export const Inline = () => <ProgressBar inline progress="66" sx={{width: '100px'}} aria-label="Upload test.png" />

export const Color = () => <ProgressBar progress="66" bg="done.emphasis" aria-label="Upload test.png" />

export const MultipleItems = () => (
  <ProgressBar aria-valuenow={70} aria-label="Upload test.png">
    <ProgressBar.Item progress={33} />
    <ProgressBar.Item progress={23} sx={{backgroundColor: 'danger.emphasis'}} />
    <ProgressBar.Item progress={14} sx={{backgroundColor: 'severe.emphasis'}} />
  </ProgressBar>
)

export const Animated = () => <ProgressBar progress="50" aria-label="Upload test.png" animated />
