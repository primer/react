import React from 'react'
import Link from 'next/link'
import {list} from '../components'

export default async function IndexPage() {
  const data = await list()
  const components = Object.values(data).sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  return (
    <main>
      <h1>Components</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Accessibility reviewed</th>
          </tr>
        </thead>
        <tbody>
          {components.map(component => {
            return (
              <tr key={component.id}>
                <td>
                  <Link href={`/components/${component.id}`}>{component.name}</Link>
                </td>
                <td>{component.status}</td>
                <td>{component.a11yReviewed ? '✅' : null}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
