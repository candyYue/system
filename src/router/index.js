import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {  //默认
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme', //统计中心 头部+侧边栏
            component: resolve => require(['../components/common/Home.vue'], resolve), 
            children:[                
                {   // 统计概况
                    path: '/summary',
                    component: resolve => require(['../components/page/summary.vue'], resolve),
                    // children:[
                    //     {
                    //     path: '/',
                    //     component: resolve => require(['../components/page/formchart/day.vue'], resolve)   // 默认日报组件
                    //     },
                    //     {
                    //     path: '/day',
                    //     component: resolve => require(['../components/page/formchart/day.vue'], resolve)   // 日报组件
                    //     },
                    //     {
                    //     path: '/month',
                    //     component: resolve => require(['../components/page/formchart/month.vue'], resolve)   // 月报组件
                    //     },
                    //     {
                    //     path: '/year',
                    //     component: resolve => require(['../components/page/formchart/year.vue'], resolve)   // 年报组件
                    //     }
                    // ]
                },
                {   // 坐席统计
                    path: '/count',
                    component: resolve => require(['../components/page/count.vue'], resolve)
                },
                {  //线索池
                    path: '/link',
                    component: resolve => require(['../components/page/link.vue'], resolve),
                    children:[
                        {
                        path: '/',
                        component: resolve => require(['../components/page/link/linkers.vue'], resolve),  // 默认线索池组件
                        },
                        {
                        path: '/phoneresult',
                        component: resolve => require(['../components/page/link/phoneresult.vue'], resolve)   // 通话结果管理组件
                        }
                    ]
                },
                {    // 坐席管理
                    path: '/manage',
                    component: resolve => require(['../components/page/manage.vue'], resolve) 
                },
                {  // 通话记录
                    path: '/callhistory', 
                    component: resolve => require(['../components/page/callhistory.vue'], resolve)
                }
            ]
        },
        { //登录
            path: '/login',  
            component: resolve => require(['../components/page/Login.vue'], resolve),
          
        },
        {
            path: '/bootpage', //引导页
            component: resolve => require(['../components/common/table.vue'], resolve), 
        }

    ]
})
