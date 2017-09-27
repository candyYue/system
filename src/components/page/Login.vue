<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="loginLeft">
                <img src="../../../static/img/login/logo.png" height="80" width="80" alt="">
                <p>
                    <span>
                        —————— 南京易米云通网络科技有限公司 版本所有 ——————
                    </span>
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
            // console.log(this.$store.state.phone)
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
        box-shadow: 5px 5px  10px 0 #76c3e7
    }
    .loginLeft p{
        width: 100%;
        position: absolute;
        text-align: center;
        bottom: 16px;
    }
    .loginRight{
        text-align: center;
        float: right;
        width: 466px;
        height: 100%;
        background-color: #fff;
    }
</style>