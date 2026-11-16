import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId, useRef, useState} from 'react'
import {flushSync} from 'react-dom'
import {ActionList} from '../ActionList'
import {Button} from '../Button'
import {Stack} from '../Stack'
import {TextInput} from '../TextInput'
import {Dialog, type DialogContentProps} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog/Features',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const longContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt. Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus luctus tempus posuere.'

const lipsumParagraphs = [
  longContent,
  'Curabitur scelerisque bibendum faucibus. Duis rhoncus nunc est, at pharetra eros tristique a. Nam sodales turpis lectus, quis faucibus felis fermentum in. Curabitur vel velit vel eros laoreet pharetra. Aenean in facilisis sapien, eu porttitor ex. Donec ultrices ac arcu ut lobortis. Pellentesque vitae rutrum orci. Etiam pretium et enim sit amet scelerisque. Nulla sed odio nec lorem dapibus condimentum at sagittis quam. Sed in ornare ex, sed luctus sem. Mauris a est tellus.',
  'Sed fringilla est ac urna aliquet, eget condimentum felis vulputate. Sed sagittis eros non mauris sodales molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ante leo, condimentum sed lectus non, rutrum octopodes urna. Mauris neque ante, interdum molestie tellus pharetra, eleifend dapibus justo. Sed at diam ligula. Donec dapibus ipsum quis elit euismod, sed suscipit eros euismod. Aliquam pretium felis quis risus luctus fringilla. Ut purus lacus, mattis a turpis eget, sollicitudin pellentesque neque.',
  'Nunc sodales quis ante quis porttitor. Vestibulum ornare lacinia ante. Donec a nisi nec arcu aliquam pretium in nec nunc. Donec fringilla erat vitae viverra feugiat. Sed non odio vel ipsum porttitor maximus. Donec id eleifend lectus. Proin varius felis sit amet neque eleifend, vitae porttitor ligula commodo.',
  'Vivamus felis quam, porttitor a justo sit amet, placerat ultricies nisl. Suspendisse potenti. Maecenas non consequat lorem, eu porta ante. Pellentesque elementum diam sapien, nec ultrices risus convallis eget. Nam pharetra dolor at dictum tempor. Quisque ut est a ligula hendrerit sodales. Curabitur ornare a nulla in laoreet. Maecenas semper mi egestas, dignissim nisi et, elementum neque.',
]

const lipsum = lipsumParagraphs.map(paragraph => (
  <p key={paragraph} className="mt-0 mb-3.5 text-sm">
    {paragraph}
  </p>
))

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

interface SubtitleArgs {
  subtitle: boolean
}

const subtitleArgs = {
  args: {subtitle: false},
  argTypes: {subtitle: {control: 'boolean'}},
} satisfies Pick<StoryObj<SubtitleArgs>, 'args' | 'argTypes'>

const DialogFixture = ({
  align,
  defaultOpen,
  footer,
  long = false,
  position,
  title,
  width,
}: Pick<DialogContentProps, 'align' | 'position' | 'width'> & {
  defaultOpen?: boolean
  footer?: boolean
  long?: boolean
  title?: string
}) => (
  <Dialog defaultOpen={defaultOpen}>
    <Dialog.Trigger render={<Button>Show dialog</Button>} />
    <Dialog.Content align={align} position={position} width={width}>
      <Content footer={footer} long={long} title={title} />
    </Dialog.Content>
  </Dialog>
)

const InsetFixture = ({children}: React.PropsWithChildren) => <div className="h-8">{children}</div>

const fixtureSubtitle = 'This is a subtitle!'

const InnerDialog = ({trigger}: {trigger: React.ReactElement}) => (
  <Dialog>
    <Dialog.Trigger render={trigger} />
    <Dialog.Content width="small">
      <Dialog.Header>
        <Dialog.Title>Inner dialog!</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>Hello world</Dialog.Body>
    </Dialog.Content>
  </Dialog>
)

// Upstream swaps in custom header, body, and footer renderers. Here each part is restyled through `className`.
export const WithCustomRenderers: StoryObj<SubtitleArgs> = {
  ...subtitleArgs,
  render: ({subtitle}) => (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header className="bg-accent-muted">
          <Dialog.Title className="uppercase">My Dialog</Dialog.Title>
          {subtitle ? <Dialog.Subtitle className="lowercase">{fixtureSubtitle}</Dialog.Subtitle> : null}
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body className="bg-danger-muted">{lipsum}</Dialog.Body>
        <Dialog.Footer className="bg-attention-muted">
          <Dialog.Close render={<Button variant="danger">Delete the universe</Button>} />
          <Button variant="primary">Proceed</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
export const WithDirectSubcomponents: StoryObj<SubtitleArgs> = {
  ...subtitleArgs,
  render: ({subtitle}) => (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>My Dialog</Dialog.Title>
          {subtitle ? <Dialog.Subtitle>{fixtureSubtitle}</Dialog.Subtitle> : null}
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>{lipsum}</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="danger">Delete the universe</Button>} />
          <Button variant="primary">Proceed</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
export const CenteredLongContent: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content width="xlarge">
        <Dialog.Header>
          <Dialog.Title lang="de">Repositoryzugriffsberechtigungsprüfung</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          {Array.from({length: 12}, (_, index) => (
            <p className="mt-0 mb-4 last:mb-0" key={index}>
              Rule {index + 1}: Review the repository access settings before continuing.
            </p>
          ))}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button>Cancel</Button>} />
          <Button lang="de">Repositoryzugriffsberechtigung überprüfen</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}

function HeaderWithoutCloseFixture() {
  const titleId = useId()
  return (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content width="small">
        <Dialog.Header aria-labelledby={titleId} className="h-16" role="region">
          <Dialog.Title id={titleId}>
            Review repository access and visibility settings across your organization
          </Dialog.Title>
          <Dialog.Subtitle>
            Scroll to read the complete summary of the changes before closing this dialog.
          </Dialog.Subtitle>
        </Dialog.Header>
        <Dialog.Body>Review the current settings before continuing.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button>Close</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

export const ScrollableHeaderWithoutClose: Story = {
  render: () => <HeaderWithoutCloseFixture />,
}

export const StressTest: StoryObj<SubtitleArgs> = {
  ...subtitleArgs,
  render: ({subtitle}) => (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content position={{narrow: 'fullscreen', regular: 'center'}}>
        <Dialog.Header>
          <Dialog.Title>
            This dialog has a really long title. So long, in fact, that it should cause wrapping, going to multiple
            lines!.
          </Dialog.Title>
          {subtitle ? (
            <Dialog.Subtitle>
              It&apos;s not a common scenario, sure, but what if the subtitle is generated from a really long value? Do
              we just break the dialog? Or do we handle it because we are pros?
            </Dialog.Subtitle>
          ) : null}
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>{lipsum}</Dialog.Body>
        <Dialog.Footer>
          {Array.from({length: 7}, (_, index) => (
            <Button key={index}>Button {index}</Button>
          ))}
          <Dialog.Close render={<Button variant="danger">Delete the universe</Button>} />
          <InnerDialog trigger={<Button variant="primary">Proceed</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
const MultistepDialog = () => {
  const [step, setStep] = useState(1)
  const [inputText, setInputText] = useState('')
  const closeButtonRef = useRef<HTMLElement>(null)
  const choose = () => {
    flushSync(() => setStep(2))
    // The footer mounts with step 2, so focus has to stay inside the dialog while its content changes.
    closeButtonRef.current?.focus()
  }
  return (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Step {step}</Dialog.Title>
          <Dialog.CloseButton ref={closeButtonRef} />
        </Dialog.Header>
        <Dialog.Body>
          {step === 1 ? (
            <Stack direction="vertical" gap="spacious">
              <Stack direction="horizontal" justify="space-between">
                Bug Report <Button onClick={choose}>Choose</Button>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                Feature request <Button onClick={choose}>Choose</Button>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="vertical" gap="condensed">
              <label htmlFor="description">Description</label>
              <TextInput
                id="description"
                onChange={event => setInputText(event.target.value)}
                placeholder="Write the description here"
                value={inputText}
              />
            </Stack>
          )}
        </Dialog.Body>
        {step === 1 ? null : (
          <Dialog.Footer>
            <Button variant="primary">Submit</Button>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
export const ReproMultistepDialogWithConditionalFooter: Story = {render: () => <MultistepDialog />}
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
const ReturnFocusRefDialog = () => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(true)} variant="primary">
        Show dialog
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <Dialog.Content finalFocus={triggerRef}>
          <Dialog.Header>
            <Dialog.Title>title</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>body</Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export const ReturnFocusRef: Story = {render: () => <ReturnFocusRefDialog />}

const ReturnFocusToContainerDialog = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div ref={containerRef} tabIndex={-1} data-testid="return-focus-container">
        <Button aria-disabled="true">Feedback action</Button>
      </div>
      <Dialog>
        <Dialog.Trigger render={<Button>Open with ref</Button>} />
        <Dialog.Content finalFocus={containerRef}>
          <Dialog.Header>
            <Dialog.Title>Ref focus target</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>The return target contains a tabbable action.</Dialog.Body>
        </Dialog.Content>
      </Dialog>
      <Dialog>
        <Dialog.Trigger render={<Button>Open with callback</Button>} />
        <Dialog.Content finalFocus={() => containerRef.current}>
          <Dialog.Header>
            <Dialog.Title>Callback focus target</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>The return target contains a tabbable action.</Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export const ReturnFocusToContainer: Story = {render: () => <ReturnFocusToContainerDialog />}

const NewIssuesDialog = () => {
  const initialFocusRef = useRef<HTMLAnchorElement>(null)
  return (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content initialFocus={initialFocusRef}>
        <Dialog.Header>
          <Dialog.Title>New issue</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <ActionList>
          <ActionList.LinkItem ref={initialFocusRef} href="https://github.com">
            Item 1
          </ActionList.LinkItem>
          <ActionList.LinkItem href="https://github.com">Link</ActionList.LinkItem>
        </ActionList>
      </Dialog.Content>
    </Dialog>
  )
}
export const NewIssues: Story = {render: () => <NewIssuesDialog />}
const DynamicContentDialog = () => {
  const [expandContent, setExpandContent] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  return (
    <Dialog>
      <Dialog.Trigger render={<Button>Show dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>My Dialog</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <Button onClick={() => setExpandContent(!expandContent)}>
            Click me to dynamically {expandContent ? 'remove' : 'render'} content
          </Button>
          <Button onClick={() => setShowFooter(!showFooter)}>
            Click me to {showFooter ? 'remove' : 'add'} a footer
          </Button>
          <InnerDialog trigger={<Button>Click me to open a new dialog</Button>} />
          {expandContent && (
            <Stack direction="vertical" gap="normal">
              {lipsum}
              <Button>Dialog Button Example 1</Button>
              <Button>Dialog Button Example 2</Button>
            </Stack>
          )}
        </Dialog.Body>
        {showFooter && (
          <Dialog.Footer>
            <Button variant="primary">Submit</Button>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
export const RetainsFocusTrapWithDynamicContent: Story = {render: () => <DynamicContentDialog />}
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
            <Dialog.Title>Process Data</Dialog.Title>
            <Dialog.Subtitle>Custom footer with loading states</Dialog.Subtitle>
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
