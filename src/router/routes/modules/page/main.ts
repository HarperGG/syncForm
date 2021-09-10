import { AppRouteModule } from "@/router/types"

const page: AppRouteModule = {
  path: "/page-demo",
  name: "PageDemo",
  component: () => {},
  redirect: "/page-demo/form/basic",
  meta: {
    orderNo: 20,
    icon: "ion:aperture-outline",
    title: "page-demo"
  },
  children: [
    {
      path: "form",
      name: "FormPage",
      redirect: "/page-demo/form/basic",
      component: () => Promise.resolve({ name: "test" }),
      meta: {
        title: "form"
      },
      children: [
        {
          path: "basic",
          name: "FormBasicPage",
          component: () => {},
          meta: {
            title: "basic"
          }
        }
      ]
    }
  ]
}

export default page
