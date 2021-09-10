import colors from "windicss/colors"
import { defineConfig } from "vite-plugin-windicss"

export default defineConfig({
  darkMode: "class",
  // 属性模式
  attributify: {
    prefix: "w:"
  },
  theme: {
    extend: {
      zIndex: {
        "-1": "-1"
      },
      colors: {
        ...colors
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1600px"
      }
    }
  }
})
