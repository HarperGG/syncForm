import { AppRouteRecordRaw } from "@/router/types"
import { REDIRECT_NAME } from "@/router/constant"

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: "/redirect",
  name: REDIRECT_NAME,
  component: () => {},
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: REDIRECT_NAME,
      component: () => {},
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true
      }
    }
  ]
}
