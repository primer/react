import React from 'react'
import styled from 'styled-components'
import Link from '../../src/Link'
import {H1, H2, H3, H4, H5, H6} from '@primer/gatsby-theme-doctocat/src/components/heading'
import BorderBox from '../../src/BorderBox'
import Button from '../../src/Button'
import Text from '../../src/Text'
import Details from '../../src/Details'
import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'
import Paragraph from '@primer/gatsby-theme-doctocat/src/components/paragraph'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'

function getHeadingElement(headingLevel) {
  switch (headingLevel) {
    case 1:
      return H1
    case 2:
      return H2
    case 3:
      return H3
    case 4:
      return H4
    case 5:
      return H5
    case 6:
      return H6
  }
}

const InheritedBox = styled(BorderBox)`
  > :first-child {
    margin-top: 0px !important;
  }
`

function collect(inherited, acc = {system: [], inherited: []}, seen = new Set()) {
  for (const Comp of inherited) {
    if (Comp.propTypesDocumented) {
      const {system, inherited: nestedInherited} = Comp.propTypesDocumented
      for (const sys of system) {
        if (!seen.has(sys)) {
          acc.system.push(sys)
          seen.add(sys)
        }
      }
      for (const inh of nestedInherited) {
        if (!seen.has(inh)) {
          acc.inherited.push(inh)
          seen.add(inh)
        }
      }
      if (nestedInherited.length) {
        collect(nestedInherited, acc, seen)
      }
    }
  }

  return acc
}

function ComponentProps({Component, name, headingLevel, showInherited, showSystem}) {
  if (!Component.propTypesDocumented) {
    return null
  }
  const Heading = getHeadingElement(headingLevel)

  const {own} = Component.propTypesDocumented
  const {system, inherited} = collect([Component])

  const output = []

  if (own) {
    output.push(
      <OwnProps key="own" name={name} props={own} defaults={Component.defaultProps || {}} headingLevel={headingLevel} />
    )
  }

  const inheritedWithDocs = inherited.filter(Comp => Comp.propTypesDocumented)
  if (inheritedWithDocs.length && showInherited) {
    output.push()
    output.push(
      <React.Fragment key="inherited">
        <Heading>Inherited props</Heading>
        <Paragraph>
          <InlineCode>{name}</InlineCode> inherits from the following components and thus receives their props:
        </Paragraph>
      </React.Fragment>
    )
    for (const Comp of inherited) {
      output.push(
        <Details mb={2} key={`inh-${Comp.displayName}`}>
          {({open}) => (
            <>
              <Button as="summary">
                {Comp.displayName} {open ? '▼' : '►'}
              </Button>
              <InheritedBox p={2} mt={2}>
                <ComponentProps
                  Component={Comp}
                  name={Comp.displayName}
                  headingLevel={headingLevel + 1}
                  showInherited={false}
                  showSystem
                />
              </InheritedBox>
            </>
          )}
        </Details>
      )
    }
  }

  if (showSystem && system && system.length) {
    output.push(<SystemProps key="system" name={name} systemProps={system} headingLevel={headingLevel} />)
  }

  return <>{output}</>
}

ComponentProps.defaultProps = {
  headingLevel: 3,
  showInherited: true,
  showSystem: true
}

function getDefault(defaults, prop) {
  const value = defaults[prop]
  return getDisplayValue(value)
}

function getDisplayValue(value, key) {
  const type = typeof value

  if (type === 'object') {
    return '(object)'
  }

  if (type === 'string') {
    return <InlineCode key={key}>"{value}"</InlineCode>
  }

  if (type === 'number' || type === 'boolean') {
    return <InlineCode key={key}>{String(value)}</InlineCode>
  }

  if (type === 'function') {
    return <InlineCode key={key}>(function)</InlineCode>
  }

  return value
}

const PropValueList = styled.ul`
  margin-block-start: 0;
  margin-block-end: 0;
  margin-left: -20px;
`

function getType(doc) {
  switch (doc.name) {
    case 'any':
      return 'any'
    case 'array':
      return 'array'
    case 'bool':
      return 'boolean'
    case 'func':
      return 'function'
    case 'number':
      return 'number'
    case 'node':
      return 'node'
    case 'object':
      return 'object'
    case 'string':
      return 'string'
    case 'symbol':
      return 'symbol'
    case 'element':
      return 'element'
    case 'elementType':
      return 'element type'

    case 'instanceOf':
      return `instance of ${doc.args.name}`
    case 'arrayOf':
      return `array of ${getType(doc.args)}s`
    case 'oneOf': {
      const items = doc.args.map((item, idx) => getDisplayValue(item, idx))
      return (
        <>
          <Text>One of:</Text>
          <PropValueList>
            {items.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={idx}>{item}</li>
            ))}
          </PropValueList>
        </>
      )
    }
    case 'oneOfType': {
      const items = doc.args.map(item => getType(item.doc))
      return (
        <>
          <Text>One of type:</Text>
          <PropValueList>
            {items.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={idx}>{item}</li>
            ))}
          </PropValueList>
        </>
      )
    }
    default:
      return '(unknown type)'
  }
}

function OwnProps({props, defaults, headingLevel}) {
  const Heading = getHeadingElement(headingLevel)
  const propsToShow = Object.keys(props).filter(key => !props[key].doc.hidden)
  if (propsToShow.length === 0) {
    return (
      <>
        <Heading>Component props</Heading>
        <Text>This component gets no additional props.</Text>
      </>
    )
  }
  return (
    <>
      <Heading>Component props</Heading>
      <Table>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Type</th>
            <th align="left">Default value</th>
            <th align="left">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsToShow.map(prop => {
            return (
              <tr key={prop}>
                <td align="left">{prop}</td>
                <td align="left">{getType(props[prop].doc)}</td>
                <td align="left">{getDefault(defaults, prop)}</td>
                <td align="left">{props[prop].doc.desc}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

function SystemProps({name, systemProps, headingLevel}) {
  const Heading = getHeadingElement(headingLevel)
  return (
    <>
      <Heading>System props</Heading>
      <Paragraph>
        <InlineCode>{name}</InlineCode> components receive the following categories of system props. See our{' '}
        <Link href="/system-props">System Props page</Link> for more information.
      </Paragraph>
      <Table>
        <thead>
          <tr>
            <th align="left">Category</th>
            <th align="left">Included props</th>
          </tr>
        </thead>
        <tbody>
          {systemProps.map(s => (
            <tr key={s.systemPropsName}>
              <td>
                <InlineCode>{s.systemPropsName}</InlineCode>
              </td>
              <td>
                <div>{Object.keys(s.propTypes).join(', ')}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default ComponentProps
