import React from 'react'
import {IssueLabelToken, Token, TokenBase, type IssueLabelTokenProps, type TokenProps} from '@primer/react-tailwind'
import {IssueLabelToken as SubpathIssueLabelToken, Token as SubpathToken} from '@primer/react-tailwind/Token'

function RouterLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
  return (
    <a {...props} href={to}>
      {children}
    </a>
  )
}

function SvgRoot(props: React.ComponentPropsWithRef<'svg'>) {
  return <svg {...props} />
}

const rootRef = React.createRef<HTMLElement>()

const anchorProps: TokenProps = {
  as: 'a',
  href: '/issues',
  target: '_blank',
  text: 'Issues',
  removeButtonLabel: 'Remove issues',
  ref: rootRef,
}
const buttonProps: TokenProps = {as: 'button', form: 'filters', text: 'Issues', ref: rootRef}
const labelProps: IssueLabelTokenProps = {
  as: 'a',
  href: '/labels',
  text: 'Label',
  removeButtonLabel: 'Remove label',
  ref: rootRef,
}
const reflectedToken: React.ComponentProps<typeof Token> = {
  text: 'Issues',
  removeButtonLabel: 'Remove issues',
  ref: rootRef,
}
const reflectedWithoutRef: React.ComponentPropsWithoutRef<typeof Token> = {
  as: 'a',
  href: '/issues',
  text: 'Issues',
}
const reflectedWithRef: React.ComponentPropsWithRef<typeof IssueLabelToken> = {text: 'Label', ref: rootRef}
const reflectedLabel: React.ComponentProps<typeof IssueLabelToken> = {
  as: 'a',
  href: '/labels',
  text: 'Label',
  ref: rootRef,
}
const reflectedCallback: React.ComponentProps<typeof IssueLabelToken> = {
  text: 'Label',
  ref: element => {
    element?.focus()
    // @ts-expect-error A reflected compound token ref may point to a span, not just an anchor.
    element?.href
  },
}
const routerProps: TokenProps<typeof RouterLink> = {as: RouterLink, to: '/issues', text: 'Issues', ref: rootRef}
const svgProps: TokenProps<typeof SvgRoot> = {
  as: SvgRoot,
  text: 'Status',
  ref: React.createRef<SVGSVGElement | HTMLSpanElement>(),
}
const specificAnchorProps: TokenProps<'a'> = {as: 'a', href: '/issues', text: 'Issues', ref: rootRef}
const specificButtonProps: IssueLabelTokenProps<'button'> = {
  as: 'button',
  text: 'Label',
  removeButtonLabel: 'Remove label',
  ref: rootRef,
}
const reflectedRouter: React.ComponentProps<typeof Token> & {to: string} = {
  as: RouterLink,
  to: '/issues',
  text: 'Issues',
}
const spanRef = React.createRef<HTMLSpanElement>()
const reflectedBaseDefault: React.ComponentProps<typeof TokenBase> = {text: 'Issues'}
const reflectedBaseAnchor: React.ComponentProps<typeof TokenBase> = {as: 'a', href: '/issues', text: 'Issues'}

// @ts-expect-error A native button does not accept a link destination.
const invalidButtonProps: TokenProps<'button'> = {as: 'button', href: '/issues', text: 'Issues'}
// @ts-expect-error A default span does not accept a link destination.
const invalidDefaultProps: TokenProps<'span'> = {href: '/issues', text: 'Issues'}
// @ts-expect-error An explicit router root retains its required destination.
const invalidRouterProps: TokenProps<typeof RouterLink> = {as: RouterLink, text: 'Issues'}
void invalidButtonProps
void invalidDefaultProps
void invalidRouterProps

interface TokenInterfaceWrapper extends TokenProps {
  wrapper?: boolean
}
interface ReflectedInterfaceWrapper extends React.ComponentProps<typeof IssueLabelToken> {
  wrapper?: boolean
}
const interfaceTokenProps: TokenInterfaceWrapper = {as: 'a', href: '/issues', text: 'Issues', ref: rootRef}
const interfaceLabelProps: ReflectedInterfaceWrapper = {as: 'a', href: '/labels', text: 'Label', ref: rootRef}

type OmittedTokenWrapperProps = Omit<TokenProps, 'leadingVisual' | 'text' | 'ref'> & {
  label: React.ReactNode
  ref?: React.Ref<HTMLElement>
}

function OmittedTokenWrapper({label, ref, ...props}: OmittedTokenWrapperProps) {
  return <Token {...props} text={label} ref={ref} />
}

function OmittedLabelWrapper({label, ...props}: Omit<IssueLabelTokenProps, 'text' | 'ref'> & {label: React.ReactNode}) {
  return <IssueLabelToken {...props} text={label} />
}

function NativeWrapper(props: TokenProps) {
  return <Token {...props} />
}

function ReflectedWrapper(props: React.ComponentProps<typeof IssueLabelToken>) {
  return <IssueLabelToken {...props} />
}

function ReflectedBaseWrapper(props: React.ComponentProps<typeof TokenBase>) {
  return <TokenBase {...props} />
}

function acceptsElement(_element: React.ReactElement) {}

acceptsElement(<Token as={undefined} text="Issues" ref={spanRef} />)
acceptsElement(<IssueLabelToken as={undefined} text="Label" ref={spanRef} />)
acceptsElement(<TokenBase as={undefined} text="Issues" ref={spanRef} />)
acceptsElement(<TokenBase as={RouterLink} to="/issues" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />)
acceptsElement(<TokenBase as={SvgRoot} text="Status" ref={React.createRef<SVGSVGElement>()} />)
acceptsElement(
  <TokenBase
    as={RouterLink}
    to="/issues"
    text="Issues"
    ref={(element: HTMLAnchorElement | null) => element?.focus()}
  />,
)
acceptsElement(
  // @ts-expect-error A custom anchor root cannot be stored in a button-only ref.
  <TokenBase as={RouterLink} to="/issues" text="Issues" ref={React.createRef<HTMLButtonElement>()} />,
)
acceptsElement(
  // @ts-expect-error A custom SVG root cannot be stored in an HTML-only ref.
  <TokenBase as={SvgRoot} text="Status" ref={React.createRef<HTMLElement>()} />,
)
acceptsElement(
  // @ts-expect-error Undefined selects a span, not an anchor.
  <Token as={undefined} href="/issues" text="Issues" />,
)
acceptsElement(
  // @ts-expect-error Undefined selects a span, not a button.
  <IssueLabelToken as={undefined} form="filters" text="Label" />,
)
acceptsElement(
  // @ts-expect-error Undefined selects a span, not an anchor.
  <TokenBase as={undefined} target="_blank" text="Issues" />,
)
const undefinedRootProps = {as: undefined, text: 'Issues', target: '_blank'}
acceptsElement(
  // @ts-expect-error Spreading undefined must not admit anchor-only props.
  <Token {...undefinedRootProps} />,
)
acceptsElement(
  // @ts-expect-error Spreading undefined must not admit anchor-only props on TokenBase.
  <TokenBase {...undefinedRootProps} />,
)
const optionalAnchor: 'a' | undefined = Math.random() > 0.5 ? 'a' : undefined
const optionalRootRef = React.createRef<HTMLAnchorElement | HTMLSpanElement>()
acceptsElement(<Token as={optionalAnchor} text="Issues" ref={optionalRootRef} />)
acceptsElement(<IssueLabelToken as={optionalAnchor} text="Label" ref={optionalRootRef} />)
acceptsElement(<TokenBase as={optionalAnchor} text="Issues" ref={optionalRootRef} />)
acceptsElement(
  // @ts-expect-error An optional anchor root can still be a span.
  <Token as={optionalAnchor} href="/issues" text="Issues" />,
)
acceptsElement(
  // @ts-expect-error An optional TokenBase anchor root can also be a span.
  <TokenBase as={optionalAnchor} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsElement(
  // @ts-expect-error A removable compound token can expose a span rather than an anchor.
  <Token as="a" text="Issues" onRemove={() => {}} ref={React.createRef<HTMLAnchorElement>()} />,
)
const invalidAnchorRef = {as: 'a' as const, text: 'Issues', ref: React.createRef<HTMLAnchorElement>()}
acceptsElement(
  // @ts-expect-error Spreading a narrower anchor ref cannot make it safe for the span shell.
  <Token {...invalidAnchorRef} />,
)
acceptsElement(
  // @ts-expect-error A custom anchor root can still use a span shell when removal is shown.
  <Token as={RouterLink} to="/issues" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsElement(
  // @ts-expect-error Router components retain required props.
  <Token as={RouterLink} text="Issues" />,
)
acceptsElement(
  // @ts-expect-error Native buttons do not accept anchor-only href.
  <IssueLabelToken as="button" href="/labels" text="Label" />,
)
acceptsElement(
  // @ts-expect-error The default span does not accept an anchor-only target.
  <Token target="_blank" text="Issues" />,
)
acceptsElement(
  // @ts-expect-error The default span cannot be stored in an anchor-only ref.
  <Token text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsElement(
  // @ts-expect-error Accessible button names must be strings.
  <Token text="Issues" removeButtonLabel={42} />,
)
acceptsElement(
  // @ts-expect-error TokenBase does not create or label a remove button.
  <TokenBase text="Issues" removeButtonLabel="Remove issues" />,
)
acceptsElement(
  // @ts-expect-error An explicitly undefined root cannot be stored in an anchor-only ref.
  <Token as={undefined} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
const dynamicAs: 'a' | 'button' = Math.random() < 0.5 ? 'a' : 'button'
acceptsElement(
  // @ts-expect-error A dynamic action may also render a span shell or a button.
  <Token as={dynamicAs} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
function acceptsDynamicRoot(as: NonNullable<TokenProps['as']>) {
  acceptsElement(<Token as={as} text="Issues" ref={rootRef} />)
  acceptsElement(<TokenBase as={as} text="Issues" ref={rootRef} />)
  acceptsElement(
    // @ts-expect-error A broadly selected root cannot be stored in an anchor-only ref.
    <Token as={as} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
  )
  acceptsElement(
    // @ts-expect-error A broadly selected TokenBase root cannot be stored in an anchor-only ref.
    <TokenBase as={as} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
  )
}
void acceptsDynamicRoot

export function TokenConsumer() {
  return (
    <>
      <NativeWrapper {...anchorProps} />
      <NativeWrapper {...buttonProps} />
      <NativeWrapper {...interfaceTokenProps} />
      <OmittedTokenWrapper as="a" href="/issues" label="Issues" removeButtonLabel="Remove issues" ref={rootRef} />
      <OmittedLabelWrapper as="a" href="/labels" label="Label" removeButtonLabel="Remove label" />
      <SubpathToken {...reflectedToken} />
      <SubpathToken {...reflectedWithoutRef} />
      <SubpathToken {...reflectedRouter} />
      <SubpathToken {...routerProps} />
      <SubpathToken {...svgProps} />
      <SubpathToken {...specificAnchorProps} />
      <ReflectedWrapper {...labelProps} />
      <ReflectedWrapper {...interfaceLabelProps} />
      <ReflectedBaseWrapper {...reflectedBaseDefault} />
      <ReflectedBaseWrapper {...reflectedBaseAnchor} />
      <SubpathIssueLabelToken {...reflectedWithRef} />
      <SubpathIssueLabelToken {...reflectedLabel} />
      <SubpathIssueLabelToken {...reflectedCallback} />
      <SubpathIssueLabelToken {...specificButtonProps} />
    </>
  )
}
