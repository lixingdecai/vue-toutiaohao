// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ECharts from 'vue-echarts';
import Element from 'element-ui';

import 'es6-promise/auto';
import 'assets/javascripts/polyfill';
import 'assets/stylesheets/reset.scss';
import 'assets/stylesheets/index.scss';
import 'assets/stylesheets/ie.scss';
// import 'element-ui/lib/theme-default/index.css';
import '../theme/index.css';

import router from './router';
import store from './store';
import filters from './filters';
import App from './App';
// import API from './service';

Vue.use(Element);
Vue.component('chart', ECharts);

// API.init();

Vue.config.devtools = process.env.DEBUG_MODE;

// 注册全局自定义过滤器
Object.keys(filters).forEach(v => {
  Vue.filter(v, filters[v]);
});

// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: el => {
    // 聚焦元素
    el.focus();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
