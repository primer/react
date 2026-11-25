import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, waitFor, within} from 'storybook/test'
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
      <FeatureFlags flags={{primer_react_select_panel_composable_adapter: composable}}>
        <Example key={`${composable}-${example}`} />
      </FeatureFlags>
    )
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reuses existing configured examples. The default-off adapter composes the new parts without changing call sites. Turning it off restores configured selection rules, message markup and the original collection renderer. Both paths use the ordinary AnchoredOverlay host; native hosting is a separate experiment.',
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
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(1))
    await userEvent.click(body.getByRole('option', {name: /enhancement/}))
    await expect(body.getByRole('option', {name: /enhancement/})).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const Legacy: StoryObj<typeof meta> = {...Default, args: {composable: false}}

export const Messages: StoryObj<typeof meta> = {args: {example: 'WithMessage'}}
