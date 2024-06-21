import React from 'react'
import {Box, Link} from '@primer/react'
import {PropsTable} from './props-table'
import {H3} from '@primer/gatsby-theme-doctocat/src/components/heading'
import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'

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
//   import data from '../../packages/react/src/Button/Button.docs.json'
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
      <Props props={data.props} passthrough={data.passthrough} />
      {data.subcomponents?.map(subcomponent => {
        return (
          <>
            <H3>{subcomponent.name}</H3>
            <Props props={subcomponent.props} passthrough={subcomponent.passthrough} />
          </>
        )
      })}
    </>
  )
}

function Props({props, passthrough}) {
  return props.length > 0 ? (
    <PropsTable>
      {props.map(prop => {
        const isPolymorphic = props.some(prop => prop.name === 'as')
        let type = prop.type
        let description = prop.description

        // Provide default types and descriptions for common props like `as`, `ref`, and `sx`
        switch (prop.name) {
          case 'as':
            type = (
              <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L73">
                React.ElementType
              </Link>
            )
            description =
              description || 'The underlying element to render — either a HTML element name or a React component.'
            break

          case 'ref':
            if (isPolymorphic) {
              description = description || (
                <>
                  A ref to the element rendered by this component. Because this component is polymorphic, the type will
                  vary based on the value of the <InlineCode>as</InlineCode> prop.
                </>
              )
            } else {
              description = description || 'A ref to the element rendered by this component.'
            }
            break

          case 'sx':
            type = (
              <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/styled-system__css/index.d.ts#L407">
                SystemStyleObject
              </Link>
            )
            description = description || (
              <>
                Style overrides to apply to the component. See also{' '}
                <Link href="/react/overriding-styles">overriding styles</Link>.
              </>
            )
            break
        }

        return (
          <PropsTable.Row
            key={prop.name}
            name={prop.name}
            required={prop.required}
            deprecated={prop.deprecated}
            type={type}
            defaultValue={prop.defaultValue}
            description={description}
          />
        )
      })}
      {passthrough ? (
        <PropsTable.PassthroughPropsRow
          elementName={passthrough.element}
          passthroughPropsLink={<Link href={passthrough.url}>{passthrough.element} docs</Link>}
        />
      ) : null}
    </PropsTable>
  ) : (
    <Box sx={{p: 3, bg: 'canvas.inset', color: 'fg.muted', borderRadius: 2, textAlign: 'center'}}>No props</Box>
  )
}
