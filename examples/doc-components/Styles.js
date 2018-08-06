import React from 'react'
import PropTypes from 'prop-types'
import {theme} from '../../src'

/* eslint-disable-next-line react/no-danger */
const Styles = ({css}) => <style dangerouslySetInnerHTML={{__html: css}} />

Styles.defaultProps = {
  css: `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${theme.fonts.normal};
      line-height: ${theme.lineHeights.normal};
    }
  `
}

Styles.propTypes = {
  css: PropTypes.string
}

export default Styles
