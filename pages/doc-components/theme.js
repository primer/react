import {theme} from '../../src'

export default {
  font: theme.fonts.normal,
  /* figure out how to use our theme values here */
  LiveEditor: {
    whiteSpace: 'pre-wrap',
    backgroundColor: '#2f363d',
    color: '#fff',
    padding: '8px',
    borderBottomLeftRadius: '3px',
    borderBottomRightRadius: '3px'
  },
  LiveCode: {
    border: '1px #e1e4e8 solid',
    borderRadius: '3px'
  },
  LivePreview: {
    textAlign: 'center',
    padding: '24px'
  },
  LayoutSidebar: {
    top: '64px',
    backgroundColor: theme.colors.gray[0]
  },
  NavLink: {
    padding: '8px 0px',
    fontSize: '16px'
  },
  LayoutContainer: {
    padding: '0px',
    maxWidth: '100%'
  }
}
