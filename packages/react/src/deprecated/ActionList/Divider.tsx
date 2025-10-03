import classes from './Divider.module.css'

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export function Divider(): JSX.Element {
  return <div className={classes.Divider} />
}

/**
 * `Divider` fulfills the `ItemPropsWithCustomRenderer` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider
