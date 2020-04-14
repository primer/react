import styled from 'styled-components'

import css from '@styled-system/css'

const sxProps = props => css(props.sx)

function generateSxComp(base) {
  function tag(strings, ...values) {
    const Comp = base(strings, ...values)
    return styled(Comp)`
      ${sxProps};
    `
  }

  return tag
}

function sxStyled(Comp) {
  return generateSxComp(styled(Comp))
}

for (const ctr of Object.keys(styled)) {
  sxStyled[ctr] = generateSxComp(styled[ctr], ctr)
}

const sx = {
  get styled() {
    return sxStyled
  }
}

export default sx
