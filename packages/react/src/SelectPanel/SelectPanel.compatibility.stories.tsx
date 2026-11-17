import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, fireEvent, waitFor, within} from 'storybook/test'
import {FeatureFlags} from '../FeatureFlags'
import {Default as ConfiguredExample} from './SelectPanel.stories'
import {SingleSelectModal, MultiSelectModal, WithExternalAnchor, WithMessage} from './SelectPanel.features.stories'

const examples = {
  Default: ConfiguredExample,
  SingleSelectModal,
  MultiSelectModal,
  WithExternalAnchor,
  WithMessage,
}

const meta = {
  title: 'Components/SelectPanel/Configured Adapter',
  args: {composable: true, example: 'Default'},
  argTypes: {
    composable: {control: 'boolean'},
    example: {control: 'select', options: Object.keys(examples)},
  },
  render: ({composable, example}) => {
    const Example = examples[example]
    return (
      <FeatureFlags
        flags={{
          primer_react_select_panel_composable_adapter: composable,
        }}
      >
        <Example key={`${composable}-${example}`} />
      </FeatureFlags>
    )
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reuses the existing configured examples, unchanged. Controls reset the example. The default-off composable adapter uses shared primitives and a native dialog for compatible configured pickers. Browser command support is detected automatically; JavaScript activation handles unsupported commands. Turning composable off restores the original configured selection rules, heading and message markup, collection renderer, and AnchoredOverlay host. Explicit compositions always use native dialog. Native showModal makes even anchored panels truly modal. Save/Cancel and narrow defaults are retained; incompatible legacy positioning, reflow and focus opt-outs retain the configured legacy host.',
      },
    },
  },
} satisfies Meta<{composable: boolean; example: keyof typeof examples}>

export default meta

export const Default: StoryObj<typeof meta> = {
  play: async ({canvas, canvasElement, userEvent, args}) => {
    if (args.example !== 'Default') return
    await userEvent.click(canvas.getByRole('button', {name: /bug/}))
    const body = within(canvasElement.ownerDocument.body)
    const input = await body.findByRole('combobox', {name: 'Filter items'})
    await waitFor(() => expect(input).toHaveFocus())
    await expect(
      input.closest(
        args.composable ? '[data-component="SelectPanel.Collection"]' : '[data-component="FilteredActionList"]',
      ),
    ).toBeInTheDocument()
    await userEvent.type(input, 'enhancement')
    await expect(body.getAllByRole('option')).toHaveLength(1)
    await userEvent.click(body.getByRole('option', {name: /enhancement/}))
    await expect(body.getByRole('option', {name: /enhancement/})).toHaveAttribute('aria-selected', 'true')
    const dialog = body.getByRole('dialog')
    if (dialog instanceof HTMLDialogElement) {
      // Storybook's synthetic keyboard events cannot invoke the browser's
      // dialog cancel action. Real Escape is covered by the browser tests.
      fireEvent(dialog, new Event('cancel', {cancelable: true}))
    } else {
      await userEvent.keyboard('{Escape}')
    }
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const Legacy: StoryObj<typeof meta> = {
  ...Default,
  args: {composable: false},
}

export const Messages: StoryObj<typeof meta> = {
  args: {example: 'WithMessage'},
}

export const ModalTransaction: StoryObj<typeof meta> = {
  args: {example: 'SingleSelectModal'},
  play: async ({canvas, canvasElement, userEvent}) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', {name: 'Select labels'}))
    await userEvent.click(body.getByRole('option', {name: /enhancement/}))
    await expect(body.getByRole('dialog')).toBeVisible()
    await userEvent.click(body.getByRole('button', {name: 'Cancel'}))
    await expect(canvas.getByRole('button', {name: 'Select labels'})).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', {name: 'Select labels'}))
    await expect(body.getByRole('option', {name: /enhancement/})).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(body.getByRole('option', {name: /enhancement/}))
    await userEvent.click(body.getByRole('button', {name: 'Save'}))
    await expect(canvas.getByRole('button', {name: 'enhancement'})).toHaveFocus()
  },
}
