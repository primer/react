import React from 'react'
import {RefPicker, type SelectedRef} from './RefPicker'

export default {
  title: 'Components/SelectPanel/Examples/RefPicker',
  component: RefPicker,
}

export const Default = () => {
  return <RefPicker />
}

export const Controlled = () => {
  const [selected, setSelected] = React.useState<SelectedRef | undefined>({type: 'branches', name: 'main'})

  return (
    <div>
      <RefPicker value={selected} onChange={setSelected} />
      <p>
        Selected ref: <strong>{selected ? `${selected.name} (${selected.type})` : 'none'}</strong>
      </p>
    </div>
  )
}
