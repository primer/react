import {useId, useRef, useState, type ComponentProps, type RefObject} from 'react'
import {ChevronDownIcon, InfoIcon, RepoIcon, SearchIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import {ActionList} from '../../ActionList'
import BaseStyles from '../../BaseStyles'
import {Button} from '../../Button'
import {Dialog} from '../../Dialog/Dialog'
import {useOnOutsideClick} from '../../hooks/useOnOutsideClick'
import Text from '../../Text'
import {ThemeProvider} from '../../ThemeProvider'
import {SelectPanel, type SelectPanelValue} from '../index'
import {getAppearance} from './appearance'
import {repositories, type PlaygroundConfig} from './model'
import classes from './SelectPanelDemo.module.css'
import {AnatomyInspector, type AnatomyMarker} from './AnatomyInspector'

export interface SelectPanelDemoProps {
  config: PlaygroundConfig
  resetKey: number
}

type Repository = (typeof repositories)[number]

function RepositoryOption({
  repository,
  config,
  mark,
  searchRef,
}: {
  repository: Repository
  config: PlaygroundConfig
  mark: AnatomyMarker
  searchRef: RefObject<HTMLInputElement>
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  return (
    <>
      <SelectPanel.Item
        {...mark('Item')}
        ref={itemRef}
        value={repository.id}
        className={classes.Option}
        secondaryActions={
          config.actions && repository.id === repositories[0].id
            ? [
                {
                  label: `Details for ${repository.name}`,
                  icon: (iconProps: ComponentProps<typeof InfoIcon>) => (
                    <InfoIcon {...iconProps} {...mark('Item.secondaryActions')} />
                  ),
                  onClick: () => setDetailsOpen(true),
                },
              ]
            : undefined
        }
      >
        {repository.name}
        {config.descriptions ? (
          // eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item forwards slots to ActionList.Item.
          <ActionList.Description variant="block">
            <span {...mark('Item.description')}>{repository.description}</span>
          </ActionList.Description>
        ) : null}
        {!config.actions ? (
          // eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item forwards slots to ActionList.Item.
          <ActionList.TrailingVisual {...mark('Item.trailingVisual')}>
            <span className={classes.Metadata}>{repository.language}</span>
          </ActionList.TrailingVisual>
        ) : null}
      </SelectPanel.Item>
      {detailsOpen ? (
        <RepositoryDetails
          repository={repository}
          itemRef={config.search ? searchRef : itemRef}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </>
  )
}

function RepositoryDetails({
  repository,
  itemRef,
  onClose,
}: {
  repository: Repository
  itemRef: RefObject<HTMLElement>
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  // Register this portaled dialog above the parent picker's outside-click handler.
  useOnOutsideClick({
    containerRef: dialogRef,
    onClickOutside: event => {
      event.preventDefault()
      onClose()
    },
  })
  return (
    <Dialog
      ref={dialogRef}
      title={repository.name}
      width="large"
      position={{regular: 'center', narrow: 'bottom'}}
      onClose={onClose}
      returnFocusRef={itemRef}
      initialFocusRef={backRef}
    >
      <p>{repository.description}</p>
      <p>Primary language: {repository.language}</p>
      <p>Inspecting this repository does not select it.</p>
      <Dialog.Footer>
        <Button ref={backRef} size="small" onClick={onClose}>
          Back to repositories
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export function SelectPanelDemo({config, resetKey}: SelectPanelDemoProps) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <RepositoryPicker key={resetKey} config={config} />
      </BaseStyles>
    </ThemeProvider>
  )
}

function RepositoryPicker({config}: {config: PlaygroundConfig}) {
  const searchRef = useRef<HTMLInputElement>(null)
  const anatomyId = useId()
  const mark: AnatomyMarker = part => ({'data-select-panel-part': part, 'data-select-panel-owner': anatomyId})
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SelectPanelValue[]>([repositories[0].id])
  const [committed, setCommitted] = useState<SelectPanelValue[]>([repositories[0].id])
  const [query, setQuery] = useState('')
  const isPrimer = config.appearance === 0
  const skin = getAppearance(config.appearance)
  const skinClass = skin.className && classes[skin.className]
  const style = isPrimer ? undefined : skin.style
  const needsSave = config.commitMode === 'submit'
  const inline = config.presentation === 'inline'
  const showHeader =
    isPrimer || config.descriptions || config.grouped || needsSave || config.actions || config.presentation === 'modal'
  const results = repositories.filter(repository =>
    `${repository.name} ${repository.language}`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const summary = committed.length === 1 ? committed[0] : `${committed.length} repositories`

  function option(repository: Repository) {
    return (
      <RepositoryOption key={repository.id} repository={repository} config={config} mark={mark} searchRef={searchRef} />
    )
  }

  const content = (
    <SelectPanel.Content
      {...mark('Content')}
      className={clsx(classes.Panel, isPrimer && inline && classes.InlinePanel)}
    >
      <SelectPanel.Header {...mark('Header')} className={classes.Header} data-compact={!showHeader}>
        <div className={showHeader ? undefined : classes.VisuallyHidden}>
          <SelectPanel.Title {...mark('Title')} className={classes.Title}>
            Choose repositories
          </SelectPanel.Title>
          {config.descriptions ? (
            <SelectPanel.Description {...mark('Description')} className={classes.Description}>
              Choose the code you want to work with.
            </SelectPanel.Description>
          ) : null}
        </div>
        {!inline && !needsSave ? (
          <SelectPanel.CloseButton
            {...mark('CloseButton')}
            className={config.presentation === 'modal' ? undefined : classes.ResponsiveClose}
          />
        ) : null}
      </SelectPanel.Header>
      {config.search ? (
        <SelectPanel.SearchInput
          ref={searchRef}
          {...mark('SearchInput')}
          className={classes.Search}
          placeholder="Search repositories..."
          leadingVisual={isPrimer ? <SearchIcon {...mark('SearchInput.leadingVisual')} /> : null}
          aria-label="Search repositories"
        />
      ) : null}
      {config.previewState === 'loading' ? (
        <SelectPanel.Loading {...mark('Loading')} className={classes.Status}>
          Loading repositories
        </SelectPanel.Loading>
      ) : config.previewState === 'error' ? (
        <SelectPanel.Message
          {...mark('Message')}
          className={classes.Status}
          variant="error"
          title="Repositories could not be loaded"
        >
          This is a simulated error. Choose Ready in the preview controls to try again.
        </SelectPanel.Message>
      ) : config.previewState === 'empty' || results.length === 0 ? (
        <SelectPanel.Message
          {...mark('Message')}
          className={classes.Status}
          variant="empty"
          title="No repositories found"
        >
          {config.previewState === 'empty' ? 'This is a simulated empty result.' : 'Try another name or language.'}
        </SelectPanel.Message>
      ) : (
        <SelectPanel.List
          {...mark('List')}
          className={classes.List}
          aria-label="Repositories"
          data-secondary-actions={config.actions || undefined}
        >
          {config.grouped
            ? ['Applications', 'Infrastructure'].map(group => {
                const members = results.filter(repository => repository.group === group)
                return members.length > 0 ? (
                  <SelectPanel.Group {...mark('Group')} key={group} label={group}>
                    {members.map(option)}
                  </SelectPanel.Group>
                ) : null
              })
            : results.map(option)}
        </SelectPanel.List>
      )}
      {needsSave ? (
        <SelectPanel.Footer {...mark('Footer')} className={classes.Footer}>
          <Text size="small" className={classes.SelectionCount}>
            {selected.length} selected
          </Text>
          <div className={classes.FooterActions}>
            <SelectPanel.CancelButton {...mark('CancelButton')} className={classes.Action} size="small">
              Cancel
            </SelectPanel.CancelButton>
            <SelectPanel.SubmitButton
              {...mark('SubmitButton')}
              className={classes.Action}
              size="small"
              variant="primary"
            >
              Save
            </SelectPanel.SubmitButton>
          </div>
        </SelectPanel.Footer>
      ) : null}
    </SelectPanel.Content>
  )

  return (
    <div className={clsx(classes.Stage, !isPrimer && classes.Theme, skinClass)} style={style}>
      <div className={classes.RepositoryContext}>
        <RepoIcon /> <span>acme / workspace</span>
      </div>
      <SelectPanel.Root
        open={open}
        onOpenChange={nextOpen => {
          if (nextOpen && needsSave) setSelected([...committed])
          setOpen(nextOpen)
        }}
        selectionMode={config.multiple ? 'multiple' : 'single'}
        closeOnSelect={!config.multiple && !needsSave && !inline}
        selected={selected}
        onSelectedChange={values => {
          setSelected(values)
          if (!needsSave) setCommitted(values)
        }}
        filterValue={query}
        onFilterChange={setQuery}
        onSubmit={values => setCommitted([...values])}
        onCancel={() => setSelected([...committed])}
        onDismiss={() => {
          if (needsSave) setSelected([...committed])
        }}
      >
        {inline ? (
          content
        ) : (
          <>
            <SelectPanel.Trigger
              {...mark('Trigger')}
              className={classes.Trigger}
              trailingAction={(iconProps: ComponentProps<typeof ChevronDownIcon>) => (
                <ChevronDownIcon {...iconProps} {...mark('Trigger.trailingAction')} />
              )}
            >
              {committed.length === 0 ? 'Choose repositories' : summary}
            </SelectPanel.Trigger>
            <SelectPanel.Overlay
              width="medium"
              variant={{
                regular: config.presentation === 'modal' ? 'modal' : 'anchored',
                narrow: config.presentation === 'modal' ? 'bottom-sheet' : 'fullscreen',
              }}
              overlayProps={{
                ...mark('Overlay'),
                className: isPrimer ? undefined : clsx(classes.Theme, classes.Overlay, skinClass),
                style,
              }}
            >
              {content}
            </SelectPanel.Overlay>
          </>
        )}
      </SelectPanel.Root>
      <div className={classes.Committed} aria-live="polite">
        <strong>Saved selection</strong>
        <p>{committed.length > 0 ? committed.join(', ') : 'No repositories selected'}</p>
        <small>{needsSave ? 'Draft changes only apply when you save.' : 'Selection is applied immediately.'}</small>
      </div>
      <AnatomyInspector
        enabled={config.anatomy}
        owner={anatomyId}
        variant={config.appearance === 3 ? 'clippy' : 'default'}
      />
    </div>
  )
}
