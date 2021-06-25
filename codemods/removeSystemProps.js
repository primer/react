const prettify = require('./lib/prettify')
const _ = require('lodash')

const COMMON = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingX',
  'paddingY',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
  'color',
  'backgroundColor',
  'opacity',
  'bg',
  'display'
]

const TYPOGRAPHY = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'fontStyle',
  'whiteSpace'
]

const BORDER = [
  'border',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderRadius',
  'borderTop',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderRight',
  'borderBottom',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderLeft',
  'borderX',
  'borderY',
  'borderTopWidth',
  'borderTopColor',
  'borderTopStyle',
  'borderBottomWidth',
  'borderBottomColor',
  'borderBottomStyle',
  'borderLeftWidth',
  'borderLeftColor',
  'borderLeftStyle',
  'borderRightWidth',
  'borderRightColor',
  'borderRightStyle',
  'boxShadow',
  'textShadow'
]

const LAYOUT = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'size',
  'overflow',
  'overflowX',
  'overflowY',
  'display',
  'verticalAlign'
]

const POSITION = ['position', 'zIndex', 'top', 'right', 'bottom', 'left']

const FLEX = [
  'alignItems',
  'alignContent',
  'justifyItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'justifySelf',
  'alignSelf',
  'order'
]

const GRID = [
  'gridGap',
  'gridColumnGap',
  'gridRowGap',
  'gridColumn',
  'gridRow',
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridArea'
]

const stylePropsMap = {
  Avatar: [...COMMON],
  AvatarStack: [...COMMON],
  BranchName: [...COMMON],
  Breadcrumb: [...COMMON, ...FLEX],
  ButtonBase: [...COMMON, ...LAYOUT],
  ButtonClose: [...COMMON, ...LAYOUT],
  ButtonTableList: [...COMMON, ...TYPOGRAPHY, ...LAYOUT],
  CircleBadge: [...COMMON],
  CounterLabel: [...COMMON],
  Details: [...COMMON],
  Dialog: [...LAYOUT, ...COMMON, ...POSITION],
  Dropdown: [...COMMON],
  FilteredSearch: [...COMMON],
  FilterList: [...COMMON],
  Flash: [...COMMON],
  FormGroup: [...COMMON],
  FormGroupLabel: [...COMMON, ...TYPOGRAPHY],
  Header: [...COMMON, ...BORDER],
  HeaderItem: [...COMMON, ...BORDER],
  Label: [...COMMON],
  LabelGroup: [...COMMON],
  Link: [...COMMON, ...TYPOGRAPHY],
  Overlay: [...COMMON, ...POSITION],
  Pagehead: [...COMMON],
  Pagination: [...COMMON],
  Popover: [...COMMON, ...LAYOUT, ...POSITION],
  PopoverContent: [...COMMON, ...LAYOUT, ...POSITION, ...FLEX],
  SelectMenu: [...COMMON],
  SelectMenuDivider: [...COMMON],
  SelectMenuFilter: [...COMMON],
  SelectMenuFooter: [...COMMON],
  SelectMenuHeader: [...COMMON, ...TYPOGRAPHY],
  SelectMenuItem: [...COMMON],
  SelectMenuList: [...COMMON],
  SelectMenuLoadingAnimation: [...COMMON],
  SelectMenuModal: [...COMMON],
  SelectMenuTab: [...COMMON],
  SelectMenuTabPanel: [...COMMON],
  SelectMenuTabs: [...COMMON],
  SideNav: [...COMMON],
  Spinner: [...COMMON],
  StateLabel: [...COMMON],
  StyledOcticon: [...COMMON],
  SubNav: [...COMMON, ...FLEX],
  TabNav: [...COMMON],
  TabNavLink: [...COMMON, ...TYPOGRAPHY],
  TextInput: [...COMMON],
  Timeline: [...COMMON],
  Tooltip: [...COMMON],
  Truncate: [...TYPOGRAPHY, ...COMMON],
  UnderlineNav: [...COMMON]
}

const objectToString = object => {
  const values = _.values(object)
  const keys = _.keys(object)
  const duples = _.zip(keys, values)
  const sortedDuples = _.sortBy(duples, [0])
  const accumulator = (string, duple) => {
    const literal = typeof duple[1] === 'string' ? `"${duple[1]}"` : duple[1]
    return `${string} ${duple[0]}: ${literal},`
  }
  const objString = sortedDuples.reduce(accumulator, '')
  return `{ ${objString} }`
}

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  const importsByName = {}

  ast
    .find(j.ImportDeclaration, decl => decl.source.value.includes('@primer/components'))
    .forEach(decl => {
      j(decl)
        .find(j.ImportSpecifier)
        .forEach(spec => {
          importsByName[spec.node.imported.name] = spec.node.local.name
        })
    })

  ast
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: name => {
            return name in stylePropsMap
          }
        }
      }
    })
    .forEach(el => {
      const sx = {}
      const attrNodes = j(el).find(j.JSXAttribute, {
        name: name => {
          const elementName = el.value.openingElement.name.name.replace('.', '')
          const systemProps = stylePropsMap[elementName]
          return systemProps && systemProps.includes(name.name)
        }
      })
      attrNodes.forEach((attr, index) => {
        const key = attr.value.name.name
        const val = attr.value.value.expression.value
        sx[key] = val
        if (index + 1 !== attrNodes.length) {
          attr.prune()
        } else {
          j(attr).replaceWith(`sx={${objectToString(sx)}}`)
        }
      })
    })

  return prettify(ast, file)
}
