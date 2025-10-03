import React from 'react'

export default function DefaultExportComponent({a, b = false}: {a: string; b?: boolean}) {
  return (
    <div>
      {a}
      {b ? 'b' : ''}
    </div>
  )
}
