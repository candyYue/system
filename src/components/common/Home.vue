<template>
    <div class="wrapper">
        <div class="RightContent" :class={bigcontent:isbigcontent}>
            <div class="header">
                <a href="javascript:;" class="toggle" @click="toogle"><Icon type="navicon"></Icon></a>
                <div class="user-info">
                    <span class="el-dropdown-link">
                        <span class="date">今 天 是 {{datemg1}}，{{datemg2}}</span>
                        <span class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../../../static/img/photo.png">
                        您好！云电销 - 管理员</span>
                    </span>
                    <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
                        <div class="drop" v-if="dropshow">
                            <div class="dropup">
                                <img src="../../../static/img/photo.png" alt="" class="userphoto">
                                <h4>{{companyname}} - 管理员</h4>
                                <p>登陆时间：{{datemg1}}，{{datemg2}}</p>
                            </div>
                            <div class="dropdown">
                                <Button class="changpwd" @click="changepwd">修改密码</Button>
                                <Button class="signOut"  @click="signOut">退出登录</Button>
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
            <Col span="8">
            <Menu theme="dark" width='230px'>
                <MenuItem name="1-0">菜单栏</MenuItem>
                <Submenu name="1">
                    <template slot="title">
                        <i class='center'></i>
                        统计中心
                    </template>
                    <MenuItem name="1-1"><router-link to="/day">统计概况</router-link></MenuItem>
                    <MenuItem name="1-2"><router-link to="/count">坐席统计</router-link></MenuItem>
                </Submenu>

                <MenuItem name="1-3"><router-link to="/link"><i class='client'></i>线索池</router-link></MenuItem>
                <MenuItem name="1-4"><router-link to="/manage"><i class='seat'></i>坐席管理</router-link></MenuItem>
                <MenuItem name="1-5"><router-link to="/callhistory"><i class='callhistory'></i>通话记录</router-link></MenuItem>
            </Menu>
        </Col>
        </div>

        <!-- 修改密码 -->

        <Modal v-model="changebox">
            <p slot="header">
                <span>修改密码</span>
            </p>
            <Form label-position="right" :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="companyname"></Input>
                    <span class='changepwd'>修改密码</span>
                </FormItem>
                <FormItem label="原密码">
                    <Input v-model="oldpwd"></Input>
                </FormItem>
                <FormItem label="新密码">
                    <Input v-model="newpassword" type='password'></Input>
                </FormItem>
                <FormItem label="确认密码">
                    <Input v-model="passwordagain" type='password'></Input>
                    <span class="changetip">{{tip}}</span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="info"  @click="confirmpwd">确认</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>


        <!-- 首次登陆修改密码 -->
        <Modal v-model="$store.state.firstlogin">
            <p slot="header">
                <span>修改密码</span>
            </p>
            <Form label-position="right" :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="companyname"></Input>
                    <span class='changepwd'>修改密码</span>
                </FormItem>
                <FormItem label="原密码">
                    <Input v-model="oldpwd"></Input>
                </FormItem>
                <FormItem label="新密码">
                    <Input v-model="newpassword"  type='password'></Input>
                </FormItem>
                <FormItem label="确认密码">
                    <Input v-model="passwordagain"  type='password'></Input>
                    <span class="changetip">{{tip}}</span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="info"  @click="confirmpwd">确认</Button>
            </div>
        </Modal>
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
            this.datemg2 = " 星 期 "+ arr[week];
            // this.username=window.localStorage.getItem("username");
            this.companyname=window.localStorage.getItem("companyname");



            var ivuTable=document.querySelector('.ivu-table') //表格应该的width
            this.ivuTablestyle = window.getComputedStyle ? window.getComputedStyle(ivuTable,null) : null || ivuTable.currentStyle;

            var sidebar=document.querySelector('.sidebar')
            this.sidebarstyle = window.getComputedStyle ? window.getComputedStyle(sidebar,null) : null || sidebar.currentStyle;
            this.tablewidthsmall=this.ivuTablestyle.width

            this.tablewidthlarge=(parseInt(this.ivuTablestyle.width)+180)+'px'

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
                var tables=document.querySelectorAll('.ivu-table-wrapper table')

                if (this.sidebarstyle.left=='0px') {
                    logotext.innerText='云电销'
                    for (var i = 0; i < tables.length-1; i++) {
                        tables[i].style.width=this.tablewidthlarge
                    };
                }else{
                    logotext.innerText='云电销企业后台管理'
                    for (var i = 0; i < tables.length-1; i++) {
                        tables[i].style.width=this.tablewidthsmall
                    };
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
                        that.$Message.success('密码重置成功');
                        that.cancel()
                        that.$router.push("/day") 
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
    /* @import "../../../static/css/mark.css"; */
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
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #ccc;
    }
    .logo{
        line-height: 54px;
        width:230px;
        font-weight: 700;
        text-align: center;
        font-size: 16px;
        padding-left: 30px;
        background: url(../../../static/img/01.png) no-repeat 30px center;
        background-color: #00b5ff;
        color: #fff;
    }
    .user-info {
        float: right;
        padding-right: 28px;
        font-size: 16px;
        height: 54px;
    }
    .user-info .date{
        font-size: 14px;
        color: #999;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        cursor: pointer;
        height: 54px;
    }
    .user-info .welcome{
        display: inline-block;
        height: 53px;
        width: 260px;
        padding:0 14px 0 64px;
        position: relative;
        color: #303030;
        font-size: 14px
    }
    .user-info .welcome:hover{
        background-color: #fafafb;
    }
    .user-info .user-logo{
        position: absolute;
        margin: 0 10px;
        left: 14px;
        top: 10px;
        width:26px;
        height:26px;
        border-radius: 50%;
    }
    .toggle{
        display: inline-block;
        width: 54px;
        text-align: center;
    }
    .toggle i{
        font-size: 28px;
        line-height: 50px;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 230px;
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
    .RightContent{
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom:0;
        left: 230px;
        width: auto;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .smallsidebar{left: -180px;}
    .bigcontent{left: 50px;}
    li>a{
        display: block;
        width: 100%;
        height: 100%;
    }
    footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 50px;
        padding-left: 36px;
        font-size: 14px;
        line-height: 50px;
        color: #666;
        background-color: #fafafb;
        border: 1px solid #e6e6e6;
        z-index: 99;
    }
    .drop{
        width: 260px;
        height: 230px;
        border:1px solid #ccc;
        border-radius: 3px;
        position: absolute;
        right: 28px;
        top: 55px;
        z-index: 99;
        background-color: #fafafa;
    }
    .dropup{
        width: 100%;
        background-color: #00b5ff;
        padding-top: 10px;
        text-align: center;
    }
    .userphoto{
        display: block;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        margin:0 auto 14px;
        box-shadow: 0 0 2px 4px #00a4e2;
    }
    .dropup h4{
        margin: 0;
        padding: 0;
        font-size: 16px;
        color: #fff;
        line-height: 20px;
    }
    .dropup p{
        font-size: 14px;
        color: #c6e3f5;
        line-height: 14px;
        margin-top: 10px;
        padding-bottom: 14px
    }
    .dropdown{
        height: 56px;
        padding: 14px;
        position: relative;
    }
    .dropdown button{
        width: 88px;
        height: 34px;
        background-color: #f4f4f4;
        color: #333;
        border:1px solid #ddd;
        font-size: 14px;
    }
    .changpwd{
        position: absolute;
        left: 15px;
        top: 15px;
    }
    .signOut{
        position: absolute;
        right: 15px;
        top: 15px;
    }
    .changepwd{
        color: #999;
        position: absolute;
        left: -60px;
        top: 28px;
    }
    .changepwd:after{
        content: '';
        display: inline-block;
        width:400px;
        height:1px;
        background-color:#ccc;
        position:absolute;
        bottom:50%;
        z-index:1;
        left:60px;
        opacity: .8
    }
    
    .changetip{
        position: absolute;
        left: 0;
        bottom: -35px;
        color: #ff5e5e; 
    }
    .ivu-btn{
        width: 80px;
    }
    a:hover{
        color:#bfcbd9
    }
    .ivu-form-item{
        margin-bottom: 24px
    }
    
    .sidebar i{
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 10px;
        font-size:16px;

    }
    .center{
        background: url(../../../static/img/1.png) 0 -25px;
    }
    .client{
        background: url(../../../static/img/1.png) -75px -25px;
    }
    .seat{
        background: url(../../../static/img/1.png) -90px -25px;
    }
    .callhistory{
        background: url(../../../static/img/1.png) -105px -25px;
    }
</style>
