import React from 'react'
import {ConfirmationDialog} from '../'
import figma from '@figma/code-connect'

figma.connect(
  ConfirmationDialog,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16593%3A65794',
  {
    props: {},
    example: props => <ConfirmationDialog onClose={/* TODO */} title={/* TODO */} />,
  },
)
