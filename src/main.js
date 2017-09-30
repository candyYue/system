import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import iView from 'iview'
// import 'iview/dist/styles/iview.css'   // 使用 iviewCSS

import "babel-polyfill";//ie9和一些低版本的高级浏览器对es6新语法的兼容
// import "../static/js/echarts.common.min.js"
import Vuex from 'vuex';
import store from './vuex/store'

Vue.use(Vuex)

Vue.use(iView)
import '../theme/dist/iview.css'
import "../static/css/main.css";
import "../static/css/public.css";

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
