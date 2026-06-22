import {ActionList as ActionListComponent} from '.'
import figma from '@figma/code-connect'

figma.connect(
  ActionListComponent,
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
    example: ({children, selectionVariant}) => (
      <ActionListComponent selectionVariant={selectionVariant}>{children}</ActionListComponent>
    ),
  },
)

figma.connect(
  ActionListComponent.Divider,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38843&t=m8uYul4RVKTAkjzl-4',
  {
    props: {},
    example: () => <ActionListComponent.Divider />,
  },
)

figma.connect(
  ActionListComponent.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46399&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionListComponent.LeadingVisual>{child}</ActionListComponent.LeadingVisual>,
  },
)

figma.connect(
  ActionListComponent.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15039-46400&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => <ActionListComponent.LeadingVisual>{child}</ActionListComponent.LeadingVisual>,
  },
)

figma.connect(
  ActionListComponent.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=23595-96989&t=YefUJRQj0NNo9Plz-4',
  {
    example: () => (
      <ActionListComponent.LeadingVisual>
        <div
          style={{borderRadius: 'var(--borderRadius-full)', display: 'inline-block', height: '10px', width: '10px'}}
        ></div>
      </ActionListComponent.LeadingVisual>
    ),
  },
)

figma.connect(
  ActionListComponent.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-46632&m=dev',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => (
      <ActionListComponent.TrailingAction label="Trailing Action">{child}</ActionListComponent.TrailingAction>
    ),
  },
)

figma.connect(
  ActionListComponent.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-52769&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      child: figma.children('*'),
    },
    example: ({child}) => (
      <ActionListComponent.TrailingAction label="Trailing Action">{child}</ActionListComponent.TrailingAction>
    ),
  },
)

figma.connect(
  ActionListComponent.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-46633&t=YefUJRQj0NNo9Plz-4',
  {
    props: {
      text: figma.textContent('Trailing text'),
    },
    example: ({text}) => (
      <ActionListComponent.TrailingAction label="Trailing Action">{text}</ActionListComponent.TrailingAction>
    ),
  },
)

figma.connect(
  ActionListComponent.GroupHeading,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38837&m=dev',
  {
    props: {
      variant: figma.enum('variant', {
        subtle: 'subtle',
        filled: 'filled',
      }),
      title: figma.string('title'),
    },
    example: ({variant, title}) => (
      <ActionListComponent.GroupHeading variant={variant}>{title}</ActionListComponent.GroupHeading>
    ),
  },
)

figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item variant="default" selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)

figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29564-68229&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item variant="default" disabled selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)

figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30051-5381&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item variant="default" loading selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)

/** DANGER ITEM */
figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56205&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      leadingVisual: figma.children('leadingVisualIcon'),
    },
    example: ({text, leadingVisual}) => (
      <ActionListComponent.Item variant="danger">
        {leadingVisual}
        {text}
      </ActionListComponent.Item>
    ),
  },
)
/** Single Select ITEM */
figma.connect(
  ActionListComponent.Item,
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
      <ActionListComponent.Item selected={selected} active={currentSelection}>
        {leadingVisual}
        {text}
      </ActionListComponent.Item>
    ),
  },
)

figma.connect(
  ActionListComponent.Item,
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
      <ActionListComponent.Item selected={selected} active={currentSelection} disabled>
        {leadingVisual}
        {text}
      </ActionListComponent.Item>
    ),
  },
)

figma.connect(
  ActionListComponent.Item,
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
      <ActionListComponent.Item selected={selected} active={currentSelection} loading>
        {leadingVisual}
        {text}
      </ActionListComponent.Item>
    ),
  },
)

/** Multi Select ITEM */
figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56203&t=HMGAnO63EZZSdkly-4',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item selected={selected}>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)
figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29564-70145&t=HMGAnO63EZZSdkly-4',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item selected={selected} disabled>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)
figma.connect(
  ActionListComponent.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30051-5141&m=dev',
  {
    props: {
      text: figma.children('label and description'),
      selected: figma.boolean('currentSelection'),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    example: ({text, selected, leadingVisual, trailingVisual}) => (
      <ActionListComponent.Item selected={selected} loading>
        {leadingVisual}
        {text}
        {trailingVisual}
      </ActionListComponent.Item>
    ),
  },
)
