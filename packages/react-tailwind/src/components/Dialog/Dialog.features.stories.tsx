import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog} from './Dialog'

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
  contentClassName,
  defaultOpen,
  footer,
  long = false,
  modal = true,
  title,
  triggerInactive,
  triggerVariant,
  viewportClassName,
}: {
  contentClassName?: string
  defaultOpen?: boolean
  footer?: boolean
  long?: boolean
  modal?: boolean | 'trap-focus'
  title?: string
  triggerInactive?: boolean
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
  viewportClassName?: string
}) => (
  <Dialog defaultOpen={defaultOpen} modal={modal}>
    <Dialog.Trigger
      render={
        <Button inactive={triggerInactive} variant={triggerVariant}>
          Show dialog
        </Button>
      }
    />
    <Dialog.Content className={contentClassName} viewportClassName={viewportClassName}>
      <Content footer={footer} long={long} title={title} />
    </Dialog.Content>
  </Dialog>
)

const InsetFixture = ({children}: React.PropsWithChildren) => <div className="h-8">{children}</div>

export const WithCustomRenderers: Story = {render: () => <DialogFixture />}
export const WithDirectSubcomponents: Story = {render: () => <DialogFixture modal="trap-focus" />}
export const StressTest: Story = {render: () => <DialogFixture long />}
export const ReproMultistepDialogWithConditionalFooter: Story = {render: () => <DialogFixture />}
export const BottomSheetNarrow: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture
        contentClassName="max-md:max-w-none max-md:rounded-t-lg max-md:rounded-b-none"
        defaultOpen
        footer={false}
        long
        title="My Dialog"
        triggerInactive
        viewportClassName="max-md:items-end max-md:p-0"
      />
    </InsetFixture>
  ),
}
export const FullScreenNarrow: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture
        contentClassName="max-md:h-full max-md:max-w-none max-md:rounded-none"
        defaultOpen
        footer={false}
        long
        title="My Dialog"
        triggerInactive
        viewportClassName="p-0"
      />
    </InsetFixture>
  ),
}
export const SideSheet: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Trigger render={<Button inactive>Show dialog</Button>} />
      <Dialog.Content
        className="h-full w-[calc(100%_-_64px)] max-w-[640px] rounded-none rounded-l-lg"
        viewportClassName="items-stretch justify-end p-0"
      >
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
        <Dialog.Trigger render={<Button inactive>Show Dialog</Button>} />
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
        <Dialog.Trigger render={<Button inactive>Show Dialog</Button>} />
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
      <DialogFixture
        defaultOpen
        footer={false}
        long
        title="My Dialog"
        triggerInactive
        viewportClassName="items-start pt-16"
      />
    </InsetFixture>
  ),
}
export const AlignBottom: Story = {
  render: () => (
    <InsetFixture>
      <DialogFixture
        defaultOpen
        footer={false}
        long
        title="My Dialog"
        triggerInactive
        viewportClassName="items-end pb-16"
      />
    </InsetFixture>
  ),
}
export const CustomWidth: Story = {
  render: () => (
    <InsetFixture>
      <Dialog defaultOpen>
        <Dialog.Trigger render={<Button inactive>Show dialog</Button>} />
        <Dialog.Content className="max-w-[400px]">
          <Content footer={false} long title="Custom Width Dialog" />
        </Dialog.Content>
      </Dialog>
    </InsetFixture>
  ),
}
