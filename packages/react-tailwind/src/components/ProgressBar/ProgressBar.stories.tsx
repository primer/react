import {ProgressBar} from './ProgressBar'

export default {title: 'Display/ProgressBar', component: ProgressBar}
export const Default = {args: {progress: 60, 'aria-label': 'Upload'}}
export const Playground = {
  args: {progress: 42, variant: 'accent', size: 'large', animated: true, 'aria-label': 'Upload'},
}
