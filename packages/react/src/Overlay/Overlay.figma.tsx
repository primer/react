// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import {Overlay} from '../../src'
import figma from '@figma/code-connect'

figma.connect(Overlay, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=9685-44751&m=dev', {
  props: {
    children: figma.children('*'),
    overflow: figma.boolean('overflow'),
  },
  example: ({children}) => <Overlay>{children}</Overlay>,
})
