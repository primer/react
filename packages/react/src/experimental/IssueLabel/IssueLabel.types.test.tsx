import {IssueLabel} from '../IssueLabel'

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
type Expect<T extends true> = T

export function shouldDefaultToSpan() {
  return (
    <IssueLabel
      onFocus={event => {
        type _test = Expect<Equal<typeof event, React.FocusEvent<HTMLSpanElement>>>
      }}
    >
      test
    </IssueLabel>
  )
}

export function shouldDefaultToButtonWithOnClick() {
  return (
    <IssueLabel
      onClick={event => {
        type _test = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement>>>
      }}
    >
      test
    </IssueLabel>
  )
}

export function shouldDefaultToAnchorWithHref() {
  return (
    <IssueLabel
      href="https://github.com"
      onClick={event => {
        type _test = Expect<Equal<typeof event, React.MouseEvent<HTMLAnchorElement>>>
      }}
    >
      test
    </IssueLabel>
  )
}

export function shouldSupportAsProp() {
  return (
    <IssueLabel
      as="div"
      onClick={event => {
        type _test = Expect<Equal<typeof event, React.MouseEvent<HTMLDivElement>>>
      }}
    >
      test
    </IssueLabel>
  )
}
