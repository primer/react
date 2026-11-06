import type React from 'react'

function ElementChild({children}: {children: React.ReactElement}) {
  return children
}

function TextChild({children}: {children: string}) {
  return <div>{children}</div>
}

function RenderChild({children}: {children: (count: number) => React.ReactNode}) {
  return <>{children(1)}</>
}

function ElementOrTextChild({children}: {children: React.ReactElement | string}) {
  return <>{children}</>
}

function LongChild({
  children,
}: {
  children:
    | 'choice-one'
    | 'choice-two'
    | 'choice-three'
    | 'choice-four'
    | 'choice-five'
    | 'choice-six'
    | 'choice-seven'
    | 'choice-eight'
    | 'choice-nine'
    | 'choice-ten'
    | 'choice-eleven'
    | 'choice-twelve'
    | 'choice-thirteen'
    | 'choice-fourteen'
    | 'choice-fifteen'
    | 'choice-sixteen'
    | 'choice-seventeen'
    | 'choice-eighteen'
    | 'choice-nineteen'
    | 'choice-twenty'
    | 'choice-twenty-one'
    | 'choice-twenty-two'
    | 'choice-twenty-three'
    | 'choice-twenty-four'
}) {
  return <>{children}</>
}

function Root({children}: {children?: React.ReactNode}) {
  return <>{children}</>
}

export const ChildrenComponent = Object.assign(Root, {
  ElementChild,
  TextChild,
  RenderChild,
  ElementOrTextChild,
  LongChild,
})
