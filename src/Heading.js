import Text from './Text'

const Heading = Text.withComponent('h1')

Heading.defaultProps = {
  fontSize: 5,
  fontWeight: 600,
  lineHeight: 1.25,
  m: 0,
}

const H1 = Heading.withComponent('h1')
const H2 = Heading.withComponent('h2')
const H3 = Heading.withComponent('h3')
const H4 = Heading.withComponent('h4')
const H5 = Heading.withComponent('h5')
const H6 = Heading.withComponent('h6')

export default Heading
export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6
}
