import React, {forwardRef, type FC, type PropsWithChildren} from 'react'

export type TestComponentProps = {
  /** The name of the thing */
  name: string
  /** The color of the thing */
  color?: 'red' | 'blue' | 'green'
  /** Metadata about the thing */
  metadata?: {
    age: number
    location: string
  }
  /** The order of the thing */
  order: number
  /** Whether the thing is real */
  isReal?: boolean
}

const TestComponent: FC<PropsWithChildren<TestComponentProps>> = ({
  name = 'Mona',
  color = 'blue',
  metadata,
  order = 0,
  isReal,
}) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{color}</p>
      <p>{metadata?.age}</p>
      <p>{metadata?.location}</p>
      <p>{order}</p>
      <p>{isReal}</p>
    </div>
  )
}

export const TestComponentWithForwardRef = forwardRef<HTMLDivElement, TestComponentProps>(
  ({name = 'Mona', color = 'blue', metadata, order = 0, isReal}: TestComponentProps, _ref) => {
    return (
      <div>
        <h1>{name}</h1>
        <p>{color}</p>
        <p>{metadata?.age}</p>
        <p>{metadata?.location}</p>
        <p>{order}</p>
        <p>{isReal}</p>
      </div>
    )
  },
)

export default TestComponent
