import {describe, expect, test} from 'vitest'
import {page} from 'vitest/browser'
import {renderServer} from 'vitest-plugin-rsc/testing-library'
import {Heading, Text} from '../index'
import {Counter} from './rsc-fixtures/Counter'

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

  test('runs client state and handlers for a client component rendered by a Server Component', async () => {
    await renderServer(<Counter initialCount={1} />)

    const button = page.getByRole('button', {name: 'Count: 1'})
    await expect.element(button).toBeVisible()
    await button.click()
    await expect.element(page.getByRole('button', {name: 'Count: 2'})).toBeVisible()
  })
})
