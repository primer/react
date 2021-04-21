import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Button, ButtonDanger, ButtonPrimary, ThemeProvider, Box} from '..'
import {Dialog, DialogProps, DialogWidth, DialogHeight} from '../Dialog/Dialog'

export default {
  title: 'Internal components/Dialog',
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
    }
  ],
  argTypes: {
    width: {
      defaultValue: 'xl',
      control: {
        type: 'radio',
        options: ['sm', 'md', 'lg', 'xl']
      }
    },
    height: {
      defaultValue: 'auto',
      control: {
        type: 'radio',
        options: ['sm', 'lg', 'auto']
      }
    },
    subtitle: {
      name: 'show subtitle',
      defaultValue: true,
      control: {
        type: 'boolean'
      }
    },
    title: {table: {disable: true}},

    renderHeader: {table: {disable: true}},
    renderBody: {table: {disable: true}},
    renderFooter: {table: {disable: true}},
    onClose: {table: {disable: true}},
    role: {table: {disable: true}},
    ref: {table: {disable: true}},
    key: {table: {disable: true}},
    footerButtons: {table: {disable: true}}
  }
} as Meta

const lipsum = (
  <div style={{fontSize: '14px'}}>
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
  </div>
)
interface DialogStoryProps {
  width: DialogWidth
  height: DialogHeight
  subtitle: boolean
}
export const BasicDialog = ({width, height, subtitle}: DialogStoryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const onSecondDialogClose = useCallback(() => setSecondOpen(false), [])
  const openSecondDialog = useCallback(() => setSecondOpen(true), [])
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <Dialog
          title="My Dialog"
          subtitle={subtitle ? 'This is a subtitle!' : undefined}
          onClose={onDialogClose}
          width={width}
          height={height}
          footerButtons={[
            {buttonType: ButtonDanger, text: 'Delete the universe', onClick: onDialogClose},
            {buttonType: ButtonPrimary, text: 'Proceed', onClick: openSecondDialog, autoFocus: true}
          ]}
        >
          {lipsum}
          {secondOpen && (
            <Dialog title="Inner dialog!" onClose={onSecondDialogClose} width="sm">
              Hello world
            </Dialog>
          )}
        </Dialog>
      )}
    </>
  )
}

function CustomHeader({
  title,
  subtitle,
  dialogLabelId,
  dialogDescriptionId,
  onClose
}: React.PropsWithChildren<DialogProps & {dialogLabelId: string; dialogDescriptionId: string}>) {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  if (typeof title === 'string' && typeof subtitle === 'string') {
    return (
      <Box bg="auto.blue.3">
        <h1 id={dialogLabelId}>{title.toUpperCase()}</h1>
        <h2 id={dialogDescriptionId}>{subtitle.toLowerCase()}</h2>
        <Dialog.CloseButton onClose={onCloseClick} />
      </Box>
    )
  }
  return null
}
function CustomBody({children}: React.PropsWithChildren<DialogProps>) {
  return <Dialog.Body bg="auto.red.3">{children}</Dialog.Body>
}
function CustomFooter({footerButtons}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog.Footer bg="auto.yellow.3">
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
            {buttonType: ButtonDanger, text: 'Delete the universe', onClick: onDialogClose},
            {buttonType: ButtonPrimary, text: 'Proceed'}
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
  const manyButtons = new Array(10).fill(undefined).map((_, i) => ({text: `Button ${i}`}))
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
            {buttonType: ButtonDanger, text: 'Delete the universe', onClick: onDialogClose},
            {buttonType: ButtonPrimary, text: 'Proceed', onClick: openSecondDialog, autoFocus: true}
          ]}
        >
          {lipsum}
          {secondOpen && (
            <Dialog title="Inner dialog!" onClose={onSecondDialogClose} width="sm">
              Hello world
            </Dialog>
          )}
        </Dialog>
      )}
    </>
  )
}
