import {AvatarStack} from './AvatarStack'
import {Avatar} from '../Avatar'

export default {title: 'Display/AvatarStack', component: AvatarStack}
export const Default = {
  render: () => (
    <AvatarStack>
      <Avatar src="https://github.com/github.png" />
      <Avatar src="https://github.com/primer.png" />
    </AvatarStack>
  ),
}
export const Playground = {args: {variant: 'stack', alignRight: true}}
