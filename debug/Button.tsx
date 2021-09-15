import React, {FC, forwardRef} from 'react'

type ButtonProps = {
  variant?: 'small' | 'medium' | 'large'
}

// doesn't work
export const SimpleButtonWithFC: React.FC<ButtonProps> = props => {
  return <button {...props} />
}

export const ButtonWithForwardRef = React.forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => {
  return <button ref={ref} {...props} />
})

// works?!
export const SimpleButtonWithDestructuredFC: FC<ButtonProps> = props => {
  return <button {...props} />
}

export const ButtonWithDestructuredForwardRef = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    return <button ref={ref} {...props} />
  }
)
