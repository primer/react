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

export const Inline = () => <ProgressBar inline progress="66" sx={{width: '100px'}} aria-label="Upload test.png" />

export const Color = () => <ProgressBar progress="66" bg="done.emphasis" aria-label="Upload test.png" />

export const MultipleItems = () => (
  <ProgressBar>
    <ProgressBar.Item progress={33} aria-label="Photo Usage" sx={{bg: 'accent.emphasis'}} />
    <ProgressBar.Item progress={23} aria-label="Application Usage" bg={'danger.emphasis'} />
    <ProgressBar.Item progress={14} aria-label="Music Usage" bg={'severe.emphasis'} />
  </ProgressBar>
)

export const Animated = () => <ProgressBar progress="50" aria-label="Upload test.png" animated />
