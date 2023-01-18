import {ComponentMeta, ComponentStory} from '@storybook/react'
import React from 'react'
import {Table, TableHead, TableHeader, TableCell, TableBody, TableRow} from '../DataTable'
import Label from '../Label'
import LabelGroup from '../LabelGroup'
import RelativeTime from '../RelativeTime'

export default {
  title: 'Drafts/Components/DataTable',
  component: Table,
  subcomponents: {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  },
} as ComponentMeta<typeof Table>

const now = Date.now()
const Second = 1000
const Minute = 60 * Second
const Hour = 60 * Minute
const Day = 24 * Hour
const Week = 7 * Day
const Month = 4 * Week

const data = [
  {
    id: 1,
    name: 'codeql-dca-worker',
    type: 'internal',
    updatedAt: now,
    securityFeatures: {
      dependabot: ['alerts', 'security updates'],
      codeScanning: ['report secrets'],
    },
  },
  {
    id: 2,
    name: 'aegir',
    type: 'public',
    updatedAt: now - 5 * Minute,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: ['report secrets'],
    },
  },
  {
    id: 3,
    name: 'strapi',
    type: 'public',
    updatedAt: now - 1 * Hour,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 4,
    name: 'codeql-ci-nightlies',
    type: 'public',
    updatedAt: now - 6 * Hour,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    id: 5,
    name: 'dependabot-updates',
    type: 'public',
    updatedAt: now - 1 * Day,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 6,
    name: 'tsx-create-react-app',
    type: 'public',
    updatedAt: now - 1 * Week,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 7,
    name: 'bootstrap',
    type: 'public',
    updatedAt: now - 1 * Month,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    id: 8,
    name: 'docker-templates',
    type: 'public',
    updatedAt: now - 3 * Month,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
]

function uppercase(input: string): string {
  return input[0].toUpperCase() + input.slice(1)
}

export const Playground: ComponentStory<typeof Table> = args => {
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Repository</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Updated</TableHeader>
          <TableHeader>Dependabot</TableHeader>
          <TableHeader>Code scanning</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(row => {
          return (
            <TableRow key={row.id}>
              <TableCell scope="row">{row.name}</TableCell>
              <TableCell>
                <Label>{uppercase(row.type)}</Label>
              </TableCell>
              <TableCell>
                <RelativeTime date={new Date(row.updatedAt)} />
              </TableCell>
              <TableCell>
                {row.securityFeatures.dependabot.length > 0 ? (
                  <LabelGroup>
                    {row.securityFeatures.dependabot.map(feature => {
                      return <Label key={feature}>{uppercase(feature)}</Label>
                    })}
                  </LabelGroup>
                ) : null}
              </TableCell>
              <TableCell>
                {row.securityFeatures.codeScanning.length > 0 ? (
                  <LabelGroup>
                    {row.securityFeatures.codeScanning.map(feature => {
                      return <Label key={feature}>{uppercase(feature)}</Label>
                    })}
                  </LabelGroup>
                ) : null}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

Playground.args = {
  density: 'normal',
}

Playground.argTypes = {
  density: {
    control: {
      type: 'radio',
    },
    type: {
      name: 'enum',
      value: ['condensed', 'normal', 'spacious'],
    },
  },
}
