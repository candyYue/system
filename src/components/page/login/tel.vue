<template>
    <div class="loginIn">
        <h1>手机号登录</h1>
        <p>欢迎回来</p>
            <div class="phone">
                <img src="../../../../static/img/login/cell.png" height="20" width="20" alt="">
                <input v-model="tel" placeholder="请输入手机号"></input>
                <span class="wrongTel">{{wrongTip}}</span>
            </div>
            <div class="login-btn">
                <button type="primary" @click="next">下一步</button>
            </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                tel: '',
                wrongTip:""
            }
        },
        methods: {
            next(){
                if (this.tel.trim()=='') {
                    this.wrongTip='请输入手机号'
                    return false;
                }else{
                    var r_this=this
                axios.post('/account/user/getBelongEps',qs.stringify({phone:this.tel.trim()}))
                .then(function(response){ 
                    var res=response.data
                    if (res.status==0) {
                        //存储手机号
                        if(!window.localStorage){
                            console.log("浏览器支持localstorage");
                            return false;
                        }else{
                            window.localStorage.setItem("phone",r_this.tel);
                            //对应一个企业
                            if (res.data.length==1) {  
                                //企业id 
                                window.localStorage.setItem("eid",res.data[0].id);
                                // r_this.$router.push("/password") 
                                r_this.$store.state.tel=false
                                r_this.$store.state.password=true
                                r_this.$store.state.company=false
                                r_this.$store.state.findpassword=false
                            }else{
                            //对应多个企业
                                // console.log(res.data);
                                r_this.$store.state.company=res.data
                                // r_this.$router.push("/company")

                                r_this.$store.state.tel=false
                                r_this.$store.state.password=false
                                r_this.$store.state.company=true
                                r_this.$store.state.findpassword=false
                            }
                        }
                        
                    };
                    if (res.status!==0) {
                        r_this.wrongTip=res.info
                    };
                })
                .catch(function(err){
                    console.log(err);
                });
                }
                
            }
        },
        mounted(){
            
        }
    }
</script>

<style scoped>
    @import "../../../../static/css/login/login.css";
    .phone{
        position: relative;
    }
    .phone input{
        padding-left: 30px;
        color: #000;
    }
    .wrongTel{
        position: absolute;
        top: 32px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .phone img{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }
</style>