import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {list, get} from '../../../components'

interface Props {
  params: {
    id: string
  }
}

export default async function ComponentPage(props: Props) {
  const component = await get(props.params.id)
  if (!component) {
    throw new Error('Component not found')
  }

  console.log(component)
  return (
    <>
      <main>
        <nav aria-label="Breadcrumbs">
          <ul>
            <li>
              <Link href="/">Components</Link>
            </li>
          </ul>
        </nav>
        <h1>{component.name}</h1>
        <p>{component.status}</p>
        <p>{component.a11yReviewed ? '✅ Reviewed' : null}</p>
        <section>
          <h2>Props</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default value</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map(prop => {
                return (
                  <tr key={prop.name}>
                    <td>{prop.name}</td>
                    <td>
                      <Markdown remarkPlugins={[remarkGfm]}>{prop.description}</Markdown>
                    </td>
                    <td>
                      <code>{prop.type}</code>
                    </td>
                    <td>{prop.required ? 'Required' : null}</td>
                    <td>
                      <code>{prop.defaultValue}</code>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        {component.subcomponents.map(subcomponent => {
          return (
            <section key={subcomponent.name}>
              <h2>{subcomponent.name}</h2>
              <section>
                <h3>{subcomponent.name} Props</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Default value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcomponent.props.map(prop => {
                      return (
                        <tr key={prop.name}>
                          <td>{prop.name}</td>
                          <td>
                            <Markdown remarkPlugins={[remarkGfm]}>{prop.description}</Markdown>
                          </td>
                          <td>
                            <code>{prop.type}</code>
                          </td>
                          <td>{prop.required ? 'Required' : null}</td>
                          <td>
                            <code>{prop.defaultValue}</code>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </section>
            </section>
          )
        })}
      </main>
    </>
  )
}

export async function generateStaticParams() {
  const components = await list()
  return components.map(component => {
    return {
      id: component.id,
    }
  })
}
