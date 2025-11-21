import {Avatar, type AvatarProps} from '../../index'
import {parseSizeFromArgs} from '../storyHelpers'

type Args = {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
} & Omit<AvatarProps, 'size'>

const Playground = (args: Args) => {
  return (
    <Avatar
      size={parseSizeFromArgs(args)}
      square={args.square}
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
      alt="mona"
    />
  )
}

export default Playground
