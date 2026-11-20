import {describe, expect, test} from 'vitest'
import {page} from 'vitest/browser'
import {renderServer} from 'vitest-plugin-rsc/testing-library'
import {Checkbox, Heading, Text} from '../index'

// `src/index.ts` is the `'use client'` boundary, so everything imported from it is a client
// reference when it is rendered by a Server Component.
function Greeting({name}: {name: string}) {
  return (
    <section>
      <Heading as="h2">Hello, {name}</Heading>
      <Text>Rendered on the server</Text>
    </section>
  )
}

describe('React Server Components', () => {
  test('renders components inside a Server Component', async () => {
    await renderServer(<Greeting name="Primer" />)

    await expect.element(page.getByRole('heading', {name: 'Hello, Primer'})).toBeVisible()
    await expect.element(page.getByText('Rendered on the server')).toBeVisible()
  })

  test('hydrates client components rendered by a Server Component', async () => {
    await renderServer(<Checkbox aria-label="Subscribe" />)

    const checkbox = page.getByRole('checkbox', {name: 'Subscribe'})
    await expect.element(checkbox).not.toBeChecked()
    await checkbox.click()
    await expect.element(checkbox).toBeChecked()
  })
})
