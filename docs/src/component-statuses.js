import React from 'react'
import {useStaticQuery, graphql, Link as GatsbyLink} from 'gatsby'
import {Link} from '@primer/components'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'
import StatusLabel from '@primer/gatsby-theme-doctocat/src/components/status-label'

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
            }
          }
        }
      }
    }
  `)

  const pages = data.allSitePage.nodes
    .filter(node => node.context.frontmatter && node.context.frontmatter.status !== null)
    .sort((a, b) => {
      // if (a.context.frontmatter.status === 'deprecated') return -1
      // if (b.context.frontmatter.status === 'deprecated') return 1
      // return 0
      return a.context.frontmatter.title.localeCompare(b.context.frontmatter.title)
    })

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th align="left">Component</th>
            <th align="left">Status</th>
            <th align="left">Description</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.path}>
              <td valign="top">
                <Link as={GatsbyLink} to={page.path}>
                  {page.context.frontmatter.title}
                </Link>
              </td>
              <td valign="top">
                <StatusLabel status={page.context.frontmatter.status} />
              </td>
              <td>{page.context.frontmatter.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
