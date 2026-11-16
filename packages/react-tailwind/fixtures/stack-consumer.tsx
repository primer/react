import React from 'react'
import {Stack, StackItem, Text} from '@primer/react-tailwind'
import {Stack as SubpathStack, type StackProps, type StackItemProps} from '@primer/react-tailwind/Stack'
import {Text as SubpathText, type TextProps} from '@primer/react-tailwind/Text'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- JSX intrinsic augmentation requires namespace merging.
  namespace JSX {
    interface IntrinsicElements {
      'packed-fixture-element': {children?: React.ReactNode}
    }
  }
}

function UnionElements({htmlTag}: {htmlTag: keyof React.JSX.IntrinsicElements}) {
  return (
    <>
      <Text as={htmlTag} className="consumer-class">
        Text
      </Text>
      <SubpathText as={htmlTag} className="consumer-class">
        Text
      </SubpathText>
      <Stack as={htmlTag} className="consumer-class" />
      <SubpathStack.Item as={htmlTag} className="consumer-class" />
    </>
  )
}

function UnionHeader({htmlTag}: {htmlTag: 'th' | 'td'}) {
  return (
    <table>
      <tbody>
        <tr>
          <Text as={htmlTag} className="consumer-class" ref={React.createRef<HTMLTableCellElement>()}>
            Metric
          </Text>
        </tr>
      </tbody>
    </table>
  )
}

const formRef = React.createRef<HTMLFormElement>()
const divRef = React.createRef<HTMLDivElement>()
const linkRef = React.createRef<HTMLAnchorElement>()
const labelRef = React.createRef<HTMLLabelElement>()
const cellRef = React.createRef<HTMLTableCellElement>()
const spanRef = React.createRef<HTMLSpanElement>()

const labelProps: TextProps<'label'> = {
  as: 'label',
  htmlFor: 'key-title',
  ref: labelRef,
  onClick(event) {
    const label: HTMLLabelElement = event.currentTarget
    const htmlFor: string = label.htmlFor
    void htmlFor
  },
}
const cellProps: TextProps<'th'> = {
  as: 'th',
  scope: 'col',
  colSpan: 2,
  ref: cellRef,
  onClick(event) {
    const cell: HTMLTableCellElement = event.currentTarget
    const scope: string = cell.scope
    void scope
  },
}

const formProps: StackProps<'form'> = {
  as: 'form',
  action: '/keys',
  method: 'post',
  encType: 'multipart/form-data',
  acceptCharset: 'UTF-8',
  ref: formRef,
  onSubmit(event) {
    event.preventDefault()
    new FormData(event.currentTarget)
  },
  onChange(event) {
    const form: HTMLFormElement = event.currentTarget
    new FormData(form)
  },
}

const itemFormProps: StackItemProps<'form'> = {
  as: 'form',
  action: async data => {
    data.get('title')
  },
  ref: formRef,
  onSubmit(event) {
    new FormData(event.currentTarget)
  },
}

function RouterLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
  return (
    <a {...props} href={to}>
      {children}
    </a>
  )
}

export function StackConsumerForms() {
  return (
    <>
      <UnionElements htmlTag="span" />
      <UnionHeader htmlTag="th" />
      <Stack {...formProps} gap="condensed" />
      <SubpathStack
        as="form"
        action="/comments"
        method="post"
        ref={form => {
          form?.requestSubmit()
        }}
        onSubmit={event => {
          event.preventDefault()
          new FormData(event.currentTarget)
        }}
        onChange={event => {
          new FormData(event.currentTarget)
        }}
      />
      <Stack.Item {...itemFormProps} grow />
      <StackItem as="form" action="/keys" ref={formRef} onSubmit={event => new FormData(event.currentTarget)} />
      <SubpathStack.Item as="form" ref={formRef} onChange={event => new FormData(event.currentTarget)} />
      <Stack
        ref={divRef}
        onClick={event => {
          const div: HTMLDivElement = event.currentTarget
          div.focus()
        }}
      />
      <Stack
        as="a"
        href="/keys"
        ref={linkRef}
        target="_blank"
        onClick={event => {
          const link: HTMLAnchorElement = event.currentTarget
          const href: string = link.href
          void href
        }}
      >
        Keys
      </Stack>
      <Stack as={RouterLink} to="/keys" ref={linkRef}>
        Keys
      </Stack>
      <Stack.Item as={RouterLink} to="/comments" ref={linkRef}>
        Comments
      </Stack.Item>
      <Text {...labelProps}>Key title</Text>
      <SubpathText
        as="label"
        htmlFor="phase"
        ref={label => {
          label?.control?.focus()
        }}
      >
        Phase
      </SubpathText>
      <table>
        <thead>
          <tr>
            <SubpathText {...cellProps} weight="semibold">
              Metric
            </SubpathText>
          </tr>
        </thead>
      </table>
      <Text
        ref={spanRef}
        onClick={event => {
          const span: HTMLSpanElement = event.currentTarget
          span.focus()
        }}
      >
        Default span
      </Text>
      <Text as={RouterLink} to="/metrics" ref={linkRef}>
        Metrics
      </Text>
    </>
  )
}

function acceptsElement(_element: React.ReactElement) {}

acceptsElement(
  // @ts-expect-error Form-specific props require as="form".
  <Stack action="/keys" />,
)
acceptsElement(
  // @ts-expect-error Explicit generic arguments cannot select an element without as.
  <Stack<'form'> ref={formRef} />,
)
acceptsElement(
  // @ts-expect-error A button cannot accept a link destination.
  <SubpathStack.Item as="button" href="/keys" />,
)
acceptsElement(
  // @ts-expect-error A form ref must point to an HTMLFormElement.
  <Stack as="form" ref={divRef} />,
)
acceptsElement(
  // @ts-expect-error The custom component's required destination is preserved.
  <Stack as={RouterLink} />,
)
acceptsElement(
  // @ts-expect-error StackItem refs also follow the selected element.
  <StackItem as="a" href="/keys" ref={formRef} />,
)
acceptsElement(
  // @ts-expect-error The default span does not have label-specific props.
  <Text htmlFor="key-title">Key title</Text>,
)
acceptsElement(
  // @ts-expect-error The non-default native type argument must match the runtime root.
  <SubpathText<'th'> scope="col">Metric</SubpathText>,
)
acceptsElement(
  // @ts-expect-error Native label refs must point to an HTMLLabelElement.
  <Text as="label" ref={cellRef}>
    Key title
  </Text>,
)
acceptsElement(
  // @ts-expect-error Native header-cell refs must point to an HTMLTableCellElement.
  <SubpathText as="th" ref={labelRef}>
    Metric
  </SubpathText>,
)
acceptsElement(
  // @ts-expect-error Custom Text roots retain their required props.
  <Text as={RouterLink}>Metrics</Text>,
)
