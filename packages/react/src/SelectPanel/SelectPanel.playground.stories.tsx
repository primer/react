import type {Meta} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
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

Playground.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const frame = canvas.getByTitle<HTMLIFrameElement>('Interactive SelectPanel preview')
  await waitFor(() => expect(frame).toBeVisible(), {timeout: 30_000})
  const previewDocument = frame.contentDocument
  if (!previewDocument) throw new Error('Expected the same-origin Storybook preview')
  const preview = within(previewDocument.body)
  const previewUser = userEvent.setup({document: previewDocument})
  await userEvent.selectOptions(canvas.getByRole('combobox', {name: 'Appearance'}), '2')
  await previewUser.click(await preview.findByRole('button', {name: 'copilot-app'}))
  const input = await preview.findByRole('combobox', {name: 'Search repositories'})
  await previewUser.type(input, 'reforge')
  await waitFor(() => expect(preview.getAllByRole('option')).toHaveLength(1))
  await previewUser.keyboard('{ArrowDown}{Enter}')
  await waitFor(() => expect(preview.queryByRole('dialog')).not.toBeInTheDocument())
  await expect(preview.getByRole('button', {name: 'reforge'})).toHaveFocus()
  await userEvent.click(canvas.getByRole('button', {name: 'Code'}))
  await expect(canvas.getByRole('region', {name: 'React example'})).toHaveTextContent('SelectPanel.Root')
  await userEvent.click(canvas.getByRole('button', {name: 'CSS'}))
  await expect(canvas.getByRole('region', {name: 'Picker CSS'})).toHaveTextContent('.Theme')
}

export const PreviewSurface = () => <StorybookPreviewSurface renderPreview={props => <SelectPanelDemo {...props} />} />
