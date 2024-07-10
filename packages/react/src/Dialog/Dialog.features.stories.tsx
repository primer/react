import React, {useState, useRef, useCallback} from 'react'
import {Box, TextInput, Text, Button, ActionList} from '..'
import type {DialogProps, DialogWidth, DialogHeight} from './Dialog'
import {Dialog} from './Dialog'

/* Dialog Version 2 */

export default {
  title: 'Components/Dialog/Features',
}

const lipsum = (
  <>
    <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
      lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
      nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
      Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris
      fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus
      luctus tempus posuere.
    </Text>

    <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
      Curabitur scelerisque bibendum faucibus. Duis rhoncus nunc est, at pharetra eros tristique a. Nam sodales turpis
      lectus, quis faucibus felis fermentum in. Curabitur vel velit vel eros laoreet pharetra. Aenean in facilisis
      sapien, eu porttitor ex. Donec ultrices ac arcu ut lobortis. Pellentesque vitae rutrum orci. Etiam pretium et enim
      sit amet scelerisque. Nulla sed odio nec lorem dapibus condimentum at sagittis quam. Sed in ornare ex, sed luctus
      sem. Mauris a est tellus.
    </Text>

    <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
      Sed fringilla est ac urna aliquet, eget condimentum felis vulputate. Sed sagittis eros non mauris sodales
      molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ante leo,
      condimentum sed lectus non, rutrum octopodes urna. Mauris neque ante, interdum molestie tellus pharetra, eleifend
      dapibus justo. Sed at diam ligula. Donec dapibus ipsum quis elit euismod, sed suscipit eros euismod. Aliquam
      pretium felis quis risus luctus fringilla. Ut purus lacus, mattis a turpis eget, sollicitudin pellentesque neque.
    </Text>

    <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
      Nunc sodales quis ante quis porttitor. Vestibulum ornare lacinia ante. Donec a nisi nec arcu aliquam pretium in
      nec nunc. Donec fringilla erat vitae viverra feugiat. Sed non odio vel ipsum porttitor maximus. Donec id eleifend
      lectus. Proin varius felis sit amet neque eleifend, vitae porttitor ligula commodo.
    </Text>

    <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
      Vivamus felis quam, porttitor a justo sit amet, placerat ultricies nisl. Suspendisse potenti. Maecenas non
      consequat lorem, eu porta ante. Pellentesque elementum diam sapien, nec ultrices risus convallis eget. Nam
      pharetra dolor at dictum tempor. Quisque ut est a ligula hendrerit sodales. Curabitur ornare a nulla in laoreet.
      Maecenas semper mi egestas, dignissim nisi et, elementum neque.
    </Text>
  </>
)
interface DialogStoryProps {
  width: DialogWidth
  height: DialogHeight
  subtitle: boolean
}

function CustomHeader({
  title,
  subtitle,
  dialogLabelId,
  dialogDescriptionId,
  onClose,
}: React.PropsWithChildren<DialogProps & {dialogLabelId: string; dialogDescriptionId: string}>) {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  if (typeof title === 'string' && typeof subtitle === 'string') {
    return (
      <Box bg="accent.subtle">
        <h1 id={dialogLabelId}>{title.toUpperCase()}</h1>
        <h2 id={dialogDescriptionId}>{subtitle.toLowerCase()}</h2>
        <Dialog.CloseButton onClose={onCloseClick} />
      </Box>
    )
  }
  return null
}
function CustomBody({children}: React.PropsWithChildren<DialogProps>) {
  return <Dialog.Body sx={{bg: 'danger.subtle'}}>{children}</Dialog.Body>
}
function CustomFooter({footerButtons}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog.Footer sx={{bg: 'attention.subtle'}}>
      {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
    </Dialog.Footer>
  )
}
export const WithCustomRenderers = ({width, height, subtitle}: DialogStoryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title="My Dialog"
          subtitle={subtitle ? 'This is a subtitle!' : undefined}
          width={width}
          height={height}
          renderHeader={CustomHeader}
          renderBody={CustomBody}
          renderFooter={CustomFooter}
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed'},
          ]}
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const StressTest = ({width, height, subtitle}: DialogStoryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const onSecondDialogClose = useCallback(() => setSecondOpen(false), [])
  const openSecondDialog = useCallback(() => setSecondOpen(true), [])
  const manyButtons = new Array(10).fill(undefined).map((_, i) => ({content: `Button ${i}`}))
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog
          title="This dialog has a really long title. So long, in fact, that it should cause wrapping, going to multiple lines!."
          subtitle={
            subtitle
              ? "It's not a common scenario, sure, but what if the subtitle is generated from a really long value? Do we just break the dialog? Or do we handle it because we are pros?"
              : undefined
          }
          onClose={onDialogClose}
          width={width}
          height={height}
          footerButtons={[
            ...manyButtons,
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed', onClick: openSecondDialog, autoFocus: true},
          ]}
        >
          {lipsum}
          {secondOpen && (
            <Dialog title="Inner dialog!" onClose={onSecondDialogClose} width="small">
              Hello world
            </Dialog>
          )}
        </Dialog>
      )}
    </>
  )
}

// repro for https://github.com/github/primer/issues/2480
export const ReproMultistepDialogWithConditionalFooter = ({width, height}: DialogStoryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const [step, setStep] = React.useState(1)

  const renderFooterConditionally = () => {
    if (step === 1) return null

    return (
      <Dialog.Footer>
        <Button variant="primary">Submit</Button>
      </Dialog.Footer>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title={`Step ${step}`}
          width={width}
          height={height}
          renderFooter={renderFooterConditionally}
          onClose={onDialogClose}
          footerButtons={[{buttonType: 'primary', content: 'Proceed'}]}
        >
          {step === 1 ? (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                Bug Report <Button onClick={() => setStep(2)}>Choose</Button>
              </Box>
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                Feature request <Button onClick={() => setStep(2)}>Choose</Button>
              </Box>
            </Box>
          ) : (
            <p>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <label htmlFor="description">Description</label>
                <TextInput id="description" placeholder="Write the description here" />
              </Box>
            </p>
          )}
        </Dialog>
      )}
    </>
  )
}

const bodyContent = (
  <Text sx={{fontSize: 1, marginBlockStart: 0}} as="p">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
    lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
    nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
    Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
    amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris fringilla
    tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus luctus tempus
    posuere.
  </Text>
)

export const BottomSheetNarrow = () => {
  const [isOpen, setIsOpen] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" onClose={onDialogClose} position={{narrow: 'bottom', regular: 'center'}}>
          {bodyContent}
        </Dialog>
      )}
    </>
  )
}
BottomSheetNarrow.storyName = '[Position] Bottom sheet (narrow)'

export const FullScreenNarrow = () => {
  const [isOpen, setIsOpen] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" onClose={onDialogClose} position={{narrow: 'fullscreen', regular: 'center'}}>
          {bodyContent}
        </Dialog>
      )}
    </>
  )
}
FullScreenNarrow.storyName = '[Position] Fullscreen (narrow)'

export const SideSheet = () => {
  const [isOpen, setIsOpen] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" onClose={onDialogClose} position="right">
          {bodyContent}
        </Dialog>
      )}
    </>
  )
}
SideSheet.storyName = '[Position] Side sheet'

export const ReturnFocusRef = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onDialogClose = useCallback(() => setIsOpen(false), [])

  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const triggerButton = (
    <Button ref={triggerRef} variant="primary" onClick={() => setIsOpen(true)}>
      Show dialog
    </Button>
  )

  if (!isOpen) return triggerButton

  return (
    <React.Suspense fallback={<Button>Show Dialog</Button>}>
      {triggerButton}
      <Dialog title="title" onClose={onDialogClose} returnFocusRef={triggerRef}>
        body
      </Dialog>
    </React.Suspense>
  )
}

export const NewIssues = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const initialFocusRef = useRef(null)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen ? (
        <Dialog
          initialFocusRef={initialFocusRef}
          onClose={onDialogClose}
          title="New issue"
          renderBody={() => (
            <ActionList>
              <ActionList.LinkItem ref={initialFocusRef} href="https://github.com">
                Item 1
              </ActionList.LinkItem>
              <ActionList.LinkItem href="https://github.com">Link</ActionList.LinkItem>
            </ActionList>
          )}
        ></Dialog>
      ) : null}
    </>
  )
}
