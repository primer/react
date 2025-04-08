import React from 'react'
import BranchName from './BranchName'
import figma from '@figma/code-connect'

figma.connect(
  BranchName,
  'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=3655-7208&mode=design&t=HqwKHI6akvFT5reK-4',
  {
    props: {
      label: figma.textContent('branch_name'),
      as: figma.enum('type', {
        text: 'span',
        link: undefined,
      }),
      href: figma.enum('type', {
        text: undefined,
        link: '#',
      }),
    },
    example: ({as, label, href}) => (
      <BranchName as={as} href={href}>
        {label}
      </BranchName>
    ),
  },
)
