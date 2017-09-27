<template>
    <div>
        <div class="loginIn">
            <h1>选择企业</h1>
            <p>欢迎回来</p>
                <div class="company">
                         <Select v-model="model" style="width:300px" @on-change="getcid" placeholder='请选择企业'>
                            <Option v-for="(item,index) in company" :value="index" ref="button">{{item.name}}</Option>
                        </Select>
                        <!-- <button v-for="(item,index) in company" :value="index" @click="getcid(index)" ref="button">{{item.name}}</button> -->

                    
                    <span class="wrongTel">{{wrongTip}}</span>
                </div>
                <div class="login-btn">
                    <button type="primary" @click="next" class="next">下一步</button>
                </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
    import qs from 'qs';
    export default {
        data () {
            return {
                company:[],
                choose:-1,
                wrongTip:'',
                model: ""
            }
        },
        methods: {
            getcid(index){
                console.log(this.company[index])
                window.localStorage.setItem("eid",this.company[index].id); 
                window.localStorage.setItem("companyname",this.company[index].name); 
                this.choose=index;  
            },
            next(){
                var button=this.$refs.button;
                if (this.choose>-1) {
                    this.wrongTip=''
                    // this.$router.push("./password")
                    this.$store.state.tel=false
                    this.$store.state.password=true
                    this.$store.state.company=false
                    this.$store.state.findpassword=false
                }else{
                    this.wrongTip='请选择企业'
                }
            }
        },
        mounted(){
            var r_this=this
                var phone=window.localStorage.getItem("phone")
                console.log(phone)
                axios.post('/account/user/getBelongEps', qs.stringify({phone:phone}))
                  .then(function (response) {
                    r_this.company=response.data.data
                  })
                if(this.$store.state.eid){
                    // this.$router.push("/password") 
                    this.$store.state.tel=false
                    this.$store.state.password=true
                    this.$store.state.company=false
                    this.$store.state.findpassword=false
                }
        }
    }
</script>

<style scoped>
    @import "../../../../static/css/login/login.css";
    .company{
        position: relative;
    }
    .company button{
        width: 18.75rem;
        height: 2.625rem;
        border: 1px solid #d8d8d8;
        border-radius: 2px;
        cursor: pointer;
    }
    .company button:nth-of-type(2){
        margin:0.75rem 0; 
    }
    .onfocus{
        background-color: #03a9f4;
        color: #fff;
    }
    .wrongTel{
        position: absolute;
        bottom: -0.9375rem;
        left: 5.3125rem;
        font-size:0.875rem;
        color: #ff5e5e;
        line-height: 1.5rem;
    }
</style>