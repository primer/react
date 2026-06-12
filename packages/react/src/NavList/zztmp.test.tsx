import {describe, it} from 'vitest'
import React from 'react'
import {render} from '@testing-library/react'
import {NavList} from './NavList'
import {FeatureFlags} from '../FeatureFlags'
describe('dom', () => {
  it('prints', () => {
    const {container} = render(<FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
      <NavList><NavList.Item defaultOpen href="#">Item 1<NavList.SubNav><NavList.Item href="#">Sub item 1</NavList.Item></NavList.SubNav></NavList.Item></NavList>
    </FeatureFlags>)
    const li = container.querySelector('li[data-has-subitem]')!
    console.log('children of group li:', Array.from(li.children).map(c=>c.tagName+'.'+(c.className.toString().match(/(ActionListContent|SubGroup)/)?.[0]||'')))
  })
})
