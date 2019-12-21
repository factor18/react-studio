import React, { Component } from 'react'
import objectPath from 'object-path'

import render from './render'
import parseChild from './utils/parseChild'

export default class Renderer extends Component {
  constructor() {
    super()
    this.state = {}
  }

  onUpdate = (state) => {
    const { onChange } = this.props
    this.setState(state, () => onChange(this.state))
  }

  helpers = {
    $utils: {
      updateData: (scope, { transformer, path, accessPath }) => {
        let value
        let { data } = this.state
        if(transformer) {
          value = this.executeAction(transformer, scope)
        } else {
          value = objectPath.get(scope, parseChild(accessPath.value, scope))
        }

        data = { ...data, [parseChild(path, scope)]: value }
        this.onUpdate({ data })
      }
    },
    $transformer: {
      inc: (scope, { args: argsConfig }) => {
        const [ value, by ] = parseChild(argsConfig, scope)
        return parseFloat(parseChild(value, scope)) + parseFloat(parseChild(by, scope))
      },
      dec: (scope, { args: argsConfig }) => {
        const [ value, by ] = parseChild(argsConfig, scope)
        return parseFloat(parseChild(value, scope)) - parseFloat(parseChild(by, scope))
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      data: (
        nextProps.value ??
        prevState.data ??
        nextProps.defaultValue
      )
    }
  }

  executeAction({ action: actionName, props, onSuccess, onError, finally: postHook }, scope) {
    const action = objectPath.get(this.helpers, actionName)
    
    try {
      const value = action(scope, props)
      return onSuccess ? this.executeAction(onSuccess, { ...scope, $value: value }) : value
    } catch(e) {
      console.error(e)
      onError && this.executeAction(onError, { ...scope, $error: error })
    } finally {
      postHook && postHook(scope)
    }
  }

  dispatch = (action, event) => {
    let value = null
    const { data } = this.state
    let { onEvent } = this.props
    const scope = { $data: data, $event: event }
    onEvent && onEvent({ action, scope })
    this.executeAction(action, scope)
  }

  render() {
    let { data } = this.state
    let { config, mapping } = this.props

    return render(config, data, { dispatch: this.dispatch }, mapping)
  }
}
