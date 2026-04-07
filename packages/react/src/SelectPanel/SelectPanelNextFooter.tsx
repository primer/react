import {clsx} from 'clsx'

import {Button} from '../Button'
import classes from './SelectPanel.module.css'
import type {SelectPanelProps} from './SelectPanel.shared'
import type {FooterLayout} from './SelectPanelNext.shared.utils'

interface SelectPanelNextFooterProps {
  footer: SelectPanelProps['footer']
  footerLayout: FooterLayout
  onCancel?: () => void
  onCancelRequested: () => void
  onSave: () => void
  secondaryAction?: SelectPanelProps['secondaryAction']
  usingFullScreenOnNarrow: boolean
  variant: SelectPanelProps['variant']
}

export function SelectPanelNextFooter({
  footer,
  footerLayout,
  onCancel,
  onCancelRequested,
  onSave,
  secondaryAction,
  usingFullScreenOnNarrow,
  variant,
}: SelectPanelNextFooterProps) {
  if (footerLayout.kind === 'none') {
    return null
  }

  if (footerLayout.kind === 'legacy') {
    return <div className={classes.Footer}>{footer}</div>
  }

  return (
    <div
      data-display-footer={footerLayout.displayFooter}
      data-stretch-secondary-action={footerLayout.stretchSecondaryAction}
      data-stretch-save-button={footerLayout.stretchSaveButton}
      className={clsx(classes.Footer, classes.ResponsiveFooter)}
    >
      <div data-stretch-secondary-action={footerLayout.stretchSecondaryAction} className={classes.SecondaryAction}>
        {secondaryAction}
      </div>
      {footerLayout.showCancelAndSave ? (
        <div
          data-stretch-save-button={footerLayout.stretchSaveButton}
          className={clsx(classes.CancelSaveButtons, {
            [classes.ResponsiveSaveButton]: variant !== 'modal' && usingFullScreenOnNarrow,
          })}
        >
          <Button
            size="medium"
            onClick={() => {
              onCancel?.()
              onCancelRequested()
            }}
          >
            Cancel
          </Button>
          <Button block={onCancel === undefined} variant="primary" size="medium" onClick={onSave}>
            Save
          </Button>
        </div>
      ) : null}
      {footerLayout.showSaveAndClose ? (
        <div className={classes.ResponsiveSaveButton} data-stretch-save-button={footerLayout.stretchSaveButton}>
          <Button block variant="primary" size="medium" onClick={onSave}>
            Save and close
          </Button>
        </div>
      ) : null}
    </div>
  )
}
