import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider, Box, TextInput} from '..'
import {Button} from '../Button'
import Text from '../Text'
import {Dialog, DialogProps} from './Dialog'

/* Dialog Version 2 */

export default {
  title: 'Components/Dialog/Features',
  component: Dialog,
  decorators: [
    Story => {
      // Since portal roots are registered globally, we need this line so that each storybook
      // story works in isolation.
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

const lipsum = (
  <Text sx={{fontSize: 1}}>
    <p style={{marginBlockStart: 0}}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
      lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
      nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
      Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris
      fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus
      luctus tempus posuere.
    </p>

    <p>
      Curabitur scelerisque bibendum faucibus. Duis rhoncus nunc est, at pharetra eros tristique a. Nam sodales turpis
      lectus, quis faucibus felis fermentum in. Curabitur vel velit vel eros laoreet pharetra. Aenean in facilisis
      sapien, eu porttitor ex. Donec ultrices ac arcu ut lobortis. Pellentesque vitae rutrum orci. Etiam pretium et enim
      sit amet scelerisque. Nulla sed odio nec lorem dapibus condimentum at sagittis quam. Sed in ornare ex, sed luctus
      sem. Mauris a est tellus.
    </p>

    <p>
      Sed fringilla est ac urna aliquet, eget condimentum felis vulputate. Sed sagittis eros non mauris sodales
      molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ante leo,
      condimentum sed lectus non, rutrum octopodes urna. Mauris neque ante, interdum molestie tellus pharetra, eleifend
      dapibus justo. Sed at diam ligula. Donec dapibus ipsum quis elit euismod, sed suscipit eros euismod. Aliquam
      pretium felis quis risus luctus fringilla. Ut purus lacus, mattis a turpis eget, sollicitudin pellentesque neque.
    </p>

    <p>
      Nunc sodales quis ante quis porttitor. Vestibulum ornare lacinia ante. Donec a nisi nec arcu aliquam pretium in
      nec nunc. Donec fringilla erat vitae viverra feugiat. Sed non odio vel ipsum porttitor maximus. Donec id eleifend
      lectus. Proin varius felis sit amet neque eleifend, vitae porttitor ligula commodo.
    </p>

    <p>
      Vivamus felis quam, porttitor a justo sit amet, placerat ultricies nisl. Suspendisse potenti. Maecenas non
      consequat lorem, eu porta ante. Pellentesque elementum diam sapien, nec ultrices risus convallis eget. Nam
      pharetra dolor at dictum tempor. Quisque ut est a ligula hendrerit sodales. Curabitur ornare a nulla in laoreet.
      Maecenas semper mi egestas, dignissim nisi et, elementum neque.
    </p>
  </Text>
)

export const WithCustomRenderers = () => {
  const [isOpen, setIsOpen] = useState(true)

  const CustomHeader = ({
    title,
    subtitle,
    dialogLabelId,
    dialogDescriptionId,
    onClose,
  }: React.PropsWithChildren<DialogProps & {dialogLabelId: string; dialogDescriptionId: string}>) => {
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

  const CustomBody = () => <Dialog.Body sx={{bg: 'danger.subtle'}}>{lipsum}</Dialog.Body>

  const CustomFooter = ({footerButtons}: React.PropsWithChildren<DialogProps>) => (
    <Dialog.Footer sx={{bg: 'attention.subtle'}}>
      {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
    </Dialog.Footer>
  )

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title="My Dialog"
          subtitle="This is a subtitle!"
          renderHeader={CustomHeader}
          renderBody={CustomBody}
          renderFooter={CustomFooter}
          onClose={() => setIsOpen(false)}
          footerButtons={[
            {buttonType: 'danger', content: 'Delete the universe'},
            {buttonType: 'primary', content: 'Proceed'},
          ]}
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const StressTest = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [secondOpen, setSecondOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const onSecondDialogClose = useCallback(() => setSecondOpen(false), [])
  const openSecondDialog = useCallback(() => setSecondOpen(true), [])
  const manyButtons = new Array(10).fill(undefined).map((_, i) => ({content: `Button ${i}`}))
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog
          title="This dialog has a really long title. So long, in fact, that it should cause wrapping, going to multiple lines!."
          subtitle="It's not a common scenario, sure, but what if the subtitle is generated from a really long value? Do we just break the dialog? Or do we handle it because we are pros?"
          onClose={onDialogClose}
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

export const NonDeclaritive = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Trigger dialog</Button>
      {isOpen && (
        <Dialog width="small" title="This dialog has no buttons (non declaritive)." onClose={() => setIsOpen(false)}>
          <Text sx={{fontSize: 1}}>
            It&apos;s a common scenario, to show a dialog that&apos;s just informational and therefore doesn&apos;t have
            footers in the button
          </Text>
        </Dialog>
      )}
    </>
  )
}

export const SizeSmall = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog width="small" height="small" title="This is a small dialog." onClose={() => setIsOpen(false)}>
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const SizeXLarge = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog width="xlarge" height="auto" title="This is a xlarge dialog." onClose={() => setIsOpen(false)}>
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const SizeLarge = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog width="large" height="auto" title="This is a large dialog." onClose={() => setIsOpen(false)}>
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const Responsive = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title="Your title"
          onClose={() => {}}
          type={{narrow: 'full-screen', regular: 'default', wide: 'default'}}
          footerButtons={[
            {buttonType: 'normal', content: 'Cancel', onClick: () => {}},
            {buttonType: 'primary', content: 'Submit', autoFocus: true},
          ]}
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const FullScreen = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title="Your title"
          onClose={() => setIsOpen(false)}
          type="full-screen"
          footerButtons={[
            {buttonType: 'normal', content: 'Cancel', onClick: () => {}},
            {buttonType: 'primary', content: 'Submit', autoFocus: true},
          ]}
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const BottomSheet = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog title="Your title" type="bottom-sheet" onClose={() => setIsOpen(false)}>
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

// repro for https://github.com/github/primer/issues/2480
export const ReproMultistepDialogWithConditionalFooter = () => {
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const [isOpen, setIsOpen] = useState(true)
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
      <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
      {isOpen && (
        <Dialog
          title={`Step ${step}`}
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
