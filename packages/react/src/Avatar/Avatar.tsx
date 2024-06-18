// packages/react/src/Avatar/Avatar.tsx

import React, {forwardRef} from 'react'
import styles from './Avatar.module.css'

export const DEFAULT_AVATAR_SIZE = 20

export type AvatarProps = {
  src: string
  alt?: string
  size?: number | {narrow?: number; regular?: number; wide?: number}
  square?: boolean
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  asButton?: boolean
}

const Avatar = forwardRef<HTMLElement, AvatarProps>(
  ({src, alt, href, onClick, size = DEFAULT_AVATAR_SIZE, square, asButton, ...restProps}, ref) => {
    const getSize = (): number => {
      if (typeof size === 'number') {
        return size
      }
      if (typeof size === 'object') {
        // Return the highest specified size or a default
        return size.wide || size.regular || size.narrow || DEFAULT_AVATAR_SIZE
      }
      return DEFAULT_AVATAR_SIZE
    }

    const finalSize = getSize()
    const wrapperClass = square ? 'Avatar__link--square' : 'Avatar__link--round'
    const style = {width: finalSize, height: finalSize}

    const imgElement = <img src={src} alt={alt} className={styles.Avatar__img} />

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={`${styles.Avatar__link} ${styles[wrapperClass]}`}
          style={style}
          {...restProps}
        >
          {imgElement}
        </a>
      )
    } else if (onClick || asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          className={`${styles.Avatar__button} ${styles[wrapperClass]}`}
          style={style}
          {...restProps}
        >
          {imgElement}
        </button>
      )
    } else {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={`${styles.Avatar__div} ${styles[wrapperClass]}`}
          style={style}
          {...restProps}
        >
          {imgElement}
        </div>
      )
    }
  },
)

export default Avatar
