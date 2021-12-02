import React from 'react'
import {Box, Link, Label} from '@primer/components'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'
import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'
import {element} from 'prop-types'

function PropsTable({children}) {
  return (
    <Table>
      <thead>
        <tr>
          <Box as="th" textAlign="left">
            Name
          </Box>
          <Box as="th" textAlign="left">
            Type
          </Box>
          <Box as="th" textAlign="left">
            Default
          </Box>
          <Box as="th" textAlign="left">
            Description
          </Box>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

function Row({name, type, defaultValue, description, required}) {
  return (
    <tr>
      <Box as="td" fontFamily="mono" fontSize={1} sx={{whiteSpace: 'nowrap'}} verticalAlign="top">
        {typeof name === 'function' ? name() : name}
        {required ? (
          <>
            {` `}
            <Label style={{verticalAlign: 'text-top'}}>Required</Label>
          </>
        ) : null}
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1} verticalAlign="top">
        {typeof type === 'function' ? type() : type}
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1} verticalAlign="top">
        {typeof defaultValue === 'function' ? defaultValue() : defaultValue}
      </Box>
      <Box as="td" verticalAlign="top">
        {typeof description === 'function' ? description() : description}
      </Box>
    </tr>
  )
}

function CommonPropRows({elementType, isPolymorphic}) {
  return (
    <>
      <SxRow />
      {isPolymorphic && <AsRow defaultElementType={elementType} />}
      <RefRow elementType={elementType} isPolymorphic={isPolymorphic} />
      <DOMPropsRow elementName={elementType} isPolymorphic={isPolymorphic} />
    </>
  )
}

function DOMPropsRow({elementName, isPolymorphic}) {
  return (
    <tr>
      <Box as="td" colSpan={3}>
        <i>
          (various DOM props. See{' '}
          <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L2023">
            the React HTML attribute types
          </Link>
          )
        </i>
      </Box>
      <td>
        This component will also accept all the props of its underlying element (<InlineCode>{elementName}</InlineCode>)
        {isPolymorphic && (
          <>
            Or, if an <InlineCode>as</InlineCode> prop is passed, the properties of that element are passed through.
          </>
        )}
        .
      </td>
    </tr>
  )
}

function AsRow({defaultElementType}) {
  return (
    <Row
      name="as"
      defaultValue={`"${defaultElementType}"`}
      type={() => (
        <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L73">
          React.ElementType
        </Link>
      )}
      description="The underlying element to render — either a DOM element name or a React component."
    />
  )
}

function RefRow({elementType, isPolymorphic}) {
  return (
    <Row
      name="ref"
      type={() => <>{'React.RefObject<HTMLElement>'}</>}
      description={() => (
        <>
          A ref to the element rendered by this component.
          {isPolymorphic && (
            <>
              Because this component is isPolymorphic, the type will vary based on the value of the{' '}
              <InlineCode>as</InlineCode> prop.
            </>
          )}
        </>
      )}
    />
  )
}

function SxRow() {
  return (
    <Row
      name="sx"
      type={() => (
        <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/styled-system__css/index.d.ts#L407">
          SystemStyleObject
        </Link>
      )}
      description={() => (
        <>
          Style overrides to apply to the component. See also <Link href="/overriding-styles">overriding styles</Link>.
        </>
      )}
    />
  )
}

Object.assign(PropsTable, {Row, CommonPropRows, AsRow, RefRow, DOMPropsRow, SxRow})

export {PropsTable}
