<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="loginLeft">
                <img src="../../../static/img/login/logo.png" height="80" width="80" alt="">
                <p class="title">云电销管理后台</p>
                <p class='logotext'>
                    <span>南京易米云通网络科技有限公司 版权所有</span>
                </p>
            </div>
            <div class="loginRight">
                <!-- <router-view></router-view> -->
                <tel v-if="$store.state.tel"></tel>
                <password v-if="$store.state.password"></password>
                <company v-if="$store.state.company"></company>
                <findpassword v-if="$store.state.findpassword"></findpassword>

            </div>
            
        </div>
    </div>
</template>

<script>
import tel from './login/tel.vue' 
import password from './login/password.vue' 
import company from './login/company.vue' 
import findpassword from './login/findpassword.vue' 
    export default {
        data: function(){
            return {
                
            }
        },
        components: {
            tel,
            password,
            company,
            findpassword,
        },
        methods: {
            
        },
        mounted(){
            //禁止页面后退
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: linear-gradient(to bottom right, #dedcf1, #aecae2);
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%); 
        width:1066px;
        height:600px;
        box-shadow: 5px 5px  10px 0 #a5c8df
    }
    .title{
        font-size: 30px;
        position: absolute;
        top: 200px;
        left: 50%;
        transform:translateX(-50%) 
    }
    .loginLeft{
        float: left;
        width: 600px;
        height: 100%;
        background: url(../../../static/img/login/bg.png) no-repeat center;
        color: #fff;
        font-size: 14px;
        position: relative;
    }
    .loginLeft img{
        position: absolute;
        top: 112px;
        left: 50%;
        transform:translate(-50%);
        box-shadow: 5px 5px  10px #76c3e7
    }
    .logotext{
        width: 100%;
        position: absolute;
        text-align: center;
        bottom: 16px;
    }
    .logotext span{
        z-index:2;
        position: relative;
        padding:0 10px;
    }
    .logotext:before{
        content: '';
        display: inline-block;
        width:107px;
        height:1px;
        background-color:#fff;
        position:absolute;
           bottom:50%;
           z-index:1;
           left:60px;
           opacity: .8
    }
    .logotext:after{
        content: '';
        display: inline-block;
        width:107px;
        height:1px;
        background-color:#fff;
        position:absolute;
        bottom:50%;
        z-index:1;
        right:60px;
        opacity: .8
    }
    .loginRight{
        text-align: center;
        float: right;
        width: 466px;
        height: 100%;
        background-color: #fff;
    }
</style>