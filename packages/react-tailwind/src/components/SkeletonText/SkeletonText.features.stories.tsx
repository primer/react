import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonText} from './SkeletonText'

const meta = {
  title: 'React Tailwind/Display/SkeletonText/Features',
  component: SkeletonText,
} satisfies Meta<typeof SkeletonText>

export default meta
type Story = StoryObj<typeof meta>

export const WithMaxWidth: Story = {args: {maxWidth: 200}}
export const WithMultipleLines: Story = {args: {lines: 3}}
export const Display: Story = {args: {size: 'display'}}
export const Subtitle: Story = {args: {size: 'subtitle'}}
export const TitleLarge: Story = {args: {size: 'titleLarge'}}
export const TitleMedium: Story = {args: {size: 'titleMedium'}}
export const TitleSmall: Story = {args: {size: 'titleSmall'}}
export const BodyLarge: Story = {args: {size: 'bodyLarge'}}
export const BodyMedium: Story = {args: {size: 'bodyMedium'}}
export const BodySmall: Story = {args: {size: 'bodySmall'}}

export const FractionalLines: Story = {args: {lines: 2.8}}
