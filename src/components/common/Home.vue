<template>
    <div class="wrapper">        
        <div class="content" :class={bigcontent:isbigcontent}>
            <div class="header">
                <a href="javascript:;" class="toggle" @click="toogle"><Icon type="navicon"></Icon></a>
                <div class="user-info">
                    <span class="el-dropdown-link">
                        <span class="date">今天是{{datemg1}}，{{datemg2}}</span>
                        <span class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../../../static/img/img.jpg">
                        您好！云电销 - 管理员</span> 
                    </span>
                    <transition name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                        <div class="drop" v-if="dropshow">
                            <div class="dropup">
                                <img src="../../../static/img/img.jpg" alt="" class="userphoto">
                                <h4>{{companyname}} - 管理员</h4>
                                <p>登陆时间：{{datemg1}}，{{datemg2}}</p>
                            </div>
                            <div class="dropdown">
                                <button class="changpwd" @click="changepwd">修改密码</button>
                                <button class="signOut" @click="signOut">退出登录</button>
                            </div>
                        </div>
                </transition>
                </div>
            </div>

            <!-- 主体部分 -->
            <transition name="move" mode="out-in"><router-view></router-view></transition>
            
            <footer>copyright@20142015</footer>  
                          
        </div>
        <div class="sidebar":class={smallsidebar:issmallsidebar}>
            <div class="logo"><p>云电销企业后台管理</p></div>
            <el-menu default-active="2" class="el-menu-vertical-demo" theme="dark">
                <el-submenu index="1">
                    <template slot="title"><Icon type="ios-pie-outline"></Icon>统计中心</template>
                        <el-menu-item index="1-1"><router-link to="/day">统计概况</router-link></el-menu-item>
                        <el-menu-item index="1-2"><router-link to="/count">坐席统计</router-link></el-menu-item>
                </el-submenu>
                <el-menu-item index="2"><router-link to="/link"><Icon type="ios-paper-outline"></Icon>线索池</router-link></el-menu-item>
                <el-menu-item index="3"><router-link to="/manage"><Icon type="ios-grid-view-outline"></Icon>坐席管理</router-link></el-menu-item>
                <el-menu-item index="4"><router-link to="/callhistory"><Icon type="document"></Icon>通话记录</router-link></el-menu-item>
            </el-menu>
        </div>

        <!-- 修改密码 -->
        <transition>
            <div class="mark" v-if="changebox" @click="cancel"></div>  
        </transition>
        <transition>
            <div class="changebox" v-if="changebox">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>修改密码</h2>
                <div class="item1">用户名<input type="text" v-model="companyname"  disabled="disabled" ></div>
                <div class="item2"><div class="line"></div>修改密码</div>
                <div class="item1">原密码<input type="password" v-model="oldpwd"></div>
                <div class="item1">新密码<input type="password" v-model="newpassword"></div>
                <div class="item1">确认密码<input type="password" v-model="passwordagain"></div>
                <span class="tip">{{tip}}</span>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="confirmpwd">确认</button>
                </div>
            </div>
        </transition>


        <!-- 首次登陆修改密码 -->
        <transition>
            <div class="mark" v-if="$store.state.firstlogin"></div>  
        </transition>
        <transition>
            <div class="changebox" v-if="$store.state.firstlogin">
                <!-- <a href="javascript:;" class="delete" @click="cancel"></a> -->
                <h2>修改密码</h2>
                <div class="item1">用户名<input type="text" v-model="companyname"  disabled="disabled" ></div>
                <div class="item2"><div class="line"></div>修改密码</div>
                <div class="item1">原密码<input type="password" v-model="oldpwd"></div>
                <div class="item1">新密码<input type="password" v-model="newpassword"></div>
                <div class="item1">确认密码<input type="password" v-model="passwordagain"></div>
                <span class="tip">{{tip}}</span>
                <div class="item4">
                    <button class="confirm" @click="confirmpwd">确认</button>
                </div>
            </div>
        </transition>


        <!-- 过期提醒 -->

    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                companyname:'',
                tablewidthsmall:'',
                tablewidthlarge:'',
                datemg1: '',
                datemg2:'',
                dropshow:false,
                changebox:false,
                tip:"",
                // username:"",
                oldpwd:"",
                newpassword:"",
                passwordagain:"",
                issmallsidebar:false,
                isbigcontent:false,
                ivuTablestyle:null,
                sidebarstyle:null

            }
        },
        
        mounted(){
            this.$store.state.tel=true
            this.$store.state.password=false
            this.$store.state.company=false
            this.$store.state.findpassword=false
            var date = new Date();
            var year=date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.datemg1=year+'年'+month+'月'+day+'日';
            var arr = new Array("日", "一", "二", "三", "四", "五", "六");  
            var week = new Date().getDay();  
            this.datemg2 = "星期"+ arr[week];  
            // this.username=window.localStorage.getItem("username");
            this.companyname=window.localStorage.getItem("companyname");



            var ivuTable=document.querySelector('.ivu-table') //表格应该的width
            this.ivuTablestyle = window.getComputedStyle ? window.getComputedStyle(ivuTable,null) : null || ivuTable.currentStyle;

            var sidebar=document.querySelector('.sidebar')
            this.sidebarstyle = window.getComputedStyle ? window.getComputedStyle(sidebar,null) : null || sidebar.currentStyle;
            // this.tablewidthsmall=parseInt(this.ivuTablestyle.width)/16+'rem'

            // this.tablewidthlarge=(parseInt(this.ivuTablestyle.width)/16+11.25)+'rem'

            if (this.$store.state.firstlogin) {

            };
            // this.instance()  //过期提醒
        }, 
        methods:{
            instance () {
                const title = '过期提醒';
                const content = '<p>您的云电销将于30天后到期，为了不影响您的继续使用，请联系客户经理进行续费。</p>';    
                this.$Modal.warning({
                    title: title,
                    content: content
                }); 
            },
            cancel(){
                this.changebox=false
                this.oldpwd=""
                this.newpassword=""
                this.passwordagain=""
                this.tip="";
            },
            toogle(){
                this.issmallsidebar=!this.issmallsidebar;
                this.isbigcontent=!this.isbigcontent;

                var logotext=document.querySelector('.logo p')
                var tables=document.querySelectorAll('table')
                
                if (this.sidebarstyle.left=='0px') {
                    logotext.innerText='云电销'
                    // for (var i = 0; i < tables.length-1; i++) {
                    //     tables[i].style.width=this.tablewidthlarge
                    // };
                }else{
                    logotext.innerText='云电销企业后台管理'
                    // for (var i = 0; i < tables.length-1; i++) {
                    //     tables[i].style.width=this.tablewidthsmall
                    // };
                }
                

            },
            signOut(){
                var that=this;
                axios.get('/account/user/logout')
                .then(function(response){
                    console.log(response.data);
                    if(response.data.status==0){
                        window.localStorage.clear();  //清除localstorage
                        that.$router.push("/login") 
                    }
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
            changepwd(){
                this.changebox=!this.changebox;
                this.dropshow=false;
            },
            // 提交新密码
            confirmpwd(){
                console.log(this.newpassword)
                if(this.oldpwd.trim()==''){
                    this.tip="旧密码不能为空";
                    return
                }
                if(this.newpassword.trim()==''){
                    this.tip="新密码不能为空";
                    return
                }
                if(this.newpassword!==this.passwordagain){
                    this.tip="两次密码输入不一致";
                    return;
                }
                this.changepassword()
                
            },
            changepassword(){
                var that=this;
                axios.get('/account/user/resetPwd',{
                    params:{
                        eid:window.localStorage.getItem("eid"),
                        phone:window.localStorage.getItem("phone"),
                        old_password:that.oldpwd,
                        new_password:that.newpassword
                    }
                })
                .then(function(response){
                    console.log(response)
                    that.tip=response.data.info;
                    if (response.data.status==0) {
                        that.$Message.info('密码重置成功');
                        that.cancel()
                        that.$store.state.firstlogin=false
                    }else{
                        return
                    }
                })
                .catch(function(err){
                    console.log(err);
                }); 
            }
        }
    }
</script>
<style scoped>
    @import "../../../static/css/animate.css";
    @import "../../../static/css/mark.css";
    @import "../../../static/css/bootpage.css";
    a {
        color: #bfcbd9;
    }
    a:hover {
        color: #2d8cf0;
    }
    .header {
        position: relative;
        box-sizing: border-box;
        height: 3.375rem;
        line-height: 3.375rem;
        border-bottom: 1px solid #ccc;
    }
    .logo{
        line-height: 3.375rem;
        width:14.375rem;
        text-align: center;
        font-size: 1rem;
        padding-left: 1.875rem;
        background: url(../../../static/img/01.png) no-repeat 1.875rem center;
        background-color: #00b5ff;
        color: #fff;
    }
    .user-info {  
        float: right;
        padding-right: 1.75rem;
        font-size: 1rem;
    }
    .user-info .date{
        font-size: 0.75rem;
        color: #999;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .welcome{
        margin-left: 3.125rem;
        position: relative;
        color: #303030;
        font-size: 0.75rem
    }
    .user-info .user-logo{
        position: absolute;
        margin: 0 0.625rem;
        left: -3.125rem;
        top: -0.3125rem;
        width:1.625rem;
        height:1.625rem;
        border-radius: 50%;
    }
    .toggle{
        display: inline-block;
        width: 3.375rem;
        text-align: center;
    }
    .toggle i{
        font-size: 1.75rem;
        line-height: 3.125rem;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 14.375rem;
        left: 0;
        top: 0;
        bottom:0;
        background-color: #222c3e;
    }
    .sidebar a{
        display: block;
        width: 100%;
        height: 100%;
    }
    .sidebar i{
        margin-right: 0.625rem;
        font-size:1rem;
    }
    .content{
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom:0;
        left: 14.375rem;
        width: auto;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .smallsidebar{left: -11.25rem;}
    .bigcontent{left: 3.125rem;}
    li>a{
        display: block;
        width: 100%;
        height: 100%;
    }
    footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 3.125rem;
        padding-left: 2.25rem;
        font-size: 0.75rem;
        line-height: 3.125rem;
        color: #666; 
        background-color: #fafafb;
        border: 1px solid #e6e6e6;
        z-index: 99;
    }
    .drop{
        width: 16.25rem;
        height: 14.375rem;
        border:1px solid #ccc;
        border-radius: 3px;
        position: absolute;
        right: 1.75rem;
        top: 3.4375rem;
        z-index: 99; 
        background-color: #fafafa;
    }
    .dropup{
        width: 100%;
        height: 10.5rem;
        background-color: #00b5ff;
        padding-top: 0.625rem;
        text-align: center;
    }
    .userphoto{
        display: block;
        width: 5.25rem;
        height: 5.25rem;
        border-radius: 50%;
        margin:0 auto 0.875rem;
        box-shadow: 0 0 0.125rem 0.25rem #00a4e2;
    }
    .dropup h4{
        margin: 0;
        padding: 0;
        font-size: 1rem;
        color: #fff;
        line-height: 1.25rem;
    }
    .dropup p{
        font-size: 0.75rem;
        color: #c6e3f5;
        margin: 0
    }
    .dropdown{
        height: 4rem;
        padding: 0.75rem;
        position: relative;
    }
    .dropdown button{
        width: 5.5rem;
        height: 2.125rem;
        border-radius: 3px solid #ddd;
        background-color: #f4f4f4;
        text-align: center;
        color: #000;
        cursor: pointer;
        line-height: 2.125rem;
        font-size: 0.875rem;
    }
    .changpwd{
        position: absolute;
        left: 0.9375rem;
        top: 0.9375rem;
    }
    .signOut{
        position: absolute;
        right: 0.9375rem;
        top: 0.9375rem;
    }
    .changebox{
        height: 23.125rem;
    }
</style>
