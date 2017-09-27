<template>
    <div class="temp1">
        <h3>统计概况</h3>

        <ul class="cate">
            <li><router-link to="/day">日报</router-link></li>
            <li><router-link to="/month">月报</router-link></li>
            <li class="choosetime"><router-link to="/year">年报</router-link></li>
            <!-- <li class="choosetime"><router-link to="/othertime">自定义时间</router-link></li> -->
        </ul>

        
        <router-view></router-view >
        
    </div>
</template>

<script>
    // import {myCommon} from '../../assets/common.js';
    import Schart from 'vue-schart';
    export default {
        data () {
            return {
                call:[]
            }
        },
    }
</script>

<style scoped>
    .cate{
        margin-top: 10px;
    }
    .cate li{
        text-align: center;
        float: left;
        width: 60px;
        line-height: 34px;
        border: 1px solid #ccc;
        border-right: 0;
        cursor: pointer;
        font-size: 14px;
    }
    .cate .choosetime{
        border-right: 1px solid #ccc
    }
    .router-link-active {
        color: #fff;
        background-color: #00b5ff;
    }
    li a{
        display: block;
        width: 100%;
        height: 100%;
    }
    
</style>