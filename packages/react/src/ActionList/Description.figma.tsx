import {ActionList as ActionListComponent} from '.'
import figma from '@figma/code-connect'

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46267&m=dev',
  {
    props: {
      label: figma.textContent('label'),
    },
    example: ({label}) => <>{label}</>,
  },
)

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15021-46365&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionListComponent.Description variant="block">{description}</ActionListComponent.Description>
      </>
    ),
  },
)

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28656-141637&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionListComponent.Description>{description}</ActionListComponent.Description>
      </>
    ),
  },
)

/** DANGER VARIANT **/

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15114-48250&m=dev',
  {
    props: {
      label: figma.textContent('label'),
    },
    example: ({label}) => <>{label}</>,
  },
)

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15114-48249&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionListComponent.Description variant="block">{description}</ActionListComponent.Description>
      </>
    ),
  },
)

figma.connect(
  ActionListComponent.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28656-142729&m=dev',
  {
    props: {
      label: figma.textContent('label'),
      description: figma.textContent('description'),
    },
    example: ({label, description}) => (
      <>
        {label}
        <ActionListComponent.Description>{description}</ActionListComponent.Description>
      </>
    ),
  },
)
