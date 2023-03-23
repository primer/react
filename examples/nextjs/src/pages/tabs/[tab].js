import {useRouter} from 'next/router'

const Tabs = () => {
  const router = useRouter()
  const {tab} = router.query

  return <p>Tab: {tab}</p>
}

export default Tabs
