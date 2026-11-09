import {act, fireEvent, render, screen} from '@testing-library/react'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {expect, it, vi} from 'vitest'
import {
  Banner,
  BannerActions,
  BannerDescription,
  BannerPrimaryActionLink,
  BannerSecondaryActionLink,
  BannerTitle,
} from './Banner'
it('labels itself with its title and dismisses', () => {
  const dismiss = vi.fn()
  render(
    <Banner onDismiss={dismiss} title="Update available">
      Details
    </Banner>,
  )
  expect(screen.getByRole('region', {name: 'Update available'})).toHaveAttribute('data-variant', 'info')
  fireEvent.click(screen.getByRole('button', {name: 'Dismiss banner'}))
  expect(dismiss).toHaveBeenCalledOnce()
})
it('supports a composed title', () => {
  render(
    <Banner role="alert">
      <BannerTitle as="h3">Composed</BannerTitle>
    </Banner>,
  )
  const alert = screen.getByRole('alert', {name: 'Composed'})
  expect(alert).toHaveAttribute('aria-labelledby', screen.getByRole('heading', {name: 'Composed'}).id)
})

it('preserves explicit title IDs and accessible name precedence', () => {
  render(
    <>
      <Banner>
        <>
          <BannerTitle as="h3" id="custom-title">
            Custom title
          </BannerTitle>
        </>
      </Banner>
      <Banner aria-label="Explicit label">
        <BannerTitle>Visible title</BannerTitle>
      </Banner>
      <Banner aria-labelledby="external-title" title="Prop title">
        <BannerTitle>Additional title</BannerTitle>
      </Banner>
      <Banner title="Preferred prop title">
        <BannerTitle>Another title</BannerTitle>
      </Banner>
      <span id="external-title">External title</span>
    </>,
  )

  expect(screen.getByRole('region', {name: 'Custom title'})).toHaveAttribute('aria-labelledby', 'custom-title')
  expect(screen.getByRole('region', {name: 'Explicit label'})).not.toHaveAttribute('aria-labelledby')
  expect(screen.getByRole('region', {name: 'External title'})).toHaveAttribute('aria-labelledby', 'external-title')
  expect(screen.getByRole('region', {name: 'Preferred prop title'})).toBeInTheDocument()
  const titles = screen.getAllByRole('heading')
  const ids = titles.map(heading => heading.id).filter(Boolean)
  expect(new Set(ids).size).toBe(ids.length)
})

it('updates a composed title association without replacing the banner', () => {
  const ref = React.createRef<HTMLElement>()
  const actionRef = React.createRef<HTMLButtonElement>()
  const banner = (showTitle: boolean) => (
    <Banner ref={ref} role="alert">
      {showTitle ? <BannerTitle>Save failed</BannerTitle> : null}
      Details
      <button ref={actionRef} type="button">
        Retry
      </button>
    </Banner>
  )
  const {rerender} = render(banner(false))
  const alert = screen.getByRole('alert')
  const action = screen.getByRole('button', {name: 'Retry'})
  expect(alert).not.toHaveAttribute('aria-labelledby')
  rerender(banner(true))
  expect(ref.current).toBe(alert)
  expect(actionRef.current).toBe(action)
  expect(alert).toHaveAccessibleName('Save failed')
  const titleId = alert.getAttribute('aria-labelledby')
  rerender(banner(false))
  expect(ref.current).toBe(alert)
  expect(actionRef.current).toBe(action)
  expect(alert).not.toHaveAttribute('aria-labelledby')
  expect(titleId && document.getElementById(titleId)).toBeNull()
})

it('preserves keyed fragment content when title IDs change', () => {
  const banner = (id: string | undefined, showTitle: boolean) => (
    <Banner role="alert">
      <React.Fragment key="content">
        {showTitle ? <BannerTitle id={id}>Unable to save</BannerTitle> : null}
        <input aria-label="Draft" defaultValue="Keep this draft" />
      </React.Fragment>
    </Banner>
  )
  const {rerender} = render(banner(undefined, true))
  const input = screen.getByRole('textbox', {name: 'Draft'})
  fireEvent.change(input, {target: {value: 'Edited draft'}})

  rerender(banner('custom-id', true))
  expect(screen.getByRole('alert', {name: 'Unable to save'})).toHaveAttribute('aria-labelledby', 'custom-id')
  expect(screen.getByRole('textbox', {name: 'Draft'})).toBe(input)
  expect(input).toHaveValue('Edited draft')

  rerender(banner(undefined, false))
  expect(screen.getByRole('textbox', {name: 'Draft'})).toBe(input)
  expect(input).toHaveValue('Edited draft')
})

it('keeps a composed title association stable through server rendering and hydration', async () => {
  const app = (
    <Banner role="alert">
      <>
        <BannerTitle as="h3">Unable to save changes</BannerTitle>
      </>
      Try again.
    </Banner>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  document.body.append(container)
  const alert = container.querySelector('[role="alert"]')
  const titleId = alert?.getAttribute('aria-labelledby')
  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    expect(titleId).toBeTruthy()
    expect(container.querySelector('h3')?.id).toBe(titleId)
    await act(async () => {
      root = hydrateRoot(container, app, {onRecoverableError})
    })
    expect(screen.getByRole('alert', {name: 'Unable to save changes'})).toBe(alert)
    expect(alert).toHaveAttribute('aria-labelledby', titleId)
    expect(onRecoverableError).not.toHaveBeenCalled()
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
})

it('lets a field reference both the banner title and details using separate IDs', () => {
  render(
    <>
      <label htmlFor="filter">Filter</label>
      <input id="filter" aria-describedby="filter-title filter-details" aria-invalid="true" />
      <Banner variant="warning">
        <BannerTitle id="filter-title">Filter contains 1 issue:</BannerTitle>
        <BannerDescription id="filter-details">
          <ul>
            <li>Invalid value for state</li>
          </ul>
        </BannerDescription>
      </Banner>
    </>,
  )

  expect(screen.getByRole('region', {name: 'Filter contains 1 issue:'})).toHaveAttribute(
    'aria-labelledby',
    'filter-title',
  )
  expect(screen.getByRole('textbox', {name: 'Filter'})).toHaveAccessibleDescription(
    'Filter contains 1 issue: Invalid value for state',
  )
})

it('preserves a grouped field description and banner name through hydration', async () => {
  const app = (
    <>
      <label htmlFor="filter">Filter</label>
      <input id="filter" aria-describedby="filter-errors" aria-invalid="true" />
      <Banner aria-labelledby="filter-title" variant="warning">
        <div id="filter-errors">
          <BannerTitle id="filter-title">Filter contains 1 issue:</BannerTitle>
          <ul>
            <li>Invalid value for state</li>
          </ul>
        </div>
      </Banner>
    </>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  document.body.append(container)
  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  const expectRelationships = () => {
    expect(screen.getByRole('region', {name: 'Filter contains 1 issue:'})).toHaveAttribute(
      'aria-labelledby',
      'filter-title',
    )
    expect(screen.getByRole('textbox', {name: 'Filter'})).toHaveAccessibleDescription(
      'Filter contains 1 issue: Invalid value for state',
    )
  }
  try {
    expectRelationships()
    await act(async () => {
      root = hydrateRoot(container, app, {onRecoverableError})
    })
    expectRelationships()
    expect(onRecoverableError).not.toHaveBeenCalled()
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
})

it('applies the actions layout', () => {
  const {container} = render(
    <Banner actionsLayout="stacked" aria-label="Actions" primaryAction={<button type="button">Confirm</button>} />,
  )

  const actions = container.querySelector('[data-component="Banner.Actions"]')
  expect(actions).toHaveAttribute('data-layout', 'stacked')
  expect(actions?.firstElementChild).toHaveClass('primer:items-center')
  expect(actions?.firstElementChild).not.toHaveClass('primer:flex-row-reverse')
  expect(container.querySelector('[data-component="Banner"] > div')).toHaveClass('primer:flex', 'primer:flex-col')
})

it('only reserves a second narrow row when actions are present', () => {
  const {container, rerender} = render(<Banner aria-label="No actions" description="Description" />)
  const content = container.querySelector('[data-component="Banner.Content"]')?.parentElement

  expect(content).not.toHaveClass('primer:@max-[500px]/banner:grid-rows-[auto_auto]')

  rerender(
    <Banner aria-label="Actions" description="Description" primaryAction={<button type="button">Confirm</button>} />,
  )
  expect(container.querySelector('[data-component="Banner.Content"]')?.parentElement).toHaveClass(
    'primer:@max-[500px]/banner:grid-rows-[auto_auto]',
  )
})

it('provides native link actions with their own variants and forwarded refs', () => {
  const primaryRef = React.createRef<HTMLElement>()
  const secondaryRef = React.createRef<HTMLElement>()
  render(
    <Banner
      title="Update available"
      primaryAction={
        <BannerPrimaryActionLink href="/update" ref={primaryRef}>
          Update
        </BannerPrimaryActionLink>
      }
      secondaryAction={
        <BannerSecondaryActionLink
          ref={secondaryRef}
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          render={<a data-router-link="" href="/details" />}
        >
          Details
        </BannerSecondaryActionLink>
      }
    />,
  )

  const primary = screen.getByRole('link', {name: 'Update'})
  const secondary = screen.getByRole('link', {name: 'Details'})
  expect(primary).toBe(primaryRef.current)
  expect(primary).toHaveAttribute('href', '/update')
  expect(primary).toHaveAttribute('data-component', 'Banner.PrimaryActionLink')
  expect(primary).toHaveAttribute('data-variant', 'default')
  expect(secondary).toBe(secondaryRef.current)
  expect(secondary).toHaveAttribute('href', '/details')
  expect(secondary).toHaveAttribute('data-router-link')
  expect(secondary).toHaveAttribute('data-component', 'Banner.SecondaryActionLink')
  expect(secondary).toHaveAttribute('data-variant', 'invisible')
})

it('constrains and wraps actions so label-wrapping links fit narrow banners', () => {
  render(
    <Banner
      actionsLayout="stacked"
      data-testid="banner"
      primaryAction={
        <BannerPrimaryActionLink href="#primary" labelWrap>
          Review the repository security advisory settings
        </BannerPrimaryActionLink>
      }
      secondaryAction={
        <BannerSecondaryActionLink href="#secondary" labelWrap>
          Learn more about private vulnerability reporting
        </BannerSecondaryActionLink>
      }
      title="Security"
    />,
  )
  const actions = screen.getByTestId('banner').querySelector<HTMLElement>('[data-component="Banner.Actions"]')!
  expect(actions).toHaveClass('primer:w-fit', 'primer:min-w-0')
  expect(actions.className).not.toMatch(/max-w-/)
  expect(actions.firstElementChild).toHaveClass('primer:flex-wrap')
})

it('forwards ref, className, and HTML props to composed Banner.Actions', () => {
  const ref = React.createRef<HTMLDivElement>()
  render(
    <Banner title="Security">
      <BannerActions
        ref={ref}
        className="custom-actions w-full"
        data-testid="actions"
        style={{width: '80%'}}
        primaryAction={<BannerPrimaryActionLink href="#p">Review</BannerPrimaryActionLink>}
      />
    </Banner>,
  )
  const actions = screen.getByTestId('actions')
  expect(ref.current).toBe(actions)
  expect(actions).toHaveClass('custom-actions', 'w-full', 'primer:min-w-0')
  expect(actions).not.toHaveClass('primer:w-fit')
  expect(actions).toHaveStyle({width: '80%'})
  expect(actions).toHaveAttribute('data-component', 'Banner.Actions')
})
