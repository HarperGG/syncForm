import { Component } from "vue"
import { ComponentType } from "./types/index"

/**
 * Component list, register here to setting it in the form
 */

const componentMap = new Map<any, Component>()

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
