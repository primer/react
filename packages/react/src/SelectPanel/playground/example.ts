import {getAppearance} from './appearance'
import {repositories, type PlaygroundConfig} from './model'

export function getExample(config: PlaygroundConfig): string {
  const isPrimer = config.appearance === 0
  const skin = getAppearance(config.appearance)
  const skinClass = skin.className ? `, styles.${skin.className}` : ''
  const needsSave = config.commitMode === 'submit'
  const inline = config.presentation === 'inline'
  const showHeader =
    isPrimer || config.descriptions || config.grouped || needsSave || config.actions || config.presentation === 'modal'
  const item = config.actions
    ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
      '<RepositoryOption key={repo.id} repo={repo} />'
    : // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
      `<SelectPanel.Item key={repo.id} value={repo.id} className={styles.Option}>
                {repo.name}
                ${
                  config.descriptions
                    ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
                      '<ActionList.Description variant="block">{repo.description}</ActionList.Description>'
                    : ''
                }
                <ActionList.TrailingVisual>
                  <span className={styles.Metadata}>{repo.language}</span>
                </ActionList.TrailingVisual>
              </SelectPanel.Item>`
  // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
  const list = `<SelectPanel.List className={styles.List} aria-label="Repositories"${config.actions ? ' data-secondary-actions' : ''}>
            ${
              config.grouped
                ? `{['Applications', 'Infrastructure'].map(group => {
              const members = results.filter(repo => repo.group === group)
              return members.length > 0 ? (
                <SelectPanel.Group key={group} label={group}>
                  {members.map(repo => (${item}))}
                </SelectPanel.Group>
              ) : null
            })}`
                : `{results.map(repo => (${item}))}`
            }
          </SelectPanel.List>`
  const results =
    config.previewState === 'loading'
      ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
        '<SelectPanel.Loading className={styles.Status}>Loading repositories</SelectPanel.Loading>'
      : config.previewState === 'error'
        ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
          '<SelectPanel.Message className={styles.Status} variant="error" title="Repositories could not be loaded">Please try again.</SelectPanel.Message>'
        : `{${config.previewState === 'empty' ? 'true' : 'results.length === 0'} ? (
          <SelectPanel.Message className={styles.Status} variant="empty" title="No repositories found">
            Try another name or language.
          </SelectPanel.Message>
        ) : (${list})}`
  // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
  const content = `<SelectPanel.Content className={${isPrimer && inline ? "[styles.Panel, styles.InlinePanel].join(' ')" : 'styles.Panel'}}>
        <SelectPanel.Header className={styles.Header} data-compact={${!showHeader}}>
          <div${showHeader ? '' : ' className={styles.VisuallyHidden}'}>
            <SelectPanel.Title className={styles.Title}>Choose repositories</SelectPanel.Title>
            ${
              config.descriptions
                ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
                  '<SelectPanel.Description className={styles.Description}>Choose the code you want to work with.</SelectPanel.Description>'
                : ''
            }
          </div>
          ${
            !inline && !needsSave
              ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
                `<SelectPanel.CloseButton${config.presentation === 'modal' ? '' : ' className={styles.ResponsiveClose}'} />`
              : ''
          }
        </SelectPanel.Header>
        ${
          config.search
            ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
              `<SelectPanel.SearchInput className={styles.Search} placeholder="Search repositories..." aria-label="Search repositories"${isPrimer ? '' : ' leadingVisual={null}'} />`
            : ''
        }
        ${results}
        ${
          needsSave
            ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
              `<SelectPanel.Footer className={styles.Footer}>
          <Text size="small" className={styles.SelectionCount}>{selected.length} selected</Text>
          <div className={styles.FooterActions}>
            <SelectPanel.CancelButton className={styles.Action} size="small">Cancel</SelectPanel.CancelButton>
            <SelectPanel.SubmitButton className={styles.Action} size="small" variant="primary">Save</SelectPanel.SubmitButton>
          </div>
        </SelectPanel.Footer>`
            : ''
        }
      </SelectPanel.Content>`

  return `import {useState${config.actions ? ', useRef, type RefObject' : ''}${isPrimer ? '' : ', type CSSProperties'}} from 'react'
import {ActionList, SelectPanel, type SelectPanelValue${config.actions ? ', Button, Dialog, useOnOutsideClick' : ''}${needsSave ? ', Text' : ''}} from '@primer/react'
import {ChevronDownIcon${config.actions ? ', InfoIcon' : ''}} from '@primer/octicons-react'
import styles from './SelectPanelDemo.module.css'

const repositories = ${JSON.stringify(repositories, null, 2)}
${
  isPrimer
    ? ''
    : `const appearance: CSSProperties & Record<\`--playground-\${string}\`, string | number> = ${JSON.stringify(skin.style, null, 2)}
const overlayProps = {
  className: [styles.Theme, styles.Overlay${skinClass}].join(' '),
  style: appearance,
}`
}
${
  config.actions
    ? `
function RepositoryOption({repo}: {repo: (typeof repositories)[number]}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  return (
    <>
      <SelectPanel.Item
        ref={itemRef}
        value={repo.id}
        className={styles.Option}
        secondaryActions={repo.id === repositories[0].id ? [{
          label: \`Details for \${repo.name}\`,
          icon: InfoIcon,
          onClick: () => setDetailsOpen(true),
        }] : undefined}
      >
        {repo.name}
        ${
          config.descriptions
            ? // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
              '<ActionList.Description variant="block">{repo.description}</ActionList.Description>'
            : ''
        }
      </SelectPanel.Item>
      {detailsOpen ? (
        <RepositoryDetails repo={repo} itemRef={itemRef} onClose={() => setDetailsOpen(false)} />
      ) : null}
    </>
  )
}

function RepositoryDetails({repo, itemRef, onClose}: {
  repo: (typeof repositories)[number]
  itemRef: RefObject<HTMLLIElement>
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
      title={repo.name}
      width="large"
      position={{regular: 'center', narrow: 'bottom'}}
      onClose={onClose}
      returnFocusRef={itemRef}
      initialFocusRef={backRef}
    >
      <p>{repo.description}</p>
      <p>Primary language: {repo.language}</p>
      <p>Inspecting this repository does not select it.</p>
      <Dialog.Footer>
        <Button ref={backRef} size="small" onClick={onClose}>Back to repositories</Button>
      </Dialog.Footer>
    </Dialog>
  )
}
`
    : ''
}
export function RepositoryPicker() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SelectPanelValue[]>([repositories[0].id])
  const [committed, setCommitted] = useState<SelectPanelValue[]>([repositories[0].id])
  const [query, setQuery] = useState('')
  const results = repositories.filter(repo =>
    \`\${repo.name} \${repo.language}\`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <div className={${isPrimer ? 'styles.Stage' : `[styles.Theme, styles.Stage${skinClass}].join(' ')`}}${isPrimer ? '' : ' style={appearance}'}>
      <SelectPanel.Root
        open={open}
        onOpenChange={nextOpen => {
          ${needsSave ? 'if (nextOpen) setSelected([...committed])' : ''}
          setOpen(nextOpen)
        }}
        selected={selected}
        onSelectedChange={values => {
          setSelected(values)
          ${needsSave ? '' : 'setCommitted(values)'}
        }}
        selectionMode="${config.multiple ? 'multiple' : 'single'}"
        closeOnSelect={${!config.multiple && !needsSave && !inline}}
        filterValue={query}
        onFilterChange={setQuery}
        onSubmit={values => setCommitted([...values])}
        ${needsSave ? 'onCancel={() => setSelected([...committed])}\n        onDismiss={() => setSelected([...committed])}' : ''}
      >
        ${
          inline
            ? content
            : // eslint-disable-next-line github/unescaped-html-literal -- Generated TSX is displayed as text, never inserted as HTML.
              `<SelectPanel.Trigger className={styles.Trigger} trailingAction={ChevronDownIcon}>
          {committed.length === 1 ? committed[0] : \`\${committed.length} repositories\`}
        </SelectPanel.Trigger>
        <SelectPanel.Overlay
          width="medium"
          variant={{regular: '${config.presentation}', narrow: '${config.presentation === 'modal' ? 'bottom-sheet' : 'fullscreen'}'}}
          ${isPrimer ? '' : 'overlayProps={overlayProps}'}
        >
          ${content}
        </SelectPanel.Overlay>`
        }
      </SelectPanel.Root>
      <div className={styles.Committed} aria-live="polite">
        <strong>Saved selection</strong>
        <p>{committed.length ? committed.join(', ') : 'No repositories selected'}</p>
      </div>
    </div>
  )
}
`
}
