import type {ReactNode} from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  KebabHorizontalIcon,
  LockIcon,
  MarkGithubIcon,
  PlusIcon,
  SearchIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import classes from './SelectPanelFilm.module.css'

export function SelectPanelFilmDesktopBackground({application = 'Chrome'}: {application?: 'Chrome' | 'Slack'}) {
  const menus =
    application === 'Slack'
      ? ['File', 'Edit', 'View', 'History', 'Window', 'Help']
      : ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Profiles', 'Tab', 'Window', 'Help']
  return (
    <div className={classes.Desktop} aria-hidden="true">
      <div className={classes.DesktopMenu}>
        <span className={classes.DesktopApple}>{'\uF8FF'}</span>
        <strong>{application}</strong>
        {menus.map(menu => (
          <span key={menu}>{menu}</span>
        ))}
        <span className={classes.BrowserSpacer} />
        <span className={classes.DesktopBattery} />
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
          <path d="M1 5Q9 -1 17 5M4 8Q9 4 14 8M7 11Q9 9 11 11" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
        </svg>
        <SearchIcon size={15} />
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="16" height="5" rx="2.5" stroke="currentColor" />
          <rect x="1" y="10" width="16" height="5" rx="2.5" stroke="currentColor" />
          <circle cx="5" cy="3.5" r="1.5" fill="currentColor" />
          <circle cx="13" cy="12.5" r="1.5" fill="currentColor" />
        </svg>
        <span>Wed Nov 18</span>
        <span>10:00 AM</span>
      </div>
    </div>
  )
}

export function SelectPanelFilmBrowserChrome({themed = false}: {themed?: boolean}) {
  return (
    <div className={classes.BrowserChrome} data-themed={themed} aria-hidden="true">
      <div className={classes.BrowserTabs}>
        <div className={classes.BrowserTrafficLights}>
          <span />
          <span />
          <span />
        </div>
        <div className={classes.BrowserTab}>
          <MarkGithubIcon size={16} />
          <span>Breadcrumbs: &quot;Maximum update depth exceeded&quot; · Issue #8790</span>
          <XIcon size={13} />
        </div>
        <PlusIcon size={17} />
        <span className={classes.BrowserSpacer} />
        <ChevronDownIcon size={16} />
      </div>
      <div className={classes.BrowserToolbar}>
        <ArrowLeftIcon size={17} />
        <ArrowRightIcon size={17} />
        <SyncIcon size={16} />
        <div className={classes.BrowserAddress}>
          <LockIcon size={14} />
          <span>github.com/primer/react/issues/8790</span>
        </div>
        <span className={classes.BrowserProfile}>M</span>
        <KebabHorizontalIcon size={18} />
      </div>
    </div>
  )
}

export function SelectPanelFilmDesktop({children}: {children: ReactNode}) {
  return (
    <>
      <SelectPanelFilmDesktopBackground />
      <div className={classes.BrowserFrame}>
        <SelectPanelFilmBrowserChrome />
        <div className={classes.BrowserContent}>{children}</div>
      </div>
    </>
  )
}
