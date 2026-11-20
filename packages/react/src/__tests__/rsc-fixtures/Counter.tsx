'use client'

import {useState} from 'react'
import {Button} from '../../index'

export function Counter({initialCount}: {initialCount: number}) {
  const [count, setCount] = useState(initialCount)
  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
}
