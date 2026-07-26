import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {Card, CardDescription, CardHeading, CardIcon, CardImage, CardMetadata} from './Card'

const TestIcon = () => <svg aria-hidden="true" />

it('labels section cards from a composed heading', () => {
  render(
    <Card as="section">
      <CardHeading>Project</CardHeading>
    </Card>,
  )

  expect(screen.getByRole('region', {name: 'Project'})).toBeInTheDocument()
})

it('preserves custom accessible labels on section cards', () => {
  const {container} = render(
    <Card aria-label="Project" as="section">
      <CardHeading>Project</CardHeading>
    </Card>,
  )

  expect(container.querySelector('section')).toHaveAttribute('aria-label', 'Project')
  expect(container.querySelector('section')).not.toHaveAttribute('aria-labelledby')
})

it('uses an explicit heading id for automatic section labelling', () => {
  const {container} = render(
    <Card as="section">
      <CardHeading id="project-heading">Project</CardHeading>
    </Card>,
  )

  expect(container.querySelector('section')).toHaveAttribute('aria-labelledby', 'project-heading')
})

it('does not reference a missing heading from section cards', () => {
  const {container} = render(
    <Card as="section">
      <CardDescription>Description</CardDescription>
    </Card>,
  )

  expect(container.querySelector('section')).not.toHaveAttribute('aria-labelledby')
})

it('composes slots into the upstream card structure', () => {
  const {container} = render(
    <Card>
      <CardDescription>Description</CardDescription>
      <CardMetadata>Updated</CardMetadata>
      <CardHeading>Project</CardHeading>
      <CardIcon icon={TestIcon} />
      <CardImage src="image.png" alt="Project preview" />
    </Card>,
  )

  expect(container.querySelector('[data-component="Card"] > div > [data-component="Card.Image"]')).toBeInTheDocument()
  expect(container.querySelector('[data-component="Card"] [data-component="Card.Heading"]')).toHaveTextContent(
    'Project',
  )
  expect(container.querySelector('[data-component="Card"] [data-component="Card.Metadata"]')).toHaveTextContent(
    'Updated',
  )
})

it('preserves custom and duplicate children alongside composed slots', () => {
  const {container} = render(
    <Card as="section">
      <CardHeading>Primary project</CardHeading>
      <span>Custom status</span>
      <CardDescription>Description</CardDescription>
      <CardHeading>Additional project heading</CardHeading>
    </Card>,
  )

  expect(screen.getByText('Custom status')).toBeInTheDocument()
  expect(screen.getByText('Additional project heading')).toBeInTheDocument()
  const headings = container.querySelectorAll('[data-component="Card.Heading"]')
  expect(headings[0]).toHaveAttribute('id')
  expect(headings[1]).not.toHaveAttribute('id')
})

it('composes slots nested in fragments', () => {
  const {container} = render(
    <Card>
      <>
        <CardIcon icon={TestIcon} />
        <CardHeading>Project</CardHeading>
      </>
    </Card>,
  )

  expect(container.querySelector('[data-component="Card"] > div > [data-component="Card.Icon"]')).toBeInTheDocument()
})

it('does not render an empty card', () => {
  // @ts-expect-error children is required, but runtime behavior is intentionally covered.
  const {container} = render(<Card />)
  expect(container).toBeEmptyDOMElement()
})
