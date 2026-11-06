import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from './Avatar'

const src = 'https://avatars.githubusercontent.com/u/7143434?v=4'
const meta = {title: 'React Tailwind/Display/Avatar/Features', component: Avatar} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

export const Square: Story = {args: {square: true, alt: 'primer', src}}
export const Size: Story = {
  render: () => (
    <div>
      {[4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64].map(size => (
        <Avatar key={size} alt="mona" size={size} src={src} />
      ))}
    </div>
  ),
}
export const SizeResponsive: Story = {
  render: () => (
    <div>
      {[
        {narrow: 4, regular: 8, wide: 12},
        {narrow: 8, regular: 12, wide: 16},
        {narrow: 12, regular: 16, wide: 20},
        {narrow: 16, regular: 20, wide: 24},
        {narrow: 20, regular: 24, wide: 28},
        {narrow: 24, regular: 28, wide: 32},
        {narrow: 28, regular: 32, wide: 40},
        {narrow: 32, regular: 40, wide: 48},
        {narrow: 40, regular: 48, wide: 56},
        {narrow: 48, regular: 56, wide: 64},
      ].map(size => (
        <Avatar key={size.narrow} alt="mona" size={size} src={src} />
      ))}
    </div>
  ),
}
