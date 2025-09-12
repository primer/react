import type React from 'react'
import {useState, useCallback, useRef} from 'react'
import {Text, Button} from '..'
import type {DialogProps, DialogWidth, DialogHeight} from './Dialog'
import {Dialog} from './Dialog'

/* Dialog Version 2 */

export default {
  title: 'Components/Dialog/Dev',
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
  </>
)

interface DialogStoryProps {
  width: DialogWidth
  height: DialogHeight
  subtitle: boolean
}

function CssHeader({title, subtitle, dialogLabelId}: React.PropsWithChildren<DialogProps & {dialogLabelId: string}>) {
  if (typeof title === 'string' && typeof subtitle === 'string') {
    return (
      <Dialog.Header className="testCustomClassnameColor">
        <h1 id={dialogLabelId}>{title.toUpperCase()}</h1>
      </Dialog.Header>
    )
  }
  return null
}
function CssBody({children}: React.PropsWithChildren<DialogProps>) {
  return <Dialog.Body className="testCustomClassnameColor">{children}</Dialog.Body>
}
function CssFooter({footerButtons}: React.PropsWithChildren<DialogProps>) {
  return (
    <Dialog.Footer className="testCustomClassnameMono">
      {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
    </Dialog.Footer>
  )
}
export const WithCss = ({width, height, subtitle}: DialogStoryProps) => {
  const [isOpen, setIsOpen] = useState(true)
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
          renderHeader={CssHeader}
          renderBody={CssBody}
          renderFooter={CssFooter}
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed'},
          ]}
          className="testCustomClassnameBorder testCustomAnimation"
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}

export const WithScrollBody = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {lipsum}
      {isOpen && (
        <Dialog
          title="My Dialog"
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed', onClick: onDialogClose},
          ]}
        >
          {lipsum}
        </Dialog>
      )}
    </>
  )
}
WithScrollBody.parameters = {
  layout: 'fullscreen',
}
