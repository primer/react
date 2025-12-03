import type {Meta} from '@storybook/react-vite'
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

export const Inline = () => <ProgressBar inline progress="66" style={{width: '100px'}} aria-label="Upload test.png" />

export const AllColors = () => (
  <ProgressBar aria-label="Upload test.png">
    <ProgressBar.Item progress={20} aria-label="Photo Usage" bg="accent.emphasis" />
    <ProgressBar.Item progress={15} aria-label="Application Usage" bg="danger.emphasis" />
    <ProgressBar.Item progress={12} aria-label="Music Usage" bg="severe.emphasis" />
    <ProgressBar.Item progress={11} aria-label="Music Usage" bg="done.emphasis" />
    <ProgressBar.Item progress={8} aria-label="Music Usage" bg="sponsors.emphasis" />
    <ProgressBar.Item progress={7} aria-label="Music Usage" bg="neutral.emphasis" />
    <ProgressBar.Item progress={7} aria-label="Music Usage" bg="attention.emphasis" />
  </ProgressBar>
)

export const MultipleItems = () => (
  <ProgressBar>
    <ProgressBar.Item progress={33} aria-label="Photo Usage" bg="accent.emphasis" />
    <ProgressBar.Item progress={23} aria-label="Application Usage" bg={'danger.emphasis'} />
    <ProgressBar.Item progress={14} aria-label="Music Usage" bg={'severe.emphasis'} />
  </ProgressBar>
)

export const Animated = () => <ProgressBar progress="50" aria-label="Upload test.png" animated />
