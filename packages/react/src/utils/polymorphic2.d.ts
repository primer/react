/**
 * This file is an alternative to polymorphic.ts that hopes to support
 * polyrmophic components in React. It explicitly hopes to make it easy to
 * type the props of components and allow for explicitly setting the type of a
 * component
 */

import type {ElementType} from 'react'

type AsProp<As extends ElementType> = {
  /**
   * Customize the element type of the container element for the component
   */
  as?: As
}

type PolymorphicProps<DefaultAs extends ElementType, As extends ElementType, Props = {}> = Props &
  AsProp<As> &
  (As extends React.ElementType
    ? Omit<React.ComponentPropsWithoutRef<As>, keyof Props>
    : Omit<React.ComponentPropsWithoutRef<DefaultAs>, keyof Props>)

export type {PolymorphicProps}
