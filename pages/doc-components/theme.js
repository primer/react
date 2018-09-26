import {theme} from '../..'

export default {
  font: theme.fonts.normal,
  LiveEditor: {
    whiteSpace: 'pre-wrap',
    backgroundColor: theme.colors.gray[1],
    color: theme.colors.black,
    fontFamily: theme.fonts.mono,
    padding: `${theme.space[2]}px`,
    fontSize: `${theme.fontSizes[1]}px`,
    borderBottomLeftRadius: `${theme.radii[1]}px`,
    borderBottomRightRadius: `${theme.radii[1]}px`
  },
  LivePreview: {
    border: `${theme.space[1]}px solid ${theme.colors.gray[1]}`,
    padding: `${theme.space[3]}px`,
    borderTopLeftRadius: `${theme.radii[1]}px`,
    borderTopRightRadius: `${theme.radii[1]}px`
  },
  NavLink: {
    padding: `${theme.space[4]} 0px`,
    fontSize: `${theme.fontSizes[2]}px`
  },
  LayoutContainer: {
    padding: '0px',
    maxWidth: '100%'
  }
}
