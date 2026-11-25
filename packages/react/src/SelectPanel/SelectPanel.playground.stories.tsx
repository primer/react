import type {Meta} from '@storybook/react-vite'
import {SelectPanelDemo} from './playground/SelectPanelDemo'
import {SelectPanelPlayground} from './playground/SelectPanelPlayground'
import {StorybookPreview, StorybookPreviewSurface} from './playground/StorybookPreview'
import skinSource from './playground/SelectPanelDemo.module.css?raw'

const meta = {
  title: 'Components/SelectPanel/Playground',
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
  },
  globals: {
    showSurroundingElements: false,
  },
} satisfies Meta

export default meta

export const Playground = () => (
  <SelectPanelPlayground skinSource={skinSource} renderPreview={props => <StorybookPreview {...props} />} />
)

Playground.globals = {colorScheme: 'dark'}

export const PreviewSurface = () => <StorybookPreviewSurface renderPreview={props => <SelectPanelDemo {...props} />} />
