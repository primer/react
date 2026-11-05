import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog, type DialogContentProps} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog/Features',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const longContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt. Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus luctus tempus posuere.'

const Content = ({
  footer = true,
  long = false,
  title = 'Dialog title',
}: {
  footer?: boolean
  long?: boolean
  title?: string
}) => (
  <>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>{long ? longContent : 'Dialog description and content.'}</Dialog.Description>
    </Dialog.Body>
    {footer && (
      <Dialog.Footer>
        <Dialog.Close render={<Button>Done</Button>} />
      </Dialog.Footer>
    )}
  </>
)

const DialogFixture = ({
  align,
  defaultOpen,
  footer,
  long = false,
  modal = true,
  position,
  title,
  triggerVariant,
  width,
}: Pick<DialogContentProps, 'align' | 'position' | 'width'> & {
  defaultOpen?: boolean
  footer?: boolean
  long?: boolean
  modal?: boolean | 'trap-focus'
  title?: string
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
}) => (
  <Dialog defaultOpen={defaultOpen} modal={modal}>
    <Dialog.Trigger render={<Button variant={triggerVariant}>Show dialog</Button>} />
    <Dialog.Content align={align} position={position} width={width}>
      <Content footer={footer} long={long} title={title} />
    </Dialog.Content>
  </Dialog>
)

const InsetFixture = ({children}: React.PropsWithChildren) => <div className="h-8">{children}</div>

export const WithCustomRenderers: Story = {render: () => <DialogFixture />}
export const WithDirectSubcomponents: Story = {render: () => <DialogFixture modal="trap-focus" />}
export const StressTest: Story = {
  render: () => <DialogFixture long position={{narrow: 'fullscreen', regular: 'center'}} />,
}
export const ReproMultistepDialogWithConditionalFooter: Story = {render: () => <DialogFixture />}
export const BottomSheetNarrow: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture
        defaultOpen
        footer={false}
        long
        position={{narrow: 'bottom', regular: 'center'}}
        title="My Dialog"
      />
    </InsetFixture>
  ),
}
export const FullScreenNarrow: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture
        defaultOpen
        footer={false}
        long
        position={{narrow: 'fullscreen', regular: 'center'}}
        title="My Dialog"
      />
    </InsetFixture>
  ),
}
export const SideSheet: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content position="right">
        <Content footer={false} long title="My Dialog" />
      </Dialog.Content>
    </Dialog>
  ),
}
export const ReturnFocusRef: Story = {
  render: () => <DialogFixture triggerVariant="primary" />,
}
export const NewIssues: Story = {render: () => <DialogFixture />}
export const RetainsFocusTrapWithDynamicContent: Story = {
  render: () => <DialogFixture modal="trap-focus" />,
}
export const LoadingFooterButtons: Story = {
  render: () => (
    <InsetFixture>
      <Dialog defaultOpen>
        <Dialog.Trigger render={<Button>Show Dialog</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog title</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <p>This is some text</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cancel</Button>} />
            <Button variant="danger">Delete Repository</Button>
            <Button autoFocus variant="primary">
              Save &amp; Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </InsetFixture>
  ),
}
export const LoadingCustomFooterButtonsCould: Story = {
  render: () => (
    <InsetFixture>
      <Dialog defaultOpen>
        <Dialog.Trigger render={<Button>Show Dialog</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <div>
              <Dialog.Title>Process Data</Dialog.Title>
              <div className="mt-1 text-sm text-muted">Custom footer with loading states</div>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <p>This is some text</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cancel</Button>} />
            <Button>Save Draft</Button>
            <Button autoFocus variant="primary">
              Process &amp; Continue
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </InsetFixture>
  ),
}
export const AlignTop: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture align="top" defaultOpen footer={false} long title="My Dialog" />
    </InsetFixture>
  ),
}
export const AlignBottom: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture align="bottom" defaultOpen footer={false} long title="My Dialog" />
    </InsetFixture>
  ),
}
export const CustomWidth: Story = {
  render: () => (
    <InsetFixture>
      <Dialog defaultOpen>
        <Dialog.Trigger render={<Button>Show dialog</Button>} />
        <Dialog.Content width="400px">
          <Content footer={false} long title="Custom Width Dialog" />
        </Dialog.Content>
      </Dialog>
    </InsetFixture>
  ),
}
