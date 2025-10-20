// import type {Meta} from '@storybook/react-vite'

import {Avatar} from '@primer/react'

export default () => <Avatar alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" />

// const DEFAULT_AVATAR_SIZE = 20

// export default {
//   title: 'Components/Avatar',
//   component: Avatar,
// }

// type Args = {
//   size?: number
//   sizeAtNarrow?: number
//   sizeAtRegular?: number
//   sizeAtWide?: number
// } & Omit<AvatarProps, 'size'>

// export const Playground: StoryFn<Args> = args => {
//   return (
//     <Avatar
//       size={DEFAULT_AVATAR_SIZE}
//       square={args.square}
//       src="https://avatars.githubusercontent.com/u/7143434?v=4"
//       alt="mona"
//     />
//   )
// }

// Playground.args = {
//   size: DEFAULT_AVATAR_SIZE,
// }

// Playground.argTypes = {
//   size: {
//     control: {
//       type: 'number',
//     },
//   },
//   sizeAtNarrow: {
//     name: 'size.narrow',
//     control: {
//       type: 'number',
//     },
//   },
//   sizeAtRegular: {
//     name: 'size.regular',
//     control: {
//       type: 'number',
//     },
//   },
//   sizeAtWide: {
//     name: 'size.wide',
//     control: {
//       type: 'number',
//     },
//   },
//   alt: {
//     controls: false,
//     table: {
//       disable: true,
//     },
//   },
// }
