import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonAvatar, type SkeletonAvatarProps} from './SkeletonAvatar'

const meta = {
  title: 'React Tailwind/Display/SkeletonAvatar',
  component: SkeletonAvatar,
} satisfies Meta<typeof SkeletonAvatar>

export default meta

type Story = StoryObj<typeof meta>
type PlaygroundArgs = Omit<SkeletonAvatarProps, 'size'> & {
  size?: number
  sizeAtNarrow?: number
  sizeAtRegular?: number
  sizeAtWide?: number
}

export const Default: Story = {args: {}}
export const Playground: StoryObj<PlaygroundArgs> = {
  args: {size: 20, square: false},
  argTypes: {
    square: {control: 'boolean'},
    size: {control: 'number'},
    sizeAtNarrow: {name: 'size.narrow', control: 'number'},
    sizeAtRegular: {name: 'size.regular', control: 'number'},
    sizeAtWide: {name: 'size.wide', control: 'number'},
  },
  render: ({size, sizeAtNarrow, sizeAtRegular, sizeAtWide, ...args}) => {
    const responsive = sizeAtNarrow !== undefined || sizeAtRegular !== undefined || sizeAtWide !== undefined
    return (
      <SkeletonAvatar
        {...args}
        size={
          responsive
            ? {
                narrow: sizeAtNarrow,
                regular: sizeAtRegular,
                wide: sizeAtWide,
              }
            : size
        }
      />
    )
  },
}
