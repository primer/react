/* eslint-disable react/no-array-index-key */
import React from 'react'
import DoctocatTable from '@primer/gatsby-theme-doctocat/src/components/table'

function Table({columns, rows, ...rest}) {
  return (
    <DoctocatTable {...rest}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th align="left" key={idx}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((val, iidx) => (
              <td align="left" key={iidx}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DoctocatTable>
  )
}

export default Table
