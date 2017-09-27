<template>
    <div class="loginIn">
        <h1>找回密码</h1>
        <p>欢迎回来</p>
            <div class="findpassword">
                <div>
                    <img src="../../../../static/img/login/cell.png" height="20" width="20" alt="" class="cell">
                    <input v-model='tel' class="tel" disabled="disabled" /></input>  
                </div>
                <div>
                    <input placeholder="请输入验证码" class="vcode" v-model="vcode"></input>
                    <button class="getvcode" @click="getvcode">
                      <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
                      <span v-if="!sendMsgDisabled">获取验证码</span>
                    </button>
                </div>
                <div>
                    <input placeholder="请输入6-16位密码" class="newpwd" type="password" v-model="newpwd"></input>
                    <div class="pwdeye"></div>
                </div>
                <div>
                    <input placeholder="请再次输入密码" class="pwdagain" type="password" v-model="pwdagain" @blur="check"></input>
                </div>
                <span class="wrong">{{checkmsg}}</span>
            </div>
            <div class="login-btn">
                <button type="primary" @click="check">登录</button>
            </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                tel:'',
                newpwd:"",
                pwdagain:"",
                vcode:'',
                checkmsg:"",
                time:60,
                sendMsgDisabled:false,
            }
        },
        methods: {
            check(){
                var that=this
                if (this.newpwd!=this.pwdagain) {
                    this.checkmsg="密码输入不一致";
                    return
                }
                if(this.newpwd.trim()==""||this.pwdagain.trim()==""){
                    this.checkmsg="输入不能为空";
                    return
                }
                this.loginvcode()

            },

            loginvcode(){
                var r_this=this
                axios.get('/account/user/resetPwd',{
                    params:{
                        eid:window.localStorage.getItem("eid"),
                        phone:window.localStorage.getItem("phone"),
                        new_password:r_this.newpwd,
                        vcode:r_this.vcode
                    }
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.status==0) {
                        r_this.$Message.success('密码重置成功');
                        r_this.$router.push("/bootpage") 
                        // r_this.$store.state.tel=false
                        // r_this.$store.state.password=true
                        // r_this.$store.state.company=false
                        // r_this.$store.state.findpassword=false
                  }else{
                        this.checkmsg=response.data.info
                  }
                })
                .catch(function (error) {
                  console.log(error);
                })
            },
            login(){
                var r_this=this
                axios.post('/account/user/Login', qs.stringify({
                    phone:window.localStorage.getItem("phone"),
                    eid:window.localStorage.getItem("eid"),
                    pwd:this.newpwd
                }))
                  .then(function (response) {
                    var res=response.data
                    console.log(res);
                    if (res.status==0) {
                        window.localStorage.setItem("username",res.data.username);
                        if (res.data.last_login_time==""||res.data.last_login_ip=="") {
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
                
            },
            getvcode(){
                let that = this;
                that.sendMsgDisabled = true;
                let interval = window.setInterval(function() {
                if ((that.time--) <= 0) {
                    that.time = 60;
                    that.sendMsgDisabled = false;
                    window.clearInterval(interval);
                    }
                }, 1000);     

                axios.get('/account/user/sendVcode',{
                    params: {
                        eid:window.localStorage.getItem("eid"),
                            phone:that.tel
                        }
                    })
                    .then(function (response) {
                        console.log(response)
                        if (response.data.status==0) {
                            that.$Message.success('短信验证码已发送，请查收');   
                        }else{
                            that.checkmsg=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });          
            }
        },
        mounted(){
            this.tel=window.localStorage.getItem("phone")
        }
    }
</script>

<style scoped>
    @import "../../../../static/css/login/login.css"; /* login页面公共样式 */
    .findpassword{
        position: relative;
    }
    .wrongPWD{
        position: absolute;
        top: 2rem;
        left: 4.375rem;
        font-size:0.875rem;
        color: #ff5e5e;
        line-height: 1.5rem;
    }
    .forgetpwd{
        position: absolute;
        top: 2rem;
        right: 4.0625rem;
        font-size:0.875rem;
        color: #03a9f4;
        line-height: 1.5rem;
    }
    .tel{
        padding-left: 1.875rem;
    }
    .vcode,.newpwd,.pwdagain{
        width: 18.75rem;
    }
    .findpassword>div{
        position: relative;
        margin-bottom: 0.75rem;
    }
    .cell{
        position: absolute;
        left: 5.3125rem;
        bottom: 0.5rem;
    }
     .wrong{
        position: absolute;
        bottom: -1.5625rem;
        left: 5.3125rem;
        font-size:0.875rem;
        color: #ff5e5e;
        line-height: 1.5rem;
    }
    .getvcode{
        position: absolute;
        right: 5.3125rem;
        bottom: 0.5rem;
        font-size: 0.875rem;
        color: #03a9f4;
        border:none;
        cursor: pointer;
    }
    .pwdeye{
        width: 2rem;
        height: 2rem;
        background:url(../../../../static/img/login/da.png) no-repeat center;
        position: absolute;
        right: 5.3125rem;
        top: 0;
    }
    .newpwd:focus~.pwdeye{
        background:url(../../../../static/img/login/mr.png) no-repeat center;
    }
</style>