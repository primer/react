import React, {useState, useRef} from 'react'
import {Button, Text, ButtonDanger, Position, Flex, BaseStyles, ThemeProvider} from '..'
import {Meta} from '@storybook/react'
import {RefAnchoredOverlay} from '../AnchoredOverlay/RefAnchoredOverlay'

export default {
  title: 'Internal components/RefAnchoredOverlay',
  component: RefAnchoredOverlay,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const RefAnchoredOverlayStory = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  return (
    <Position position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      <RefAnchoredOverlay onClose={closeOverlay} anchorRef={buttonRef} open={isOpen} width="small">
        <Flex flexDirection="column" p={2}>
          <Text>Are you sure?</Text>
          <ButtonDanger onClick={closeOverlay}>Cancel</ButtonDanger>
          <Button onClick={closeOverlay} ref={confirmButtonRef}>
            Confirm
          </Button>
        </Flex>
      </RefAnchoredOverlay>
    </Position>
  )
}
