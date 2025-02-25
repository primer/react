import Link from 'next/link'
import {ThemePreference} from '../ThemePreference'
import classes from './PageHeader.module.css'

export function PageHeader() {
  return (
    <header className={classes.Header}>
      <Link href="/" className={classes.Logo}>
        Primer
      </Link>
      <ThemePreference />
    </header>
  )
}
