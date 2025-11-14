import {Avatar} from '@primer/react'
import {parseSizeFromArgs} from 'storyHelpers'

const Playground = args => {
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
