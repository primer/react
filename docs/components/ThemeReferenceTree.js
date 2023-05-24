import React, {useState} from 'react'
import {Box, Text, TreeView} from '@primer/react'

export default function ThemeReferenceTree({themeData}) {
  return (
    <Box mb={4} borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={6} p={2}>
      <TreeView>
        <RecursiveTree property={themeData} propertyName="theme" isRootTreeItem={true} />
      </TreeView>
    </Box>
  )
}

const isColor = strColor => {
  const s = new Option().style
  s.color = strColor
  return s.color !== ''
}

const getLeadingVisual = property => {
  const propertyStr = property.toString()
  if (isColor(propertyStr)) {
    return (
      <Box
        bg={`${propertyStr}`}
        width={16}
        height={16}
        borderRadius={1}
        boxShadow="inset 0px 0px 0px 1px rgba(0,0,0,0.125)"
      />
    )
  } else {
    return null
  }
}

const getPropertyType = property => {
  if (Array.isArray(property)) {
    return '[...]'
  }
  if (typeof property === 'object') {
    return '{...}'
  }
  return
}

function RecursiveTree({property, propertyName, isRootTreeItem = false}) {
  const [expanded, setExpanded] = useState(false)

  const isLeafItem = typeof property === 'number' || typeof property === 'string' || typeof property === 'boolean'
  const getItem = () => {
    if (isLeafItem) {
      return (
        <TreeView.Item>
          <TreeView.LeadingVisual>{getLeadingVisual(property)}</TreeView.LeadingVisual>
          <Text fontWeight="bold">{propertyName}</Text> : <Text>{property && property.toString()}</Text>
        </TreeView.Item>
      )
    } else if (isRootTreeItem) {
      return Object.values(property).map((childProperty, index) => (
        <RecursiveTree
          key={index}
          property={childProperty}
          propertyName={Object.getOwnPropertyNames(property)[index]}
          isRootTreeItem={false}
        />
      ))
    }
    return (
      <TreeView.Item expanded={expanded} onExpandedChange={setExpanded}>
        <Text fontWeight="bold">{propertyName}</Text>{' '}
        {!expanded && <Text color="fg.subtle">{getPropertyType(property)}</Text>}
        <TreeView.SubTree>
          {Object.values(property).map((childProperty, index) => (
            <RecursiveTree
              key={index}
              property={childProperty}
              propertyName={Object.getOwnPropertyNames(property)[index]}
              isRootTreeItem={false}
            />
          ))}
        </TreeView.SubTree>
      </TreeView.Item>
    )
  }

  return (
    <>
      {property ? (
        getItem()
      ) : (
        // Render an item for 0 values
        <TreeView.Item>
          <Text fontWeight="bold">0</Text> : 0
        </TreeView.Item>
      )}
    </>
  )
}
