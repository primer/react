import {UnderlineNav} from '@primer/react/drafts'

function TransformsSelected() {
  return (
    <UnderlineNav aria-label="Main">
      <UnderlineNav.Item href="#home" aria-current="page">
        Home
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#documentation">Documentation</UnderlineNav.Item>
      <UnderlineNav.Item href="#support">Support</UnderlineNav.Item>
    </UnderlineNav>
  )
}

function TransformsSelectedValue() {
  return (
    <UnderlineNav aria-label="Main">
      <UnderlineNav.Item href="#home" aria-current={!condition ? 'page' : undefined}>
        Home
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#documentation">Documentation</UnderlineNav.Item>
      <UnderlineNav.Item href="#support">Support</UnderlineNav.Item>
    </UnderlineNav>
  )
}

function RemovesFull() {
  return (
    <UnderlineNav aria-label="Main" full>
      <UnderlineNav.Item href="#home">Home</UnderlineNav.Item>
      <UnderlineNav.Item href="#documentation">Documentation</UnderlineNav.Item>
      <UnderlineNav.Item href="#support">Support</UnderlineNav.Item>
    </UnderlineNav>
  )
}
