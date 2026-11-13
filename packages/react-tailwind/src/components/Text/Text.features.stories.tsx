import type {Meta, StoryObj} from '@storybook/react-vite'
import {Text} from './Text'

const meta = {title: 'React Tailwind/Display/Text/Features', component: Text} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Polymorphism: Story = {
  render: () => (
    <div className="flex flex-col">
      <Text as="em">Emphasized text</Text>
      <Text as="i">Italicized text</Text>
      <Text as="strong">Strong text</Text>
      <Text as="small">Small text</Text>
      <Text as="u">Text with underline</Text>
    </div>
  ),
}
export const StyledText: Story = {
  args: {
    as: 'p',
    size: 'small',
    className: 'bg-neutral-emphasis p-2 text-on-emphasis',
    children: 'Stylized text',
  },
}
export const SizeSmall: Story = {args: {as: 'span', size: 'small', children: 'Stylized text'}}
export const SizeMedium: Story = {args: {as: 'span', size: 'medium', children: 'Stylized text'}}
export const SizeLarge: Story = {args: {as: 'span', size: 'large', children: 'Stylized text'}}
export const LightWeight: Story = {args: {as: 'span', weight: 'light', children: 'Stylized text'}}
export const NormalWeight: Story = {args: {as: 'span', weight: 'normal', children: 'Stylized text'}}
export const MediumWeight: Story = {args: {as: 'span', weight: 'medium', children: 'Stylized text'}}
export const SemiboldWeight: Story = {args: {as: 'span', weight: 'semibold', children: 'Stylized text'}}
export const PreWhiteSpace: Story = {args: {as: 'span', whiteSpace: 'pre', children: 'Stylized text'}}
export const NormalWhiteSpace: Story = {args: {as: 'span', whiteSpace: 'normal', children: 'Stylized text'}}
export const NowrapWhiteSpace: Story = {args: {as: 'span', whiteSpace: 'nowrap', children: 'Stylized text'}}
export const PreWrapWhiteSpace: Story = {args: {as: 'span', whiteSpace: 'pre-wrap', children: 'Stylized text'}}
export const PreLineWhiteSpace: Story = {args: {as: 'span', whiteSpace: 'pre-line', children: 'Stylized text'}}
