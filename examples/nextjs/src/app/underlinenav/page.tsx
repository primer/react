'use client'

import React from 'react'
import {UnderlineNav} from '@primer/react'

export default function UnderlineNavPage() {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  const items: {navigation: string; counter?: number | string; href?: string}[] = [
    {navigation: 'Code', href: '#code'},
    {navigation: 'Issues', counter: '12K', href: '#issues'},
    {navigation: 'Pull Requests', counter: 13, href: '#pull-requests'},
    {navigation: 'Discussions', counter: 5, href: '#discussions'},
    {navigation: 'Actions', counter: 4, href: '#actions'},
    {navigation: 'Projects', counter: 9, href: '#projects'},
    {navigation: 'Insights', counter: '0', href: '#insights'},
    {navigation: 'Settings', counter: 10, href: '#settings'},
    {navigation: 'Security', href: '#security'},
  ]

  return (
    <div style={{margin: '0 auto', padding: '16px'}}>
      <h1 style={{marginBottom: '16px'}}>UnderlineNav - Overflow on Narrow Screen</h1>
      <UnderlineNav aria-label="Repository">
        {items.map((item, index) => (
          <UnderlineNav.Item
            key={item.navigation}
            aria-current={index === selectedIndex ? 'page' : undefined}
            onSelect={event => {
              event.preventDefault()
              setSelectedIndex(index)
            }}
            counter={item.counter}
            href={item.href}
          >
            {item.navigation}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>
    </div>
  )
}
