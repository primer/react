import {
  BookIcon,
  ChecklistIcon,
  CodeIcon,
  CommentDiscussionIcon,
  FileDiffIcon,
  GearIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  GraphIcon,
  IssueOpenedIcon,
  PackageIcon,
  PeopleIcon,
  PlayIcon,
  ProjectIcon,
  RepoIcon,
  ShieldLockIcon,
  StarIcon,
  ThreeBarsIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Avatar} from '../Avatar'
import {BranchName} from '../BranchName'
import {Button} from '../Button'
import {Heading} from '../Heading'
import {Link} from '../Link'
import {StateLabel} from '../StateLabel'
import {Text} from '../Text'
import {UnderlineNav} from './UnderlineNav'

const meta = {title: 'React Tailwind/Navigation/UnderlineNav/Examples', component: UnderlineNav} satisfies Meta<
  typeof UnderlineNav
>
export default meta
type Story = StoryObj<typeof meta>

export const PullRequestPage: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <Heading as="h1" className="m-0 font-normal">
          Switch to new UnderlineNav <span className="font-light text-muted">#1111</span>
        </Heading>
        <div className="flex items-center gap-2">
          <StateLabel status="pullOpened">Open</StateLabel>
          <span className="text-sm text-muted">
            <Link href="#" muted className="font-semibold">
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
          </span>
        </div>
      </div>
      <UnderlineNav aria-label="Pull Request">
        <UnderlineNav.Item aria-current="page" counter="0" leadingVisual={<CommentDiscussionIcon />}>
          Conversation
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={3} leadingVisual={<GitCommitIcon />}>
          Commits
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={7} leadingVisual={<ChecklistIcon />}>
          Checks
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={4} leadingVisual={<FileDiffIcon />}>
          Files Changes
        </UnderlineNav.Item>
      </UnderlineNav>
    </div>
  ),
}

const repositoryItems: {navigation: string; icon: React.ReactElement; counter?: number | string; href?: string}[] = [
  {navigation: 'Code', icon: <CodeIcon />, href: '#code'},
  {navigation: 'Issues', icon: <IssueOpenedIcon />, counter: '12K', href: '#issues'},
  {navigation: 'Pull Requests', icon: <GitPullRequestIcon />, counter: 13, href: '#pull-requests'},
  {navigation: 'Discussions', icon: <CommentDiscussionIcon />, counter: 5, href: '#discussions'},
  {navigation: 'Actions', icon: <PlayIcon />, counter: 4, href: '#actions'},
  {navigation: 'Projects', icon: <ProjectIcon />, counter: 9, href: '#projects'},
  {navigation: 'Insights', icon: <GraphIcon />, counter: '0', href: '#insights'},
  {navigation: 'Settings', icon: <GearIcon />, counter: 10, href: '#settings'},
  {navigation: 'Security', icon: <ShieldLockIcon />, href: '#security'},
]

function RepositoryNavigation({items}: {items: typeof repositoryItems}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1)
  return (
    <UnderlineNav aria-label="Repository">
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          aria-current={index === selectedIndex ? 'page' : undefined}
          counter={item.counter}
          href={item.href}
          leadingVisual={item.icon}
          onSelect={event => {
            event.preventDefault()
            setSelectedIndex(index)
          }}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const ReposPage: Story = {
  render: () => <RepositoryNavigation items={repositoryItems} />,
}

const profileItems: typeof repositoryItems = [
  {navigation: 'Overview', icon: <BookIcon />, href: '#overview'},
  {navigation: 'Repositories', icon: <RepoIcon />, counter: '12', href: '#repositories'},
  {navigation: 'Projects', icon: <ProjectIcon />, counter: 3, href: '#projects'},
  {navigation: 'Packages', icon: <PackageIcon />, counter: '0', href: '#packages'},
  {navigation: 'Stars', icon: <StarIcon />, counter: '0', href: '#stars'},
  {navigation: 'Activity', icon: <ThreeBarsIcon />, counter: 67, href: '#activity'},
]

export const ProfilePage: Story = {
  render: () => (
    <div>
      <div className="mb-4">
        <RepositoryNavigation items={profileItems} />
      </div>
      <div className="flex items-start gap-4">
        <div className="flex h-full flex-col items-start">
          <Avatar size={256} src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="mona user avatar" />
          <div>
            <div className="py-4">
              <Heading as="h1" style={{fontSize: 24}}>
                Monalisa Octocat
              </Heading>
              <Heading as="h1" size="medium" className="m-0 font-light leading-normal">
                mona
              </Heading>
            </div>
            <div className="flex flex-col text-on-emphasis">
              <Button block>Edit Profile</Button>
              <div className="mt-4 flex items-center">
                <PeopleIcon className="mr-1" size={16} />
                <Link href="https://github.com" muted className="mr-2">
                  47 Followers
                </Link>
                <span> · </span>
                <Link href="https://github.com" muted className="ml-2">
                  54 Following
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 box-border h-[300px] w-4/5 rounded-lg border-thin border-default p-6">
          <Text> mona/README.md</Text>
        </div>
      </div>
    </div>
  ),
}
