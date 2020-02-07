export default [
  {
    group: 'AvatarStack',
    name: 'Default',
    code: `
      <AvatarStack>
        <img alt="Primer" src="https://avatars.githubusercontent.com/primer"/>
        <img alt="GitHub" src="https://avatars.githubusercontent.com/github"/>
        <img alt="Atom" src="https://avatars.githubusercontent.com/atom"/>
        <img alt="Desktop" src="https://avatars.githubusercontent.com/desktop"/>
      </AvatarStack>
    `
  },
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
    group: 'ButtonGroup',
    name: 'Default',
    code: `
      <ButtonGroup>
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>
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
    group: 'FilterList',
    name: 'Default',
    code: `
      <FilterList>
        <FilterList.Item selected count='32' href='#foo'>First Filter</FilterList.Item>
        <FilterList.Item count='2' href='#bar'>Second Filter</FilterList.Item>
        <FilterList.Item href='#baz'>Third Filter</FilterList.Item>
      </FilterList>
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
