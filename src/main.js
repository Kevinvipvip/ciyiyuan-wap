import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import Axios from 'axios'
//
// Vue.prototype.$axios = Axios;

import 'vant/lib/index.css'
import './vant-import' // 引入需要的vant组件

Vue.config.productionTip = false;
// 引入工具js
import utils from './utils'

Vue.prototype.utils = utils;

// 公共配置
import config from './config'

Vue.prototype.config = config;

// 引入视频播放插件
import VideoPlayer from 'vue-video-player';

require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
Vue.use(VideoPlayer);

// 公共组件
import Header from './components/Header'
import Footer from './components/Footer'

Vue.component('Header', Header);
Vue.component('Footer', Footer);

// 设置1rem是屏幕的1/10宽
window.onresize = setHtmlFontSize;

function setHtmlFontSize() {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = htmlWidth / 10 + 'px'
}

setHtmlFontSize();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
