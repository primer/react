import React from 'react'
import PropTypes from 'prop-types'
import {withDefaultTheme} from '../../src/system-props'

function Styles({theme}) {
  return (
    /* eslint-disable react/no-danger */
    <style
      dangerouslySetInnerHTML={{
        __html: `
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: ${theme.fonts.normal};
            line-height: ${theme.lineHeights.default};
          }
        `
      }}
    />
    /* eslint-enable react/no-danger */
  )
}

Styles.propTypes = {
  theme: PropTypes.object
}

export default withDefaultTheme(Styles)
