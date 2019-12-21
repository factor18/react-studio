import React from 'react'

import isObject from './utils/isObject'
import parseChild from './utils/parseChild'

const render = (config, data={}, renderProps={}, mapping={}, utils={}, key=null) => {
  let { component: RenderComponent, children: childConfig, actions, props } = config
  const mappedActions = {}

  Object.entries(actions || []).map(([ entry, value ]) => {
    mappedActions[entry] = (...args) => renderProps.dispatch(value, ...args)
  })

  if(mapping[RenderComponent]) RenderComponent = mapping[RenderComponent]

  return (
    <RenderComponent {...props} {...mappedActions} key={key}>
      {(childConfig || []).map((child, index) =>
        isObject(child) ?
          render(child, data, renderProps, mapping, utils, index) :
          parseChild(child, { $data: data })
      )}
    </RenderComponent>
  )
}

export default render
