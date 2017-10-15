<template>
    <div class="loginIn">
        <h1>输入密码</h1>
        <p>欢迎回来</p>
            <div class="password">
                <img src="../../../../static/img/login/password.png" height="20" width="20" alt="">
                <Input v-model="pwd" placeholder="请输入密码" type="password" style="width: 300px"></Input>
                <span class="wrongPWD">{{wrongtip}}</span>
                <a href="javascript:;" class="forgetpwd" @click="find">忘记密码?</a>
            </div>
            <div class="login-btn">
                <Button type="info"  @click="login" :loading="loading">登录</Button>
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
                wrongtip:"",
                loading:false,
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
                this.loading=true;
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
                        //首次登陆跳转引导页，强制修改密码弹窗出现
                        if (res.data.has_first_logined==0) {
                            r_this.$store.state.firstlogin=true
                            r_this.$router.push("/bootpage") 
                        }else{
                            r_this.$router.push("/summary") 
                        }
                        
                        
                    }else if (res.status=='102001') {
                        r_this.$router.push("/summary") 
                        
                    }else{
                        r_this.wrongtip=res.info;

                        r_this.loading=false;
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