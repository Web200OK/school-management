import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'


import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axios from 'axios';
// import vueAxios from 'vue-axios';


import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

axios.defaults.baseURL = 'http://127.0.0.1:6789';

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
createApp(App)
    .use(router)
    .use(ElementPlus, {
        locale
    })
    .mount('#app')