/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { Plugin } from "vite"

import html from "vite-plugin-html"

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE } = env

  const htmlPlugin: Plugin[] = html({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      injectData: {
        title: VITE_GLOB_APP_TITLE
      }
    }
  })
  return htmlPlugin
}
