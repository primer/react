import {assertType, expectTypeOf, test} from 'vitest'
import {IssueLabel} from '../IssueLabel'

test('IssueLabel defaults to span for prop types', () => {
  // const t = (
  // <IssueLabel
  // as="span"
  // onClick={event => {
  // expectTypeOf(event).toEqualTypeOf<React.MouseEvent<HTMLSpanElement>>()
  // }}
  // >
  // label
  // </IssueLabel>
  // )
})

test('passing `onClick` assumes `button` semantics', () => {
  //
})

test('passing `href` assumes `a` semantics', () => {
  //
})

test('passing `as` prop', () => {
  //
})
