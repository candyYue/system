<template>
    <div class="temp1">
            
        <ul class="link">
            <li class='linktab'><router-link to="/link">线索池</router-link></li>
            <li class='linktab'><router-link to="/phoneresult">通话结果管理</router-link></li>
        </ul>
        

        <router-view></router-view>
    </div>
</template>

<script>
    // import {myCommon} from '../../assets/common.js';
    export default {
        data() {
            return {
                
            }
        },
        
        methods: {
             
            
        }
    }
</script>

<style scoped>
    .temp1{
        margin-bottom: 80px;
    }
    .link{
        margin:20px 0;
        border-bottom: 1px solid #ccc;
    }
    .link .linktab{
        float: left;
        /* height: 50px;
        box-sizing: border-box; */
    }
    .link .linktab:nth-of-type(1){
        margin-left: 10px;
    }
    a{
        display: inline-block;
        line-height: 50px;
        height: 51px;
        padding: 0 20px;
        border: 1px solid #ccc;
        border-bottom: none;
        background-color: #f4f4f4;
        color: #000;
        /* box-sizing: border-box; */
    }
    .linktab:nth-of-type(1) a{
        border-right: none;
    }
    .router-link-active {
        background-color: #fff;
        border-top: 3px solid #00b5ff;
        border-bottom: 1px solid #fff
    }
</style>