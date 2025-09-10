import type {Meta} from '@storybook/react-vite'
import Flash from './Flash'
import {AlertIcon, CheckCircleIcon, InfoIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton} from '../Button'
import Link from '../Link'
import classes from './Flash.features.stories.module.css'

export default {
  title: 'Components/Flash/Features',
  component: Flash,
} as Meta<typeof Flash>

export const Success = () => (
  <Flash
    variant="success"
    style={{
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr minmax(0, auto)',
      gridTemplateAreas: `'visual message actions'`,
    }}
  >
    <div className={classes.Visual}>
      <CheckCircleIcon aria-label="Success" />
    </div>
    <div className={classes.Message}>Success</div>
  </Flash>
)

export const Danger = () => (
  <Flash
    variant="danger"
    style={{
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr minmax(0, auto)',
      gridTemplateAreas: `'visual message actions'`,
    }}
  >
    <div className={classes.Visual}>
      <InfoIcon aria-label="Danger" />
    </div>
    <div className={classes.Message}>Danger</div>
  </Flash>
)

export const Warning = () => (
  <Flash
    variant="warning"
    style={{
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr minmax(0, auto)',
      gridTemplateAreas: `'visual message actions'`,
    }}
  >
    <div className={classes.Visual}>
      <AlertIcon aria-label="Warning" />
    </div>
    <div className={classes.Message}>Warning</div>
  </Flash>
)

export const Full = () => (
  <Flash
    full
    style={{
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr minmax(0, auto)',
      gridTemplateAreas: `'visual message actions'`,
    }}
  >
    <div className={classes.Visual}>
      <InfoIcon aria-label="Info" />
    </div>
    <div className={classes.Message}>Full</div>
  </Flash>
)

export const WithIconAndAction = () => (
  <Flash
    style={{
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr minmax(0, auto)',
      gridTemplateRows: 'min-content',
      gridTemplateAreas: `'visual message actions'`,
      '@media screen and (max-width: 543.98px)': {
        gridTemplateColumns: 'min-content 1fr',
        gridTemplateRows: 'min-content min-content',
        gridTemplateAreas: `
        'visual message'
        '.      actions'
      `,
      },
    }}
  >
    <div className={classes.Visual}>
      <InfoIcon aria-label="Info" />
    </div>
    <div className={classes.Message}>
      This is a flash message with an icon and an action.
      <Link href="/"> Learn more.</Link>
    </div>
    <div className={classes.ActionsResponsive}>
      <Button>Join waitlist</Button>
    </div>
  </Flash>
)

export const WithIconActionDismiss = () => (
  <Flash className={classes.WithIconActionDismiss}>
    <div className={classes.Visual}>
      <InfoIcon aria-label="Info" />
    </div>
    <div className={classes.Message}>
      This is a flash message with an icon and an action.
      <Link href="/"> Learn more.</Link>
    </div>
    <div className={classes.ActionsResponsive}>
      <Button>Join waitlist</Button>
    </div>
    <div className={classes.Close}>
      <IconButton variant="invisible" icon={XIcon} aria-label="Dismiss" />
    </div>
  </Flash>
)
