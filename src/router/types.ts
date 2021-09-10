import { RouteRecordRaw, RouteMeta } from "vue-router"
import { defineComponent } from "vue"

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import("*.vue")>)
  | (() => Promise<T>)

type Recordable<T = any> = {
  [x: string]: T
}
// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, "meta"> {
  name: string
  meta: RouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export type AppRouteModule = AppRouteRecordRaw
