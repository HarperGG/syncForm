// Register windi
import "virtual:windi.css"
import naive from "naive-ui"

import "vfonts/Lato.css"

import { createApp } from "vue"
import App from "./App.vue"

async function bootstrap() {
  const app = createApp(App)
  app.use(naive)
  app.mount("#app")
}

void bootstrap()
