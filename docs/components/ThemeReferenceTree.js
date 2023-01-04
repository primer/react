import React, {useEffect, useState} from 'react'
import {Box, Text} from '@primer/react'
import {TreeView} from '@primer/react/drafts'

export default function ThemeReferenceTree({themeData}) {
  return (
    <Box mb={4} borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={6} p={2}>
      <TreeView>
        <RecursiveTree property={themeData} propertyName="theme" isRootParentNode={true} />
      </TreeView>
    </Box>
  )
}

function RecursiveTree({property, propertyName, isRootParentNode = false}) {
  const [expanded, setExpanded] = useState(isRootParentNode)
  return (
    <>
      {property ? (
        typeof property === 'number' || typeof property === 'string' || typeof property === 'boolean' ? (
          <TreeView.Item>
            <Text fontWeight="bold">{propertyName}</Text> : {property && property.toString()}
          </TreeView.Item>
        ) : (
          <>
            <TreeView.Item expanded={expanded} onExpandedChange={setExpanded}>
              <Text fontWeight="bold">{propertyName}</Text> :
              <TreeView.SubTree>
                {Object.values(property).map((childProperty, index) => (
                  <RecursiveTree
                    key={index}
                    property={childProperty}
                    propertyName={Object.getOwnPropertyNames(property)[index]}
                    isRootParentNode={false}
                  />
                ))}
              </TreeView.SubTree>
            </TreeView.Item>
          </>
        )
      ) : (
        <TreeView.Item>
          <Text fontWeight="bold">0</Text> : 0
        </TreeView.Item>
      )}
    </>
  )
}
