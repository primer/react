import {useCallback, useId, useRef, useState, type ComponentProps, type CSSProperties, type RefCallback} from 'react'
import {clsx} from 'clsx'
import {
  CheckIcon,
  CommentDiscussionIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  InfoIcon,
  GearIcon,
  ListUnorderedIcon,
  SearchIcon,
  XIcon,
} from '@primer/octicons-react'
import {ActionList} from '../../ActionList'
import {Button, IconButton} from '../../Button'
import {Dialog} from '../../Dialog/Dialog'
import Avatar from '../../Avatar'
import Heading from '../../Heading'
import Label from '../../Label'
import Text from '../../Text'
import {SegmentedControl} from '../../SegmentedControl'
import {useMedia} from '../../hooks/useMedia'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {SelectPanel} from '../index'
import {appearanceStops, getAppearance} from './appearance'
import {
  getShowcaseFrame,
  showcasePlatformFeatures,
  showcaseReviewers,
  showcaseAppearanceOrder,
  SHOWCASE_THEME_DURATION,
  SHOWCASE_THEME_PLAYBACK_DURATION,
  SHOWCASE_THEME_FADE_DURATION,
  type ShowcaseConfig,
  type ShowcaseFrame,
} from './showcase'
import skins from './SelectPanelDemo.module.css'
import classes from './SelectPanelShowcase.module.css'
import {AnatomyInspector, type AnatomyMarker} from './AnatomyInspector'

export function ShowcaseSurface({elapsedMs, playing = false}: ShowcaseConfig) {
  const anatomyId = useId()
  const mark: AnatomyMarker = part => ({'data-select-panel-part': part, 'data-select-panel-owner': anatomyId})
  const frame = getShowcaseFrame(elapsedMs)
  const customizationIntro = frame.scene.id === 'customize-intro'
  const skin = getAppearance(frame.config.appearance)
  const themeBackdrop = useRef<HTMLDivElement>(null)
  const [themeOverlay, setThemeOverlay] = useState<HTMLDivElement | null>(null)
  const themeAnimations = useRef<Animation[]>([])
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)', false)
  const themeIndex = frame.themeTransition?.index
  const themeTime =
    ((frame.themeTransition?.elapsedMs ?? 0) * SHOWCASE_THEME_PLAYBACK_DURATION) / SHOWCASE_THEME_DURATION
  useIsomorphicLayoutEffect(() => {
    if (themeIndex === undefined) return
    // The recording clock replaces the overlay's independent entrance animation.
    for (const animation of themeOverlay?.getAnimations() ?? []) animation.cancel()
    if (reducedMotion) return
    const transition = SHOWCASE_THEME_FADE_DURATION / SHOWCASE_THEME_PLAYBACK_DURATION
    themeAnimations.current = [themeBackdrop.current, themeOverlay].flatMap(element =>
      element
        ? [
            element.animate(
              [
                {
                  opacity: 0,
                  transform: element === themeOverlay ? 'translateX(calc(50vw + 50%))' : 'none',
                  offset: 0,
                  easing: 'ease-in-out',
                },
                {opacity: 1, transform: 'none', offset: transition},
                {opacity: 1, transform: 'none', offset: 1 - transition, easing: 'ease-in-out'},
                {
                  opacity: 0,
                  transform: element === themeOverlay ? 'translateX(calc(-50vw - 50%))' : 'none',
                  offset: 1,
                },
              ],
              {duration: SHOWCASE_THEME_PLAYBACK_DURATION, fill: 'both'},
            ),
          ]
        : [],
    )
    return () => {
      for (const animation of themeAnimations.current) animation.cancel()
      themeAnimations.current = []
    }
  }, [themeIndex, themeOverlay, reducedMotion])

  useIsomorphicLayoutEffect(() => {
    for (const animation of themeAnimations.current) {
      animation.pause()
      // eslint-disable-next-line react-hooks/immutability -- Animation handles are mutable browser objects, not React state.
      animation.currentTime = themeTime
      if (playing && themeTime < SHOWCASE_THEME_PLAYBACK_DURATION) animation.play()
    }
  }, [themeTime, themeIndex, themeOverlay, reducedMotion, playing])
  const setPresentationOnly = useCallback((element: HTMLDivElement | null) => {
    if (element) element.inert = true
  }, [])

  return (
    <div
      ref={setPresentationOnly}
      className={clsx(
        skins.Stage,
        frame.config.appearance !== 0 && skins.Theme,
        skin.className && skins[skin.className],
        classes.Product,
      )}
      style={{
        ...(frame.config.appearance === 0 ? undefined : skin.style),
        backgroundColor: frame.themeTransition ? 'var(--bgColor-muted)' : undefined,
      }}
      data-scene={frame.scene.id}
      data-custom={frame.config.appearance !== 0}
      data-appearance={frame.config.appearance}
    >
      {frame.platformFeature ? (
        <section className={classes.Platform} aria-label="Native platform experiments">
          <div className={classes.PlatformHeading}>
            <Label variant="accent" size="large">
              Native-first, not another overlay engine
            </Label>
            <Text as="p" className={classes.Muted}>
              Composable Primer parts. Browser-native possibilities.
            </Text>
          </div>
          <div className={classes.PlatformSteps} role="group" aria-label="Native platform features">
            {showcasePlatformFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={classes.PlatformStep}
                data-active={feature.id === frame.platformFeature?.id}
                data-platform-feature={feature.id}
              >
                <Text as="span" className={classes.PlatformNumber}>
                  {index + 1}
                </Text>
                <Text weight="semibold">{feature.label}</Text>
                <Text as="span" size="small" className={classes.Muted}>
                  {feature.benefit}
                </Text>
              </div>
            ))}
          </div>
          <div
            key={frame.platformFeature.id}
            className={classes.PlatformDetail}
            data-platform-active={frame.platformFeature.id}
          >
            <Heading as="h2">{frame.platformFeature.title}</Heading>
            <pre className={classes.PlatformCode}>
              <code>{frame.platformFeature.code}</code>
            </pre>
            <Text as="p" className={classes.Muted}>
              {frame.platformFeature.description}
            </Text>
          </div>
          <Text as="p" size="small" className={classes.Muted}>
            Opt-in proofs of concept, not the current default.
            <br /> An alternative to Base UI&apos;s current JavaScript-managed Dialog/Popover defaults.
          </Text>
        </section>
      ) : customizationIntro || frame.scene.id === 'closing' ? (
        <div className={classes.Closing}>
          <Label variant="accent" size="large">
            {customizationIntro ? 'Composable SelectPanel' : 'Primer'}
          </Label>
          <Heading as="h2" className={classes.ClosingTitle}>
            {customizationIntro ? (
              <>
                Composable by design.
                <br />
                Yours to customize.
              </>
            ) : (
              <>
                More possibilities.
                <br />
                Same foundations.
              </>
            )}
          </Heading>
          <Text as="p" className={classes.Muted}>
            {customizationIntro
              ? 'More ways to shape the look and feel of SelectPanel.'
              : 'Keep the familiar path. Open up the parts.'}
          </Text>
          {!customizationIntro ? (
            <div className={classes.ClosingPoints}>
              {[
                'Existing SelectPanel API remains available',
                'Compose the parts your product needs',
                'Built on Primer, without Base UI',
              ].map(point => (
                <div key={point}>
                  <CheckIcon />
                  <Text>{point}</Text>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : frame.scene.id === 'customize' ? (
        <>
          <div ref={themeBackdrop} className={classes.ThemeBackdrop} data-showcase-theme-backdrop aria-hidden="true" />
          <header className={classes.ThemeCaption} aria-label="Theme preview">
            {/* A handler opts into controlled selection; the recording root itself is inert. */}
            <SegmentedControl
              aria-label="Showcase themes"
              size="small"
              fullWidth
              className={classes.ThemeSwitcher}
              onChange={() => undefined}
            >
              {showcaseAppearanceOrder.map(appearance => (
                <SegmentedControl.Button
                  key={appearance}
                  selected={appearance === frame.config.appearance}
                  style={{
                    color:
                      appearance === frame.config.appearance
                        ? skin.style['--playground-text']
                        : skin.style['--playground-stage-text'],
                  }}
                >
                  {appearanceStops[appearance].name}
                </SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </header>
          <ShowcasePicker key={frame.scene.id} frame={frame} mark={mark} onOverlayChange={setThemeOverlay} />
        </>
      ) : (
        <aside className={clsx(classes.Sidebar, frame.open && classes.Background)} aria-label="Pull request sidebar">
          <section className={classes.SidebarSection}>
            <Text size="small" weight="semibold" className={classes.Muted}>
              Activity
            </Text>
            {[
              {icon: GitCommitIcon, label: 'Commits', count: '1'},
              {icon: CommentDiscussionIcon, label: 'Comments', count: '3'},
              {icon: GitPullRequestIcon, label: 'PR updates', count: '2'},
            ].map(({icon: Icon, label, count}) => (
              <div key={label} className={classes.ActivityRow}>
                <Icon />
                <Text size="small">{label}</Text>
                <Label>{count}</Label>
              </div>
            ))}
            <div className={classes.ActivityRow}>
              <ListUnorderedIcon />
              <Text size="small">View all activity</Text>
            </div>
          </section>
          <ShowcasePicker key={frame.scene.id} frame={frame} mark={mark} />
          {[
            ['Assignees', 'No one—assign yourself'],
            ['Labels', 'enhancement'],
            ['Projects', 'None yet'],
            ['Milestone', 'No milestone'],
            ['Development', 'No linked issues'],
          ].map(([title, value]) => (
            <section key={title} className={classes.SidebarSection}>
              <div className={classes.SidebarHeading}>
                <Text size="small" weight="semibold" className={classes.Muted}>
                  {title}
                </Text>
                <GearIcon />
              </div>
              {title === 'Labels' ? (
                <Label variant="accent" className={classes.SidebarLabel}>
                  {value}
                </Label>
              ) : (
                <Text as="p" size="small" className={classes.Muted}>
                  {value}
                </Text>
              )}
            </section>
          ))}
        </aside>
      )}
      <AnatomyInspector enabled owner={anatomyId} scriptedPart={frame.anatomyPart} />
    </div>
  )
}

function ShowcasePicker({
  frame,
  mark,
  onOverlayChange,
}: {
  frame: ShowcaseFrame
  mark: AnatomyMarker
  onOverlayChange?: RefCallback<HTMLDivElement>
}) {
  const {config} = frame
  const centered = frame.scene.id === 'customize'
  const hideHeading = centered && (frame.config.appearance === 2 || frame.config.appearance === 4)
  const compactHeading = centered && frame.config.appearance === 1
  const hideFooter = centered && [2, 3, 5].includes(config.appearance)
  const hideSearch = centered && config.appearance === 3
  const centerAnchor = useRef<HTMLDivElement>(null)
  const reviewerAnchor = useRef<HTMLLIElement>(null)
  const reviewer = showcaseReviewers[0]
  const centeredStyle: CSSProperties | undefined = centered
    ? {position: 'fixed', top: '50%', left: '50%', translate: '-50% -50%', transform: 'none'}
    : undefined
  const isPrimer = config.appearance === 0
  const skin = getAppearance(config.appearance)
  const overlayProps = {
    ...mark('Overlay'),
    className: isPrimer ? undefined : clsx(skins.Theme, skins.Overlay, skin.className && skins[skin.className]),
    style: isPrimer ? undefined : skin.style,
  }
  const results = showcaseReviewers.filter(reviewer =>
    `${reviewer.id} ${reviewer.name}`.toLowerCase().includes(frame.query),
  )
  const item = (reviewer: (typeof showcaseReviewers)[number]) => (
    <SelectPanel.Item
      {...mark('Item')}
      key={reviewer.id}
      ref={reviewer.id === showcaseReviewers[0].id ? reviewerAnchor : undefined}
      value={reviewer.id}
      className={clsx(skins.Option, config.actions && classes.PickerRow)}
      data-highlighted={config.actions && reviewer.id === showcaseReviewers[0].id}
      secondaryActions={
        config.actions && reviewer.id === showcaseReviewers[0].id
          ? [
              {
                label: `Details for ${reviewer.name}`,
                icon: (props: ComponentProps<typeof InfoIcon>) => (
                  <InfoIcon {...props} {...mark('Item.secondaryActions')} />
                ),
                onClick: () => undefined,
              },
            ]
          : undefined
      }
    >
      {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item composes ActionList.Item. */}
      <ActionList.LeadingVisual>
        <ReviewerAvatar reviewer={reviewer} />
      </ActionList.LeadingVisual>
      {reviewer.name}
      {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item composes ActionList.Item. */}
      <ActionList.Description variant="block">{reviewer.description}</ActionList.Description>
    </SelectPanel.Item>
  )
  const title = (
    <SelectPanel.Title {...mark('Title')} className={clsx(skins.Title, hideHeading && classes.SrOnly)}>
      Request reviewers
    </SelectPanel.Title>
  )
  const content = (
    <SelectPanel.Content {...mark('Content')} className={skins.Panel}>
      {hideHeading ? (
        title
      ) : (
        <SelectPanel.Header
          {...mark('Header')}
          className={clsx(skins.Header, compactHeading && classes.CompactHeading)}
        >
          {title}
        </SelectPanel.Header>
      )}
      {!hideSearch ? (
        <SelectPanel.SearchInput
          {...mark('SearchInput')}
          className={skins.Search}
          aria-label="Search reviewers"
          placeholder="Type or choose a user"
          leadingVisual={isPrimer ? <SearchIcon {...mark('SearchInput.leadingVisual')} /> : null}
        />
      ) : null}
      <SelectPanel.List {...mark('List')} className={clsx(skins.List, classes.PickerList)} aria-label="Reviewers">
        {config.grouped
          ? ['Suggestions', 'Everyone else'].map(group => (
              <SelectPanel.Group {...mark('Group')} key={group} label={group}>
                {results.filter(reviewer => reviewer.group === group).map(item)}
              </SelectPanel.Group>
            ))
          : results.map(item)}
      </SelectPanel.List>
      {config.commitMode === 'submit' && !hideFooter ? (
        <SelectPanel.Footer {...mark('Footer')} className={skins.Footer}>
          <Text size="small" className={skins.SelectionCount}>
            {frame.selected.length} selected
          </Text>
          <div className={skins.FooterActions}>
            <SelectPanel.CancelButton {...mark('CancelButton')} className={skins.Action} size="small">
              Cancel
            </SelectPanel.CancelButton>
            <SelectPanel.SubmitButton {...mark('SubmitButton')} className={skins.Action} size="small" variant="primary">
              Save
            </SelectPanel.SubmitButton>
          </div>
        </SelectPanel.Footer>
      ) : null}
    </SelectPanel.Content>
  )

  return (
    <SelectPanel.Root
      focusStrategy="roving"
      open={frame.open}
      selected={frame.selected}
      filterValue={frame.query}
      selectionMode={config.multiple ? 'multiple' : 'single'}
    >
      <section className={centered ? undefined : classes.SidebarSection}>
        {centered ? (
          <div ref={centerAnchor} className={classes.CenterAnchor} aria-hidden="true" />
        ) : (
          <>
            <div className={classes.SidebarHeading}>
              <Text size="small" weight="semibold" className={classes.Muted}>
                Reviewers
              </Text>
              <SelectPanel.Trigger
                {...mark('Trigger')}
                render={props => (
                  <IconButton
                    {...props}
                    icon={GearIcon}
                    variant="invisible"
                    size="small"
                    notificationIndicator={undefined}
                    aria-label="Request reviewers"
                    aria-labelledby={undefined}
                  />
                )}
              />
            </div>
            <div className={classes.Reviewers}>
              {showcaseReviewers
                .filter(reviewer => frame.committed.includes(reviewer.id))
                .map(reviewer => (
                  <div key={reviewer.id} className={classes.ActivityRow}>
                    <ReviewerAvatar reviewer={reviewer} />
                    <Text size="small" weight="semibold">
                      {reviewer.name}
                    </Text>
                    <span className={classes.ReviewPending} role="img" aria-label="Review requested" />
                  </div>
                ))}
            </div>
          </>
        )}
        <SelectPanel.Overlay
          width="medium"
          cssAnchorPositioningSettings={{disable: centered}}
          anchorRef={centered ? centerAnchor : undefined}
          overlayProps={{
            ...overlayProps,
            ref: onOverlayChange,
            className: clsx(overlayProps.className, frame.detailsOpen && classes.Background),
            style: {...overlayProps.style, ...centeredStyle},
          }}
          focusTrapSettings={{disabled: true}}
        >
          {content}
        </SelectPanel.Overlay>
        {frame.detailsOpen ? (
          <Dialog
            title={reviewer.name}
            width="large"
            className={classes.ReviewerDialog}
            position={{regular: 'center', narrow: 'bottom'}}
            returnFocusRef={reviewerAnchor}
            onClose={() => undefined}
            renderHeader={({dialogLabelId, dialogDescriptionId, onClose}) => (
              <div className={classes.ReviewerProfile}>
                <div className={classes.DetailCopy}>
                  <Heading as="h2" id={dialogLabelId} className={classes.ReviewerName}>
                    {reviewer.name}
                  </Heading>
                  <Text as="p" id={dialogDescriptionId}>
                    Design systems engineer at <a href="https://github.com/github">@github</a>,{' '}
                    <a href="https://github.com/primer">@primer</a>.
                  </Text>
                </div>
                <IconButton
                  icon={XIcon}
                  aria-label="Close"
                  variant="invisible"
                  size="small"
                  className={classes.ReviewerClose}
                  onClick={() => onClose('close-button')}
                />
              </div>
            )}
          >
            <Dialog.Footer>
              <Button size="small">Back to reviewers</Button>
            </Dialog.Footer>
          </Dialog>
        ) : null}
      </section>
    </SelectPanel.Root>
  )
}

function ReviewerAvatar({reviewer}: {reviewer: (typeof showcaseReviewers)[number]}) {
  return <Avatar src={reviewer.avatarUrl} alt="" size={20} />
}
