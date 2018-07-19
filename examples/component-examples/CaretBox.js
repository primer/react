import React from 'react'
import {PropsForm} from '@compositor/kit'
import {Caret, CaretBox, theme} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const CaretBoxExample = {
  name: 'CaretBox',
  element: (
    <div>
      <ExampleHeading mt={2}>CaretBox</ExampleHeading>
      <PropsForm>
        <CaretBox my={4} p={2} minHeight={100} borderColor="purple">
          CaretBox
        </CaretBox>
        <PropsForm.Select name="caret">{Caret.locations.map(loc => <option key={loc}>{loc}</option>)}</PropsForm.Select>
        <PropsForm.Select name="borderColor">
          {Object.keys(theme.colors.border).map(borderColor => <option key={borderColor}>{borderColor}</option>)}
        </PropsForm.Select>
        <PropsForm.Select name="bg">
          {Object.keys(theme.colors.bg).map(bgColor => <option key={bgColor}>{bgColor}</option>)}
        </PropsForm.Select>
      </PropsForm>
    </div>
  )
}

export default CaretBoxExample
