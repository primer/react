import {LocationIcon, RepoIcon} from '@primer/octicons-react'
import {Avatar} from '../Avatar'
import {Button} from '../Button'
import {Link} from '../Link'
import {Stack} from '../Stack'

/** The user hover card that the AnchoredOverlay stories render inside the overlay. */
export function HoverCard() {
  return (
    <Stack gap="condensed" padding="normal">
      <Stack direction="horizontal" gap="condensed" justify="space-between">
        <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" size={48} />
        <Button size="small">Follow</Button>
      </Stack>
      <Stack direction="horizontal" gap="none">
        <span className="font-medium text-default">monalisa</span>
        <span className="ml-1 text-muted">
          <Link inline muted href="#">
            Monalisa Octocat
          </Link>
        </span>
      </Stack>
      <span className="text-body-medium">
        Former beach cat and champion swimmer. Now your friendly octopus with a normal face.
      </span>
      <Stack direction="horizontal" gap="none">
        <LocationIcon className="text-muted" />
        <span className="ml-1 text-body-small text-muted">Interwebs</span>
      </Stack>
      <Stack direction="horizontal" gap="none">
        <RepoIcon className="text-muted" />
        <span className="ml-1 text-body-small text-muted">Owns this repository</span>
      </Stack>
    </Stack>
  )
}
