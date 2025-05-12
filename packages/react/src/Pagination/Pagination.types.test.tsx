import Pagination from '../Pagination'

export function shouldAcceptCallWithNoProps() {
  return <Pagination currentPage={1} pageCount={2} />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Pagination currentPage={1} pageCount={2} backgroundColor="palegoldenrod" />
}
