import {UnderlineNav} from '@primer/react/drafts'

function TransformsSelected() {
  return (
    <UnderlineNav aria-label="Main">
      <UnderlineNav.Link href="#home" selected>
        Home
      </UnderlineNav.Link>
      <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
      <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
    </UnderlineNav>
  )
}

function TransformsSelectedValue() {
  return (
    <UnderlineNav aria-label="Main">
      <UnderlineNav.Link href="#home" selected={!condition}>
        Home
      </UnderlineNav.Link>
      <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
      <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
    </UnderlineNav>
  )
}

function RemovesFull() {
  return (
    <UnderlineNav aria-label="Main" full>
      <UnderlineNav.Link href="#home">Home</UnderlineNav.Link>
      <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
      <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
    </UnderlineNav>
  )
}
