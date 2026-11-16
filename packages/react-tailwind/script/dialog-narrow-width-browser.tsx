import React from 'react'
import {createRoot} from 'react-dom/client'
import {createPortal, flushSync} from 'react-dom'
import {DirectionProvider} from '@base-ui/react/direction-provider'
import {PlusIcon} from '@primer/octicons-react'
import {Button, type ButtonProps} from '../src/components/Button'
import {ConfirmationDialog} from '../src/components/ConfirmationDialog'
import {Dialog, type DialogPosition, type DialogWidth} from '../src/components/Dialog'
import {IconButton} from '../src/components/IconButton'
import {IconLinkButton} from '../src/components/IconLinkButton'
import {LinkButton} from '../src/components/LinkButton'

const widths: Record<string, DialogWidth> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
  custom: '400px',
  percent: '75%',
  auto: 'auto',
}
const positions: Record<string, DialogPosition> = {
  center: 'center',
  left: 'left',
  right: 'right',
  bottom: 'bottom',
  fullscreen: 'fullscreen',
  responsive: {narrow: 'fullscreen', regular: 'center'},
}

export function Fixture({
  dialogContainer,
  params,
  portalTarget,
}: {
  dialogContainer: HTMLElement | null
  params: URLSearchParams
  portalTarget: HTMLElement | null
}) {
  const closeRef = React.useRef<HTMLElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement>(null)
  const [controlledOpen, setControlledOpen] = React.useState(false)
  const width = widths[params.get('width') ?? '']
  const hostCase = params.get('case') === 'host'
  const title = hostCase
    ? 'Review the visibility of project access'
    : params.get('title') === 'long'
      ? 'AReallyLongLocalizedDialogTitleWithoutAnySpaces'
      : 'Dialog title'
  const longActions = params.get('actions') === 'long'
  if (params.get('kind') === 'confirmation') {
    return (
      <ConfirmationDialog
        confirmButtonContent={longActions ? <span lang="de">Repositoryzugriffsberechtigung</span> : undefined}
        description="Dialog content"
        title={params.get('title') === 'long' ? title : 'Confirm dialog'}
        trigger={<Button>Open confirmation</Button>}
        width={width}
      />
    )
  }

  const position = positions[params.get('position') ?? '']
  const size = params.get('size') === 'small' ? 'small' : params.get('size') === 'large' ? 'large' : undefined
  const variant = params.has('linkVariant') ? 'link' : hostCase ? 'primary' : undefined
  const labelWrap = params.has('nowrapFooter') ? false : params.has('wrapFooter') ? true : undefined
  const label = hostCase ? 'Save changes' : longActions ? 'Repositoryzugriffsberechtigung' : 'Confirm'
  const actionProps: Pick<ButtonProps, 'className' | 'labelWrap' | 'lang' | 'leadingVisual' | 'size' | 'variant'> = {
    className: params.has('customHeight') ? 'h-10' : undefined,
    labelWrap,
    lang: longActions ? 'de' : undefined,
    leadingVisual: params.has('actionIcon') ? PlusIcon : undefined,
    size,
    variant,
  }
  const action = params.has('linkFooter') ? (
    <LinkButton {...actionProps} href="#destination">
      {label}
    </LinkButton>
  ) : (
    <Button {...actionProps}>{label}</Button>
  )
  const initialFocus = params.has('headerInitialFocus')
    ? headerRef
    : params.has('closeInitialFocus')
      ? closeRef
      : params.has('noInitialFocus')
        ? false
        : undefined
  const modal =
    params.get('modality') === 'non-modal' ? false : params.get('modality') === 'trap-focus' ? 'trap-focus' : true
  const rapidReopen = params.has('rapidReopen')
  const content = (
    <>
      <Dialog.Header
        ref={headerRef}
        {...(params.has('headerTabIndex') ? {tabIndex: params.get('headerTabIndex') === '-1' ? -1 : 0} : {})}
      >
        <Dialog.Title>{title}</Dialog.Title>
        {!params.has('noClose') && <Dialog.CloseButton ref={closeRef} />}
      </Dialog.Header>
      <Dialog.Body className={params.get('override') === 'body-min' ? 'min-h-0' : undefined}>
        {hostCase ? (
          Array.from({length: 12}, (_, index) => (
            <p key={index}>Rule {index + 1}: A description that wraps across multiple lines in the dialog.</p>
          ))
        ) : params.has('textSpacing') ? (
          <p>Dialog content</p>
        ) : (
          'Dialog content'
        )}
        {params.has('bodyControl') && <Button>Body control</Button>}
      </Dialog.Body>
      {!params.has('noActions') && (
        <Dialog.Footer>
          {hostCase ? <Button>Cancel</Button> : <Dialog.Close render={<Button>Cancel</Button>} />}
          {params.has('wrappedAction') ? <div className="flex min-w-0">{action}</div> : action}
          {params.has('iconControls') && (
            <>
              <IconButton aria-label="Add" icon={PlusIcon} />
              <IconLinkButton aria-label="Add link" href="#destination" icon={PlusIcon} unsafeDisableTooltip />
            </>
          )}
          {portalTarget && createPortal(<Button data-testid="portaled-button">Portaled control</Button>, portalTarget)}
        </Dialog.Footer>
      )}
    </>
  )
  return (
    <>
      {rapidReopen && (
        <button
          data-testid="rapid-reopen"
          onClick={() => {
            flushSync(() => setControlledOpen(false))
            triggerRef.current?.focus()
            flushSync(() => setControlledOpen(true))
            closeRef.current?.focus()
            triggerRef.current?.focus()
          }}
          type="button"
        >
          Reopen dialog
        </button>
      )}
      <Dialog.Root
        defaultOpen={rapidReopen ? undefined : params.has('defaultOpen')}
        modal={modal}
        onOpenChange={
          rapidReopen
            ? (open, details) => {
                if (details.reason !== 'focus-out') setControlledOpen(open)
              }
            : undefined
        }
        open={rapidReopen ? controlledOpen : undefined}
      >
        <Dialog.Trigger ref={triggerRef} render={<Button>Open dialog</Button>} />
        {params.has('keepMounted') ? (
          <Dialog.Portal container={dialogContainer ?? undefined} keepMounted>
            <Dialog.Viewport>
              <Dialog.Popup
                initialFocus={initialFocus}
                style={{width: 'min(100%, 640px)', maxHeight: 'calc(100dvh - 64px)', minWidth: 0}}
              >
                {content}
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        ) : (
          <Dialog.Content
            className={
              params.get('override') === 'min'
                ? 'min-w-0'
                : params.get('override') === 'overflow'
                  ? 'overflow-hidden'
                  : undefined
            }
            container={dialogContainer ?? undefined}
            initialFocus={initialFocus}
            position={position}
            width={width}
          >
            {content}
          </Dialog.Content>
        )}
      </Dialog.Root>
    </>
  )
}

function mountFixture() {
  const shadowRoot = document.getElementById('dialog-shadow-host')?.shadowRoot
  const root = document.getElementById('root') ?? shadowRoot?.getElementById('root')
  if (!root) throw new Error('Expected the dialog sizing fixture root')
  const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
  const params = new URLSearchParams(window.location.search)
  createRoot(root).render(
    <DirectionProvider direction={direction}>
      <Fixture
        dialogContainer={shadowRoot?.getElementById('dialog-container') ?? null}
        params={params}
        portalTarget={document.getElementById('portal-target')}
      />
    </DirectionProvider>,
  )
}

mountFixture()
