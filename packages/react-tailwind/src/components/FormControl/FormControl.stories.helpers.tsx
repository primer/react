import React from 'react'
import {cn} from '../../internal/cn'
import {Token} from '../Token'

export type FormControlToken = {
  id: number
  text: string
}

export const formControlTokens: FormControlToken[] = [
  {id: 0, text: 'zero'},
  {id: 1, text: 'one'},
  {id: 2, text: 'two'},
  {id: 3, text: 'three'},
  {id: 4, text: 'four'},
  {id: 5, text: 'five'},
  {id: 6, text: 'six'},
  {id: 7, text: 'seven'},
  {id: 20, text: 'twenty'},
  {id: 21, text: 'twentyone'},
]

export function TokenInputFixture({
  className,
  inputClassName,
  initialTokens = formControlTokens,
}: {
  className?: string
  inputClassName?: string
  initialTokens?: FormControlToken[]
}) {
  const [tokens, setTokens] = React.useState(initialTokens)

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center gap-1 rounded-md border-thin border-default bg-default py-1.5 pr-1.5 pl-3 shadow-[var(--shadow-inset)]',
        className,
      )}
    >
      {tokens.map(token => (
        <Token
          key={token.id}
          size="xlarge"
          className="text-sm"
          text={token.text}
          onRemove={() => setTokens(current => current.filter(item => item !== token))}
        />
      ))}
      <input
        aria-label="Add token"
        className={cn('m-0 h-5 min-w-72 flex-1 border-0 bg-transparent p-0 text-sm outline-none', inputClassName)}
      />
    </div>
  )
}
