import type React from 'react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {cn} from '../../internal/cn'
import {Avatar} from '../Avatar'
import {Label} from '../Label'
import {Link} from '../Link'
import {RelativeTime} from '../RelativeTime'

export const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

export function VariantSection({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <section className="mb-6">
      <h3 className="m-0 mb-1 text-xs leading-[18px] font-semibold tracking-[0.04em] text-muted uppercase">{label}</h3>
      {children}
    </section>
  )
}

export function RealisticTimeline({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('max-w-[1012px]', className)}>{children}</div>
}

export function Examples({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={cn('max-w-[1012px]', className)}
      data-a11y-link-underlines="true"
      onClick={event => {
        if (event.target instanceof Element && event.target.closest('a')) event.preventDefault()
      }}
    >
      {children}
    </div>
  )
}

export function BoldLink({className, ...props}: React.ComponentProps<typeof Link>) {
  return <Link {...props} className={cn('mr-1 inline font-semibold text-default hover:text-accent', className)} />
}

export function InlineAvatar({alt = '', className, size = 20, ...props}: React.ComponentProps<typeof Avatar>) {
  return <Avatar {...props} alt={alt} className={cn('mr-1 inline-block align-middle', className)} size={size} />
}

export function UserActor({
  href,
  icon: Icon,
  login = 'monalisa',
  muted,
  size = 20,
  src = MONALISA_AVATAR,
}: {
  href?: string
  icon?: React.ElementType
  login?: string
  muted?: boolean
  size?: number
  src?: string
}) {
  const isBot = login.endsWith('[bot]')
  const displayLogin = isBot ? login.replace(/\[bot\]$/i, '') : login
  return (
    <>
      {Icon ? (
        <Icon aria-hidden="true" className="mr-1 inline-block align-middle" />
      ) : (
        <InlineAvatar size={size} src={src} />
      )}
      {href && !isBot ? (
        <BoldLink href={href} muted={muted}>
          {displayLogin}
        </BoldLink>
      ) : (
        <strong className="mr-1 font-semibold text-default">{displayLogin}</strong>
      )}
      {isBot ? (
        <Label className="ml-1" size="small" variant="secondary">
          bot
        </Label>
      ) : null}
    </>
  )
}

export function GitHubActor() {
  return <UserActor icon={MarkGithubIcon} login="GitHub" />
}

export function EventSubRow({children, icon: Icon}: {children: React.ReactNode; icon: React.ElementType}) {
  return (
    <div className="mt-1 flex items-center gap-1 text-xs leading-[18px] text-muted">
      <Icon aria-hidden="true" size={16} />
      <span>{children}</span>
    </div>
  )
}

export function MutedTime({date, href}: {date: Date; href?: string}) {
  const time = <RelativeTime date={date} format="relative" />
  return href ? (
    <Link className="text-muted underline" href={href} inline muted>
      {time}
    </Link>
  ) : (
    <span className="text-muted">{time}</span>
  )
}
