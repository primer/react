import {Truncate} from './Truncate'

export default {title: 'Display/Truncate', component: Truncate}
export const Default = {
  args: {children: 'A long branch name that truncates', title: 'A long branch name that truncates'},
}
export const Playground = {
  args: {
    children: 'A long branch name that truncates',
    title: 'A long branch name that truncates',
    inline: true,
    maxWidth: 180,
  },
}
