import {Box} from '@primer/components'
import {ComponentChecklist} from '../../component-checklist'
import {Props} from '../../props'
import {PropsTable} from '../../props-table'

export default {
  Box,
  ComponentChecklist,
  Props,
  PropsTable,
  // HACK: MDX doesn't support rendering subcomponents with dot notation
  //       so we need to alias them
  PropsTableRow: PropsTable.Row,
  PropsTableBasePropRows: PropsTable.BasePropRows,
  PropsTablePassthroughPropsRow: PropsTable.PassthroughPropsRow,
  PropsTableAsRow: PropsTable.AsRow,
  PropsTableRefRow: PropsTable.RefRow,
  PropsTableSxRow: PropsTable.SxRow
}
