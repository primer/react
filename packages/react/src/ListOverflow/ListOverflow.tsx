import React from 'react'
import '../../../list-overflow-element/src/define'
import {ListOverflowElement} from '../../../list-overflow-element/src/list-overflow-element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'list-overflow': React.DetailedHTMLProps<React.HTMLAttributes<ListOverflowElement>, ListOverflowElement>
    }
  }
}

interface ListOverflowProps extends React.PropsWithChildren {}

function ListOverflow({children}: ListOverflowProps) {
  return (
    <list-overflow
      style={{
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {children}
      <button slot="trigger" type="button" popovertarget="overflow">
        ...
      </button>
      <ul id="overflow" slot="overflow" popover=""></ul>
    </list-overflow>
  )
}

export {ListOverflow}
export type {ListOverflowProps}
