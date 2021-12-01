import React from 'react'
import {Box, Link, Label} from '@primer/components'
import Table from '@primer/gatsby-theme-doctocat/src/components/table'

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
      <Box as="td" fontFamily="mono" fontSize={1} fontWeight="bold" sx={{whiteSpace: 'nowrap'}}>
        {typeof name === 'function' ? name() : name}
        {required ? (
          <>
            {` `}
            <Label style={{verticalAlign: 'text-top'}}>Required</Label>
          </>
        ) : null}
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1}>
        {typeof type === 'function' ? type() : type}
      </Box>
      <Box as="td" fontFamily="mono" fontSize={1}>
        {typeof defaultValue === 'function' ? defaultValue() : defaultValue}
      </Box>
      <td>{typeof description === 'function' ? description() : description}</td>
    </tr>
  )
}

function AsRow({defaultValue}) {
  return (
    <Row
      name="as"
      defaultValue={defaultValue}
      type="ReactElement"
      description="The underlying element to render — either a DOM element or a React component."
    />
  )
}

function SxRow() {
  return (
    <Row
      name="sx"
      defaultValue="{}"
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

Object.assign(PropsTable, {Row, AsRow, SxRow})

export {PropsTable}
