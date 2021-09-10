import { Plugin } from "vite"

import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

import windiCSS from "vite-plugin-windicss"
import { configHtmlPlugin } from "./html"

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {} = viteEnv

  const vitePlugins: (Plugin | Plugin[])[] = [vue(), vueJsx()]

  // vite-plugin-windicss
  vitePlugins.push(windiCSS())

  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  return vitePlugins
}
