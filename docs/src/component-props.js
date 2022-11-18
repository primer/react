import React from 'react'
import {Box} from '@primer/react'
import {PropsTable} from './props-table'
import {H3} from '@primer/gatsby-theme-doctocat/src/components/heading'

// We're moving the source of truth for component prop documentation out of .mdx
// files and into .docs.json files that live in the same directory as the
// component's source code. Example:
//
//   src/
//     Button/
//       Button.tsx
//       Button.docs.json
//
// We'll use this `ComponentProps` component to render the prop tables for
// components given the data defined in the .docs.json file.
//
// To render prop documentation in an .mdx file, import the component data:
//
//   import data from '../../src/Button/Button.docs.json'
//
// Then pass the data to `ComponentProps`:
//
//   ## Props
//   <ComponentProps data={data} />
//
// The schema for the `data` object is defined in /script/component-props/component.schema.json

export function ComponentProps({data}) {
  return (
    <>
      <H3>{data.name}</H3>
      {data.props.length > 0 ? (
        <PropsTable>
          {data.props.map(prop => {
            return (
              <PropsTable.Row
                key={prop.name}
                name={prop.name}
                required={prop.required}
                deprecated={prop.deprecated}
                type={prop.type}
                defaultValue={prop.defaultValue}
                description={prop.description}
              />
            )
          })}
        </PropsTable>
      ) : (
        <Box sx={{p: 3, bg: 'canvas.inset', color: 'fg.muted', borderRadius: 2, textAlign: 'center'}}>No props</Box>
      )}
      {data.subcomponents.map(subcomponent => {
        return (
          <>
            <H3>{subcomponent.name}</H3>
            {subcomponent.props.length > 0 ? (
              <PropsTable>
                {subcomponent.props.map(prop => {
                  return (
                    <PropsTable.Row
                      key={prop.name}
                      name={prop.name}
                      required={prop.required}
                      deprecated={prop.deprecated}
                      type={prop.type}
                      defaultValue={prop.defaultValue}
                      description={prop.description}
                    />
                  )
                })}
              </PropsTable>
            ) : (
              <Box sx={{p: 3, bg: 'canvas.inset', color: 'fg.muted', borderRadius: 2, textAlign: 'center'}}>
                No props
              </Box>
            )}
          </>
        )
      })}
    </>
  )
}
