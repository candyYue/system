<template>
    <div class="loginIn">
        <h1>输入密码</h1>
        <p>欢迎回来</p>
            <div class="password">
                <img src="../../../../static/img/login/password.png" height="20" width="20" alt="">
                <input v-model="pwd" placeholder="请输入密码" type="password"></input>
                
                <span class="wrongPWD">{{wrongtip}}</span>
                <a href="javascript:;" class="forgetpwd" @click="find">忘记密码?</a>
            </div>
            <div class="login-btn">
                <button type="primary" @click="login">登录</button>
            </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                pwd: '',
                wrongtip:""
            }
        },
        methods: {
            find(){
                // this.$router.push("/findpassword")
                this.$store.state.tel=false
                this.$store.state.password=false
                this.$store.state.company=false
                this.$store.state.findpassword=true
            },
            login(){
                var r_this=this
                axios.post('/account/user/Login', qs.stringify({
                    phone:window.localStorage.getItem("phone"),
                    eid:window.localStorage.getItem("eid"),
                    pwd:this.pwd
                }))
                  .then(function (response) {
                    var res=response.data
                    console.log(res);
                    if (res.status==0) {
                        window.localStorage.setItem("username",res.data.username);
                        if (res.data.has_first_logined==0) {
                            r_this.$store.state.firstlogin=true
                            r_this.$router.push("/bootpage") 
                        }else{
                            r_this.$router.push("/day") 
                        }
                        
                        
                    }else if (res.status==102001) {
                        r_this.$router.push("/day") 
                        
                    }else{
                        r_this.wrongtip=res.info
                    };
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
            }
        }
    }
</script>

<style scoped>
    @import "../../../../static/css/login/login.css";
    .password{
        position: relative;
    }
    .password input{
        padding-left: 30px;
        color: #000;
    }
    .wrongPWD{
        position: absolute;
        top: 32px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .forgetpwd{
        position: absolute;
        top: 32px;
        right: 85px;
        font-size:14px;
        color: #03a9f4;
        line-height: 24px;
    }
    .password img{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }

</style>