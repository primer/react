export default [
  {
    group: 'Button',
    name: 'Default',
    code: `
      <Button>Button</Button>
    `
  },
  {
    group: 'Button',
    name: 'Outline',
    code: `
      <ButtonOutline>Button</ButtonOutline>
    `
  },
  {
    group: 'Button',
    name: 'Primary',
    code: `
      <ButtonPrimary>Button</ButtonPrimary>
    `
  },
  {
    group: 'Button',
    name: 'Danger',
    code: `
      <ButtonDanger>Button</ButtonDanger>
    `
  },
  {
    group: 'Dropdown',
    name: 'Default',
    code: `
      <Dropdown title="Dropdown">
        <Dropdown.Menu direction="se">
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    `
  },
  {
    group: 'UnderlineNav',
    name: 'Default',
    code: `
      <UnderlineNav aria-label="Main">
        <UnderlineNav.Link href="#home" selected>
          Home
        </UnderlineNav.Link>
        <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
        <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
      </UnderlineNav>
    `
  }
]
