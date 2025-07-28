import React, {useState, useRef, useCallback} from 'react'
import {TextInput, Button, ActionList} from '..'
import type {DialogProps, DialogWidth, DialogHeight} from './Dialog'
import {Dialog} from './Dialog'
import classes from './Dialog.features.stories.module.css'

/* Dialog Version 2 */

export default {
  title: 'Components/Dialog/Features',
}

const lipsum = (
  <>
    <p className={classes.SmallText}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
      lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
      nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
      Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris
      fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus
      luctus tempus posuere.
    </p>

    <p className={classes.SmallText}>
      Curabitur scelerisque bibendum faucibus. Duis rhoncus nunc est, at pharetra eros tristique a. Nam sodales turpis
      lectus, quis faucibus felis fermentum in. Curabitur vel velit vel eros laoreet pharetra. Aenean in facilisis
      sapien, eu porttitor ex. Donec ultrices ac arcu ut lobortis. Pellentesque vitae rutrum orci. Etiam pretium et enim
      sit amet scelerisque. Nulla sed odio nec lorem dapibus condimentum at sagittis quam. Sed in ornare ex, sed luctus
      sem. Mauris a est tellus.
    </p>

    <p className={classes.SmallText}>
      Sed fringilla est ac urna aliquet, eget condimentum felis vulputate. Sed sagittis eros non mauris sodales
      molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ante leo,
      condimentum sed lectus non, rutrum octopodes urna. Mauris neque ante, interdum molestie tellus pharetra, eleifend
      dapibus justo. Sed at diam ligula. Donec dapibus ipsum quis elit euismod, sed suscipit eros euismod. Aliquam
      pretium felis quis risus luctus fringilla. Ut purus lacus, mattis a turpis eget, sollicitudin pellentesque neque.
    </p>

    <p className={classes.SmallText}>
      Nunc sodales quis ante quis porttitor. Vestibulum ornare lacinia ante. Donec a nisi nec arcu aliquam pretium in
      nec nunc. Donec fringilla erat vitae viverra feugiat. Sed non odio vel ipsum porttitor maximus. Donec id eleifend
      lectus. Proin varius felis sit amet neque eleifend, vitae porttitor ligula commodo.
    </p>

    <p className={classes.SmallText}>
      Vivamus felis quam, porttitor a justo sit amet, placerat ultricies nisl. Suspendisse potenti. Maecenas non
      consequat lorem, eu porta ante. Pellentesque elementum diam sapien, nec ultrices risus convallis eget. Nam
      pharetra dolor at dictum tempor. Quisque ut est a ligula hendrerit sodales. Curabitur ornare a nulla in laoreet.
      Maecenas semper mi egestas, dignissim nisi et, elementum neque.
    </p>
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
      <div className={classes.CustomHeaderBg}>
        <h1 id={dialogLabelId}>{title.toUpperCase()}</h1>
        <h2 id={dialogDescriptionId}>{subtitle.toLowerCase()}</h2>
        <Dialog.CloseButton onClose={onCloseClick} />
      </div>
    )
  }
  return null
}
function CustomBody({children}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog.Body>
      <div className={classes.DangerBodyBg}>{children}</div>
    </Dialog.Body>
  )
}
function CustomFooter({footerButtons}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog.Footer>
      <div className={classes.AttentionFooterBg}>
        {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
      </div>
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
  const manyButtons = new Array(7).fill(undefined).map((_, i) => ({content: `Button ${i}`}))
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
            {buttonType: 'primary', content: 'Proceed', onClick: openSecondDialog},
          ]}
          position={{narrow: 'fullscreen', regular: 'center'}}
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

  const [inputText, setInputText] = React.useState('')

  const dialogRef = useRef<HTMLDivElement>(null)

  const renderFooterConditionally = () => {
    if (step === 1) return null

    return (
      <Dialog.Footer>
        <Button variant="primary">Submit</Button>
      </Dialog.Footer>
    )
  }

  React.useEffect(() => {
    // focus the close button when the step changes
    const focusTarget = dialogRef.current?.querySelector('button[aria-label="Close"]') as HTMLButtonElement
    if (step === 2) {
      focusTarget.focus()
    }
  }, [step])

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
          ref={dialogRef}
        >
          {step === 1 ? (
            <div className={classes.FlexColumn}>
              <div className={classes.FlexRowSpaceBetween}>
                Bug Report <Button onClick={() => setStep(2)}>Choose</Button>
              </div>
              <div className={classes.FlexRowSpaceBetween}>
                Feature request <Button onClick={() => setStep(2)}>Choose</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className={classes.FlexColumnGap1}>
                <label htmlFor="description">Description</label>
                <TextInput
                  id="description"
                  placeholder="Write the description here"
                  value={inputText}
                  onChange={event => setInputText(event.target.value)}
                />
              </div>
            </div>
          )}
        </Dialog>
      )}
    </>
  )
}

const bodyContent = (
  <p className={classes.SmallText}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
    lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
    nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
    Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
    amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris fringilla
    tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus luctus tempus
    posuere.
  </p>
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

export const RetainsFocusTrapWithDynamicContent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  const [expandContent, setExpandContent] = useState(false)
  const [changeBodyContent, setChangeBodyContent] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const onSecondDialogClose = useCallback(() => setSecondOpen(false), [])
  const openSecondDialog = useCallback(() => setSecondOpen(true), [])

  const renderFooterConditionally = () => {
    if (!changeBodyContent) return null

    return (
      <Dialog.Footer>
        <Button variant="primary">Submit</Button>
      </Dialog.Footer>
    )
  }

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" onClose={onDialogClose} renderFooter={renderFooterConditionally}>
          <Button onClick={() => setExpandContent(!expandContent)}>
            Click me to dynamically {expandContent ? 'remove' : 'render'} content
          </Button>
          <Button onClick={() => setChangeBodyContent(!changeBodyContent)}>
            Click me to {changeBodyContent ? 'remove' : 'add'} a footer
          </Button>
          <Button onClick={openSecondDialog}>Click me to open a new dialog</Button>
          {expandContent && (
            <div className={classes.ExpandContent}>
              {lipsum}
              <Button>Dialog Button Example 1</Button>
              <Button>Dialog Button Example 2</Button>
            </div>
          )}
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
