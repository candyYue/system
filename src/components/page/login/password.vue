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
                        if (res.data.first_login) {
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
        padding-left: 1.875rem;
        color: #000;
    }
    .wrongPWD{
        position: absolute;
        top: 2rem;
        left: 5.3125rem;
        font-size:0.875rem;
        color: #ff5e5e;
        line-height: 1.5rem;
    }
    .forgetpwd{
        position: absolute;
        top: 2rem;
        right: 5.3125rem;
        font-size:0.875rem;
        color: #03a9f4;
        line-height: 1.5rem;
    }
    .password img{
        position: absolute;
        left: 5.3125rem;
        bottom: 0.5rem;
    }

</style>