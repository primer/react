import React from 'react'
import LabelGroup from '../LabelGroup'
import Label from '../Label'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

const comp = (
  <LabelGroup>
    <Label>Default label</Label>
    <Label>Darker gray label</Label>
    <Label outline>Default outline label</Label>
  </LabelGroup>
)

describe('BranchName', () => {
  it('has default theme', () => {
    expect(LabelGroup).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<LabelGroup as="div" />).type).toEqual('div')
  })

  it('implements common system props', () => {
    expect(LabelGroup).toImplementSystemProps(COMMON)
  })

  it('preserves className on children', () => {
    expect(
      render(
        <LabelGroup>
          <Label className="custom-className" />
        </LabelGroup>
      )
    ).toMatchSnapshot()
  })

  it('matches snapshot', () => {
    expect(render(comp)).toMatchSnapshot()
  })
})
