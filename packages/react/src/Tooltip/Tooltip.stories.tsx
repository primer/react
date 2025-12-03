import type {Meta} from '@storybook/react-vite'
import {Button} from '..'
import Link from '../Link'
import {Banner} from '../Banner'
import Tooltip from './Tooltip'
import classes from './Tooltip.stories.module.css'

/* Tooltip v1 */

export default {
  title: 'Deprecated/Components/Tooltip',
  component: Tooltip,
} as Meta

export const Default = () => (
  <>
    <div className={classes.BannerContainer}>
      <Banner
        title="Planned for deprecation"
        description={
          <div data-a11y-link-underlines="true">
            There are plans to deprecate this component in a future release. We recommend using{' '}
            <Link inline={true} href="/react/storybook/?path=/story/components-tooltipv2--default">
              Tooltip
            </Link>{' '}
            instead.
          </div>
        }
        variant="warning"
      />
    </div>
    <div className={classes.PaddedContainer}>
      <Tooltip aria-label="Hello, Tooltip!">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  </>
)
