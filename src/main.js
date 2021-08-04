import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import store from './store';
import {
  loadStyle
} from './util/util';
import * as urls from '@/config/env';
import Element from 'element-ui';
import i18n from './lang'; // Internationalization
import './permission'; // 权限
import './error'; // 日志
import './styles/common.scss';

import basicContainer from './components/basic-container/main';

Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(window.AVUE, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'small'
});
import vuescroll from 'vuescroll';

// 注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('scroll', vuescroll);
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: '#9e9e9e61'
  }
};

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

// 动态加载阿里云字体库
urls.iconfontVersion.forEach((ele) => {
  loadStyle(urls.iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;
Vue.prototype.$dev = process.env.NODE_ENV == 'development';

window.addEventListener('message', (e) => {
  if (e.data.flag === 'safety-system') store.commit('SET_IFRAME', e);
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app');