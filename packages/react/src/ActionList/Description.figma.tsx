/* eslint eslint-comments/no-use: off */
/* eslint-disable primer-react/direct-slot-children */
import {ActionList} from '..'
import figma from '@figma/code-connect'

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46267&m=dev',
  {
    props: {
      label: figma.textContent('label'),
    },
    example: ({label}) => <>{label}</>,
  },
)

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15021-46365&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionList.Description variant="block">{description}</ActionList.Description>
      </>
    ),
  },
)

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28656-141637&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionList.Description>{description}</ActionList.Description>
      </>
    ),
  },
)

/** DANGER VARIANT **/

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15114-48250&m=dev',
  {
    props: {
      label: figma.textContent('label'),
    },
    example: ({label}) => <>{label}</>,
  },
)

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15114-48249&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionList.Description variant="block">{description}</ActionList.Description>
      </>
    ),
  },
)

figma.connect(
  ActionList.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28656-142729&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionList.Description>{description}</ActionList.Description>
      </>
    ),
  },
)
