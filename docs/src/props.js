import {H3} from '@primer/gatsby-theme-doctocat/src/components/heading'
import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'
import {graphql, useStaticQuery} from 'gatsby'
import React from 'react'

export function Props({of}) {
  const data = useStaticQuery(graphql`
    query {
      allComponentMetadata {
        nodes {
          id
          name
          props {
            description
            name
            required
            type
          }
        }
      }
    }
  `)

  const displayName = of?.displayName || of?.name
  const component = data.allComponentMetadata.nodes.find(node => node.name === displayName)

  if (!component) {
    // eslint-disable-next-line no-console
    console.error(`Could not find component ${displayName}`)
    return null
  }

  return (
    <>
      <H3>{component.name}</H3>
      <Table>
        <thead>
          <tr>
            <th align="left">Prop</th>
            <th align="left">Type</th>
            <th align="left">Default</th>
            <th align="left">Description</th>
          </tr>
        </thead>
        <tbody>
          {component.props.map(prop => (
            <tr key={prop.name}>
              <td>
                <InlineCode>{prop.name}</InlineCode>
              </td>
              <td>
                <InlineCode>{prop.type}</InlineCode>
              </td>
              <td>{prop.defaultValue ? <InlineCode>{JSON.stringify(prop.defaultValue)}</InlineCode> : '–'}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
