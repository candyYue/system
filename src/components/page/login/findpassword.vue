<template>
    <div class="loginIn">
        <h1>找回密码</h1>
        <p>欢迎回来</p>
            <div class="findpassword">
                <div>
                    <img src="../../../../static/img/login/cell.png" height="20" width="20" alt="" class="cell">
                    <span style="width: 300px"  class="tel">{{tel}}</span>
                </div>
                <div>
                    <Input v-model="vcode" placeholder="请输入验证码" type="password"  style="width: 300px"></Input>
                    <Button  class="getvcode" @click="getvcode">
                      <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
                      <span v-if="!sendMsgDisabled">获取验证码</span>
                    </Button>
                </div>
                <div>
                    <Input v-model="newpwd" placeholder="请输入8-16位密码" type="password"  style="width: 300px" class="newpwd" @on-focus="eyedisable" @on-blur='eyeable'></Input>
                    
                    <Icon :type="pwdeye" class='pwdeye'></Icon>
                </div>
                <div>
                    <Input v-model="pwdagain" placeholder="请再次输入密码" type="password"  style="width: 300px"></Input>
                </div>
                <span class="wrong">{{checkmsg}}</span>
            </div>
            <div class="login-btn">
                <Button type="info"  @click="check"  :loading="loading">登录</Button>
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
                pwdeye:'eye',
                loading:false,
                // <Icon type="eye-disabled"></Icon>
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
            eyedisable(){
                this.pwdeye='eye-disabled'
            },
            eyeable(){
                this.pwdeye='eye'
            },
            loginvcode(){
                this.loading=true;
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
                        r_this.$router.push("/summary")
                  }else{
                        r_this.checkmsg=response.data.info
                        r_this.loading=false;
                  }
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
        top: 32px;
        left: 70px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .forgetpwd{
        position: absolute;
        top: 32px;
        right: 65px;
        font-size:14px;
        color: #03a9f4;
        line-height: 24px;
    }
    .tel {
        display: inline-block;
        text-align: left;
        padding-left: 30px;
        border-bottom: 1px solid #ccc;
        height: 30px
    }

    .vcode,.newpwd,.pwdagain{
        width: 300px;
    }
    .findpassword>div{
        position: relative;
        margin-bottom: 12px;
    }
    .cell{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }
     .wrong{
        position: absolute;
        bottom: -40px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .getvcode{
        position: absolute;
        right: 85px;
        bottom: 1px;
        font-size: 14px;
        color: #03a9f4;
        border:none;
        background-color: #fff;
    }
    .pwdeye{
        font-size: 18px;
        color: #ccc;
        position: absolute;
        right: 90px;
        top: 2px;
    }
</style>