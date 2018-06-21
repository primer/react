import React from 'react'
import { PropsForm } from '@compositor/kit'
import { Block, Caret, CaretBox, theme } from '../../src'
import ExampleHeading from '../ExampleHeading'

const CaretBoxExample =
  {
    name: 'CaretBox',
    element: (
      <Block p={2}>
          <ExampleHeading mt={2}>CaretBox</ExampleHeading>
          <PropsForm>
            <CaretBox my={4} p={2} minHeight={100} border={[true, 'purple']}>CaretBox</CaretBox>
            <PropsForm.Select name='caret'>
              {Caret.locations.map((loc, i) => (
                <option>{loc}</option>))}
            </PropsForm.Select>
            <PropsForm.Select name='border'>
              {Object.keys(theme.colors.border).map(borderColor => (
                <option>{`[true, borderColor]`}</option>
              ))}
            </PropsForm.Select>
            <PropsForm.Select name='bg'>
              {Object.keys(theme.colors.bg).map(bgColor => (
                <option>{bgColor}</option>
              ))}
            </PropsForm.Select>
          </PropsForm>
      </Block>
    )
  }

export default CaretBoxExample
