import React from 'react'
import {Example, Library} from '@compositor/kit'

import {default as AvatarExample} from './Avatar'
import {default as BlockExample} from './Block'
import {default as BoxExample} from './Box'
// import {default as BranchNameExample} from './BranchName'
import {default as ButtonExample} from './Button'
import {default as CaretExample} from './Caret'
import {default as ColorsExample} from './colors'
import {default as CounterLabelExample} from './CounterLabel'
import {default as DetailsExample} from './Details'
import {default as DonutChartExample} from './DonutChart'
import {default as DropdownExample} from './Dropdown'
import {default as FlashExample} from './Flash'
import {default as FontSizeExample} from './font-sizes'
import {default as FormExample} from './form-elements'
import {default as HeadingExample} from './Heading'
import {default as LabelExample} from './Label'
import {default as LinkExample} from './Link'
import {default as MergeStatusExample} from './MergeStatus'
import {default as StateLabelExample} from './StateLabel'
import {default as TextExample} from './Text'
import {default as TooltipExample} from './Tooltip'

export default function Index() {
  return (
    <Library title='primer-react'>
      <Example name='Avatar'><AvatarExample /></Example>
      <Example name='Block'><BlockExample /></Example>
      <Example name='Box'><BoxExample /></Example>
      // <Example name='BranchName'><BranchNameExample /></Example>
      <Example name='Buttons'><ButtonExample /></Example>
      <Example name='Caret'><CaretExample /></Example>
      <Example name='Colors'><ColorsExample /></Example>
      <Example name='CounterLabel'><CounterLabelExample /></Example>
      <Example name='Details'><DetailsExample /></Example>
      <Example name='DonutChart'><DonutChartExample /></Example>
      <Example name='Dropdown'><DropdownExample /></Example>
      <Example name='Flash'><FlashExample /></Example>
      <Example name='Font sizes'><FontSizeExample /></Example>
      <Example name='Form elements'><FormExample /></Example>
      <Example name='Heading'><HeadingExample /></Example>
      <Example name='Label'><LabelExample /></Example>
      <Example name='Link'><LinkExample /></Example>
      <Example name='MergeStatus'><MergeStatusExample /></Example>
      <Example name='StateLabel'><StateLabelExample /></Example>
      <Example name='Text'><TextExample /></Example>
      <Example name='Tooltip'><TooltipExample /></Example>
    </Library>
  )
}
