import React from 'react'
import {join, readFileSync} from 'fs'
import StyleProvider from '../StyleProvider'
import {render} from '../utils/testing'
import css from '../css'

describe('css.js', () => {
  it('exports a CSS string', () => {
    const {join} = require('path')
    const {readFileSync} = require('fs')
    const expectedCSS = readFileSync(join(__dirname, '../../system.css'), 'utf8')
    expect(css).toEqual(expectedCSS)
  })
})

describe('StyleProvider', () => {
  it('has CSS', () => {
    expect(render(<StyleProvider />)).toEqual(
      render(
        <style dangerouslySetInnerHTML={{__html: css}} />
      )
    )
  })
})
