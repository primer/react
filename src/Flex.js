import React from 'react'
import classnames from 'classnames'
import responsive, {any, only} from './utils/responsive'

const anyDirection = any('row', 'column', 'row-reverse')
const anyJustify = any('start', 'end', 'center', 'between', 'around')
const anyItems = any('start', 'end', 'center', 'baseline', 'stretch')
const anyContent = any('start', 'end', 'center', 'between', 'around', 'stretch')
const anySelf = any('auto', 'start', 'end', 'center', 'baseline', 'stretch')

const Flex = props => {
  const {
    direction,
    wrap,
    justify,
    items,
    content,
    auto,
    shrink,
    self,
    itemEqual,
    children
  } = props
  return (
    <div className={classnames(
      'd-flex',
      responsive('flex-direction-', direction, anyDirection),
      responsive('flex-', wrap, any(true, false), v => (v ? 'wrap' : 'nowrap')),
      responsive('flex-justify-', justify, anyJustify),
      responsive('flex-items-', items, anyItems),
      responsive('flex-content-', content, anyContent),
    )}>
      {children}
    </div>
  )
}

const FlexItem = props => {
  const {
    auto,
    shrink,
    self,
    itemEqual,
    children
  } = props
  return (
    <div className={classnames(
      responsive('flex-auto', auto, only(true), v => ''),
      responsive('flex-shrink-', shrink, only(0)),
      responsive('flex-self-', self, anySelf),
      responsive('flex-item-equal', itemEqual, only(true))
    ) || undefined}>
      {children}
    </div>
  )
}

Flex.Item = FlexItem

export default Flex
export {FlexItem}
