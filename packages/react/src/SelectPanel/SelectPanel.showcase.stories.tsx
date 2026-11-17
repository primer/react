import type {Meta} from '@storybook/react-vite'
import {SelectPanelShowcase} from './playground/SelectPanelShowcase'
import {ShowcaseSurface} from './playground/ShowcaseSurface'
import {isShowcaseConfig, type ShowcaseConfig} from './playground/showcase'
import {IsolatedPreview, IsolatedPreviewSurface, type PreviewDefinition} from './playground/StorybookPreview'

const definition: PreviewDefinition<ShowcaseConfig> = {
  storyId: 'components-selectpanel-showcase--preview-surface',
  portalName: 'select-panel-showcase-preview',
  initialConfig: {elapsedMs: 0},
  isConfig: isShowcaseConfig,
  presentationOnly: true,
  title: 'SelectPanel showcase film',
}

const meta = {
  title: 'Components/SelectPanel/Showcase',
  parameters: {layout: 'fullscreen', controls: {disable: true}},
  globals: {showSurroundingElements: false, colorScheme: 'light'},
} satisfies Meta

export default meta

export const Showcase = () => (
  <SelectPanelShowcase renderPreview={props => <IsolatedPreview {...props} definition={definition} />} />
)

export const PreviewSurface = () => (
  <IsolatedPreviewSurface definition={definition} renderPreview={({config}) => <ShowcaseSurface {...config} />} />
)
