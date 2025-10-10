import {clsx} from 'clsx'
import classes from './FilteredSearch.module.css'

type FilteredSearchProps = React.HTMLAttributes<HTMLElement>

/**
 * @deprecated A new filter component is in progress.
 * Until the new filter component is ready, you can use Button + TextInput + ActionList to reproduce this pattern.
 */
function FilteredSearch({children, className, ...rest}: FilteredSearchProps) {
  return (
    <div {...rest} className={clsx(classes.FilteredSearch, className)}>
      {children}
    </div>
  )
}

export type {FilteredSearchProps}
export default FilteredSearch
