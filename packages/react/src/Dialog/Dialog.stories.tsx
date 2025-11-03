import {useState, useRef, useCallback} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Button, Text} from '..'
import type {DialogProps} from './Dialog'
import {Dialog} from './Dialog'
import classes from './Dialog.stories.module.css'

/* Dialog Version 2 */

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    controls: {expanded: true},
  },
} as Meta<typeof Dialog>

export default meta

const lipsum = (
  <>
    <Text className={classes.SmallParagraphText} as="p">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec
      lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis
      nunc vitae enim. Maecenas et lorem lectus. Vivamus iaculis tortor eget ante placerat, nec posuere nisl tincidunt.
      Cras condimentum ante in accumsan ultricies. Morbi quis porta est, sit amet congue augue. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Ut consequat nunc id quam tempus, id tincidunt neque venenatis. Mauris
      fringilla tempor est, vitae fermentum enim elementum vitae. Nullam eleifend odio ut porta efficitur. Phasellus
      luctus tempus posuere.
    </Text>

    <Text className={classes.SmallParagraphText} as="p">
      Curabitur scelerisque bibendum faucibus. Duis rhoncus nunc est, at pharetra eros tristique a. Nam sodales turpis
      lectus, quis faucibus felis fermentum in. Curabitur vel velit vel eros laoreet pharetra. Aenean in facilisis
      sapien, eu porttitor ex. Donec ultrices ac arcu ut lobortis. Pellentesque vitae rutrum orci. Etiam pretium et enim
      sit amet scelerisque. Nulla sed odio nec lorem dapibus condimentum at sagittis quam. Sed in ornare ex, sed luctus
      sem. Mauris a est tellus.
    </Text>

    <Text className={classes.SmallParagraphText} as="p">
      Sed fringilla est ac urna aliquet, eget condimentum felis vulputate. Sed sagittis eros non mauris sodales
      molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ante leo,
      condimentum sed lectus non, rutrum octopodes urna. Mauris neque ante, interdum molestie tellus pharetra, eleifend
      dapibus justo. Sed at diam ligula. Donec dapibus ipsum quis elit euismod, sed suscipit eros euismod. Aliquam
      pretium felis quis risus luctus fringilla. Ut purus lacus, mattis a turpis eget, sollicitudin pellentesque neque.
    </Text>

    <Text className={classes.SmallParagraphText} as="p">
      Nunc sodales quis ante quis porttitor. Vestibulum ornare lacinia ante. Donec a nisi nec arcu aliquam pretium in
      nec nunc. Donec fringilla erat vitae viverra feugiat. Sed non odio vel ipsum porttitor maximus. Donec id eleifend
      lectus. Proin varius felis sit amet neque eleifend, vitae porttitor ligula commodo.
    </Text>

    <Text className={classes.SmallParagraphText} as="p">
      Vivamus felis quam, porttitor a justo sit amet, placerat ultricies nisl. Suspendisse potenti. Maecenas non
      consequat lorem, eu porta ante. Pellentesque elementum diam sapien, nec ultrices risus convallis eget. Nam
      pharetra dolor at dictum tempor. Quisque ut est a ligula hendrerit sodales. Curabitur ornare a nulla in laoreet.
      Maecenas semper mi egestas, dignissim nisi et, elementum neque.
    </Text>
  </>
)
export const Default = () => {
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
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'default', content: 'Open Second Dialog', onClick: openSecondDialog},
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed', onClick: openSecondDialog},
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

type Positions = 'center' | 'left' | 'right'

export const Playground = (
  args: Omit<DialogProps, 'position'> & {
    positionNarrow: Positions
    positionRegular: Positions
  },
) => {
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
          {...args}
          position={{narrow: args.positionNarrow, regular: args.positionRegular}}
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'default', content: 'Open Second Dialog', onClick: openSecondDialog},
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed', onClick: openSecondDialog},
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
Playground.args = {
  width: 'xlarge',
  height: 'auto',
  subtitle: 'Subtitle',
  title: 'Dialog heading',
  position: 'center',
}
Playground.argTypes = {
  width: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large', 'xlarge'],
  },
  height: {
    control: {
      type: 'radio',
    },
    options: ['small', 'large', 'auto'],
  },
  subtitle: {
    name: 'subtitle',
    control: {
      type: 'text',
    },
  },
  position: {
    name: 'position',
    description: 'Sets the Dialog position for all viewports',
    defaultValue: {summary: 'center'},
    if: {arg: 'positionNarrow', truthy: false},
    control: {
      type: 'radio',
    },
    options: ['center', 'left', 'right'],
  },
  positionNarrow: {
    name: 'position.narrow',
    description:
      'See <a href="https://github.com/primer/react/blob/main/src/hooks/useResponsiveValue.ts">useResponsiveValue</a> for details.',
    control: {
      type: 'radio',
    },
    options: ['center', 'bottom', 'fullscreen', 'inherit'],
    table: {
      category: 'Responsive props',
    },
  },
  positionRegular: {
    name: 'position.regular',
    description:
      'See <a href="https://github.com/primer/react/blob/main/src/hooks/useResponsiveValue.ts">useResponsiveValue</a> for details.',
    control: {
      type: 'radio',
    },
    options: ['center', 'left', 'right'],
    table: {
      category: 'Responsive props',
    },
  },
  title: {
    name: 'title',
    control: {
      type: 'text',
    },
  },
  renderHeader: {table: {disable: true}},
  renderBody: {table: {disable: true}},
  renderFooter: {table: {disable: true}},
  onClose: {table: {disable: true}},
  role: {table: {disable: true}},
  ref: {table: {disable: true}},
  key: {table: {disable: true}},
  footerButtons: {table: {disable: true}},
}
