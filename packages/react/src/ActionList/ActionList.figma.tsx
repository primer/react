/* eslint eslint-comments/no-use: off */
/* eslint-disable primer-react/direct-slot-children */
import {ActionList} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  ActionList,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39883-5896&t=HMGAnO63EZZSdkly-4',
  {
    props: {
      children: figma.children('*'),
      selectionVariant: figma.enum('selectionVariant', {
        single: 'single',
        multiple: 'multiple',
        none: undefined,
      }),
    },
    example: ({children, selectionVariant}) => <ActionList selectionVariant={selectionVariant}>{children}</ActionList>,
  },
)

figma.connect(
  ActionList.Divider,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38843&t=m8uYul4RVKTAkjzl-4',
  {
    props: {},
    example: () => <ActionList.Divider />,
  },
)

figma.connect(
  ActionList.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46399&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionList.LeadingVisual>{child}</ActionList.LeadingVisual>,
  },
)

figma.connect(
  ActionList.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46400&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionList.LeadingVisual>{child}</ActionList.LeadingVisual>,
  },
)

figma.connect(
  ActionList.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=23595-96989&t=YefUJRQj0NNo9Plz-4',
  {
    example: () => (
      <ActionList.LeadingVisual>
        <div
          style={{borderRadius: 'var(--borderRadius-full)', display: 'inline-block', height: '10px', width: '10px'}}
        ></div>
      </ActionList.LeadingVisual>
    ),
  },
)

figma.connect(
  ActionList.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-46632&m=dev',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionList.TrailingAction label="Trailing Action">{child}</ActionList.TrailingAction>,
  },
)

figma.connect(
  ActionList.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-52769&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionList.TrailingAction label="Trailing Action">{child}</ActionList.TrailingAction>,
  },
)

figma.connect(
  ActionList.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-46633&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      text: figma.textContent('Trailing text'),
    },
    example: ({text}) => <ActionList.TrailingAction label="Trailing Action">{text}</ActionList.TrailingAction>,
  },
)

figma.connect(
  ActionList.GroupHeading,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38837&m=dev',
  {
    props: {
      variant: figma.enum('variant', {
        subtle: 'subtle',
        filled: 'filled',
      }),
      title: figma.string('title'),
    },
    example: ({variant, title}) => <ActionList.GroupHeading variant={variant}>{title}</ActionList.GroupHeading>,
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item variant="default" selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29564-68229&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item variant="default" disabled selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30051-5381&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item variant="default" loading selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)

/** DANGER ITEM */
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56205&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      leadingVisual: figma.children('leadingVisualIcon'),
    },
    example: ({text, leadingVisual}) => (
      <ActionList.Item variant="danger">
        {leadingVisual}
        {text}
      </ActionList.Item>
    ),
  },
)
/** Single Select ITEM */
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56202&m=dev',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      selected: figma.boolean('selected?'),
      currentSelection: figma.boolean('currentSelection'),
      text: figma.children('label and description'),
      leadingVisual: figma.children('leadingVisual'),
    },
    example: ({text, selected, currentSelection, leadingVisual}) => (
      <ActionList.Item selected={selected} active={currentSelection}>
        {leadingVisual}
        {text}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29564-70674&m=dev',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      selected: figma.boolean('selected?'),
      currentSelection: figma.boolean('currentSelection'),
      text: figma.children('label and description'),
      leadingVisual: figma.children('leadingVisual'),
    },
    example: ({text, selected, currentSelection, leadingVisual}) => (
      <ActionList.Item selected={selected} active={currentSelection} disabled>
        {leadingVisual}
        {text}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30051-4912&m=dev',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      selected: figma.boolean('selected?'),
      currentSelection: figma.boolean('currentSelection'),
      text: figma.children('label and description'),
      leadingVisual: figma.children('leadingVisual'),
    },
    example: ({text, selected, currentSelection, leadingVisual}) => (
      <ActionList.Item selected={selected} active={currentSelection} loading>
        {leadingVisual}
        {text}
      </ActionList.Item>
    ),
  },
)

/** Multi Select ITEM */
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56203&t=HMGAnO63EZZSdkly-4',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29564-70145&t=HMGAnO63EZZSdkly-4',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item selected={selected} disabled>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30051-5141&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionList.Item selected={selected} loading>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionList.Item>
    ),
  },
)
