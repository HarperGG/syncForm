import { AppRouteRecordRaw, AppRouteModule } from "@/router/types"

import { REDIRECT_ROUTE } from "./basic"

import { PageEnum } from "@/enums/pageEnum"

const modules = import.meta.globEager("./modules/**/*.ts")

const routeModuleList: AppRouteModule[] = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [...routeModuleList]

export const RootRoute: AppRouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root"
  }
}

// Basic routing without permission
export const basicRoutes = [RootRoute, REDIRECT_ROUTE]
