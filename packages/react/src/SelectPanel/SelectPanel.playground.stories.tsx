import type {Meta} from '@storybook/react-vite'
import {SelectPanelDemo} from './playground/SelectPanelDemo'
import {SelectPanelPlayground} from './playground/SelectPanelPlayground'
import {SelectPanelPlaygroundRecording} from './playground/SelectPanelPlaygroundRecording'
import {
  getPlaygroundRecordingFrame,
  isPlaygroundRecordingConfig,
  type PlaygroundRecordingConfig,
} from './playground/playgroundRecording'
import {
  IsolatedPreview,
  IsolatedPreviewSurface,
  StorybookPreview,
  StorybookPreviewSurface,
  type PreviewDefinition,
} from './playground/StorybookPreview'
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

const recordingDefinition: PreviewDefinition<PlaygroundRecordingConfig> = {
  storyId: 'components-selectpanel-playground--recording-surface',
  portalName: 'select-panel-playground-recording-preview',
  initialConfig: {elapsedMs: 0},
  isConfig: isPlaygroundRecordingConfig,
  presentationOnly: true,
  title: 'SelectPanel playground recording preview',
}

export const Recording = () => (
  <SelectPanelPlaygroundRecording
    skinSource={skinSource}
    renderPreview={props => <IsolatedPreview {...props} definition={recordingDefinition} />}
  />
)
Recording.globals = {colorScheme: 'dark'}

export const RecordingSurface = () => (
  <IsolatedPreviewSurface
    definition={recordingDefinition}
    renderPreview={({config, resetKey}) => {
      const frame = getPlaygroundRecordingFrame(config.elapsedMs)
      return <SelectPanelDemo config={frame.config} playback={frame.preview} resetKey={resetKey} />
    }}
  />
)
