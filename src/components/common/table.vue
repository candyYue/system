<template>
    <div class="wrapper">        
        <div class="content">
            <div class="header">
                <a href="javascript:;" class="toggle"><Icon type="navicon"></Icon></a>
                <div class="user-info">
                    <span class="el-dropdown-link">
                        <span class="date">今天是{{datemg1}}，{{datemg2}}</span>
                        <span class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../../../static/img/img.jpg">
                        您好！电销通-云总机产品线管理员</span> 
                    </span>
                    <transition name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                        <div class="drop" v-if="dropshow">
                            <div class="dropup">
                                <img src="../../../static/img/img.jpg" alt="" class="userphoto">
                                <h4>电销通 - 云总机产品线管理员</h4>
                                <p>登陆时间：{{datemg1}}，{{datemg2}}</p>
                            </div>
                            <div class="dropdown">
                                <button class="changpwd">修改密码</button>
                                <button class="signOut">退出登录</button>
                            </div>
                        </div>
                </transition>
                </div>
            </div>

            <!-- 主体部分 -->
            <transition name="move" mode="out-in">
                <div class="temp1">
            
                    <div v-if='client'>
                        <div class="link" v-if='client'>
                            <router-link to="/link">线索池</router-link>
                            <router-link to="/phoneresult">通话结果管理</router-link>
                        </div>
                        <div class="temp2">
                        <div><button><Icon type="trash-a"></Icon>删除</button></div>
                        <div :class={newhighlight:show3}><button><Icon type="android-person"></Icon>分配线索</button></div>
                        <div ref="new"><button><Icon type="plus"></Icon>新建线索</button></div>
                        <div ref="import" :class={newhighlight:show2}><button class="bluebtn"><Icon type="forward"></Icon>批量导入</button></div>
                        <div ref="all"><button class="bluebtn"><Icon type="reply"></Icon>全部导出</button>                </div>   
                        </div>
                    </div>
                    <div v-if='seat'>
                        <h3>坐席管理</h3>
                        <div class="temp2">
                            <div ref="new" :class={newhighlight:show1}><button><Icon type="plus"></Icon>新建线索</button></div>
                            <div ref="import" :class={newhighlight:show1}><button class="bluebtn"><Icon type="forward"></Icon>批量导入</button></div> 
                        </div>
                    </div>
            
                </div>
            </transition>
            
            <footer>copyright@20142015</footer>                
        </div>
        <div class="sidebar">
            <div class="logo">云电销企业后台管理</div>
            <el-menu default-active="2" class="el-menu-vertical-demo" theme="dark">
                <el-submenu index="1">
                <template slot="title">统计中心</template>
                <el-menu-item-group>
                  <el-menu-item index="1-3"><router-link to="/day">统计概况</router-link></el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title"><router-link to="/count">坐席统计</router-link></template>
                  <el-menu-item index="1-4-1"><router-link to="/link">线索池</router-link></el-menu-item>
                  <el-menu-item index="1-4-1"><router-link to="/manage">坐席管理</router-link></el-menu-item>
                  <el-menu-item index="1-4-1"><router-link to="/callhistory">通话记录</router-link></el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
        </div>
        
        <!-- 新手指导页面1 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark1" v-if="show1">
                 <div class="img1" v-if="show1">
                     <p class="tip1">为了保障坐席人员的使用，建议您先在坐席管理页面新建坐席或批量导入坐席 </p>
                     <button @click="mark2">下一步</button>
                 </div>
            </div>
        </transition>
        <!-- 新手指导页面2 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark2" v-if="show2">
                 <div class="img2" v-if="show2">
                     <p class="tip2">创建完坐席后，您可以在线索池页面批量导入客户号码 </p>
                     <button @click="mark3">下一步</button>
                 </div>
            </div>
        </transition>
        <!-- 新手指导页面3 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark3" v-if="show3">
                 <div class="img3" v-if="show3">
                     <p class="tip3">导入完客户列表后，您可以选择客户，点击分配坐席，将选择的客户分配给对应的坐席，分配完成之后，坐席登录客户端就可以直接使用 </p>
                     <button @click="markend">完成</button>
                 </div>
            </div>
        </transition>

    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                client:false,
                seat:true,
                show1:true,
                show2:false,
                show3:false,
                datemg1: '',
                datemg2:'',
                dropshow:false,
                changebox:false,
                tip:"",
                
            }
        },
        mounted(){
            var date = new Date();
            var year=date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.datemg1=year+'年'+month+'月'+day+'日';
            var arr = new Array("日", "一", "二", "三", "四", "五", "六");  
            var week = new Date().getDay();  
            this.datemg2 = "星期"+ arr[week];  
        },
        methods:{
            mark2(){ 
                this.seat=false;
                this.show1=false;
                this.client=true;
                this.show2=true;
            },
            mark3(){
                this.show2=false;
                this.show3=true;
            },
            markend(){
                this.show3=false;
                this.$router.push("/day")
            }
        }
    }
</script>
<style scoped>
    @import "../../../static/css/animate.css";
    @import "../../../static/css/mark.css";
    @import "../../../static/css/bootpage.css";
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
    .temp2{
        float: right;
    }
    .temp2>div{
        padding: 0.3125rem 0.625rem;
        position: relative;
        display: inline-block;
        width: 6.875rem;
        height: 2.75rem;
        background-color: #fff;
        border-radius: 4px;
    }
    .temp2 button{
         width: 5rem;
        height: 2.125rem;
        background-color: #fafafa;
    }
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
    }
     .link{
        margin:2.5rem 0 1.25rem; 
        height: 46;
        line-height: 2.875rem;
        border-bottom: 1px solid #ccc;
    }
    a{
        font-size: 1rem;
        color: #333;
        padding: 0.875rem;
        background-color: #f4f4f4;
        border: 1px solid #ccc;
        border-radius: 5px 5px 0 0;
        border-bottom: 3px solid #fff
    }     
    .ivu-btn{
        color: #fff;
        background-color: #00b5ff;
    }
    .ivu-btn .ivu-icon{
        color: #fff
    }  
    .temp2 .bluebtn{
        background-color: #00b5ff;
        color: #fff
    }
</style>
