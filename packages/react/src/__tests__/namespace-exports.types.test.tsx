import {createRef, type ComponentProps} from 'react'
import {ActionList, FormControl, TextInput, asSlot} from '../index'
import {Blankslate, Table} from '../experimental'

export function shouldAcceptNamespaceComponents() {
  const ref = createRef<HTMLInputElement>()
  const props: ComponentProps<typeof ActionList.Root> = {variant: 'inset'}

  return (
    <>
      <ActionList.Root {...props}>
        <ActionList.Group>
          <ActionList.GroupHeading.Root as="h2">Actions</ActionList.GroupHeading.Root>
          <ActionList.LinkItem as="a" href="/settings">
            Settings
          </ActionList.LinkItem>
        </ActionList.Group>
      </ActionList.Root>
      <FormControl.Root>
        {/* eslint-disable-next-line primer-react/direct-slot-children -- The rule does not yet recognize FormControl.Root. */}
        <FormControl.Label>Name</FormControl.Label>
        <TextInput.Root ref={ref} />
      </FormControl.Root>
      <Blankslate.Root>
        <Blankslate.Heading>No items</Blankslate.Heading>
      </Blankslate.Root>
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  )
}

export function shouldAcceptWrappedRootSlots() {
  const WrappedInput = asSlot(function WrappedInput(props: ComponentProps<typeof TextInput.Root>) {
    return <TextInput.Root {...props} />
  }, TextInput.Root)

  return (
    <FormControl.Root>
      {/* eslint-disable-next-line primer-react/direct-slot-children -- The rule does not yet recognize FormControl.Root. */}
      <FormControl.Label>Name</FormControl.Label>
      <WrappedInput />
    </FormControl.Root>
  )
}

export function shouldRejectNamespacesAsComponents() {
  // @ts-expect-error The namespace is not the root component.
  const list = <ActionList />
  // @ts-expect-error Nested namespaces also require their Root member.
  const heading = <ActionList.GroupHeading as="h2">Actions</ActionList.GroupHeading>
  // @ts-expect-error Experimental compound exports are namespaces too.
  const table = <Table />
  // @ts-expect-error Component props must reference the Root member.
  const props: ComponentProps<typeof ActionList> = {}
  return {list, heading, table, props}
}
