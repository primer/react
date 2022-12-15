const prettify = require('./lib/prettify')

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
  'display',
]

const TYPOGRAPHY = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'fontStyle',
  'whiteSpace',
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
  'textShadow',
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
  'verticalAlign',
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
  'order',
]

// const GRID = [
//   'gridGap',
//   'gridColumnGap',
//   'gridRowGap',
//   'gridColumn',
//   'gridRow',
//   'gridAutoFlow',
//   'gridAutoColumns',
//   'gridAutoRows',
//   'gridTemplateColumns',
//   'gridTemplateRows',
//   'gridTemplateAreas',
//   'gridArea'
// ]

const stylePropsMap = {
  Avatar: [...COMMON],
  AvatarStack: [...COMMON],
  BranchName: [...COMMON],
  Breadcrumb: [...COMMON, ...FLEX],
  Button: [...COMMON, ...LAYOUT, ...TYPOGRAPHY],
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
  Label: [...COMMON, ...BORDER],
  LabelGroup: [...COMMON],
  Link: [...COMMON, ...TYPOGRAPHY],
  Overlay: [...COMMON],
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
  UnderlineNav: [...COMMON],
}

const expressionToString = expression => {
  if (expression.type === 'Literal') {
    const expressionValue = expression.value
    return typeof expressionValue === 'string' ? `"${expressionValue}"` : expressionValue
  } else if (expression.type === 'Identifier') {
    return expression.name
  } else if (expression.type === 'Identifier') {
    return expression.name
  } else if (['null', 'undefined'].includes(expression.raw)) {
    return expression.raw
  } else {
    const start = expression.start
    const end = expression.end
    const toks = expression.loc.tokens.filter(token => {
      return token.type !== 'CommentLine' && token.start >= start && token.end <= end
    })
    const vals = toks.map(tok => {
      return tok.type.label === 'string' ? `"${tok.value}"` : tok.value
    })
    return vals.join('')
  }
}

const objectToString = (object, spreads = []) => {
  const values = Object.values(object)
  const keys = Object.keys(object)
  const duples = keys.map(function (key, i) {
    return [key, values[i]]
  })
  const accumulator = (string, duple) => {
    const expression = duple[1]
    const expressionString = expressionToString(expression)
    return `${string} ${duple[0]}: ${expressionString},`
  }
  const objString = duples.reduce(accumulator, '')
  const spreadsString = spreads.map(s => `...${s},`).join('')
  return `{${spreadsString}${objString}}`
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
          },
        },
      },
    })
    .forEach(el => {
      const sx = {}
      const elementName = el.value?.openingElement?.name?.name
      const elementNameScrubbed = elementName.replace('.', '')
      const systemProps = stylePropsMap[elementNameScrubbed]
      const attrNodes = j(el).find(j.JSXAttribute, {
        name: name => {
          const isInElement = name.start >= el.node.start && name.end <= el.value.openingElement.end
          return systemProps && systemProps.includes(name.name) && isInElement
        },
      })

      const sxNodes = j(el).find(j.JSXAttribute, {
        name: name => {
          const isInElement = name.start >= el.node.start && name.end <= el.value.openingElement.end
          return name.name === 'sx' && isInElement
        },
      })

      const existingSx = {}
      const sxNodesArray = sxNodes.nodes() || []
      const existingSxProps = sxNodesArray[0]?.value?.expression?.properties
      existingSxProps &&
        existingSxProps.forEach(p => {
          const keyName = p?.key?.name
          const keyValue = p?.key?.raw
          if (!keyName && !keyValue) {
            return
          }
          existingSx[keyName || keyValue] = p.value
        })
      const spreads =
        existingSxProps &&
        existingSxProps
          .filter(p => p.type === 'SpreadElement')
          .map(s => {
            const argName = s?.argument?.name
            const propName = s?.argument?.property?.name
            const objectName = s?.argument?.object?.name
            return argName || `${objectName}.${propName}`
          })

      attrNodes.forEach((attr, index) => {
        const key = attr?.value?.name?.name
        const literal = attr?.value?.value
        const val = literal.type === 'JSXExpressionContainer' ? literal.expression : literal
        if (key && val) {
          sx[key] = val
        }
        if (index + 1 !== attrNodes.length) {
          attr.prune()
        } else {
          const keys = Object.keys(sx)
          if (keys.length > 0) {
            sxNodes.forEach(node => node.prune())
            j(attr).replaceWith(`sx={${objectToString({...existingSx, ...sx}, spreads)}}`)
          }
        }
      })
    })

  return prettify(ast, file)
}
