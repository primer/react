import Link from 'next/link'
import {ThemePreference} from '../ThemePreference'
import classes from './PageHeader.module.css'

export function PageHeader() {
  return (
    <header className={classes.header}>
      <Link href="/" className={classes.logo}>
        Primer
      </Link>
      <ThemePreference />
    </header>
  )
}
