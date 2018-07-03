import React from 'react'
import PropTypes from 'prop-types'
import {theme} from '../../src'

/* eslint-disable-next-line react/no-danger */
const CSS = ({css}) => <style dangerouslySetInnerHTML={{__html: css}} />

const fonts = theme.fonts.map(name => (name.indexOf(' ') > -1 ? `"${name}"` : name)).join(', ')

CSS.defaultProps = {
  css: `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${fonts};
      line-height: ${theme.lineHeight};
    }
  `
}

CSS.propTypes = {
  css: PropTypes.string
}

export default CSS
