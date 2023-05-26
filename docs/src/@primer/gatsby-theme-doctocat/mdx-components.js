import InlineCode from '@primer/gatsby-theme-doctocat/src/components/inline-code'
import {Box, Link} from '@primer/react'
import {ComponentChecklist} from '../../component-checklist'
import {ComponentProps} from '../../component-props'
// eslint-disable-next-line import/no-deprecated
import {Props} from '../../props'
import {PropsTable} from '../../props-table'

export default {
  Box,
  Link,
  InlineCode,
  ComponentChecklist,
  // eslint-disable-next-line import/no-deprecated
  Props,
  PropsTable,
  ComponentProps,
  // HACK: MDX doesn't support rendering subcomponents with dot notation
  //       so we need to alias them
  PropsTableRow: PropsTable.Row,
  PropsTableBasePropRows: PropsTable.BasePropRows,
  PropsTablePassthroughPropsRow: PropsTable.PassthroughPropsRow,
  PropsTableAsRow: PropsTable.AsRow,
  PropsTableRefRow: PropsTable.RefRow,
  PropsTableSxRow: PropsTable.SxRow,
}
