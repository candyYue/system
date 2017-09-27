<template>
    <div class="temp1">
            
        <div class="link">
            <router-link to="/link">线索池</router-link>
            <router-link to="/phoneresult">通话结果管理</router-link>
        </div>
        

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
        margin-bottom: 5rem;
    }
    .link{
        margin:1.25rem 0; 
        height: 46;
        line-height: 2.875rem;
        border-bottom: 1px solid #ccc;
    }
    a{
        font-size: 1rem;
        color: #333;
        padding: 0.875rem;
        background-color: #f4f4f4;
        border: 1px solid #ccc;
        border-radius: 5px 5px 0 0;
        border-bottom: 3px solid #fff
    }
    .link a:nth-of-type(1){
        margin-left: 10px;
    }
    .router-link-active {
        background-color: #fff;
        border-top: 3px solid #00b5ff;
        
    }
</style>