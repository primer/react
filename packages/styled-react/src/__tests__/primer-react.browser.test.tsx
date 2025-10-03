import {userEvent} from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {describe, expect, test} from 'vitest'
import {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  CheckboxGroup,
  CircleBadge,
  CounterLabel,
  Dialog,
  Flash,
  FormControl,
  Header,
  Heading,
  IconButton,
  Label,
  Link,
  LinkButton,
  NavList,
  Overlay,
  PageHeader,
  PageLayout,
  RadioGroup,
  RelativeTime,
  SegmentedControl,
  Select,
  Spinner,
  StateLabel,
  SubNav,
  Text,
  TextInput,
  Textarea,
  ThemeProvider,
  Timeline,
  Token,
  Tooltip,
  Truncate,
  UnderlineNav,
} from '../'

describe('@primer/react', () => {
  test('ActionList supports `sx` prop', () => {
    render(<ActionList as="div" data-testid="component" sx={{background: 'red'}} variant="inset" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('data-variant', 'inset')
  })

  test('ActionMenu.Button supports `sx` prop', () => {
    const {container} = render(<ActionMenu.Button sx={{background: 'red'}}>test</ActionMenu.Button>)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('ActionMenu.Overlay supports `sx` prop', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ActionMenu>
          <ActionMenu.Button>test</ActionMenu.Button>
          <ActionMenu.Overlay data-testid="component" sx={{background: 'red'}}>
            test
          </ActionMenu.Overlay>
        </ActionMenu>
      </ThemeProvider>,
    )

    await user.click(screen.getByText('test'))

    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Autocomplete.Input supports `sx` prop', () => {
    const {container} = render(
      <Autocomplete>
        <Autocomplete.Input data-testid="component" sx={{background: 'red'}} />
      </Autocomplete>,
    )
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Autocomplete.Overlay supports `sx` prop', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Overlay data-testid="component" sx={{background: 'red'}}>
            test
          </Autocomplete.Overlay>
        </Autocomplete>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('combobox'))
    await user.keyboard('a')

    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Avatar supports `sx` prop', () => {
    render(<Avatar data-testid="component" sx={{background: 'red'}} src="" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Box supports `sx` prop', () => {
    render(<Box as="div" data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Breadcrumbs supports `sx` prop', () => {
    render(<Breadcrumbs sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByLabelText('Breadcrumbs')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Breadcrumbs.Item supports `sx` prop', () => {
    render(<Breadcrumbs.Item as="li" data-testid="component" sx={{background: 'red'}} selected />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component').className.includes('selected')).toBe(true)
  })

  test('Button supports `sx` prop', () => {
    render(<Button as="button" data-testid="component" sx={{background: 'red'}} size="medium" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('data-size', 'medium')
  })

  test('Checkbox supports `sx` prop', () => {
    render(<Checkbox data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('CheckboxGroup supports `sx` prop', () => {
    const {container} = render(<CheckboxGroup aria-labelledby="hi" data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!.firstElementChild!).backgroundColor).toBe(
      'rgb(255, 0, 0)',
    )
  })

  test('CheckboxGroup.Label supports `sx` prop', () => {
    const {container} = render(<CheckboxGroup.Label data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('CircleBadge supports `sx` prop', () => {
    render(<CircleBadge data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('CounterLabel supports `sx` prop', () => {
    render(<CounterLabel data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Dialog supports `sx` prop', () => {
    render(<Dialog data-testid="component" sx={{background: 'red'}} onClose={() => {}} />)
    expect(window.getComputedStyle(screen.getByRole('dialog')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Dialog.Header supports `sx` prop', () => {
    render(
      <Dialog
        onClose={() => {}}
        renderHeader={() => <Dialog.Header data-testid="component" sx={{background: 'red'}} />}
      />,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Dialog.Body supports `sx` prop', () => {
    render(
      <Dialog onClose={() => {}} renderBody={() => <Dialog.Body data-testid="component" sx={{background: 'red'}} />} />,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Dialog.Footer supports `sx` prop', () => {
    render(
      <Dialog
        onClose={() => {}}
        renderFooter={() => <Dialog.Footer data-testid="component" sx={{background: 'red'}} />}
      />,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Flash supports `sx` prop', () => {
    render(<Flash as="div" data-testid="component" sx={{background: 'red'}} variant="success" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('variant', 'success')
  })

  test('FormControl supports `sx` prop', () => {
    const {container} = render(
      <FormControl sx={{background: 'red'}}>
        <FormControl.Label>label</FormControl.Label>
      </FormControl>,
    )
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Header supports `sx` prop', () => {
    render(<Header as="header" data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Heading supports `sx` prop', () => {
    render(<Heading data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('IconButton supports `sx` prop', () => {
    render(
      <IconButton
        as="button"
        aria-label="test"
        data-testid="component"
        sx={{background: 'red'}}
        icon={() => <svg />}
      />,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')

    // Test that IconButton renders the icon component (SVG) in its children
    const iconButton = screen.getByTestId('component')
    const svgElement = iconButton.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
    expect(iconButton.children.length).toBeGreaterThan(0)
  })

  test('Label supports `sx` prop', () => {
    render(<Label as="span" data-testid="component" sx={{background: 'red'}} size="large" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('data-size', 'large')
  })

  test('Link supports `sx` prop', () => {
    render(<Link as="a" data-testid="component" sx={{background: 'red'}} inline />)
    expect(screen.getByTestId('component')).toHaveAttribute('data-inline', 'true')
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('LinkButton supports `sx` prop', () => {
    render(<LinkButton as="a" data-testid="component" sx={{background: 'red'}} icon={<svg />} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('icon')
  })

  test('NavList supports `sx` prop', () => {
    render(
      <NavList data-testid="component" sx={{background: 'red'}}>
        <NavList.Item>item</NavList.Item>
      </NavList>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('NavList.Item supports `sx` prop', () => {
    render(
      <NavList>
        <NavList.Item data-testid="component" sx={{background: 'red'}}>
          item
        </NavList.Item>
      </NavList>,
    )

    const itemAnchorEl = screen.getByTestId('component')
    const itemLiEl = itemAnchorEl.closest('li')
    expect(itemLiEl).not.toBeNull()
    expect(window.getComputedStyle(itemLiEl!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('NavList.Group supports `sx` prop', () => {
    render(
      <NavList>
        <NavList.Group data-testid="component" sx={{background: 'red'}}>
          <NavList.Item>item</NavList.Item>
        </NavList.Group>
      </NavList>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('NavList.GroupHeading supports `sx` prop', () => {
    render(
      <NavList>
        <NavList.Group>
          <NavList.GroupHeading data-testid="component" sx={{background: 'red'}}>
            test
          </NavList.GroupHeading>
          <NavList.Item>item</NavList.Item>
        </NavList.Group>
      </NavList>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('NavList.LeadingVisual supports `sx` prop', () => {
    render(<NavList.LeadingVisual data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Overlay supports `sx` prop', () => {
    const ref = createRef<HTMLElement>()
    render(
      <ThemeProvider>
        <Overlay
          as="div"
          data-testid="component"
          sx={{background: 'red'}}
          onClickOutside={() => {}}
          onEscape={() => {}}
          returnFocusRef={ref}
          role="dialog"
        />
      </ThemeProvider>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('role', 'dialog')
  })

  test('PageHeader supports `sx` prop', () => {
    const {container} = render(<PageHeader as="div" data-testid="component" sx={{background: 'red'}} role="article" />)
    expect(container.firstElementChild!).toHaveAttribute('role', 'article')
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('PageHeader.Actions supports `sx` prop', () => {
    const {container} = render(<PageHeader.Actions data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('PageHeader.Title supports `sx` prop', () => {
    const {container} = render(<PageHeader.Title data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('PageLayout supports `sx` prop', () => {
    const {container} = render(<PageLayout data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('PageLayout.Content supports `sx` prop', () => {
    const {container} = render(
      <PageLayout.Content as="section" data-testid="component" sx={{background: 'red'}} aria-labelledby="normal" />,
    )

    const outerElement = container.firstElementChild! as HTMLElement
    expect(window.getComputedStyle(outerElement).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(outerElement).toHaveAttribute('aria-labelledby', 'normal')
  })

  test('RadioGroup supports `sx` prop', () => {
    const {container} = render(
      <RadioGroup data-testid="component" name="test" sx={{background: 'red'}}>
        <RadioGroup.Label>test</RadioGroup.Label>
      </RadioGroup>,
    )
    expect(window.getComputedStyle(container.firstElementChild!.firstElementChild!).backgroundColor).toBe(
      'rgb(255, 0, 0)',
    )
  })

  test('RadioGroup.Label supports `sx` prop', () => {
    const {container} = render(<RadioGroup.Label data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('RelativeTime supports `sx` prop', () => {
    render(<RelativeTime data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('SegmentedControl supports `sx` prop', () => {
    render(<SegmentedControl data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('SegmentedControl.Button supports `sx` prop', () => {
    render(
      <SegmentedControl.Button data-testid="component" sx={{background: 'red'}}>
        test
      </SegmentedControl.Button>,
    )
    const buttonElement = screen.getByTestId('component')
    expect(window.getComputedStyle(buttonElement).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('SegmentedControl.IconButton supports `sx` prop', () => {
    const {container} = render(
      <SegmentedControl.IconButton
        data-testid="component"
        sx={{background: 'red'}}
        aria-label="test"
        icon={() => <svg />}
      />,
    )
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test.skip('Select supports `sx` prop', () => {
    render(<Select as="select" data-testid="component" sx={{background: 'red'}} required />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('required')
  })

  test('Spinner supports `sx` prop', () => {
    render(<Spinner data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('StateLabel supports `sx` prop', () => {
    render(<StateLabel data-testid="component" status="open" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('SubNav supports `sx` prop', () => {
    render(<SubNav data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('SubNav.Link supports `sx` prop', () => {
    render(<SubNav.Link data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Text supports `sx` prop', () => {
    render(<Text as="span" data-testid="component" sx={{background: 'red'}} size="small" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('data-size', 'small')
  })

  test('TextInput supports `sx` prop', () => {
    const {container} = render(<TextInput as="input" sx={{background: 'red'}} loading />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(container.firstElementChild).toHaveAttribute('data-trailing-visual', 'true')
  })

  test('TextInput.Action supports `sx` prop', () => {
    render(<TextInput.Action aria-label="test" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByRole('button')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Textarea supports `sx` prop', () => {
    const {container} = render(<Textarea sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Timeline supports `sx` prop', () => {
    render(<Timeline data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Timeline.Badge supports `sx` prop', () => {
    render(<Timeline.Badge data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Timeline.Break supports `sx` prop', () => {
    render(<Timeline.Break data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Timeline.Item supports `sx` prop', () => {
    render(<Timeline.Item data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Timeline.Body supports `sx` prop', () => {
    render(<Timeline.Body data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Token supports `sx` prop', () => {
    render(<Token as="button" data-testid="component" sx={{background: 'red'}} text="test" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveTextContent('test')
  })

  test.todo('Tooltip supports `sx` prop', () => {
    render(
      <Tooltip data-testid="component" sx={{background: 'red'}} text="test">
        <button type="button">test</button>
      </Tooltip>,
    )
    expect(window.getComputedStyle(screen.getByRole('tooltip', {hidden: true})).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Truncate supports `sx` prop', () => {
    render(<Truncate as="div" data-testid="component" sx={{background: 'red'}} title="test" />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component')).toHaveAttribute('title', 'test')
  })

  test('UnderlineNav supports `sx` prop', () => {
    render(
      <UnderlineNav as="nav" aria-label="navigation" data-testid="component" sx={{background: 'red'}} variant="inset">
        <UnderlineNav.Item>test</UnderlineNav.Item>
      </UnderlineNav>,
    )
    expect(window.getComputedStyle(screen.getByLabelText('navigation')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByLabelText('navigation')).toHaveAttribute('data-variant', 'inset')
  })

  test('UnderlineNav.Item supports `sx` prop', () => {
    render(
      <UnderlineNav.Item as="a" data-testid="component" sx={{background: 'red'}} icon={<svg />}>
        test
      </UnderlineNav.Item>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    const svgElement = screen.getByTestId('component').querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })
})
