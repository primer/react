import componentMetadata from '@primer/component-metadata'
import {Link, Label, Octicon} from '@primer/react'
import {AccessibilityInsetIcon} from '@primer/octicons-react'
import StatusLabel from '@primer/gatsby-theme-doctocat/src/components/status-label'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'
import {graphql, Link as GatsbyLink, useStaticQuery} from 'gatsby'
import React from 'react'

export function ComponentStatuses() {
  const data = useStaticQuery(graphql`
    query ComponentStatuses {
      allSitePage {
        nodes {
          path
          context {
            frontmatter {
              title
              status
              description
              a11yReviewed
              componentId
            }
          }
        }
      }
    }
  `)

  const pages = data.allSitePage.nodes
    // Only show components that have a status
    .filter(node => node.context.frontmatter && node.context.frontmatter.status !== null)
    // Sort alphabetically by title
    .sort((a, b) => a.context.frontmatter.title.localeCompare(b.context.frontmatter.title))

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th align="left">Component</th>
            <th align="center">Status</th>
            <th align="center">Accessibility</th>
            <th align="left">Description</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => {
            // eslint-disable-next-line prefer-const
            let {title, status, description, componentId, a11yReviewed} = page.context.frontmatter

            const component = componentMetadata.components[componentId]

            // Auto-populate title and description using component metadata
            if (component) {
              title ||= component.displayName
              description ||= component.description
            }

            return (
              <tr key={page.path}>
                <td valign="top">
                  <Link as={GatsbyLink} to={page.path}>
                    {title}
                  </Link>
                </td>
                <td align="center" valign="top" style={{whiteSpace: 'nowrap'}}>
                  <StatusLabel size="large" status={status} />
                </td>
                <td align="center" valign="top" style={{whiteSpace: 'nowrap'}}>
                  {a11yReviewed ? (
                    <Label
                      size="large"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: 'done.subtle',
                        fontWeight: 'normal',
                        borderColor: 'transparent',
                      }}
                    >
                      <Octicon icon={AccessibilityInsetIcon} sx={{fill: 'done.fg'}} />
                      Reviewed
                    </Label>
                  ) : (
                    <Label
                      size="large"
                      sx={{
                        backgroundColor: 'neutral.subtle',
                        fontWeight: 'normal',
                        borderColor: 'transparent',
                      }}
                    >
                      Not reviewed
                    </Label>
                  )}
                </td>
                <td>{description}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
