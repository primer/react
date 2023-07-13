import React from 'react'
import {Box, Link, Label} from '@primer/react'
import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'
import ReactMarkdown from 'react-markdown'

function PropsTable({children}) {
  return (
    <Table>
      <colgroup>
        <col style={{width: '20%'}} />
        <col style={{width: '30%'}} />
        <col style={{width: '10%'}} />
        <col style={{width: '40%'}} />
      </colgroup>
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

function Row({name, type, defaultValue, description, required, deprecated}) {
  return (
    <tr>
      <Box as="td" fontFamily="mono" fontSize={1} sx={{whiteSpace: 'nowrap'}} verticalAlign="top">
        {name}
        {required ? (
          <>
            {` `}
            <Label outline sx={{verticalAlign: 'middle', fontFamily: 'normal'}}>
              Required
            </Label>
          </>
        ) : null}
        {deprecated ? (
          <>
            {` `}
            <Label
              outline
              sx={{verticalAlign: 'middle', fontFamily: 'normal', color: 'danger.fg', borderColor: 'danger.emphasis'}}
            >
              Deprecated
            </Label>
          </>
        ) : null}
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1} verticalAlign="top">
        <Box as="pre" fontFamily="inherit" fontSize="inherit" margin={0} sx={{whiteSpace: 'pre-wrap'}}>
          {type}
        </Box>
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1} verticalAlign="top">
        {defaultValue}
      </Box>
      <Box as="td" verticalAlign="top">
        <ReactMarkdown components={{a: Link, code: InlineCode}}>{description}</ReactMarkdown>
      </Box>
    </tr>
  )
}

function BasePropRows({passthroughPropsLink, elementType, isPolymorphic, refType}) {
  return (
    <>
      <SxRow />
      {isPolymorphic && <AsRow defaultElementType={elementType} />}
      {refType && <RefRow refType={refType} isPolymorphic={isPolymorphic} />}
      <PassthroughPropsRow
        passthroughPropsLink={passthroughPropsLink}
        elementName={elementType}
        isPolymorphic={isPolymorphic}
      />
    </>
  )
}

function PassthroughPropsRow({elementName, isPolymorphic, passthroughPropsLink}) {
  return (
    <tr>
      <Box as="td" colSpan={4} fontSize={1} verticalAlign="top">
        Additional props are passed to the <InlineCode>&lt;{elementName}&gt;</InlineCode> element. See{' '}
        {passthroughPropsLink} for a list of props accepted by the <InlineCode>&lt;{elementName}&gt;</InlineCode>{' '}
        element.
        {isPolymorphic && (
          <>
            {' '}
            If an <InlineCode>as</InlineCode> prop is specified, the accepted props will change accordingly.
          </>
        )}
      </Box>
    </tr>
  )
}

function AsRow({defaultElementType}) {
  // Element is a component if the first letter is uppercase (e.g. Button)
  const isComponent = defaultElementType[0].toUpperCase() === defaultElementType[0]
  return (
    <Row
      name="as"
      defaultValue={isComponent ? defaultElementType : `"${defaultElementType}"`}
      type={
        <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L73">
          React.ElementType
        </Link>
      }
      description="The underlying element to render — either a HTML element name or a React component."
    />
  )
}

function RefRow({refType, isPolymorphic}) {
  return (
    <Row
      name="ref"
      type={`React.RefObject<${refType}>`}
      description={
        <>
          A ref to the element rendered by this component.
          {isPolymorphic && (
            <>
              {' '}
              Because this component is polymorphic, the type will vary based on the value of the{' '}
              <InlineCode>as</InlineCode> prop.
            </>
          )}
        </>
      }
    />
  )
}

function SxRow() {
  return (
    <Row
      name="sx"
      type={
        <Link href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/styled-system__css/index.d.ts#L407">
          SystemStyleObject
        </Link>
      }
      description={
        <>
          Style overrides to apply to the component. See also{' '}
          <Link href="/react/overriding-styles">overriding styles</Link>.
        </>
      }
    />
  )
}

Object.assign(PropsTable, {Row, BasePropRows, AsRow, RefRow, PassthroughPropsRow, SxRow})

export {PropsTable}
