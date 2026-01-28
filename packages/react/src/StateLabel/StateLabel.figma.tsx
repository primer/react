import {StateLabel} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  StateLabel,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18959-64962&t=gQF1OJTEGB3vTxPz-4',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
      }),
      status: figma.enum('status', {
        draft: 'issueDraft',
        open: 'issueOpened',
        closed: 'issueClosed',
        unavailable: 'unavailable',
      }),
      text: figma.textContent('Label'),
    },
    variant: {variant: 'issue'},
    example: ({text, size, status}) => (
      <StateLabel size={size} status={status}>
        {text}
      </StateLabel>
    ),
  },
)

figma.connect(
  StateLabel,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18959-64962&t=gQF1OJTEGB3vTxPz-4',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
      }),
      status: figma.enum('status', {
        draft: 'draft',
        open: 'pullOpened',
        closed: 'pullClosed',
        merged: 'pullMerged',
        queued: 'pullQueued',
        unavailable: 'unavailable',
      }),
      text: figma.textContent('Label'),
    },
    variant: {variant: 'pull request'},
    example: ({text, size, status}) => (
      <StateLabel size={size} status={status}>
        {text}
      </StateLabel>
    ),
  },
)
