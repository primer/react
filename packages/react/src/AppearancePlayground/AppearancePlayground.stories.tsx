import {useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, fireEvent, userEvent, waitFor, within} from 'storybook/test'
import {AppearancePlayground, Dialog} from '../experimental'
import {Button} from '../Button'
import TextInput from '../TextInput'
import Label from '../Label'
import {
  PlaygroundAppearanceDials,
  PlaygroundAppearancePortals,
  PlaygroundAppearanceProvider,
  PlaygroundAppearanceSurface,
} from './AppearancePlayground'
import {PlaygroundThemePicker} from './AppearancePlaygroundThemePicker'
import {useAppearance} from '../internal/AppearancePlaygroundContext'
import classes from './AppearancePlayground.stories.module.css'

function DemoApp() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <main className={classes.App}>
      <Label>Internal demo</Label>
      <h1>Your app, different personalities</h1>
      <p>These are normal Primer components. The wrapper supplies the appearance controls and scoped styling.</p>
      <TextInput aria-label="Project name" placeholder="Project name" />
      <div className={classes.Actions}>
        <Button variant="primary">Create project</Button>
        <Button ref={trigger} onClick={() => setOpen(true)}>
          Open app dialog
        </Button>
      </div>
      {open && (
        <Dialog title="App dialog" onClose={() => setOpen(false)} returnFocusRef={trigger}>
          This portaled dialog follows the preview theme, density and typography.
        </Dialog>
      )}
    </main>
  )
}

const meta = {
  title: 'Components/AppearancePlayground',
  component: AppearancePlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Demo only. Import {AppearancePlayground} from '@primer/react/experimental' and wrap your app inside its existing Primer providers. Includes 20 themes, five density steps and five visual-only Seriousness presets. Automatic spacing changes are limited to one density step: Friendly social uses purple/pink, rounded shapes and soft shadows; Bank security uses neutral colors, square corners and raised OS-style buttons. The middle three presets retain theme colors. Controls retain the host theme; app content and inherited Primer portals are scoped. Default resets theme colors, typography/radii and density. State is not persisted. Nested wrappers and third-party/body portals are not supported. Inline style CSP restrictions may apply.",
      },
    },
  },
  args: {children: <DemoApp />},
  argTypes: {children: {control: false}},
} satisfies Meta<typeof AppearancePlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

function SidebarControlsDemo() {
  const {density, setDensity, seriousness, setSeriousness, theme, setTheme} = useAppearance()
  return (
    <PlaygroundThemePicker value={theme} onChange={setTheme}>
      <div className={classes.SidebarDials} role="group" aria-label="Density and Seriousness">
        <PlaygroundAppearanceDials
          density={density}
          seriousness={seriousness}
          onDensityChange={setDensity}
          onSeriousnessChange={setSeriousness}
        />
      </div>
    </PlaygroundThemePicker>
  )
}

export const SidebarControls: Story = {
  render: () => (
    <PlaygroundAppearanceProvider>
      <SidebarControlsDemo />
      <PlaygroundAppearanceSurface>
        <DemoApp />
      </PlaygroundAppearanceSurface>
      <PlaygroundAppearancePortals />
    </PlaygroundAppearanceProvider>
  ),
  play: async ({canvas, canvasElement}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Choose theme: Primer'}))
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(await body.findByRole('dialog', {name: 'Themes'}))
    const density = dialog.getByRole('slider', {name: 'Density'})
    const seriousness = dialog.getByRole('slider', {name: 'Seriousness'})
    fireEvent.change(density, {target: {value: '4'}})
    await expect(density).toHaveValue('4')
    fireEvent.change(seriousness, {target: {value: '4'}})
    await expect(seriousness).toHaveAttribute('aria-valuetext', 'Bank security')
    await expect(density).toHaveAttribute('aria-valuetext', 'Compact')
    await userEvent.click(dialog.getByRole('button', {name: 'Use MS DOS theme'}))
    await expect(seriousness).toHaveAttribute('aria-valuetext', 'Bank security')
    await expect(density).toHaveAttribute('aria-valuetext', 'Compact')
    await userEvent.keyboard('{Escape}')
    await expect(canvas.getByRole('button', {name: 'Choose theme: MS DOS'})).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', {name: 'Choose theme: MS DOS'}))
    const reopened = within(await body.findByRole('dialog', {name: 'Themes'}))
    await expect(reopened.getByRole('slider', {name: 'Seriousness'})).toHaveAttribute('aria-valuetext', 'Bank security')
  },
}

export const MSDOS: Story = {
  name: 'MS DOS',
  play: async ({canvas, canvasElement}) => {
    const trigger = canvas.getByRole('button', {name: 'Choose theme: Primer'})
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(await body.findByRole('dialog', {name: 'Themes'}))
    const theme = dialog.getByRole('button', {name: 'Use MS DOS theme'})
    await userEvent.click(theme)
    await expect(theme).toHaveAttribute('aria-pressed', 'true')
    await expect(dialog.queryByRole('group', {name: 'Active theme source'})).not.toBeInTheDocument()
    await expect(dialog.queryByRole('link')).not.toBeInTheDocument()
    await expect(dialog.queryByText(/Adapted from the public Turbo blue palette/)).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(trigger).toHaveAccessibleName('Choose theme: MS DOS')
    const style = canvasElement.querySelector('[data-playground-appearance-style]')
    await expect(style).toHaveTextContent('--bgColor-default: #00006c')
    await expect(style).toHaveTextContent("--fontStack-system: 'Playground IBM VGA', 'Courier New', monospace")
    await expect(style).toHaveTextContent('--borderRadius-medium: 0px')
    const fonts = await canvasElement.ownerDocument.fonts.load('16px "Playground IBM VGA"')
    await expect(fonts).toHaveLength(1)
  },
}

export const NewYorkTimes: Story = {
  play: async ({canvas, canvasElement}) => {
    const trigger = canvas.getByRole('button', {name: 'Choose theme: Primer'})
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(await body.findByRole('dialog', {name: 'Themes'}))
    const theme = dialog.getByRole('button', {name: 'Use New York Times theme'})
    await userEvent.click(theme)
    await expect(theme).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(trigger).toHaveAccessibleName('Choose theme: New York Times')
    await expect(canvasElement.querySelector('[data-playground-appearance-style]')).toHaveTextContent(
      "--fontStack-system: Georgia, 'Times New Roman', Times, serif",
    )
  },
}

export const Playground: Story = {
  play: async ({canvas, canvasElement}) => {
    const seriousness = canvas.getByRole('slider', {name: 'Seriousness'})
    const density = canvas.getByRole('slider', {name: 'Density'})
    fireEvent.change(seriousness, {target: {value: '4'}})
    await expect(seriousness).toHaveAttribute('aria-valuetext', 'Bank security')
    await expect(density).toHaveAttribute('aria-valuetext', 'Compact')
    fireEvent.change(seriousness, {target: {value: '2'}})
    await expect(seriousness).toHaveAttribute('aria-valuetext', 'Default')
    const trigger = canvas.getByRole('button', {name: 'Choose theme: Primer'})
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(await body.findByRole('dialog', {name: 'Themes'}))
    await userEvent.type(dialog.getByRole('searchbox', {name: 'Search palettes'}), 'Linear')
    const theme = dialog.getByRole('button', {name: 'Use Linear (Dark) theme'})
    await userEvent.click(theme)
    await expect(theme).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
