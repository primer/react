import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import Details from '..'
import useDetails from '../../hooks/useDetails'
import {Button} from '../../Button'
import type {ButtonProps} from '../../Button'
import {implementsClassName} from '../../utils/testing'
import classes from '../Details.module.css'

describe('Details', () => {
  implementsClassName(
    props => (
      <Details {...props}>
        <Details.Summary>Summary</Details.Summary>
      </Details>
    ),
    classes.Details,
  )
  implementsClassName(Details.Summary)
  it('Toggles when you click outside', async () => {
    const Component = () => {
      const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
      return (
        <Details data-testid="details" {...getDetailsProps()}>
          <Details.Summary>hi</Details.Summary>
        </Details>
      )
    }

    render(<Component />)

    document.body.click()

    await expect.element(page.getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Accurately passes down open state', async () => {
    const Component = () => {
      const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
        </Details>
      )
    }

    render(<Component />)

    document.body.click()

    await expect.element(page.getByTestId('summary')).toHaveTextContent('Closed')
    await expect.element(page.getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Can manipulate state with setOpen', async () => {
    const CloseButton = (props: ButtonProps) => <Button {...props} />
    const Component = () => {
      const {getDetailsProps, setOpen, open} = useDetails({closeOnOutsideClick: true, defaultOpen: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
          <CloseButton onClick={() => setOpen(false)}>Close</CloseButton>
        </Details>
      )
    }

    render(<Component />)

    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))

    await expect.element(page.getByTestId('summary')).toHaveTextContent('Closed')
    await expect.element(page.getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Does not toggle when you click inside', async () => {
    const Component = () => {
      const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true, defaultOpen: true})
      return (
        <Details {...getDetailsProps()}>
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
          <div>
            <Button variant="primary">test</Button>
          </div>
        </Details>
      )
    }

    render(<Component />)

    await userEvent.click(page.getByRole('button', {name: 'test', exact: true}))

    await expect.element(page.getByTestId('summary')).toHaveTextContent('Open')
  })

  function NestedDetails({
    closeOnOutsideClick = true,
    onClickOutside,
  }: {
    closeOnOutsideClick?: boolean
    onClickOutside?: (event: MouseEvent) => void
  }) {
    const {getDetailsProps} = useDetails({defaultOpen: true, closeOnOutsideClick, onClickOutside})
    return (
      <>
        <Details {...getDetailsProps()} data-testid="outer-details">
          <Details.Summary>Outer summary</Details.Summary>
          <details open data-testid="inner-details">
            <summary>Inner summary</summary>
            <button type="button">Inner action</button>
          </details>
        </Details>
        <button type="button">Outside action</button>
      </>
    )
  }

  it('does not treat a click inside nested details as an outside click', async () => {
    const onClickOutside = vi.fn()
    render(<NestedDetails onClickOutside={onClickOutside} />)

    await page.getByRole('button', {name: 'Inner action'}).click()

    expect(onClickOutside).not.toHaveBeenCalled()
    await expect.element(page.getByTestId('outer-details')).toHaveAttribute('open')

    await page.getByRole('button', {name: 'Outside action'}).click()
    expect(onClickOutside).toHaveBeenCalledTimes(1)
    await expect.element(page.getByTestId('outer-details')).not.toHaveAttribute('open')
  })

  it('does not synchronize the outer open state with a nested toggle', async () => {
    render(<NestedDetails closeOnOutsideClick={false} />)

    await page.getByText('Inner summary', {exact: true}).click()

    await expect.element(page.getByTestId('inner-details')).not.toHaveAttribute('open')
    await expect.element(page.getByTestId('outer-details')).toHaveAttribute('open')
  })

  it('allows an outside-click handler to prevent closing', async () => {
    render(<NestedDetails onClickOutside={event => event.preventDefault()} />)

    await page.getByRole('button', {name: 'Outside action'}).click()

    await expect.element(page.getByTestId('outer-details')).toHaveAttribute('open')
  })

  describe('Details.Summary', () => {
    it('should support a custom `className` on the container element', async () => {
      render(<Details.Summary className="custom-class">test summary</Details.Summary>)
      await expect.element(page.getByText('test summary', {exact: true})).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', async () => {
      render(<Details.Summary data-testid="test">test summary</Details.Summary>)
      await expect.element(page.getByText('test summary', {exact: true})).toHaveAttribute('data-testid', 'test')
    })
  })

  describe('Details data-component attributes', () => {
    it('renders data-component attributes', async () => {
      render(
        <Details>
          <Details.Summary>test summary</Details.Summary>
        </Details>,
      )

      await expect.element(page.getByRole('group')).toHaveAttribute('data-component', 'Details')
      await expect
        .element(page.getByText('test summary', {exact: true}))
        .toHaveAttribute('data-component', 'Details.Summary')
    })
  })
})
