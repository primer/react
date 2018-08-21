import React from 'react'
import PropTypes from 'prop-types'
import {withDefaultTheme} from '../../src/system-props'
import {default as PrimerCSS} from '../../src/css'

function Styles({theme}) {
  return (
    /* eslint-disable-next-line react/no-danger */
    <style dangerouslySetInnerHTML={{__html: `
      /* primer-react base */
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ${theme.fonts.normal};
        line-height: ${theme.lineHeights.default};
      }
      /* primer-react imports */
      ${PrimerCSS}
    `}} />
  )
}

Styles.propTypes = {
  theme: PropTypes.object
}

export default withDefaultTheme(Styles)
