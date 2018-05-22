import React from 'react'
import map from 'system-classnames/primer'
import classnames from 'classnames'

const propsAndClassnames = (props, classes) => classnames(map(props), classes)

const classedFactory = (Component, classes) => {
  return ({className, ...props}) => {
    return (
      <Component className={propsAndClassnames(props, classes)} {...props} />
    )
  }
}

export default propsAndClassnames
export {map, classedFactory}
