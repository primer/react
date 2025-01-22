import React from 'react'
import {NavList} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  NavList,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16716-62541&t=m8uYul4RVKTAkjzl-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <NavList>{children}</NavList>,
  },
)
