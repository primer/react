import {act, cleanup, render} from '@testing-library/react'
import {afterEach, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {ThemeProvider} from '../../ThemeProvider'
import {MatchMediaContext} from '../../hooks/MatchMediaContext'
import {SelectPanelFilmIssue} from './SelectPanelFilmIssue'
import {animateSelectPanel} from './filmAnatomy'
import {FilmAgentPicker, FilmTeamChat, SelectPanelFilmSequence} from './SelectPanelFilmSequence'
import {filmConversation, filmDraftConversation, filmRequests, filmRequestTiming, filmTiming} from './filmTimeline'
import classes from './SelectPanelFilmSequence.module.css'

afterEach(cleanup)

it('holds the approval request, then moves directly from Slack into the platform scene without the theming exchange', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const approval = filmDraftConversation[4].message
  const approvalMessage = `[data-film-message="${filmDraftConversation[4].time}"]`
  const delivered = filmDraftConversation[4].time + filmRequestTiming.delivery
  const {container, rerender} = render(scene(delivered - 1))
  const chat = page.getByRole('complementary', {name: 'Team conversation'})
  expect(chat.element().querySelector(approvalMessage)).toBeNull()
  for (const time of [delivered, filmTiming.platform - 300, filmTiming.platform - 1]) {
    rerender(scene(time))
    expect(chat.element().querySelector(approvalMessage)).toHaveTextContent(approval)
    expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
    expect(chat.getByText('is it themeable?', {exact: true}).query()).toBeNull()
    expect(chat.getByText('Yes!', {exact: true}).query()).toBeNull()
    expect(page.getByRole('region', {name: 'Platform and performance', exact: true}).query()).toBeNull()
  }
  expect(filmTiming.platform - delivered).toBeGreaterThanOrEqual(1_500)
  expect(container.querySelector('[data-film-pointer]')).toBeNull()
  rerender(scene(filmTiming.platform))
  expect(chat.query()).toBeNull()
  expect(page.getByRole('complementary', {name: 'Slack notification'}).query()).toBeNull()
  await expect
    .element(page.getByRole('heading', {name: 'Platform and performance. Future proof.', exact: true}))
    .toBeInTheDocument()
  expect(page.getByRole('list', {name: 'Platform and performance capabilities'}).query()).toBeNull()
  expect(page.getByRole('dialog', {name: 'Assign agents', exact: true}).query()).toBeNull()
  expect(container.querySelector('[data-film-theme]')).toBeNull()
  rerender(scene(filmTiming.platform - 500))
  expect(chat.element()).toHaveTextContent(approval)
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
  expect(chat.getByText('is it themeable?', {exact: true}).query()).toBeNull()
  expect(chat.getByText('Yes!', {exact: true}).query()).toBeNull()
  expect(container.querySelector(`.${classes.ComposerPlaceholder}`)).toHaveTextContent(
    'Message #feature-agent-assignment',
  )
})

it('reuses the platform wheel with the requested title and keeps every capability centered, paused and seekable', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.platform + 600))
  const heading = page.getByRole('heading', {name: 'Platform and performance. Future proof.', exact: true})
  await expect.element(heading).toBeInTheDocument()
  const characters = Array.from(heading.element().querySelectorAll('span[style]'))
  rerender(scene(filmTiming.platform + 300))
  expect(getComputedStyle(characters[0]).opacity).toBe('1')
  expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
  rerender(scene(filmTiming.platform + 800))
  expect(characters.every(character => getComputedStyle(character).opacity === '1')).toBe(true)
  rerender(scene(filmTiming.platform + 300))
  expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
  expect(page.getByRole('list', {name: 'Platform and performance capabilities'}).query()).toBeNull()
  rerender(scene(filmTiming.platformCapabilities - 1))
  expect(characters.every(character => getComputedStyle(character).opacity === '1')).toBe(true)
  expect(page.getByRole('list', {name: 'Platform and performance capabilities'}).query()).toBeNull()
  rerender(scene(filmTiming.platformCapabilities + 600))
  const list = page.getByRole('list', {name: 'Platform and performance capabilities'}).element()
  const platform = page.getByRole('region', {name: 'Platform and performance', exact: true}).element()
  const initialTransform = getComputedStyle(list).transform
  const labels = ['Popover API', 'CSS Anchor Positioning', 'Invoker Commands API', 'Native', 'Virtualization']
  for (const [index, label] of labels.entries()) {
    const age = index * 1_200 + 600
    rerender(scene(filmTiming.platformCapabilities + age))
    const active = list.querySelector('[data-active="true"]')!
    expect(active).toHaveTextContent(label)
    expect(getComputedStyle(active).color).toBe('rgb(0, 0, 0)')
    const bounds = active.getBoundingClientRect()
    const window = list.parentElement!.getBoundingClientRect()
    expect(bounds.top + bounds.height / 2).toBeCloseTo(window.top + window.height / 2, 0)
    expect(bounds.left).toBeGreaterThanOrEqual(window.left)
    expect(bounds.right).toBeLessThanOrEqual(window.right)
    const animations = list.parentElement!.getAnimations({subtree: true})
    expect(animations.length).toBeGreaterThan(0)
    expect(animations.every(animation => animation.playState === 'paused' && animation.currentTime === age)).toBe(true)
  }
  rerender(scene(filmTiming.platformCapabilities + 600))
  expect(list.querySelector('[data-active="true"]')).toHaveTextContent(labels[0])
  expect(getComputedStyle(list).transform).toBe(initialTransform)
  rerender(scene(filmTiming.platform))
  expect(getComputedStyle(heading.element().parentElement!).opacity).toBe('1')
  expect(platform.getAnimations({subtree: true})).toHaveLength(0)
  expect(page.getByRole('list', {name: 'Platform and performance capabilities'}).query()).toBeNull()
  expect(page.getByRole('dialog', {name: 'Assign agents', exact: true}).query()).toBeNull()
})

it('shows all platform capabilities without motion and restores the sought rotation when motion is enabled', async () => {
  const scene = (reducedMotion: boolean) => (
    <MatchMediaContext.Provider value={{'(prefers-reduced-motion: reduce)': reducedMotion}}>
      <SelectPanelFilmSequence time={filmTiming.platformCapabilities + 3_000} />
    </MatchMediaContext.Provider>
  )
  const {rerender} = render(scene(false))
  const platform = page.getByRole('region', {name: 'Platform and performance', exact: true})
  const list = page.getByRole('list', {name: 'Platform and performance capabilities'})
  const rotation = getComputedStyle(list.element()).transform
  expect(list.element().querySelector('[data-active="true"]')).toHaveTextContent('Invoker Commands API')
  expect(rotation).not.toBe('none')
  rerender(scene(true))
  expect(platform.element().getAnimations({subtree: true})).toHaveLength(0)
  expect(getComputedStyle(list.element()).transform).toBe('none')
  for (const item of list.element().children) {
    expect(getComputedStyle(item).transform).toBe('none')
    expect(getComputedStyle(item).opacity).toBe('1')
  }
  rerender(scene(false))
  expect(getComputedStyle(list.element()).transform).toBe(rotation)
  expect(
    platform
      .element()
      .getAnimations({subtree: true})
      .every(animation => animation.playState === 'paused'),
  ).toBe(true)
})

it('finishes every assigned agent for the platform scene without adding statuses to unassigned rows', () => {
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.agentsFinished - 1))
  expect(page.getByRole('img', {name: 'done', exact: true}).elements()).toHaveLength(1)
  expect(page.getByRole('img', {name: 'working', exact: true}).element()).toBeInTheDocument()
  expect(page.getByRole('img', {name: 'queued', exact: true}).element()).toBeInTheDocument()
  rerender(scene(filmTiming.agentsFinished))
  expect(page.getByRole('img', {name: 'done', exact: true}).elements()).toHaveLength(3)
  expect(page.getByRole('img', {name: 'working', exact: true}).query()).toBeNull()
  expect(page.getByRole('img', {name: 'queued', exact: true}).query()).toBeNull()
  for (const name of ['Project manager', 'Designer']) {
    expect(page.getByRole('option', {name, exact: true}).element().querySelector(`.${classes.Status}`)).toBeNull()
  }
  rerender(scene(filmTiming.agentsFinished - 1))
  expect(page.getByRole('img', {name: 'working', exact: true}).element()).toBeInTheDocument()
  expect(page.getByRole('img', {name: 'queued', exact: true}).element()).toBeInTheDocument()
})

it('animates the channel-join notice before adding the three replies in order', async () => {
  const {rerender} = render(<FilmTeamChat time={8_000} alone />)
  const chat = page.getByRole('complementary', {name: 'Team conversation'})
  expect(chat.element()).toHaveTextContent('# feature-agent-assignment')
  const notice = page.getByText("You've been added to this channel by Maya", {exact: true})
  expect(notice.query()).toBeNull()
  rerender(<FilmTeamChat time={filmTiming.channelJoined - 1} alone />)
  expect(notice.query()).toBeNull()
  rerender(<FilmTeamChat time={filmTiming.channelJoined} alone />)
  const system = notice.element().parentElement!
  expect(getComputedStyle(system).opacity).toBe('0')
  rerender(<FilmTeamChat time={filmTiming.channelJoined + 125} alone />)
  expect(Number(getComputedStyle(system).opacity)).toBeGreaterThan(0)
  expect(Number(getComputedStyle(system).opacity)).toBeLessThan(1)
  rerender(<FilmTeamChat time={filmTiming.channelJoined + 250} alone />)
  expect(getComputedStyle(system).opacity).toBe('1')
  const idea = 'Hi! I have an idea, what if we could assign an issue to an agent, separate from human assignees?'
  expect(page.getByText(idea, {exact: true}).query()).toBeNull()
  rerender(<FilmTeamChat time={9_320} alone />)
  expect(page.getByText(idea, {exact: true}).element()).toBeInTheDocument()
  expect(page.getByText('Ooooh, I like that a lot!', {exact: true}).query()).toBeNull()
  rerender(<FilmTeamChat time={10_820} alone />)
  expect(page.getByText('Ooooh, I like that a lot!', {exact: true}).element()).toBeInTheDocument()
  expect(page.getByText('You', {exact: true}).query()).toBeNull()
  rerender(<FilmTeamChat time={12_820} alone />)
  expect(page.getByText('You', {exact: true}).element()).toBeInTheDocument()
  expect(page.getByText('I can do a quick draft', {exact: true}).element()).toBeInTheDocument()
  expect(chat.element().querySelectorAll('p')).toHaveLength(3)
  rerender(<FilmTeamChat time={filmTiming.channelJoined - 1} alone />)
  expect(notice.query()).toBeNull()
})

it('finishes modest reaction bursts before the next reply and restores them when scrubbing', async () => {
  const {rerender} = render(<FilmTeamChat time={9_819} alone />)
  const idea = page.getByRole('group', {name: "Reactions to Maya's message"})
  expect(idea.element().querySelectorAll('[role="img"]')).toHaveLength(0)
  expect(page.getByText('Ooooh, I like that a lot!', {exact: true}).query()).toBeNull()
  rerender(<FilmTeamChat time={9_820} alone />)
  expect(page.getByRole('img', {name: 'Idea, 1 reaction'}).element()).toBeInTheDocument()
  rerender(<FilmTeamChat time={10_000} alone />)
  expect(page.getByRole('img', {name: 'Idea, 2 reactions'}).element()).toBeInTheDocument()
  expect(page.getByRole('img', {name: 'Fire, 1 reaction'}).element()).toBeInTheDocument()
  rerender(<FilmTeamChat time={10_819} alone />)
  expect(page.getByRole('img', {name: 'Idea, 5 reactions'}).element()).toBeInTheDocument()
  expect(page.getByRole('img', {name: 'Fire, 3 reactions'}).element()).toBeInTheDocument()
  const completed = idea.element().textContent
  rerender(<FilmTeamChat time={10_820} alone />)
  expect(idea.element().textContent).toBe(completed)
  rerender(<FilmTeamChat time={12_819} alone />)
  const agreement = page.getByRole('group', {name: "Reactions to Leo's message"})
  expect(agreement.element().querySelectorAll('[role="img"]')).toHaveLength(1)
  expect(page.getByRole('img', {name: 'Heart, 2 reactions'}).element()).toBeInTheDocument()
  const agreed = agreement.element().textContent
  rerender(<FilmTeamChat time={12_820} alone />)
  expect(agreement.element().textContent).toBe(agreed)
  rerender(<FilmTeamChat time={14_310} alone />)
  expect(idea.element().textContent).toBe(completed)
  expect(agreement.element().textContent).toBe(agreed)
  expect(page.getByRole('img', {name: 'Rocket, 5 reactions'}).element()).toBeInTheDocument()
  expect(
    page.getByRole('complementary', {name: 'Team conversation'}).element().querySelectorAll('[role="img"][aria-label]'),
  ).toHaveLength(5)
  rerender(<FilmTeamChat time={9_819} alone />)
  expect(idea.element().querySelectorAll('[role="img"]')).toHaveLength(0)
})

it('holds a short beat before composing the reply without showing typing notices', async () => {
  const {rerender} = render(<FilmTeamChat time={10_820} alone />)
  const placeholder = page.getByText('Message #feature-agent-assignment', {exact: true})
  expect(placeholder.element()).toBeInTheDocument()
  rerender(<FilmTeamChat time={11_719} alone />)
  expect(placeholder.element()).toBeInTheDocument()
  rerender(<FilmTeamChat time={11_760} alone />)
  expect(page.getByText('I', {exact: true}).element()).toBeInTheDocument()
  expect(page.getByText('You', {exact: true}).query()).toBeNull()
  for (const time of [8_800, 10_300, 12_300]) {
    rerender(<FilmTeamChat time={time} alone />)
    expect(page.getByRole('status').query()).toBeNull()
  }
  rerender(<FilmTeamChat time={26_000} />)
  expect(page.getByRole('status').query()).toBeNull()
})

it('restores Slack already at the bottom with settled, varied thumbs-up and heart reactions', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => <FilmTeamChat time={time} alone />
  const {rerender} = render(scene(filmTiming.teamReturn))
  const chat = page.getByRole('complementary', {name: 'Team conversation'}).element()
  const history = chat.querySelector<HTMLElement>(`.${classes.ChatMessages}`)!
  for (const message of [...filmConversation, ...filmRequests]) {
    expect(history).toHaveTextContent(message.message)
  }
  expect(history.querySelectorAll('p')).toHaveLength(11)
  expect(history.scrollTop).toBeGreaterThan(0)
  expect(history.scrollTop).toBeCloseTo(history.scrollHeight - history.clientHeight, 0)
  const counts = new Set<string>()
  for (const message of filmRequests) {
    const row = history.querySelector<HTMLElement>(`[data-film-message="${message.time}"]`)!
    const reactions = [...row.querySelectorAll<HTMLElement>('[role="img"]')]
    if (message.part === 'ActionList.Description') {
      expect(reactions).toHaveLength(1)
      expect(reactions[0]).toHaveAttribute('aria-label', 'Plus, 1 reaction')
      expect(reactions[0]).toHaveTextContent('➕')
    } else {
      expect(reactions).toHaveLength(2)
      expect(reactions[0].getAttribute('aria-label')).toMatch(/^Thumbs up, /)
      expect(reactions[1].getAttribute('aria-label')).toMatch(/^Heart, /)
    }
    for (const reaction of reactions) expect(getComputedStyle(reaction).opacity).toBe('1')
    counts.add(reactions.map(reaction => reaction.textContent).join(' '))
  }
  expect(counts.size).toBeGreaterThan(1)
  const firstMessage = history.querySelector('p')
  const bottom = history.scrollTop
  for (const offset of [1_000, 700, 0]) {
    rerender(scene(filmTiming.teamReturn + offset))
    expect(history.scrollTop).toBe(bottom)
    expect(history.querySelector('p')).toBe(firstMessage)
  }
  expect(history).not.toHaveTextContent("Here's a draft PR")
})

it('starts typing the draft PR as Slack reopens, adds excited replies and reactions, then sends the approval request', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => <FilmTeamChat time={time} alone />
  const {rerender} = render(scene(filmTiming.teamReturn + 40))
  const chat = page.getByRole('complementary', {name: 'Team conversation'}).element()
  const history = chat.querySelector<HTMLElement>(`.${classes.ChatMessages}`)!
  const composer = chat.querySelector<HTMLElement>(`.${classes.ComposerPlaceholder}`)!
  expect(composer.textContent).toBe('H')
  rerender(scene(filmTiming.teamReturn + 600))
  expect(composer.textContent).toBe("Here's a draft ")
  const delivered = filmDraftConversation[0].time + filmRequestTiming.delivery
  rerender(scene(delivered - 1))
  expect(composer).toHaveTextContent("Here's a draft PR")
  expect(history).not.toHaveTextContent("Here's a draft PR")
  expect(page.getByRole('link', {name: 'https://github.com/github/github-ui/pull/45041'}).query()).toBeNull()
  rerender(scene(delivered + 499))
  const draft = page.getByText("Here's a draft PR", {exact: true}).element().closest(`.${classes.OldMessage}`)!
  expect(page.getByRole('link', {name: 'https://github.com/github/github-ui/pull/45041'}).element()).toHaveAttribute(
    'href',
    'https://github.com/github/github-ui/pull/45041',
  )
  expect(draft.querySelectorAll('[role="img"]')).toHaveLength(0)
  rerender(scene(delivered + 500))
  expect(draft.querySelector('[aria-label="Rocket, 1 reaction"]')).toBeInTheDocument()
  rerender(scene(delivered + 680))
  expect(draft.querySelector('[aria-label="Fire, 1 reaction"]')).toBeInTheDocument()
  rerender(scene(filmDraftConversation[1].time + filmRequestTiming.delivery + 250))
  await expect
    .element(page.getByText('Wow, that was fast! 🤯 ⚡ I love how this came together!', {exact: true}))
    .toBeVisible()
  expect(history).not.toHaveTextContent('This looks incredible')
  for (const label of ['Rocket, 8 reactions', 'Fire, 6 reactions', 'Mind blown, 4 reactions', 'Heart, 5 reactions']) {
    expect(draft.querySelector(`[aria-label="${label}"]`)).toBeInTheDocument()
  }
  rerender(scene(filmDraftConversation[2].time + filmRequestTiming.delivery + 250))
  await expect.element(page.getByText('🤩 This looks incredible!! 🚀 🎉', {exact: true})).toBeVisible()
  const replies = Array.from(history.querySelectorAll('p'), message => message.textContent)
  expect(replies.findIndex(message => message.includes('Wow, that was fast!'))).toBeLessThan(
    replies.findIndex(message => message.includes('This looks incredible')),
  )
  rerender(scene(filmDraftConversation[3].time + filmRequestTiming.delivery + 250))
  await expect.element(page.getByText('wow, you are so talented!', {exact: true})).toBeVisible()
  const approval = 'can someone approve it so we can deploy to preview 🙏'
  const characters = Array.from(approval)
  const lastCharacter = filmTiming.approvalTyping + characters.length * 40
  rerender(scene(lastCharacter - 40))
  expect(composer.textContent).toBe(characters.slice(0, -1).join(''))
  rerender(scene(lastCharacter))
  expect(composer.textContent).toBe(approval)
  expect(history).not.toHaveTextContent(approval)
  rerender(scene(filmDraftConversation[4].time + filmRequestTiming.delivery + 250))
  await expect.element(page.getByText(approval, {exact: true})).toBeVisible()
  expect(composer).toHaveTextContent('Message #feature-agent-assignment')
  expect(history.scrollTop).toBeCloseTo(history.scrollHeight - history.clientHeight, 0)
  rerender(scene(delivered - 1))
  expect(history).not.toHaveTextContent("Here's a draft PR")
  expect(history).not.toHaveTextContent(approval)
  expect(history).not.toHaveTextContent('Wow, that was fast!')
  expect(history).not.toHaveTextContent('wow, you are so talented!')
  expect(page.getByRole('link', {name: 'https://github.com/github/github-ui/pull/45041'}).query()).toBeNull()
})

it('captures the draft, shares its screenshot and caption, then reads the first reply before minimizing', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {container, rerender} = render(scene(filmTiming.draftScreenshot + 400))
  const panel = page.getByRole('dialog', {name: 'Assign agents', exact: true}).element()
  await expect
    .poll(() => container.querySelector(`.${classes.CaptureRegion}`)!.getBoundingClientRect().width)
    .toBeGreaterThan(panel.getBoundingClientRect().width)
  const panelBounds = panel.getBoundingClientRect()
  const architect = page.getByRole('option', {name: 'Architect', exact: true}).element()
  expect(architect).toHaveAttribute('aria-selected', 'true')
  rerender(scene(filmTiming.draftScreenshot - 1))
  expect(container.querySelector('[data-film-screenshot-selection]')).toBeNull()
  rerender(scene(filmTiming.draftScreenshot + 400))
  const capture = page.getByRole('img', {name: 'Selecting the agent panel for a screenshot'}).element()
  const region = container.querySelector<HTMLElement>(`.${classes.CaptureRegion}`)!
  const selection = container.querySelector<HTMLElement>('[data-film-screenshot-selection]')!
  const bounds = region.getBoundingClientRect()
  expect(bounds.left).toBeLessThan(panelBounds.left)
  expect(bounds.top).toBeLessThan(panelBounds.top)
  expect(bounds.right).toBeGreaterThan(panelBounds.right)
  expect(bounds.bottom).toBeGreaterThan(panelBounds.bottom)
  expect(selection.getBoundingClientRect().width).toBeGreaterThan(0)
  expect(selection.getBoundingClientRect().width).toBeLessThan(bounds.width)
  expect(capture).toHaveAttribute('data-captured', 'false')
  rerender(scene(filmTiming.draftScreenshotTaken + 300))
  expect(capture).toHaveAttribute('data-captured', 'true')
  expect(selection).not.toBeVisible()
  expect(container.querySelector(`.${classes.CapturedScreenshot}`)).toBeVisible()
  rerender(scene(filmTiming.draftShareAttach))
  const chat = page.getByRole('complementary', {name: 'Team conversation'})
  expect(chat.element()).toHaveAttribute('data-reviewing', 'true')
  const attached = page.getByRole('img', {name: 'Attached screenshot of the draft agent picker'})
  expect(attached.element()).toBeVisible()
  const composer = chat.element().querySelector(`.${classes.ComposerPlaceholder}`)!
  rerender(scene(filmTiming.draftShareTyping + 200))
  expect(composer.textContent).toBe('what ')
  rerender(scene(filmTiming.draftShared - 1))
  expect(composer.textContent).toBe('what do you think?')
  expect(chat.element().querySelector(`.${classes.ChatMessages}`)).not.toHaveTextContent('what do you think?')
  rerender(scene(filmTiming.draftShared))
  expect(attached.query()).toBeNull()
  expect(composer).toHaveTextContent('Message #feature-agent-assignment')
  expect(chat.getByText('what do you think?', {exact: true}).element()).toBeInTheDocument()
  expect(chat.getByRole('img', {name: 'Draft agent picker with Architect selected'}).element()).toBeInTheDocument()
  const reply = chat.getByText(filmRequests[0].message, {exact: true})
  const delivered = filmRequests[0].time + filmRequestTiming.delivery
  rerender(scene(delivered - 1))
  expect(reply.query()).toBeNull()
  rerender(scene(delivered + 250))
  expect(reply.element()).toBeVisible()
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
  expect(page.getByRole('complementary', {name: 'Slack notification'}).query()).toBeNull()
  rerender(scene(delivered + 700))
  const reactions = reply.element().closest('[data-film-message]')!.querySelectorAll('[role="img"]')
  expect(reactions).toHaveLength(1)
  expect(reactions[0]).toHaveAttribute('aria-label', 'Plus, 1 reaction')
  expect(reactions[0]).toHaveTextContent('➕')
  rerender(scene(filmTiming.draftShareMinimize - 1))
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
  expect(reply.element()).toBeVisible()
  rerender(scene(filmTiming.draftShareMinimize))
  expect(chat.element()).toHaveAttribute('data-minimizing', 'true')
  expect(filmTiming.draftShareMinimize - delivered).toBeGreaterThanOrEqual(1_650)
  rerender(scene(filmTiming.draftShareEnd))
  expect(chat.query()).toBeNull()
  expect(page.getByRole('dialog', {name: 'Assign agents', exact: true}).element()).toBe(panel)
  expect(architect).toHaveAttribute('aria-selected', 'true')
  expect(page.getByText('Keeps the work moving', {exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.descriptions + 500))
  expect(page.getByText('Keeps the work moving', {exact: true}).element()).toBeVisible()
  expect(page.getByRole('complementary', {name: 'Slack notification'}).query()).toBeNull()
  rerender(scene(filmTiming.descriptions + 999))
  expect(page.getByRole('complementary', {name: 'Slack notification'}).query()).toBeNull()
  rerender(scene(filmTiming.descriptions + 1_000))
  expect(page.getByRole('complementary', {name: 'Slack notification'}).element()).toHaveTextContent(
    filmRequests[1].message,
  )
  rerender(scene(filmTiming.draftShareAttach))
  expect(attached.element()).toBeVisible()
  expect(chat.getByText('what do you think?', {exact: true}).query()).toBeNull()
  expect(reply.query()).toBeNull()
  rerender(scene(filmTiming.draftScreenshot + 400))
  expect(chat.query()).toBeNull()
  expect(container.querySelector('[data-film-screenshot-selection]')).toBeVisible()
})

it('appends dark Slack notifications below earlier messages without moving them and restores history on seek', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const delivered = filmRequests[1].time + filmRequestTiming.delivery
  const {rerender} = render(scene(filmTiming.draftShareEnd))
  const notification = page.getByRole('complementary', {name: 'Slack notification'})
  const chat = page.getByRole('complementary', {name: 'Team conversation'})
  expect(chat.query()).toBeNull()
  expect(notification.query()).toBeNull()
  rerender(scene(delivered - 1))
  expect(notification.query()).toBeNull()
  rerender(scene(delivered))
  expect(notification.element()).toHaveTextContent('Leo')
  expect(notification.element()).toHaveTextContent('#feature-agent-assignment')
  expect(notification.element()).toHaveTextContent(filmRequests[1].message)
  rerender(scene(delivered + 400))
  expect(notification.element()).toBeVisible()
  const bounds = notification.element().getBoundingClientRect()
  expect(bounds.left).toBe(24)
  expect(bounds.width).toBe(580)
  expect(bounds.right).toBeLessThan(
    page.getByRole('dialog', {name: 'Assign agents'}).element().getBoundingClientRect().left,
  )
  expect(bounds.top).toBeGreaterThanOrEqual(0)
  expect(bounds.top).toBeLessThan(80)
  expect(getComputedStyle(notification.element()).color).toBe('rgb(245, 245, 247)')
  expect(getComputedStyle(notification.element()).backgroundColor).toBe('rgba(37, 37, 40, 0.98)')
  expect(parseFloat(getComputedStyle(notification.element().querySelector('p')!).fontSize)).toBeGreaterThanOrEqual(24)
  const first = notification.element()
  const settled = filmTiming.groups + 700
  const nextDelivered = filmRequests[2].time + filmRequestTiming.delivery
  rerender(scene(settled))
  const description = page.getByText('Keeps the work moving', {exact: true}).element()
  expect(description).toBeVisible()
  const descriptionBounds = description.getBoundingClientRect().toJSON()
  expect(nextDelivered - settled).toBeGreaterThanOrEqual(800)
  expect(notification.element()).toBe(first)
  expect(first).toBeVisible()
  rerender(scene(nextDelivered - 1))
  expect(notification.element()).toBe(first)
  expect(description.getBoundingClientRect().toJSON()).toEqual(descriptionBounds)
  rerender(scene(nextDelivered))
  expect(notification.elements()).toHaveLength(2)
  expect(notification.elements()[1]).toHaveTextContent('Maya')
  expect(notification.elements()[1]).toHaveTextContent(filmRequests[2].message)
  expect(notification.elements()[0]).toBe(first)
  expect(first.getBoundingClientRect().toJSON()).toEqual(bounds.toJSON())
  expect(first).toHaveTextContent(filmRequests[1].message)
  expect(chat.query()).toBeNull()
  rerender(scene(filmTiming.groups + 700))
  expect(page.getByText('Plan', {exact: true}).element()).toBeInTheDocument()
  rerender(scene(filmRequests[3].time + filmRequestTiming.delivery))
  expect(notification.elements()[2]).toHaveTextContent('Could we assign multiple agents to one task?')
  rerender(scene(filmTiming.modeOpen + 100))
  const mode = page.getByRole('button', {name: 'Selection mode', exact: true}).element().getBoundingClientRect()
  for (const card of notification.elements()) expect(card.getBoundingClientRect().bottom).toBeLessThan(mode.top)
  rerender(scene(filmTiming.reviewerSelect + 500))
  expect(notification.elements()).toHaveLength(3)
  expect(page.getByRole('option', {name: 'Accessibility Reviewer', exact: true}).element()).toHaveAttribute(
    'aria-selected',
    'true',
  )
  rerender(scene(filmRequests[4].time + filmRequestTiming.delivery))
  expect(notification.elements()).toHaveLength(4)
  expect(notification.elements()[3]).toHaveTextContent(filmRequests[4].message)
  rerender(scene(filmTiming.mobile + filmRequestTiming.delivery + filmRequestTiming.entrance))
  expect(notification.elements()).toHaveLength(filmRequests.length - 1)
  expect(notification.elements()[5]).toHaveTextContent('Oh, and it should be responsive for mobile')
  const picker = page.getByRole('dialog', {name: 'Assign agents'}).element().getBoundingClientRect()
  let previousBottom = 24
  for (const [index, card] of notification.elements().entries()) {
    expect(card).toBeVisible()
    expect(card).toHaveTextContent(filmRequests[index + 1].message)
    const rect = card.getBoundingClientRect()
    expect(rect.left).toBe(24)
    expect(rect.right).toBeLessThan(picker.left)
    expect(rect.top).toBeGreaterThanOrEqual(previousBottom)
    expect(rect.bottom).toBeLessThanOrEqual(786)
    previousBottom = rect.bottom
  }
  rerender(scene(filmTiming.teamReturn))
  expect(notification.query()).toBeNull()
  expect(chat.element()).toBeInTheDocument()
  rerender(scene(filmTiming.platform))
  expect(notification.query()).toBeNull()
  expect(chat.query()).toBeNull()
  rerender(scene(delivered + 400))
  expect(notification.element()).toHaveTextContent(filmRequests[1].message)
  expect(notification.element()).toBeVisible()
  expect(chat.query()).toBeNull()
})

it('slides search in from above and the footer from below after their drops, including rewind', () => {
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.search - 1))
  for (const [part, drop, direction] of [
    ['search', filmTiming.search, -1],
    ['footer', filmTiming.footer, 1],
  ] as const) {
    const insertion = () =>
      part === 'search'
        ? document
            .querySelector<HTMLInputElement>('input[aria-label="Search agents"]')
            ?.closest<HTMLElement>(`.${classes.Insert}`)
        : document.querySelector<HTMLElement>(`.${classes.PickerFooter}`)
    rerender(scene(drop - 1))
    expect(insertion()).toBeFalsy()
    rerender(scene(drop))
    const inserted = insertion()!
    const translation = () => {
      const [x, y = '0'] = getComputedStyle(inserted).translate.split(/\s+/)
      expect(parseFloat(x)).toBe(0)
      return parseFloat(y)
    }
    const start = translation()
    expect(start * direction).toBeGreaterThan(0)
    rerender(scene(drop + 350))
    const middle = translation()
    expect(middle * direction).toBeGreaterThan(0)
    expect(Math.abs(middle)).toBeLessThan(Math.abs(start))
    rerender(scene(drop + 700))
    expect(translation()).toBe(0)
    rerender(scene(drop + 350))
    expect(translation()).toBe(middle)
    rerender(scene(drop - 1))
    expect(insertion()).toBeFalsy()
  }
})

it('keeps notifications, feature insertions, phone and closing at their unscaled sizes', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {container, rerender} = render(scene(filmRequests[1].time + 700))
  for (const time of [
    filmRequests[1].time + 700,
    filmTiming.search + 100,
    filmTiming.footer + 100,
    filmTiming.mobileReveal + 450,
    filmTiming.closing + 100,
  ]) {
    rerender(scene(time))
    const surfaces = container.querySelectorAll<HTMLElement>(
      `.${classes.Notification}, .${classes.Phone}[data-active="true"], .${classes.Closing}`,
    )
    expect(surfaces.length).toBeGreaterThan(0)
    for (const surface of [...surfaces, ...document.querySelectorAll<HTMLElement>(`.${classes.Insert}`)]) {
      expect(surface.getBoundingClientRect().width).toBeCloseTo(surface.offsetWidth, 0)
    }
  }
  const title = page.getByRole('heading', {name: 'SelectPanel, now composable', exact: true}).element()
  const closing = title.parentElement!
  const subtitle = page.getByText('what will you build?', {exact: true}).element()
  expect(closing).toContainElement(subtitle)
  expect(subtitle.getBoundingClientRect().top).toBeGreaterThan(title.getBoundingClientRect().bottom)
  expect(parseFloat(getComputedStyle(subtitle).fontSize)).toBeLessThan(parseFloat(getComputedStyle(title).fontSize))
  expect(closing.querySelector('svg')).toBeNull()
})

it('shows SelectPanel immediately, fades in the rest of the title, then the subtitle, and restores that order on rewind', () => {
  const scene = (offset: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={filmTiming.closing + offset} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(0))
  const title = page.getByRole('heading', {name: 'SelectPanel, now composable', exact: true}).element()
  const componentName = title.children[0]
  const suffix = title.children[1]
  const subtitle = page.getByText('what will you build?', {exact: true}).element()
  const opacity = (element: Element) => Number(getComputedStyle(element).opacity)
  expect(componentName).toHaveTextContent('SelectPanel')
  expect(opacity(title)).toBe(1)
  expect(opacity(componentName)).toBe(1)
  expect(opacity(suffix)).toBe(0)
  expect(opacity(subtitle)).toBe(0)
  rerender(scene(600))
  expect(opacity(suffix)).toBe(0)
  rerender(scene(1_050))
  expect(opacity(componentName)).toBe(1)
  expect(opacity(suffix)).toBeGreaterThan(0)
  expect(opacity(suffix)).toBeLessThan(1)
  expect(opacity(subtitle)).toBe(0)
  for (const offset of [1_500, 1_799, 1_800]) {
    rerender(scene(offset))
    expect(opacity(title)).toBe(1)
    expect(opacity(suffix)).toBe(1)
    expect(opacity(subtitle)).toBe(0)
  }
  rerender(scene(2_250))
  expect(opacity(title)).toBe(1)
  expect(opacity(subtitle)).toBeGreaterThan(0)
  expect(opacity(subtitle)).toBeLessThan(1)
  for (const offset of [2_700, 3_000]) {
    rerender(scene(offset))
    expect(opacity(title)).toBe(1)
    expect(opacity(subtitle)).toBe(1)
  }
  rerender(scene(0))
  expect(opacity(componentName)).toBe(1)
  expect(opacity(suffix)).toBe(0)
  expect(opacity(subtitle)).toBe(0)
})

it('holds the final reply for 1.5 seconds, then minimizes Slack in 300ms over the same browser', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(8_000))
  const chat = page.getByRole('complementary', {name: 'Team conversation'}).element()
  const browser = page.getByRole('heading', {name: 'Agents', exact: true}).element()
  rerender(scene(12_820))
  expect(page.getByText('I can do a quick draft', {exact: true}).element()).toBeInTheDocument()
  rerender(scene(14_319))
  const browserBounds = browser.getBoundingClientRect()
  const chatWidth = chat.getBoundingClientRect().width
  expect(chat).toHaveAttribute('data-minimizing', 'false')
  rerender(scene(14_320))
  expect(page.getByRole('complementary', {name: 'Team conversation'}).element()).toBe(chat)
  expect(chat).toHaveAttribute('data-minimizing', 'true')
  rerender(scene(14_470))
  expect(chat).toBeInTheDocument()
  await expect.poll(() => chat.getBoundingClientRect().width).toBeLessThan(chatWidth)
  expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBe(browser)
  expect(browser.getBoundingClientRect()).toEqual(browserBounds)
  rerender(scene(14_619))
  expect(chat).toBeInTheDocument()
  rerender(scene(14_620))
  expect(chat).not.toBeInTheDocument()
  expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBe(browser)
  expect(page.getByRole('button', {name: 'Assign agents', exact: true}).query()).toBeNull()
  rerender(scene(14_319))
  expect(page.getByRole('complementary', {name: 'Team conversation'}).element()).toHaveAttribute(
    'data-minimizing',
    'false',
  )
})

it('assembles only the real trigger and a plain single-select list in the issue draft', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.draft))
  expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBeInTheDocument()
  expect(page.getByRole('button', {name: 'Assign agents', exact: true}).query()).toBeNull()
  expect(page.getByRole('dialog').query()).toBeNull()
  rerender(scene(filmTiming.triggerDrop))
  await expect.element(page.getByRole('button', {name: 'Assign agents', exact: true})).toBeVisible()
  rerender(scene(filmTiming.listDrag - 1))
  expect(page.getByRole('dialog').query()).toBeNull()
  rerender(scene(filmTiming.listDrag))
  expect(page.getByRole('dialog').query()).toBeNull()
  rerender(scene(filmTiming.listDrop))
  const list = page.getByRole('listbox', {name: 'Available agents'})
  await expect.element(list).toBeVisible()
  expect(list.element().contains(document.activeElement)).toBe(false)
  expect(list.element().querySelector(':focus-visible, [data-is-active-descendant]')).toBeNull()
  expect(list.element().querySelectorAll('[role="option"]')).toHaveLength(5)
  expect(Array.from(list.element().querySelectorAll('[role="option"]'), option => option.textContent)).toEqual([
    'Project manager',
    'Designer',
    'Architect',
    'Developer',
    'Accessibility Reviewer',
  ])
  const icons = Array.from(
    list.element().querySelectorAll<SVGSVGElement>('[data-component="ActionList.LeadingVisual"] svg.octicon'),
  )
  expect(icons).toHaveLength(5)
  for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden', 'true')
  expect(list.element()).not.toHaveAttribute('aria-multiselectable', 'true')
  expect(list.element().querySelector('[aria-selected="true"]')).toBeNull()
  expect(page.getByRole('combobox').query()).toBeNull()
  expect(page.getByText('Plan', {exact: true}).query()).toBeNull()
  expect(page.getByRole('heading', {name: 'Assign agents', exact: true}).query()).toBeNull()
  expect(page.getByRole('button', {name: 'Assign', exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.listDrop + 100))
  expect(list.element().contains(document.activeElement)).toBe(false)
  expect(list.element().querySelector(':focus-visible, [data-is-active-descendant]')).toBeNull()
  const cursor = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
  expect(cursor).toBeVisible()
  rerender(scene(filmTiming.listDrop))
  const panel = page.getByRole('dialog', {name: 'Assign agents'}).element()
  expect(panel.contains(document.activeElement)).toBe(false)
  expect(panel.getBoundingClientRect().width).toBe(
    document.querySelector<HTMLElement>('[data-film-trigger-target]')!.getBoundingClientRect().width,
  )
  expect(panel.getBoundingClientRect().right).toBeLessThanOrEqual(1440)
})

it('picks up the actual trigger card and keeps its blue outline and label until the drop', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmIssue time={1_200} />
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.triggerDrag))
  const panel = page.getByRole('dialog', {name: 'Choose labels'}).element()
  const trigger = document.querySelector<HTMLButtonElement>(`button[aria-controls="${panel.id}"]`)
  if (!(panel instanceof HTMLElement) || !(trigger instanceof HTMLElement)) {
    throw new Error('The film needs HTML picker and trigger nodes.')
  }
  const film = animateSelectPanel(panel, trigger)
  const card = document.querySelector<HTMLElement>('[data-film-tile="SelectPanel.Trigger"]')!
  const label = card.querySelector<HTMLElement>('[data-film-label]')!
  const target = document.querySelector<HTMLElement>('[data-film-trigger-target]')!
  const cursorPosition = () => {
    const cursor = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
    return new DOMPoint(0, 0).matrixTransform(cursor.getScreenCTM()!)
  }
  const seek = (time: number) => {
    rerender(scene(time))
    film.seek(time)
  }
  try {
    seek(filmTiming.triggerDrag)
    expect(trigger).toHaveTextContent('Button')
    expect(trigger).toHaveAttribute('data-variant', 'default')
    expect(getComputedStyle(card).borderTopColor).not.toBe(getComputedStyle(label).color)
    const destination = target.getBoundingClientRect()
    const start = cursorPosition()
    expect(start.x).toBeGreaterThan(destination.left)
    expect(start.x).toBeLessThan(destination.right)
    expect(start.y).toBeGreaterThan(destination.top)
    expect(start.y).toBeLessThan(destination.bottom)
    const stacked = card.getBoundingClientRect().toJSON()
    seek(filmTiming.triggerPickup - 100)
    expect(getComputedStyle(card).borderTopColor).toBe(getComputedStyle(label).color)
    const pickup = cursorPosition()
    expect(pickup.x).toBeGreaterThan(stacked.left)
    expect(pickup.x).toBeLessThan(stacked.right)
    expect(pickup.y).toBeGreaterThan(stacked.top)
    expect(pickup.y).toBeLessThan(stacked.top + 32)
    expect(card.getBoundingClientRect().toJSON()).toEqual(stacked)

    seek(filmTiming.triggerPickup)
    const grip = {
      x: cursorPosition().x - card.getBoundingClientRect().left,
      y: cursorPosition().y - card.getBoundingClientRect().top,
    }
    for (const time of [filmTiming.triggerPickup + 160, filmTiming.triggerPickup + 600, filmTiming.triggerDrop - 1]) {
      seek(time)
      const bounds = card.getBoundingClientRect()
      expect(cursorPosition().x - bounds.left).toBeCloseTo(grip.x, 1)
      expect(cursorPosition().y - bounds.top).toBeCloseTo(grip.y, 1)
      expect(card).toContainElement(trigger)
      expect(label).toBeVisible()
      expect(getComputedStyle(card).borderTopColor).toBe(getComputedStyle(label).color)
      expect(Number(getComputedStyle(card).zIndex)).toBeGreaterThan(110)
      expect(page.getByRole('button', {name: 'Assign agents', exact: true}).query()).toBeNull()
    }
    expect(card.getBoundingClientRect().left).toBeCloseTo(destination.left - 1, 0)
    expect(card.getBoundingClientRect().top).toBeCloseTo(destination.top - 1, 0)
    seek(filmTiming.triggerDrop)
    expect(card).not.toBeVisible()
    expect(label).not.toBeVisible()
    await expect.element(page.getByRole('button', {name: 'Assign agents', exact: true})).toBeVisible()
    seek(filmTiming.triggerPickup + 600)
    expect(label).toBeVisible()
    expect(cursorPosition().x - card.getBoundingClientRect().left).toBeCloseTo(grip.x, 1)
    seek(filmTiming.triggerDrag)
    expect(card.getBoundingClientRect().toJSON()).toEqual(stacked)

    const listCard = document.querySelector<HTMLElement>('[data-film-tile="ActionList"]')!
    const actualList = listCard.querySelector<HTMLElement>('[data-film-list-source]')!
    seek(filmTiming.listPickup)
    const listGrip = {
      x: cursorPosition().x - listCard.getBoundingClientRect().left,
      y: cursorPosition().y - listCard.getBoundingClientRect().top,
    }
    for (const time of [filmTiming.listPickup + 100, filmTiming.listPickup + 600, filmTiming.listDrop - 1]) {
      seek(time)
      expect(listCard).toContainElement(actualList)
      expect(cursorPosition().x - listCard.getBoundingClientRect().left).toBeCloseTo(listGrip.x, 1)
      expect(cursorPosition().y - listCard.getBoundingClientRect().top).toBeCloseTo(listGrip.y, 1)
      expect(page.getByRole('dialog', {name: 'Assign agents'}).query()).toBeNull()
    }
    const pointer = document.querySelector('[data-film-pointer]')
    for (const time of [
      filmTiming.listDrop,
      20_000,
      filmTiming.draftSelect,
      filmTiming.build - 1,
      filmTiming.build,
      filmTiming.descriptions,
      filmTiming.modeOpen,
      filmTiming.multiple - 1,
      filmTiming.multiple,
      filmTiming.statuses,
    ]) {
      seek(time)
      expect(document.querySelectorAll('[data-film-pointer]')).toHaveLength(1)
      expect(document.querySelector('[data-film-pointer]')).toBe(pointer)
      expect(pointer).toBeVisible()
      const svg = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
      const tip = new DOMPoint(8, 10).matrixTransform(svg.getScreenCTM()!)
      try {
        svg.style.pointerEvents = 'all'
        expect(svg.contains(document.elementFromPoint(tip.x, tip.y))).toBe(true)
      } finally {
        svg.style.pointerEvents = ''
      }
    }
    seek(filmTiming.multiple)
    const modeChanged = cursorPosition()
    seek(filmTiming.multipleSelectionStart - 1)
    expect(cursorPosition().x).toBeCloseTo(modeChanged.x, 1)
    expect(cursorPosition().y).toBeCloseTo(modeChanged.y, 1)
    for (const name of ['Developer', 'Accessibility Reviewer']) {
      expect(page.getByRole('option', {name, exact: true}).element()).toHaveAttribute('aria-selected', 'false')
    }
    seek(filmTiming.multipleSelectionStart + 100)
    expect(cursorPosition().x).not.toBe(modeChanged.x)
    for (const [name, time] of [
      ['Developer', filmTiming.developerSelect],
      ['Accessibility Reviewer', filmTiming.reviewerSelect],
    ] as const) {
      seek(time - 1)
      const option = page.getByRole('option', {name, exact: true})
      expect(option.element()).toHaveAttribute('aria-selected', 'false')
      seek(time)
      expect(option.element()).toHaveAttribute('aria-selected', 'true')
      const checkbox = option.element().querySelector('[data-component="ActionList.Selection"]')!
      const bounds = checkbox.getBoundingClientRect()
      const svg = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
      const tip = new DOMPoint(3, 2).matrixTransform(svg.getScreenCTM()!)
      expect(tip.x).toBeGreaterThanOrEqual(bounds.left)
      expect(tip.x).toBeLessThan(bounds.right)
      expect(tip.y).toBeGreaterThanOrEqual(bounds.top)
      expect(tip.y).toBeLessThan(bounds.bottom)
    }
    const afterSelection = cursorPosition()
    seek(filmTiming.reviewerSelect + 1_000)
    expect(cursorPosition()).toEqual(afterSelection)
    seek(filmTiming.multiple)
    expect(cursorPosition().x).toBeCloseTo(modeChanged.x, 1)
    expect(cursorPosition().y).toBeCloseTo(modeChanged.y, 1)
    expect(page.getByRole('option', {name: 'Developer', exact: true}).element()).toHaveAttribute(
      'aria-selected',
      'false',
    )
    seek(filmTiming.draftSelect - 500)
    const architect = page.getByRole('option', {name: 'Architect', exact: true}).element()
    const restingBackground = getComputedStyle(architect).backgroundColor
    for (const [offset, name] of [
      [-500, 'Project manager'],
      [-300, 'Designer'],
      [-100, 'Architect'],
      [0, 'Architect'],
      [100, 'Architect'],
    ] as const) {
      seek(filmTiming.draftSelect + offset)
      const hovered = page.getByRole('option', {name, exact: true}).element()
      expect([...document.querySelectorAll('[data-film-hovered]')]).toEqual([hovered])
      expect(getComputedStyle(hovered).backgroundColor).not.toBe(restingBackground)
      for (const option of hovered.parentElement!.querySelectorAll('[role="option"]')) {
        if (option !== hovered) expect(getComputedStyle(option).backgroundColor).toBe(restingBackground)
      }
    }
    expect(architect).toHaveAttribute('aria-selected', 'true')
    seek(filmTiming.draftSelect - 80)
    const beforeClick = cursorPosition()
    seek(filmTiming.draftSelect)
    expect(cursorPosition().x).toBeCloseTo(beforeClick.x, 1)
    expect(cursorPosition().y).toBeCloseTo(beforeClick.y, 1)
    const arrived = filmRequests[1].time + filmRequestTiming.delivery + filmRequestTiming.entrance
    seek(arrived)
    const waiting = cursorPosition()
    seek(arrived + filmRequestTiming.readingPause - 1)
    expect(cursorPosition().x).toBe(waiting.x)
    expect(cursorPosition().y).toBe(waiting.y)
    seek(arrived + filmRequestTiming.readingPause + 50)
    expect(cursorPosition().x).not.toBe(waiting.x)
    seek(arrived + filmRequestTiming.readingPause + filmRequestTiming.approach)
    expect(document.querySelector('[data-film-hovered]')).toBeNull()
    seek(filmTiming.draftSelect - 300)
    expect(page.getByRole('option', {name: 'Designer', exact: true}).element()).toHaveAttribute('data-film-hovered')
    expect(getComputedStyle(architect).backgroundColor).toBe(restingBackground)
    seek(filmTiming.mobileReveal)
    expect(document.querySelector('[data-film-pointer]')).toBeNull()
    expect(document.querySelector('[data-film-hovered]')).toBeNull()
    seek(filmTiming.listPickup + 600)
    expect(listCard).toBeVisible()
    expect(listCard).toContainElement(actualList)
  } finally {
    film.dispose()
  }
})

it('keeps the issue, popup, options and Architect selection unchanged at the build boundary', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.draftSelect - 1))
  const architect = page.getByRole('option', {name: 'Architect', exact: true})
  expect(architect.element()).toHaveAttribute('aria-selected', 'false')
  rerender(scene(filmTiming.draftSelect))
  expect(architect.element()).toHaveAttribute('aria-selected', 'true')
  rerender(scene(filmTiming.build - 1))
  const heading = page.getByRole('heading', {name: 'Agents', exact: true}).element()
  const panel = page.getByRole('dialog', {name: 'Assign agents'}).element()
  const options = [...panel.querySelectorAll('[role="option"]')]
  const bounds = panel.getBoundingClientRect().toJSON()
  const content = panel.textContent
  rerender(scene(filmTiming.build))
  expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBe(heading)
  expect(page.getByRole('dialog', {name: 'Assign agents'}).element()).toBe(panel)
  expect([...panel.querySelectorAll('[role="option"]')]).toEqual(options)
  expect(panel.textContent).toBe(content)
  expect(panel.getBoundingClientRect().toJSON()).toEqual(bounds)
  expect(panel.textContent).not.toContain('Keeps the work moving')
  rerender(scene(filmTiming.descriptions + 500))
  expect(panel.textContent).toContain('Keeps the work moving')
  expect([...panel.querySelectorAll('[role="option"]')]).toEqual(options)
  const before = options.map(option => option.getBoundingClientRect().top)
  rerender(scene(filmTiming.groups + 325))
  for (const [index, option] of options.entries()) {
    expect(option.getBoundingClientRect().top).toBeGreaterThan(before[index])
    expect(option.getBoundingClientRect().top - before[index]).toBeLessThan(90)
  }
  expect([...panel.querySelectorAll('[role="option"]')]).toEqual(options)
  expect(architect.element()).toHaveAttribute('aria-selected', 'true')
})

it('waits for each banner, then lifts the populated source card without replacing its preview', () => {
  const names: Record<string, string> = {
    'SelectPanel.SearchInput': 'SelectPanel.SearchInput / TextInput',
  }
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmIssue time={1_200} />
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.build))
  const panel = page.getByRole('dialog', {name: 'Choose labels'}).element()
  const trigger = document.querySelector<HTMLButtonElement>(`button[aria-controls="${panel.id}"]`)!
  if (!(panel instanceof HTMLElement)) throw new Error('The film needs an HTML picker.')
  const film = animateSelectPanel(panel, trigger)
  const seek = (time: number) => {
    rerender(scene(time))
    film.seek(time)
  }
  try {
    for (const request of filmRequests.filter(
      message => message.time < filmTiming.mobile && message.part !== 'selectionMode="multiple"',
    )) {
      const arrived = request.time + filmRequestTiming.delivery + filmRequestTiming.entrance
      const approach =
        request.part === 'ActionList.Description' ? filmTiming.draftShareEnd : arrived + filmRequestTiming.readingPause
      const pickup = approach + filmRequestTiming.approach
      const drop = pickup + filmRequestTiming.drag
      seek(arrived)
      const card = document.querySelector<HTMLElement>(`[data-film-tile="${names[request.part] ?? request.part}"]`)!
      const preview = card.querySelector<HTMLElement>('[data-film-part]')!
      const statusPreview = request.part === 'ActionList.TrailingVisual'
      const previewLabels = () =>
        Array.from(preview.querySelectorAll<HTMLElement>('[data-component="ActionList.Item.Label"]'), label =>
          Array.from(label.children)
            .filter(child => child.checkVisibility())
            .map(child => child.textContent)
            .join(''),
        )
      if (statusPreview) expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
      const original = card.getBoundingClientRect().toJSON()
      const groupCard = document.querySelector<HTMLElement>('[data-film-tile="SelectPanel.Group / ActionList.Group"]')!
      const parkedGroup = groupCard.getBoundingClientRect().toJSON()
      if (request.part === 'ActionList.GroupHeading') {
        expect(preview).toHaveAttribute('data-component', 'GroupHeadingWrap')
      }
      expect(preview).toBeVisible()
      const input = preview.querySelector('input')
      if (input) {
        expect(input).toBeVisible()
        expect(input.placeholder.length).toBeGreaterThan(0)
      } else {
        expect(preview.textContent.trim().length).toBeGreaterThan(0)
      }
      seek(approach - 1)
      expect(card.getBoundingClientRect().toJSON()).toEqual(original)
      if (statusPreview) {
        seek(pickup - 1)
        expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
      }
      seek(pickup)
      if (statusPreview) expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
      expect(card.getBoundingClientRect().toJSON()).toEqual(original)
      for (const time of [pickup + 100, pickup + 450, drop - 1]) {
        seek(time)
        const bounds = card.getBoundingClientRect()
        expect(bounds.left).toBeLessThan(original.left)
        expect(card.querySelector('[data-film-part]')).toBe(preview)
        expect(preview).toBeVisible()
        if (statusPreview) {
          expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
          for (const label of preview.querySelectorAll('[data-component="ActionList.Item.Label"]')) {
            expect(getComputedStyle(label).opacity).toBe('1')
          }
          expect(
            page.getByRole('dialog', {name: 'Assign agents'}).element().querySelectorAll(`.${classes.Status}`),
          ).toHaveLength(0)
          for (const visual of preview.querySelectorAll('[data-component="ActionList.TrailingVisual"] > span')) {
            expect(visual.children[0]).toBeVisible()
            expect(visual.children[1]).not.toBeVisible()
          }
        }
        expect(preview.getBoundingClientRect().bottom).toBeLessThanOrEqual(bounds.bottom)
        const visiblePreview = preview.getBoundingClientRect()
        const pointerEvents = card.style.pointerEvents
        try {
          card.inert = false
          card.style.pointerEvents = 'auto'
          expect(card.contains(document.elementFromPoint(visiblePreview.left + 8, visiblePreview.top + 8))).toBe(true)
        } finally {
          card.inert = true
          card.style.pointerEvents = pointerEvents
        }
        expect(getComputedStyle(card).opacity).toBe('1')
        expect(card.querySelector('[data-film-label]')).toBeVisible()
        const cursor = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
        const point = new DOMPoint(0, 0).matrixTransform(cursor.getScreenCTM()!)
        expect(point.x - bounds.left).toBeCloseTo(328, 0)
        expect(point.y - bounds.top).toBeCloseTo(24, 0)
      }
      const landing = preview.getBoundingClientRect().toJSON()
      const statusLandings = Array.from(preview.querySelectorAll<HTMLElement>('[data-state]'), status =>
        status.getBoundingClientRect().toJSON(),
      )
      seek(drop)
      expect(card).not.toBeVisible()
      if (request.part === 'ActionList.GroupHeading') {
        expect(groupCard).toBeVisible()
        expect(groupCard.getBoundingClientRect().toJSON()).toEqual(parkedGroup)
      }
      if (statusPreview) {
        expect(
          page.getByRole('dialog', {name: 'Assign agents'}).element().querySelectorAll(`.${classes.Status}`),
        ).toHaveLength(3)
      }
      seek(drop + 700)
      const picker = page.getByRole('dialog', {name: 'Assign agents'}).element()
      const targets: Record<string, string> = {
        'ActionList.Description': '[data-component="ActionList.Description"]',
        'ActionList.GroupHeading': '[data-component="GroupHeadingWrap"]',
        'SelectPanel.SearchInput': 'input[aria-label="Search agents"]',
        'SelectPanel.Footer': `.${classes.PickerFooter}`,
      }
      if (request.part in targets) {
        const element = picker.querySelector<HTMLElement>(targets[request.part])!
        const inserted =
          request.part === 'SelectPanel.SearchInput' ? element.closest('[data-component="TextInput"]')! : element
        const destination = inserted.getBoundingClientRect()
        expect(landing.left).toBeCloseTo(destination.left, 0)
        expect(landing.top).toBeCloseTo(destination.top, 0)
        expect(landing.width).toBeCloseTo(destination.width, 0)
        expect(landing.height).toBeCloseTo(destination.height, 0)
      } else if (request.part === 'ActionList.TrailingVisual') {
        const inserted = picker.querySelectorAll<HTMLElement>(`.${classes.Status}`)
        expect(inserted).toHaveLength(statusLandings.length)
        for (const [index, status] of Array.from(inserted).entries()) {
          const destination = status.getBoundingClientRect()
          expect(statusLandings[index].left).toBeCloseTo(destination.left, 0)
          expect(statusLandings[index].top).toBeCloseTo(destination.top, 0)
        }
        const cursor = document.querySelector<SVGSVGElement>('[data-film-pointer]')!
        const position = () => {
          const matrix = cursor.getScreenCTM()!
          return {x: matrix.e, y: matrix.f}
        }
        const parked = position()
        expect(parked.x).toBeGreaterThan(picker.getBoundingClientRect().right)
        const cursorBounds = cursor.getBoundingClientRect()
        for (const status of inserted) {
          expect(cursorBounds.left).toBeGreaterThan(status.getBoundingClientRect().right)
        }
        seek(drop)
        expect(document.querySelector('[data-film-pointer]')).toBe(cursor)
        const released = position()
        seek(drop + 100)
        expect(position()).toEqual(released)
        seek(drop + 275)
        expect(position().x).toBeGreaterThan(released.x)
        expect(position().x).toBeLessThan(parked.x)
        seek(drop + 450)
        expect(position()).toEqual(parked)
        seek(drop)
        expect(position()).toEqual(released)
      }
      if (request.part === 'SelectPanel.Footer') {
        const footer = picker.querySelector<HTMLElement>(`.${classes.PickerFooter}`)!
        expect(footer.getBoundingClientRect().bottom).toBeCloseTo(picker.getBoundingClientRect().bottom, 0)
        const search = page
          .getByRole('combobox', {name: 'Search agents'})
          .element()
          .closest('[data-component="TextInput"]')!
        expect(search.getBoundingClientRect().height).toBe(32)
      }
      seek(pickup + 450)
      expect(card.querySelector('[data-film-part]')).toBe(preview)
      expect(preview).toBeVisible()
      if (statusPreview) {
        expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
        seek(arrived)
        expect(previewLabels()).toEqual(['Item one', 'Item two', 'Item three'])
      }
    }
  } finally {
    film.dispose()
  }
})

it('adds an empty search without scripted typing or filtering before moving on', () => {
  const scene = (offset: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={filmTiming.search + offset} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(-1))
  const search = page.getByRole('combobox', {name: 'Search agents'})
  expect(search.query()).toBeNull()
  for (const offset of [0, 750, 1_110, 1_699, 1_980, filmTiming.modeOpen - filmTiming.search, 0]) {
    rerender(scene(offset))
    expect(search.element()).toHaveValue('')
    expect(document.querySelectorAll('[aria-label="Available agents"] [role="option"]')).toHaveLength(5)
  }
  expect(page.getByRole('option', {name: 'Architect', exact: true}).element()).toHaveAttribute('aria-selected', 'true')
})

it('opens a code-style selectionMode dropdown and changes the real picker to multiple', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.modeOpen - 1))
  const button = page.getByRole('button', {name: 'Selection mode', exact: true})
  expect(button.element()).toHaveTextContent('single')
  const control = button.element().getBoundingClientRect()
  const callout = button.element().closest(`.${classes.ModeSwitch}`)!
  const labelBounds = callout.getBoundingClientRect()
  const panelBounds = page.getByRole('dialog', {name: 'Assign agents'}).element().getBoundingClientRect()
  const leader = getComputedStyle(callout, '::after')
  expect(labelBounds.right).toBeLessThan(panelBounds.left)
  expect(Math.abs(labelBounds.right + parseFloat(leader.width) - panelBounds.left)).toBeLessThanOrEqual(1.5)
  expect(leader.borderTopStyle).toBe('solid')
  expect(page.getByRole('menu', {name: 'Selection mode'}).query()).toBeNull()
  rerender(scene(filmTiming.modeOpen))
  const menu = page.getByRole('menu', {name: 'Selection mode'})
  await expect.element(menu).toBeVisible()
  await userEvent.click(menu.getByText('multiple', {exact: true}))
  expect(page.getByRole('listbox', {name: 'Available agents'}).element()).toHaveAttribute(
    'aria-multiselectable',
    'true',
  )
  expect(button.element()).toHaveTextContent('multiple')
  expect(button.element().getBoundingClientRect().left).toBeCloseTo(control.left, 1)
  expect(page.getByRole('option', {name: 'Architect', exact: true}).element()).toHaveAttribute('aria-selected', 'true')
  rerender(scene(filmTiming.multiple - 1))
  expect(button.element()).toHaveTextContent('single')
  rerender(scene(filmTiming.multiple))
  expect(button.element()).toHaveTextContent('multiple')
  expect(menu.query()).toBeNull()
})

it('keeps the picker fully opaque throughout every feature-block drag', () => {
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.build))
  const picker = page.getByRole('dialog', {name: 'Assign agents'})
  for (const request of filmRequests.filter(message => message.time < filmTiming.mobile)) {
    for (const offset of [0, 400, 720, 900, 1_080, 1_200, 2_400]) {
      rerender(scene(request.time + offset))
      expect(getComputedStyle(picker.element()).opacity).toBe('1')
    }
  }
})

it('builds agent assignment at the scripted cues and filters the real grouped list', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(filmTiming.build))
  const list = page.getByRole('listbox', {name: 'Available agents'})
  expect(list.element()).not.toHaveAttribute('aria-multiselectable', 'true')
  expect(page.getByRole('combobox').query()).toBeNull()
  expect(page.getByText('Plan', {exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.groups - 1))
  expect(page.getByText('Plan', {exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.groups))
  expect(page.getByText('Plan', {exact: true}).element()).toBeInTheDocument()
  rerender(scene(filmTiming.search - 1))
  expect(page.getByRole('combobox').query()).toBeNull()
  rerender(scene(filmTiming.search))
  expect(page.getByRole('combobox', {name: 'Search agents'}).element()).toBeInTheDocument()
  rerender(scene(filmTiming.multiple))
  expect(list.element()).toHaveAttribute('aria-multiselectable', 'true')
  expect(page.getByRole('option', {name: 'Architect', exact: true}).element()).toHaveAttribute('aria-selected', 'true')
  expect(page.getByRole('option', {name: 'Developer', exact: true}).element()).toHaveAttribute('aria-selected', 'false')
  expect(page.getByRole('option', {name: 'Accessibility Reviewer', exact: true}).element()).toHaveAttribute(
    'aria-selected',
    'false',
  )
  for (const [name, time] of [
    ['Developer', filmTiming.developerSelect],
    ['Accessibility Reviewer', filmTiming.reviewerSelect],
  ] as const) {
    rerender(scene(time - 1))
    expect(page.getByRole('option', {name, exact: true}).element()).toHaveAttribute('aria-selected', 'false')
    rerender(scene(time))
    expect(page.getByRole('option', {name, exact: true}).element()).toHaveAttribute('aria-selected', 'true')
  }
  expect(page.getByRole('button', {name: 'Apply', exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.footer + 900))
  expect(page.getByRole('button', {name: 'Apply', exact: true}).element()).toBeInTheDocument()
  const count = page.getByText('3 agents selected', {exact: true}).element()
  expect(getComputedStyle(count).fontSize).toBe('14px')
  expect(getComputedStyle(count).fontWeight).toBe('400')
  rerender(scene(filmTiming.statuses - 1))
  expect(page.getByRole('img', {name: 'working', exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.statuses))
  const architect = page.getByRole('option', {name: 'Architect done', exact: true})
  expect(architect.element()).not.toHaveAttribute('aria-keyshortcuts')
  expect(architect.element()).toHaveAttribute('aria-selected', 'true')
  for (const [name, status] of [
    ['Architect', 'done'],
    ['Developer', 'working'],
    ['Accessibility Reviewer', 'queued'],
  ]) {
    const option = page.getByRole('option', {name: `${name} ${status}`, exact: true})
    expect(option.getByRole('img', {name: status, exact: true}).element()).toBeInTheDocument()
  }
  for (const name of ['Project manager', 'Designer']) {
    const option = page.getByRole('option', {name, exact: true})
    expect(option.element()).not.toHaveAttribute('aria-selected', 'true')
    expect(option.element().querySelector(`.${classes.Status}`)).toBeNull()
  }
  expect(page.getByRole('complementary', {name: 'Agent details'}).query()).toBeNull()
  rerender(scene(filmTiming.statuses + 1_500))
  expect(page.getByRole('complementary', {name: 'Agent details'}).query()).toBeNull()
  rerender(scene(filmTiming.statuses - 1))
  expect(page.getByRole('img', {name: 'working', exact: true}).query()).toBeNull()
  rerender(scene(filmTiming.statuses))
  await page.getByRole('combobox', {name: 'Search agents'}).fill('inclusive')
  await expect.element(page.getByRole('option', {name: 'Accessibility Reviewer queued', exact: true})).toBeVisible()
  expect(page.getByRole('option', {name: 'Architect done', exact: true}).query()).toBeNull()
  expect(page.getByText('Plan', {exact: true}).query()).toBeNull()
})

it('preloads the closed mobile issue and opens its picker without taking focus from film controls', async () => {
  await page.viewport(375, 680)
  const scene = (time: number | null) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <button type="button">Film controls</button>
        {time !== null ? <FilmAgentPicker time={time} mobile /> : null}
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(null))
  const controls = page.getByRole('button', {name: 'Film controls', exact: true})
  await userEvent.click(controls)
  rerender(scene(filmTiming.mobileReveal))
  expect(page.getByRole('dialog', {name: 'Assign agents'}).query()).toBeNull()
  expect(page.getByRole('button', {name: 'Assign agents', exact: true}).element()).toHaveAttribute(
    'aria-expanded',
    'false',
  )
  expect(controls.element()).toHaveFocus()
  rerender(scene(filmTiming.mobileOpen + 500))
  await expect.element(page.getByRole('dialog', {name: 'Assign agents'})).toBeVisible()
  expect(controls.element()).toHaveFocus()
})

it('shows a mobile tap on the closed issue before sliding the real bottom sheet upward', async () => {
  await page.viewport(375, 680)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <FilmAgentPicker time={time} mobile />
      </BaseStyles>
    </ThemeProvider>
  )
  const {container, rerender} = render(scene(filmTiming.mobileTap - 1))
  const issue = page.getByRole('heading', {name: /Breadcrumbs:/}).element()
  const trigger = page.getByRole('button', {name: 'Assign agents', exact: true})
  const dialog = page.getByRole('dialog', {name: 'Assign agents'})
  const tap = container.querySelector<HTMLElement>(`.${classes.TapIndicator}`)!
  expect(trigger.element()).toHaveAttribute('aria-expanded', 'false')
  expect(dialog.query()).toBeNull()
  expect(tap).not.toBeVisible()
  rerender(scene(filmTiming.mobileTap + 100))
  expect(tap).toBeVisible()
  expect(Number(getComputedStyle(tap).opacity)).toBeGreaterThan(0)
  expect(dialog.query()).toBeNull()
  expect(document.querySelector('[data-film-pointer]')).toBeNull()
  rerender(scene(filmTiming.mobileOpen))
  await expect.element(dialog).toHaveAttribute('data-variant', 'bottom-sheet')
  expect(dialog.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(680)
  expect(trigger.element()).toHaveAttribute('aria-expanded', 'true')
  rerender(scene(filmTiming.mobileOpen + 250))
  const movingTop = dialog.element().getBoundingClientRect().top
  expect(movingTop).toBeLessThan(680)
  rerender(scene(filmTiming.mobileOpen + 500))
  const bounds = dialog.element().getBoundingClientRect()
  expect(bounds.top).toBeLessThan(movingTop)
  expect(bounds.top).toBeGreaterThan(0)
  expect(bounds.bottom).toBeCloseTo(680, 0)
  expect(bounds.width).toBeCloseTo(375, 0)
  expect(page.getByRole('button', {name: 'Apply', exact: true}).element()).toBeVisible()
  expect(page.getByRole('heading', {name: /Breadcrumbs:/}).element()).toBe(issue)
  rerender(scene(filmTiming.mobileTap - 1))
  expect(dialog.query()).toBeNull()
  expect(trigger.element()).toHaveAttribute('aria-expanded', 'false')
  expect(tap).not.toBeVisible()
})

it('synchronizes a late-loading phone to the latest film time when its surface is ready', () => {
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {container, rerender} = render(scene(filmTiming.mobileOpen + 500))
  const phone = container.querySelector<HTMLIFrameElement>('iframe[title="Agent assignment on a phone"]')!
  const postMessage = vi.spyOn(phone.contentWindow!, 'postMessage')
  const ready = (source: Window | null, origin = window.location.origin) => {
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {source, origin, data: {type: 'select-panel-film-ready'}}))
    })
  }
  try {
    ready(null)
    ready(phone.contentWindow, 'https://example.com')
    expect(postMessage).not.toHaveBeenCalled()
    ready(phone.contentWindow)
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: 'select-panel-film-time', time: filmTiming.mobileOpen + 500},
      window.location.origin,
    )
    rerender(scene(filmTiming.mobileTap - 1))
    postMessage.mockClear()
    ready(phone.contentWindow)
    expect(postMessage).toHaveBeenCalledExactlyOnceWith(
      {type: 'select-panel-film-time', time: filmTiming.mobileTap - 1},
      window.location.origin,
    )
    rerender(scene(filmTiming.build))
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: 'select-panel-film-time', time: filmTiming.mobile},
      window.location.origin,
    )
    postMessage.mockClear()
    rerender(scene(filmTiming.build + 1_000))
    expect(postMessage).not.toHaveBeenCalled()
    ready(phone.contentWindow)
    expect(postMessage).toHaveBeenCalledExactlyOnceWith(
      {type: 'select-panel-film-time', time: filmTiming.mobile},
      window.location.origin,
    )
    rerender(scene(filmTiming.teamReturn + 1_000))
    expect(postMessage).toHaveBeenLastCalledWith(
      {type: 'select-panel-film-time', time: filmTiming.teamReturn},
      window.location.origin,
    )
    postMessage.mockClear()
    rerender(scene(filmTiming.platform + 1_000))
    expect(postMessage).not.toHaveBeenCalled()
  } finally {
    postMessage.mockRestore()
  }
})

it('slides the phone over the unchanged desktop only after the mobile notification and reading pause', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmSequence time={time} />
      </BaseStyles>
    </ThemeProvider>
  )
  const {container, rerender} = render(scene(filmTiming.mobile - 1))
  const heading = page.getByRole('heading', {name: 'Agents', exact: true}).element()
  const picker = page.getByRole('dialog', {name: 'Assign agents'}).element()
  const bounds = picker.getBoundingClientRect()
  const phone = container.querySelector<HTMLElement>(`.${classes.Phone}`)!
  const notification = page.getByText('Oh, and it should be responsive for mobile', {exact: true})
  for (const time of [filmTiming.mobile, filmTiming.mobile + filmRequestTiming.delivery - 1]) {
    rerender(scene(time))
    expect(notification.query()).toBeNull()
    expect(phone).toHaveAttribute('data-active', 'false')
  }
  const delivered = filmTiming.mobile + filmRequestTiming.delivery + filmRequestTiming.entrance
  for (const time of [delivered, delivered + filmRequestTiming.readingPause - 1]) {
    rerender(scene(time))
    await expect.element(notification).toBeVisible()
    expect(phone).toHaveAttribute('data-active', 'false')
  }
  for (const offset of [0, 450, 900]) {
    rerender(scene(delivered + filmRequestTiming.readingPause + offset))
    expect(phone).toHaveAttribute('data-active', 'true')
    expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBe(heading)
    expect(page.getByRole('dialog', {name: 'Assign agents'}).element()).toBe(picker)
    expect(picker.getBoundingClientRect().toJSON()).toEqual(bounds.toJSON())
    const top = phone.getBoundingClientRect().top
    if (offset === 0) expect(top).toBeGreaterThanOrEqual(810)
    else if (offset === 900) expect(top).toBeCloseTo(32, 0)
    else {
      expect(top).toBeGreaterThan(32)
      expect(top).toBeLessThan(810)
      expect(phone.contains(document.elementFromPoint(800, top + 100))).toBe(true)
    }
  }
  rerender(scene(filmTiming.mobileReveal - 1))
  expect(phone).toHaveAttribute('data-active', 'false')
  expect(page.getByRole('dialog', {name: 'Assign agents'}).element()).toBe(picker)
  rerender(scene(filmTiming.teamReturn - 1))
  expect(phone).toHaveAttribute('data-active', 'true')
  rerender(scene(filmTiming.teamReturn))
  expect(phone).toHaveAttribute('data-exiting', 'true')
  const chat = page.getByRole('complementary', {name: 'Team conversation'})
  expect(chat.element()).toHaveAttribute('data-returning', 'true')
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
  rerender(scene(filmTiming.teamReturn + 300))
  expect(phone.getBoundingClientRect().top).toBeGreaterThan(32)
  rerender(scene(filmTiming.teamReturn + 600))
  expect(phone).toHaveAttribute('data-active', 'false')
  expect(page.getByRole('heading', {name: 'Agents', exact: true}).element()).toBe(heading)
  expect(page.getByRole('dialog', {name: 'Assign agents'}).element()).toBe(picker)
  expect(chat.element().getBoundingClientRect().width).toBeCloseTo(1080, 0)
  expect(chat.element().contains(document.elementFromPoint(750, 300))).toBe(true)
  rerender(scene(filmTiming.platform - 300))
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
  rerender(scene(filmTiming.platform))
  expect(chat.query()).toBeNull()
  rerender(scene(filmTiming.teamReturn + 600))
  expect(chat.element()).toHaveAttribute('data-minimizing', 'false')
})

it('draws anatomy callouts before splitting the original picker DOM into cards', async () => {
  await page.viewport(1440, 810)
  const scene = (time: number) => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <SelectPanelFilmIssue time={time} />
        <div data-film-backdrop>Next scene stays visible</div>
      </BaseStyles>
    </ThemeProvider>
  )
  const {rerender} = render(scene(0))
  const trigger = page.getByRole('button', {name: 'Labels', exact: true})
  expect(trigger.element()).toHaveAttribute('aria-expanded', 'false')
  expect(page.getByRole('dialog').query()).toBeNull()
  rerender(scene(1_199))
  expect(page.getByRole('dialog').query()).toBeNull()
  rerender(scene(1_200))
  const panel = page.getByRole('dialog', {name: 'Choose labels'}).element()
  for (const animation of panel.getAnimations()) animation.cancel()
  const search = page.getByRole('combobox').element()
  const before = search.getBoundingClientRect()
  const font = getComputedStyle(search).font
  const firstOption = page.getByRole('option', {name: 'Bug', exact: true}).element()
  const enhancement = page.getByRole('option', {name: 'Enhancement', exact: true}).element()
  const description = enhancement.querySelector<HTMLElement>('[data-component="ActionList.Description"]')!
  const title = page.getByRole('heading', {name: 'Choose labels'}).element()
  const footerButtons = ['Clear selection', 'Cancel', 'Save'].map(name =>
    page.getByRole('button', {name, exact: true}).element(),
  )
  const triggerElement = trigger.element()
  if (!(panel instanceof HTMLElement) || !(triggerElement instanceof HTMLElement)) {
    throw new Error('The film needs HTML picker and trigger nodes.')
  }
  const film = animateSelectPanel(panel, triggerElement)

  try {
    film.seek(0)
    expect(search.getBoundingClientRect().width).toBe(before.width)
    expect(getComputedStyle(search).font).toBe(font)
    const componentHighlight = panel.ownerDocument.querySelector<SVGGElement>('[data-film-component-highlight]')!
    expect(componentHighlight).not.toBeVisible()
    film.seek(filmTiming.panelHighlight + 350)
    expect(componentHighlight).toBeVisible()
    expect(componentHighlight.querySelector('text')).toHaveTextContent('SelectPanel')
    expect(getComputedStyle(componentHighlight.querySelector('g')!).opacity).toBe('1')
    const componentBox = componentHighlight.querySelector('rect')!
    const panelBounds = panel.getBoundingClientRect()
    const highlightBounds = componentBox.getBoundingClientRect()
    const componentLabel = componentHighlight.querySelector('text')!
    expect(componentLabel.getBoundingClientRect().right).toBeLessThan(panelBounds.left)
    expect(componentLabel.getBoundingClientRect().left).toBeGreaterThanOrEqual(0)
    const labelBounds = componentLabel.getBoundingClientRect()
    expect(Math.abs(labelBounds.y + labelBounds.height / 2 - (panelBounds.y + panelBounds.height / 2))).toBeLessThan(8)
    for (const dimension of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(highlightBounds[dimension] - panelBounds[dimension])).toBeLessThan(2)
    }
    expect(getComputedStyle(componentBox).stroke).toBe('rgb(9, 105, 218)')
    expect(filmTiming.anatomy - (filmTiming.panelHighlight + 350)).toBeGreaterThanOrEqual(1_100)
    const labelSlices = componentHighlight.querySelector<SVGGElement>('[data-film-label-slices]')!
    const slices = Array.from(labelSlices.querySelectorAll<SVGGElement>('[data-film-label-slice]'))
    expect(labelSlices).not.toBeVisible()
    film.seek(filmTiming.panelLabelCut - 1)
    expect(componentLabel).toBeVisible()
    expect(labelSlices).not.toBeVisible()
    const knives = Array.from(labelSlices.querySelectorAll<SVGGElement>('[data-film-label-knife]'))
    expect(knives).toHaveLength(2)
    film.seek(filmTiming.panelLabelCut + 125)
    expect(getComputedStyle(knives[0]).opacity).toBe('1')
    expect(getComputedStyle(knives[1]).opacity).toBe('0')
    expect(slices.every(slice => getComputedStyle(slice).transform === 'matrix(1, 0, 0, 1, 0, 0)')).toBe(true)
    film.seek(filmTiming.panelLabelCut + 210)
    expect(parseFloat(getComputedStyle(knives[0]).opacity)).toBeGreaterThan(0)
    expect(getComputedStyle(knives[1]).opacity).toBe('0')
    film.seek(filmTiming.panelLabelCut + 375)
    expect(parseFloat(getComputedStyle(knives[0]).opacity)).toBeCloseTo(0)
    expect(getComputedStyle(knives[1]).opacity).toBe('1')
    expect(getComputedStyle(slices[0]).transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)')
    expect(getComputedStyle(slices[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
    film.seek(filmTiming.panelLabelCut + 600)
    expect(componentLabel).not.toBeVisible()
    expect(labelSlices).toBeVisible()
    expect(slices).toHaveLength(3)
    const sliceTransforms = slices.map(slice => getComputedStyle(slice).transform)
    expect(new Set(sliceTransforms).size).toBe(3)
    for (const slice of slices) {
      expect(getComputedStyle(slice).transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)')
      const clipping = slice.querySelector('[clip-path]')!
      const clipId = clipping.getAttribute('clip-path')!.slice(5, -1)
      expect(panel.ownerDocument.getElementById(clipId)?.localName).toBe('clipPath')
    }
    film.seek(filmTiming.panelLabelCut - 1)
    expect(componentLabel).toBeVisible()
    expect(labelSlices).not.toBeVisible()
    film.seek(filmTiming.panelLabelCut + 600)
    expect(slices.map(slice => getComputedStyle(slice).transform)).toEqual(sliceTransforms)
    expect(filmTiming.anatomy - (filmTiming.panelLabelCut + 575)).toBeGreaterThanOrEqual(200)
    film.seek(filmTiming.anatomy - 1)
    expect(labelSlices).toBeVisible()
    expect(slices.map(slice => getComputedStyle(slice).transform)).toEqual(sliceTransforms)
    for (const knife of knives) expect(parseFloat(getComputedStyle(knife).opacity)).toBeCloseTo(0)
    const anatomy = panel.ownerDocument.querySelector<SVGSVGElement>('[data-film-anatomy]')!
    const outlines = [...anatomy.querySelectorAll<SVGRectElement>('[data-film-outline]')]
    const annotations = [...anatomy.querySelectorAll<SVGGElement>('[data-film-anatomy-label]')]
    expect(outlines).toHaveLength(12)
    expect(annotations).toHaveLength(12)
    expect(parseFloat(getComputedStyle(componentLabel).fontSize)).toBeGreaterThanOrEqual(
      parseFloat(getComputedStyle(annotations[0].querySelector('text')!).fontSize) * 3,
    )
    for (const outline of outlines) expect(getComputedStyle(outline).strokeDashoffset).toBe('1px')
    for (const annotation of annotations) expect(getComputedStyle(annotation).opacity).toBe('0')
    film.seek(filmTiming.anatomy + 175)
    expect(componentHighlight).not.toBeVisible()
    expect(parseFloat(getComputedStyle(outlines[0]).strokeDashoffset)).toBeCloseTo(0.5)
    for (const annotation of annotations) expect(getComputedStyle(annotation).opacity).toBe('0')
    film.seek(filmTiming.anatomy + 600)
    expect(getComputedStyle(annotations[0]).opacity).toBe('1')
    expect(getComputedStyle(annotations[10]).opacity).toBe('0')
    film.seek(3_200)
    expect(panel).toContainElement(title)
    film.seek(filmTiming.split - 1)
    expect(panel).toContainElement(title)
    expect(anatomy).toBeVisible()
    for (const outline of outlines) {
      expect(getComputedStyle(outline).strokeDashoffset).toBe('0px')
      const part = panel.ownerDocument.querySelector<HTMLElement>(
        `[data-film-part='${outline.getAttribute('data-film-outline')}']`,
      )!
      const box = outline.getBoundingClientRect()
      const original = (
        outline.getAttribute('data-film-outline') === 'ActionList' ? page.getByRole('listbox').element() : part
      ).getBoundingClientRect()
      expect(Math.abs(box.x - original.x)).toBeLessThan(2)
      expect(Math.abs(box.y - original.y)).toBeLessThan(2)
      expect(Math.abs(box.width - original.width)).toBeLessThan(2)
      expect(Math.abs(box.height - original.height)).toBeLessThan(2)
    }
    for (const annotation of annotations) {
      expect(getComputedStyle(annotation).opacity).toBe('1')
      const box = annotation.getBoundingClientRect()
      expect(box.left).toBeGreaterThanOrEqual(0)
      expect(box.right).toBeLessThanOrEqual(1440)
      expect(box.top).toBeGreaterThanOrEqual(0)
      expect(box.bottom).toBeLessThanOrEqual(810)
      for (const other of annotations) {
        if (other === annotation) continue
        const next = other.getBoundingClientRect()
        expect(
          box.right <= next.left || box.left >= next.right || box.bottom <= next.top || box.top >= next.bottom,
        ).toBe(true)
      }
    }
    const handoff = outlines.map((outline, index) => {
      const name = outline.getAttribute('data-film-outline')!
      const part = panel.ownerDocument.querySelector<HTMLElement>(`[data-film-part='${name}']`)!
      return {
        name,
        bounds: (name === 'ActionList' ? page.getByRole('listbox').element() : part).getBoundingClientRect(),
        labelBounds: annotations[index].getBoundingClientRect(),
        color: getComputedStyle(outline).stroke,
        labelColor: getComputedStyle(annotations[index].querySelector('text')!).fill,
        labelBackground: getComputedStyle(annotations[index].querySelector('rect')!).fill,
        labelBorder: getComputedStyle(annotations[index].querySelector('rect')!).stroke,
      }
    })
    const bugText = page.getByText('Bug', {exact: true}).element()
    const bugTextBounds = bugText.getBoundingClientRect()
    const design = page.getByRole('option', {name: 'Design', exact: true}).element()
    const designBounds = design.getBoundingClientRect()
    film.seek(filmTiming.split)
    expect(anatomy).not.toBeVisible()
    expect(panel).not.toContainElement(title)
    for (const {name, bounds, labelBounds, color, labelColor, labelBackground, labelBorder} of handoff) {
      const tile = panel.ownerDocument.querySelector<HTMLElement>(`[data-film-tile='${name}']`)!
      const label = tile.querySelector<HTMLElement>('[data-film-label]')!
      for (const dimension of ['x', 'y', 'width', 'height'] as const) {
        expect(Math.abs(tile.getBoundingClientRect()[dimension] - bounds[dimension])).toBeLessThan(1)
        expect(Math.abs(label.getBoundingClientRect()[dimension] - labelBounds[dimension])).toBeLessThan(1)
      }
      expect(getComputedStyle(tile).borderColor).toBe(color)
      expect(getComputedStyle(label).color).toBe(labelColor)
      expect(labelColor).toBe('rgb(255, 255, 255)')
      expect(labelBackground).toBe(color)
      expect(getComputedStyle(label).backgroundColor).toBe(labelBackground)
      expect(getComputedStyle(label).borderColor).toBe(labelBorder)
    }
    for (const [element, original] of [
      [bugText, bugTextBounds],
      [design, designBounds],
    ] as const) {
      expect(Math.abs(element.getBoundingClientRect().x - original.x)).toBeLessThan(2)
      expect(Math.abs(element.getBoundingClientRect().y - original.y)).toBeLessThan(2)
    }
    film.seek(5_000)
    expect(getComputedStyle(page.getByText('Next scene stays visible', {exact: true}).element()).opacity).toBe('1')
    expect(firstOption).toBeInTheDocument()
    expect(panel.ownerDocument.querySelectorAll('[role="option"]')).toHaveLength(5)
    const names = Array.from(panel.ownerDocument.querySelectorAll('[data-film-label]')).map(label => label.textContent)
    expect(names).toContain('ActionList.LeadingVisual')
    expect(names).toContain('ActionList.Description')
    expect(names).toContain('SelectPanel.Header')
    expect(names).toContain('SelectPanel.Footer')
    expect(names).not.toContain('SelectPanel.Overlay')
    expect(names).not.toContain('SelectPanel.Content')
    expect(names).not.toContain('SelectPanel.List / ActionList')
    const statusTile = panel.ownerDocument.querySelector<HTMLElement>('[data-film-tile="ActionList.TrailingVisual"]')!
    expect(statusTile).not.toBeVisible()
    const tiles = Array.from(panel.ownerDocument.querySelectorAll<HTMLElement>('[data-film-tile]')).filter(
      tile => tile !== statusTile,
    )
    const header = tiles.find(tile => tile.getAttribute('data-film-tile') === 'SelectPanel.Header')!
    const footer = tiles.find(tile => tile.getAttribute('data-film-tile') === 'SelectPanel.Footer')!
    const descriptionTile = tiles.find(tile => tile.getAttribute('data-film-tile') === 'ActionList.Description')!
    expect(descriptionTile).toContainElement(description)
    expect(header).toContainElement(title)
    for (const button of footerButtons) expect(footer).toContainElement(button)
    const selection = tiles.find(tile => tile.getAttribute('data-film-tile') === 'selectionMode="multiple"')!
    const checkbox = selection.querySelector('[data-component="ActionList.Selection"] > div')!
    expect(checkbox.getBoundingClientRect().width).toBeGreaterThanOrEqual(16)
    expect(checkbox.getBoundingClientRect().height).toBeGreaterThanOrEqual(16)
    const columns = new Set(tiles.map(tile => Math.round(tile.getBoundingClientRect().left)))
    expect(columns.size).toBe(3)
    for (const tile of tiles) {
      const bounds = tile.getBoundingClientRect()
      const label = tile.querySelector<HTMLElement>('[data-film-label]')!
      expect(label.getBoundingClientRect().bottom).toBeLessThan(bounds.top)
      expect(getComputedStyle(tile).borderColor).toBe(getComputedStyle(label).backgroundColor)
      expect(getComputedStyle(label).color).toBe('rgb(255, 255, 255)')
      expect(bounds.left).toBeGreaterThanOrEqual(0)
      expect(bounds.right).toBeLessThanOrEqual(1440)
      expect(bounds.top).toBeGreaterThanOrEqual(0)
      expect(bounds.bottom).toBeLessThanOrEqual(810)
      const part = tile.querySelector<HTMLElement>('[data-film-part]')!
      const partBounds = part.getBoundingClientRect()
      expect(partBounds.left - bounds.left).toBeGreaterThanOrEqual(16)
      expect(bounds.right - partBounds.right).toBeGreaterThanOrEqual(16)
      expect(partBounds.top - bounds.top).toBeGreaterThanOrEqual(48)
      for (const other of tiles) {
        if (other === tile) continue
        const next = other.getBoundingClientRect()
        expect(
          bounds.right <= next.left ||
            bounds.left >= next.right ||
            bounds.bottom <= next.top ||
            bounds.top >= next.bottom,
        ).toBe(true)
      }
    }

    const outlinedRadius = parseFloat(getComputedStyle(header).borderRadius)
    const appearance = () =>
      [...tiles, statusTile].map(tile => {
        const label = tile.querySelector<HTMLElement>('[data-film-label]')!
        const cardStyle = getComputedStyle(tile)
        const labelStyle = getComputedStyle(label)
        return {
          bounds: tile.getBoundingClientRect().toJSON(),
          borderColor: cardStyle.borderColor,
          borderWidth: cardStyle.borderWidth,
          borderRadius: cardStyle.borderRadius,
          boxShadow: cardStyle.boxShadow,
          opacity: cardStyle.opacity,
          overflow: cardStyle.overflow,
          labelBounds: label.getBoundingClientRect().toJSON(),
          labelFont: labelStyle.font,
          labelColor: labelStyle.color,
          labelBackground: labelStyle.backgroundColor,
          labelBorder: labelStyle.border,
          labelPadding: labelStyle.padding,
        }
      })
    film.seek(filmTiming.stacked)
    const completedStack = appearance()
    expect(statusTile).toBeVisible()
    const restingRadius = parseFloat(getComputedStyle(header).borderRadius)
    for (const time of [7_990, 8_000]) {
      film.seek(time)
      expect(appearance()).toEqual(completedStack)
    }
    const finished = [...tiles, statusTile, anatomy]
      .flatMap(element => element.getAnimations({subtree: true}))
      .filter(animation => animation.effect?.getComputedTiming().progress === 1)
      .map(animation => ({animation, time: animation.currentTime}))
    expect(finished.length).toBeGreaterThan(0)
    film.seek(8_500)
    for (const {animation, time} of finished) expect(animation.currentTime).toBe(time)
    expect(appearance()).toEqual(completedStack)
    film.seek((filmTiming.stacking + filmTiming.stacked) / 2)
    expect(parseFloat(getComputedStyle(header).borderRadius)).toBeGreaterThan(outlinedRadius)
    expect(parseFloat(getComputedStyle(header).borderRadius)).toBeLessThan(restingRadius)
    const headerLabel = header.querySelector<HTMLElement>('[data-film-label]')!
    expect(parseFloat(getComputedStyle(headerLabel).top)).toBeGreaterThan(-28)
    expect(parseFloat(getComputedStyle(headerLabel).top)).toBeLessThan(12)
    film.seek(5_000)
    expect(headerLabel.getBoundingClientRect().bottom).toBeLessThan(header.getBoundingClientRect().top)
    expect(statusTile).not.toBeVisible()
    film.seek(8_000)
    expect(appearance()).toEqual(completedStack)
    expect(
      Array.from(statusTile.querySelectorAll<HTMLElement>('[data-component="ActionList.Item.Label"]'), label =>
        Array.from(label.children)
          .filter(child => child.checkVisibility())
          .map(child => child.textContent)
          .join(''),
      ),
    ).toEqual(['Item one', 'Item two', 'Item three'])
    const previewColors = new Set(
      Array.from(statusTile.querySelectorAll('[data-state]'), status => getComputedStyle(status).color),
    )
    expect(previewColors.size).toBe(1)
    for (const tile of tiles) {
      const label = tile.querySelector<HTMLElement>('[data-film-label]')!
      expect(label.getBoundingClientRect().top).toBeGreaterThan(tile.getBoundingClientRect().top)
    }
    for (const tile of tiles) expect(tile).toBeVisible()
    film.seek(filmTiming.mobile)
    expect(tiles.find(tile => tile.getAttribute('data-film-tile') === 'SelectPanel.Header')).toBeVisible()
    film.seek(filmTiming.platform - 1)
    expect(tiles.find(tile => tile.getAttribute('data-film-tile') === 'SelectPanel.Header')).toBeVisible()
    film.seek(filmTiming.platform)
    for (const tile of tiles) expect(tile).not.toBeVisible()
    film.seek(filmTiming.draft)
    const stack = [...tiles, statusTile].sort(
      (first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top,
    )
    expect(stack.map(tile => tile.getAttribute('data-film-tile'))).toEqual([
      'SelectPanel.Trigger',
      'SelectPanel.Header',
      'SelectPanel.SearchInput / TextInput',
      'SelectPanel.Item / ActionList.Item',
      'selectionMode="multiple"',
      'SelectPanel.Footer',
      'SelectPanel.Group / ActionList.Group',
      'ActionList.GroupHeading',
      'ActionList.Item',
      'ActionList.LeadingVisual',
      'ActionList.Description',
      'ActionList',
      'ActionList.TrailingVisual',
    ])
    for (let index = 0; index < stack.length; index++) {
      const bounds = stack[index].getBoundingClientRect()
      expect(bounds.left).toBeGreaterThanOrEqual(1_000)
      expect(bounds.right).toBeLessThanOrEqual(1_440)
      expect(bounds.bottom).toBeLessThanOrEqual(810)
      expect(bounds.left).toBe(stack[0].getBoundingClientRect().left)
      expect(bounds.right).toBe(stack[0].getBoundingClientRect().right)
      if (index > 0) {
        const previous = stack[index - 1].getBoundingClientRect()
        expect(bounds.top - previous.top).toBe(index === 7 ? 44 : 32)
        expect(previous.bottom).toBeGreaterThan(bounds.top)
        expect(Number(stack[index].style.zIndex)).toBeGreaterThan(Number(stack[index - 1].style.zIndex))
      }
    }
    film.seek(filmTiming.split - 1)
    expect(anatomy).toBeVisible()
    expect(panel).toContainElement(title)
    expect(enhancement).toContainElement(description)
    film.seek(0)
    expect(getComputedStyle(annotations[0]).opacity).toBe('0')
    expect(panel).toContainElement(title)
    for (const button of footerButtons) expect(panel).toContainElement(button)
    expect(panel).toContainElement(firstOption)
    expect(enhancement).toContainElement(description)
    expect(search.getBoundingClientRect().width).toBe(before.width)
  } finally {
    film.dispose()
  }
  expect(panel.ownerDocument.querySelector('[data-film-label]')).toBeNull()
  expect(panel.ownerDocument.querySelector('[data-film-tile]')).toBeNull()
  expect(panel.ownerDocument.querySelector('[data-film-anatomy]')).toBeNull()
  rerender(scene(0))
  await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  expect(trigger.element()).toHaveAttribute('aria-expanded', 'false')
  rerender(scene(1_200))
  await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
})
