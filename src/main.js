import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // element-ui默认主题CSS
import iView from 'iview'
import 'iview/dist/styles/iview.css'   // 使用 iviewCSS
import "babel-polyfill";//ie9和一些低版本的高级浏览器对es6新语法的兼容
// import "../static/js/echarts.common.min.js"
import Vuex from 'vuex';
import store from './vuex/store'

Vue.use(Vuex)

Vue.use(iView)
Vue.use(ElementUI);


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');