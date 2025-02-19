import React from 'react'
import {DataTable} from '../experimental'
import figma from '@figma/code-connect'

figma.connect(DataTable, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28591%3A24975', {
  props: {},
  example: props => <DataTable data={/* TODO */} columns={/* TODO */} />,
})
