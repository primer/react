import {H3} from '@primer/gatsby-theme-doctocat/src/components/heading'
import Paragraph from '@primer/gatsby-theme-doctocat/src/components/paragraph'
import {Flash} from '@primer/react'
import {graphql, useStaticQuery} from 'gatsby'
import React from 'react'
import {PropsTable} from './props-table'

/**
 * Render prop documentation for the given component
 *
 * @deprecated This component does not reliably generate the correct prop types. Use `ComponentProps` instead.
 */
export function Props({of}) {
  const data = useStaticQuery(graphql`
    query {
      allComponentMetadata {
        nodes {
          id
          name
          props {
            description
            defaultValue
            name
            required
            type
          }
        }
      }
    }
  `)

  const displayName = of?.displayName || of?.name || ''
  const component = data.allComponentMetadata.nodes.find(node => node.name === displayName)

  if (!component) {
    // eslint-disable-next-line no-console
    console.error(`Could not find component ${displayName}`)
    return (
      <>
        <H3>{displayName}</H3>
        <Flash variant="danger">Component not found</Flash>
      </>
    )
  }

  return (
    <>
      <H3>{component.name}</H3>
      {component.props.length > 0 ? (
        <PropsTable>
          {component.props.map(prop => (
            <PropsTable.Row
              key={prop.name}
              required={prop.required}
              name={prop.name}
              defaultValue={prop.defaultValue}
              type={prop.type}
              description={prop.description}
            />
          ))}
        </PropsTable>
      ) : (
        <Paragraph>No props</Paragraph>
      )}
    </>
  )
}
