import React from 'react'
import {TreeView} from '@primer/react/drafts'

export default function ThemeReferenceTree({themeData}) {
  return (
    <TreeView>
      <RecursiveTree property={themeData} propertyName="Theme Data" />
    </TreeView>
  )
}
function RecursiveTree({property, propertyName}) {
  return (
    <>
      {property ? (
        typeof property === 'number' || typeof property === 'string' || typeof property === 'boolean' ? (
          <TreeView.Item>
            {propertyName} : {property && property.toString()}
          </TreeView.Item>
        ) : (
          <>
            <TreeView.Item>
              {propertyName} :
              <TreeView.SubTree>
                {Object.values(property).map((childProperty, index) => (
                  <RecursiveTree
                    key={index}
                    property={childProperty}
                    propertyName={Object.getOwnPropertyNames(property)[index]}
                  />
                ))}
              </TreeView.SubTree>
            </TreeView.Item>
          </>
        )
      ) : (
        <span>empty</span>
      )}
    </>
  )
}
