import path from "path"
import { ConfigEnv, UserConfig, loadEnv } from "vite"
import { wrapperEnv } from "./build/utils"
import { createVitePlugins } from "./build/vite/plugin"
import { OUTPUT_DIR } from "./build/constant"

import pkg from "./package.json"
import moment from "moment"

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format("YYYY-MM-DD HH:mm:ss")
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv
  const isBuild = command === "build"

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      // 导入别名
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      target: "es2015",
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE
        }
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  }
}
