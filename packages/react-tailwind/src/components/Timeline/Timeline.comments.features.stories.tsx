import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {CopilotIcon, DependabotIcon, KebabHorizontalIcon, SmileyIcon} from '@primer/octicons-react'
import {cn} from '../../internal/cn'
import {Avatar} from '../Avatar'
import {ButtonBase} from '../Button'
import {IconButton} from '../IconButton'
import {Label} from '../Label'
import {Link} from '../Link'
import {RelativeTime} from '../RelativeTime'
import {Timeline} from './Timeline'
import {Examples, MONALISA_AVATAR, VariantSection} from './Timeline.storyHelpers'

const meta = {title: 'React Tailwind/Layout/Timeline/Internal', component: Timeline} satisfies Meta<typeof Timeline>
export default meta
type Story = StoryObj<typeof meta>

type CommentFixture = {
  associationAriaLabel?: string
  associationLabel?: string
  avatar: React.ReactNode
  badgeAriaLabel?: string
  badgeLabel?: string
  children: React.ReactNode
  inlineAvatar?: React.ReactNode
  label: string
  name: string
  reactions?: boolean
  timestamp: string
  viaApp?: string
}

function CommentCard({
  associationAriaLabel,
  associationLabel,
  avatar,
  badgeAriaLabel,
  badgeLabel,
  children,
  inlineAvatar,
  label,
  name,
  reactions,
  timestamp,
  viaApp,
}: CommentFixture) {
  const isResponsive = Boolean(avatar && inlineAvatar)

  return (
    <VariantSection label={label}>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          {avatar ? (
            <Timeline.Avatar className={isResponsive ? '@max-[767px]:hidden' : undefined}>{avatar}</Timeline.Avatar>
          ) : null}
          <div
            className={cn(
              'relative -ml-4 min-w-0 flex-auto rounded-md border border-default bg-default before:absolute before:top-3 before:-left-2 before:size-0 before:border-y-8 before:border-r-8 before:border-y-transparent before:border-r-default after:absolute after:top-[13px] after:-left-[7px] after:size-0 after:border-y-7 after:border-r-7 after:border-y-transparent after:border-r-muted',
              inlineAvatar && !avatar && 'before:hidden after:hidden',
              isResponsive && '@max-[767px]:before:hidden @max-[767px]:after:hidden',
            )}
          >
            <div className="flex items-center gap-2 rounded-t-md border-b border-default bg-muted px-4 py-2">
              <div
                className={cn(
                  'flex min-w-0 flex-auto flex-wrap gap-x-1',
                  inlineAvatar ? 'items-center' : 'items-baseline',
                  isResponsive && '@min-[768px]:items-baseline',
                )}
              >
                {inlineAvatar ? (
                  <span className={cn('shrink-0', isResponsive && '@min-[768px]:hidden')}>{inlineAvatar}</span>
                ) : null}
                <Link className="font-semibold text-default hover:text-accent" href="#" muted>
                  {name}
                </Link>
                {badgeLabel ? (
                  <Label aria-label={badgeAriaLabel} size="small" variant="secondary">
                    {badgeLabel}
                  </Label>
                ) : null}
                {associationLabel ? (
                  <Label aria-label={associationAriaLabel} size="small" variant="secondary">
                    {associationLabel}
                  </Label>
                ) : null}
                {inlineAvatar ? (
                  <span className={cn('text-muted', isResponsive && '@min-[768px]:hidden')}>commented</span>
                ) : null}
                <span className="text-muted">
                  <Link className="text-muted underline" href="#" inline muted>
                    <RelativeTime date={new Date(timestamp)} format="relative" />
                  </Link>
                  {viaApp ? (
                    <>
                      {' – with '}
                      <Link href="#" inline>
                        {viaApp}
                      </Link>
                    </>
                  ) : null}
                </span>
              </div>
              <IconButton aria-label="Comment actions" icon={KebabHorizontalIcon} size="small" variant="invisible" />
            </div>
            <div className="p-4 text-sm leading-[21px] text-default [&_code]:rounded-md [&_code]:bg-neutral-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:leading-[18px] [&_p]:m-0 [&_p:not(:first-child)]:mt-2">
              {children}
            </div>
            {reactions ? (
              <div className="flex gap-2 px-4 pb-4">
                <ButtonBase
                  aria-label="👍 3 reactions"
                  className="inline-flex h-6 items-center gap-1 rounded-full border border-default bg-muted px-2 text-xs text-muted hover:border-accent-muted hover:bg-accent-muted"
                >
                  <span aria-hidden="true">👍</span>
                  <span className="font-semibold text-default">3</span>
                </ButtonBase>
                <ButtonBase
                  aria-label="🎉 1 reaction"
                  className="inline-flex h-6 items-center gap-1 rounded-full border border-default bg-muted px-2 text-xs text-muted hover:border-accent-muted hover:bg-accent-muted"
                >
                  <span aria-hidden="true">🎉</span>
                  <span className="font-semibold text-default">1</span>
                </ButtonBase>
                <IconButton aria-label="Add reaction" icon={SmileyIcon} size="small" variant="invisible" />
              </div>
            ) : null}
          </div>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

export const CommentCards: Story = {
  render: () => (
    <Examples className="flow-root [container-type:inline-size]">
      <div className="@min-[768px]:pl-[72px]">
        <CommentCard
          associationAriaLabel="This user is the author of this issue."
          associationLabel="Author"
          avatar={<Avatar alt="" size={40} src={MONALISA_AVATAR} />}
          inlineAvatar={<Avatar alt="" className="mr-1 inline-block align-middle" size={24} src={MONALISA_AVATAR} />}
          label="Standard user comment"
          name="monalisa"
          reactions
          timestamp="2022-07-26T11:46:07Z"
        >
          <p>
            Thanks for the report! I can reproduce this with <code>npm run build</code> on a clean checkout. Looks like
            the regression landed in{' '}
            <Link href="#" inline>
              #1234
            </Link>{' '}
            — I&apos;ll open a fix shortly.
          </p>
        </CommentCard>
        <CommentCard
          avatar={<Avatar alt="" shape="square" size={40} src="https://avatars.githubusercontent.com/u/44036562?v=4" />}
          badgeAriaLabel="This comment was posted by a bot."
          badgeLabel="bot"
          label="Bot comment (GitHub App)"
          inlineAvatar={
            <Avatar
              alt=""
              className="mr-1 inline-block align-middle"
              shape="square"
              size={24}
              src="https://avatars.githubusercontent.com/u/44036562?v=4"
            />
          }
          name="github-actions"
          timestamp="2022-07-26T12:02:00Z"
        >
          <p>
            All checks have passed ✅ — <code>build</code>, <code>test</code>, and <code>lint</code> are green on the
            latest commit.
          </p>
        </CommentCard>
        <CommentCard
          avatar={
            <span className="flex size-10 items-center justify-center rounded-full border border-default bg-muted text-muted">
              <CopilotIcon aria-hidden="true" size={24} />
            </span>
          }
          badgeAriaLabel="This comment was generated by Copilot."
          badgeLabel="AI"
          label="Copilot comment"
          inlineAvatar={
            <span className="mr-1 inline-flex size-6 items-center justify-center rounded-full border border-default bg-muted align-middle text-muted">
              <CopilotIcon aria-hidden="true" size={16} />
            </span>
          }
          name="Copilot"
          timestamp="2022-07-26T12:10:00Z"
        >
          <p>
            I&apos;ve analyzed the failing test. The assertion in{' '}
            <Link href="#" inline>
              parser.test.ts
            </Link>{' '}
            expects the old token shape — updating the fixture should resolve it.
          </p>
        </CommentCard>
        <CommentCard
          avatar={
            <span className="flex size-10 items-center justify-center rounded-md border border-accent-emphasis bg-accent-emphasis text-on-emphasis">
              <DependabotIcon aria-hidden="true" size={24} />
            </span>
          }
          badgeAriaLabel="This comment was posted by a bot."
          badgeLabel="bot"
          label="Dependabot comment"
          inlineAvatar={
            <span className="mr-1 inline-flex size-6 items-center justify-center rounded-md border border-accent-emphasis bg-accent-emphasis align-middle text-on-emphasis">
              <DependabotIcon aria-hidden="true" size={16} />
            </span>
          }
          name="dependabot"
          timestamp="2022-07-26T12:18:00Z"
        >
          <p>
            Bumps <code>lodash</code> from 4.17.20 to 4.17.21. This update includes a security fix —{' '}
            <Link href="#" inline>
              view the advisory
            </Link>
            .
          </p>
        </CommentCard>
        <CommentCard
          avatar={<Avatar alt="" size={40} src={MONALISA_AVATAR} />}
          inlineAvatar={<Avatar alt="" className="mr-1 inline-block align-middle" size={24} src={MONALISA_AVATAR} />}
          label="User comment via a GitHub App"
          name="monalisa"
          timestamp="2022-07-26T12:24:00Z"
          viaApp="Acme Sync"
        >
          <p>Mirrored from our internal tracker — closing the loop here so the thread stays in sync.</p>
        </CommentCard>
        <CommentCard
          avatar={
            <span className="relative inline-flex">
              <Avatar alt="" size={40} src={MONALISA_AVATAR} />
              <Avatar
                alt="GitHub Actions"
                className="absolute -right-1 -bottom-1 size-5 rounded-md shadow-[0_0_0_2px_var(--bgColor-default)]"
                shape="square"
                size={20}
                src="https://avatars.githubusercontent.com/u/44036562?v=4"
              />
            </span>
          }
          inlineAvatar={<Avatar alt="" className="mr-1 inline-block align-middle" size={24} src={MONALISA_AVATAR} />}
          label="User comment via an app (with app avatar badge)"
          name="monalisa"
          timestamp="2022-07-26T12:30:00Z"
          viaApp="GitHub Actions"
        >
          <p>Deploy preview is ready — the changes are live on the staging environment.</p>
        </CommentCard>
      </div>
      <CommentCard
        avatar={null}
        inlineAvatar={<Avatar alt="" className="mr-1 inline-block align-middle" size={24} src={MONALISA_AVATAR} />}
        label="Comment (inline avatar / compact)"
        name="monalisa"
        reactions
        timestamp="2022-07-26T12:36:00Z"
      >
        <p>
          Same comment, compact form — the avatar is inline in the header and the body runs full width with no gutter.
        </p>
      </CommentCard>
    </Examples>
  ),
  name: 'Comment cards',
}
