<template>
    <div class="temp1">
        <h3>坐席管理</h3>
        <div class="manage">
            <div class="handle">
                <!-- <i></i> -->
                <input placeholder="搜索" class="sname" v-model='sname' @keyup='osearch'></input>
                 <!-- <Button type="ghost" icon="ios-search" size='small' @click='osearch'>搜索</Button> -->
                
                <div class="fr">
                    <button @click="newseat=true"><Icon type="plus"></Icon>新建坐席</button>
                    <button class="output" @click="$store.state.importseat=true"><Icon type="forward"></Icon>批量导入</button> 
                </div>
            </div>
            <div>
                <Table   :columns="columns7" :data="list" size="small"></Table>
                            <!-- 分页 -->
                <div class="page">
                    <Page :total="total" :page-size="pagesize" show-sizer @on-page-size-change="changepagesize" @on-change="changepage" :page-size-opts="[20, 50, 100]"></Page>
                </div>
            </div>    
        </div>
        <!-- 新建坐席 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="newseat" @click="newseat=false"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="newseat" v-if="newseat">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>新建坐席</h2>
                <div class="item1">坐席名称<Input v-model="newlistname" placeholder='必填' ></Input></div>
                <div class="item1">坐席号<Input v-model="newlistnumber" placeholder='选填  (首位不为零的6-8个数字)'></Input></div>
                <div class="item1">手机号<Input v-model="newlistmobile" placeholder='必填'></Input></div>
                <div class="item1">登录密码<Input v-model="newlistpwd" placeholder='必填' type='password'></Input></div>
                <div class="item1"><p>{{tip}}</p></div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="confirmnew">确认</button>
                </div>
            </div>
        </transition>
        
        <!-- 单条删除提醒 -->
        <Modal
            v-model="deleteone"
            title="删除提醒"
            :loading="loading"
            @on-ok="removesingle"
            @on-cancel="cancel">
            <div class="item1">
                    删除后，线索将无法恢复。确定删除线索？
            </div>
        </Modal>

        <!-- 编辑坐席 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="editseat" @click="editseat=false"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="editseat" v-if="editseat">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>编辑坐席</h2>
                <div class="item1">坐席名称<Input v-model="list[select].name" style="width: 438px"></Input></div>
                <div class="item1">坐席号<Input v-model="list[select].number" style="width: 438px"></Input></div>
                <div class="item1">手机号<Input v-model="list[select].mobile" style="width: 438px"></Input></div>
                <div class="item1">登录密码<Input v-model="list[select].pwd"style="width: 438px"  type='password'></Input></div>
                <div class="item1"><p>{{tip}}</p></div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="confirmedit">确认</button>
                </div>
            </div>
        </transition>

        
        <!-- 导入坐席 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="$store.state.importseat" @click="cancelimport"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="importseat" v-if="$store.state.importseat">
                <a href="javascript:;" class="delete" @click="cancelimport"></a>
                <h2>导入坐席</h2>

                <!-- <router-view></router-view> -->
                <stepone v-if="$store.state.steponemark"></stepone>
                <steptwo v-if="$store.state.steptwomark"></steptwo>
                <stepthree v-if="$store.state.stepthreemark"></stepthree>
            
            </div>
        </transition>
    </div>
</template>

<script>
    // import {myCommon} from '../../assets/common.js';
    import axios from 'axios';
    import qs from 'qs';
    import stepone from './importseat/stepone.vue' 
    import steptwo from './importseat/steptwo.vue' 
    import stepthree from './importseat/stepthree.vue' 
    export default {
        data () {
            return {
                loading:true,
                tableheight:0,
                sname:'',
                newlistname:"",
                newlistnumber:"",
                newlistmobile:"",
                newlistpwd:'',
                tip:"",
                select:-1,
                editseat:false,
                deleteone:false,
                newseat:false,
                pagesize:20,  //每页条数
                page:1,      //页数
                total:0,
                columns7: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '坐席号',
                        key: 'number'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        size: 'small',
                                        icon:"compose"
                                    },
                                    style: {
                                        border:'none',
                                        marginRight: '1.5rem',
                                        paddingLeft: '0.3rem',
                                        paddingRight: '0.3rem',
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        
                                        type: 'ghost',
                                        size: 'small',
                                        icon:"ios-trash-outline"
                                    },
                                    style: {
                                        border:'none',
                                        paddingLeft: '0.3rem',
                                        paddingRight: '0.3rem',
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                list: [],
                newlist:{}
            }
        },
        
        methods: {
            cancelimport(){
                this.$store.state.importseat=false
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
                clearInterval(this.$store.state.getper)
            },
            cancel(){
                this.newseat=false
                this.editseat=false
                this.deleteone=false
                this.tip=''
                this.newlistname=""
                this.newlistnumber=""
                this.newlistmobile=""
                this.newlistpwd=''
                this.getallmember('/account/Operator/getAllmembers',{
                    params:{
                        first_id:(this.page-1)*this.pagesize,
                        count:this.pagesize,
                        search:this.sname
                    } 
                })
            },
            osearch(){
                console.log(this.sname)
                var that=this
                this.getallmember('/account/Operator/getAllmembers',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    search:that.sname
                    } 
                })
            },
            //进入获取所有坐席信息
            getallmember(url,config){
                var that=this
                axios.get(url,config)
                .then(function (response) {
                    if (response.data.status==0) {
                       that.total=response.data.data.total;
                        that.list=response.data.data.content
                    };
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                var that=this;
                this.getallmember('/account/Operator/getAllmembers',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    } 
               })

            },
            //切换页数
            changepage(index){
                this.page=index;
                console.log(this.page)
                var that=this;
                this.getallmember('/account/Operator/getAllmembers',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    }
               })
            },
            //编辑
            confirmedit(){
                var that=this
                axios.get('/account/Operator/modifyOperator', {
                params: {
                        name:that.list[that.select].name,
                        number:that.list[that.select].number,
                        phone:that.list[that.select].mobile,
                        pwd:that.list[that.select].pwd,
                        id:that.list[that.select].id,
                    }
                })
                .then(function(response){
                    if(response.data.status==0){
                        that.getallmember('/account/Operator/getAllmembers',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize,
                                search:that.sname
                            } 
                        })
                        that.editseat=false;
                    }else{
                        if(response.data.status==100000){
                            that.tip="输入格式不正确"
                        }else{
                            that.tip=response.data.info
                        }
                    }
                    
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
            //新建~
            confirmnew(){
                var that=this; 
                axios.post('/account/Operator/addOperator',qs.stringify({
                    name:that.newlistname,
                    number:that.newlistnumber,
                    phone:that.newlistmobile,
                    pwd:that.newlistpwd

                }))
                .then(function(response){
                    console.log(response)
                    if(response.data.status==0){
                        that.newlist={
                            name:response.data.data.name,
                            number:response.data.data.number,  
                            mobile:response.data.data.mobile,
                            oid:response.data.data.id,
                        }
                        
                        that.cancel()
                        that.$Message.success('新建坐席成功');
                    }else{
                        if(response.data.status==100000){
                            that.tip="输入格式不正确"
                        }else{
                            that.tip=response.data.info
                        }
                    }
                })
                .catch(function(err){
                    console.log(err);
                }); 
                
            },
            edit (index) {
                this.select=index;
                this.editseat=true
            },
            //删除
            remove (index) {
                this.select=index;
                this.deleteone=true
                
            },
            removesingle(){
                var that=this;
                
                axios.get('/account/Operator/deleteOperator',{
                    params: {
                        oid:that.list[that.select].id,
                    }
                })
                .then(function(response){
                    if (response.data.status==0) {
                        that.getallmember('/account/Operator/getAllmembers',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize,
                                search:that.sname
                            } 
                        })
                        that.cancel()
                    }; 
                })
                .catch(function(err){
                    console.log(err);
                });
            }
        },
        components: {
            stepone,
            steptwo,
            stepthree,
        },
        mounted(){
            this.tableheight=document.body.clientHeight-277.5;
            var that=this;
            this.getallmember('/account/Operator/getAllmembers',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    search:that.sname
                } 
            })
        }
    }
</script>

<style scoped>
    .manage{
        margin-top: 10px
    }
    .handle{
        margin-bottom: 20px;
        overflow: hidden;
        position: relative;
    }
    .handle>i{
        position: absolute;
        left: 6px; 
        top: 10px;
        width: 15px;
        height: 15px;
        background: url(../../../static/img/2.png) no-repeat 0-30px ;
        z-index: 99
    }
    .sname{
        width: 250px;
        height: 34px;
        padding-left: 25px;
    }
    .fr{
        float: right;
    }
    .handle button{
        width: 80px;
        height: 34px;
        border-radius: 3px;
        background-color: #fafafa;
        margin-left: 14px;
        font-size: 12px;
    }
    .handle button:nth-of-type(2){
        background-color: #00b5ff;
        color: #fff
    }
    .handle button:nth-of-type(2) .ivu-icon{
        color: #fff
    }
    .ivu-icon{
        color: #333;
        margin-right: 8px;
        transition: color .2s linear,background-color .2s linear,border .2s linear;
    }
    .item1 p{
        position: absolute;
        bottom: 80px;
        left: 140px;
        color:#ff5e5e;
    }
    .newseat,.editseat{
        height: 350px;
    }
    .manage>div{
        position: relative;
    }
    .page{
        position: absolute;
        right: 0;
        bottom: -50px;
    }
    .temp1{
        margin-bottom: 120px
    }
    .ivu-btn{
        border-color: none;
    }
    .ivu-btn-ghost{
        border-color: none;
    }
    .importseat{
        position: absolute;
        width: 600px;
        height: 300px;
        background-color: #fff;
        top: 200px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        font-size: 14px;
        color: #333;
    }
    .importseat>div{
        padding: 0 30px;
    }
    .importseat h2{
        font-weight: 500;
        font-size: 24px;
        height: 50px;
        border-bottom: 1px solid #f6f6f6;
        padding-left: 20px;
        line-height: 50px;
        margin-bottom: 14px;
    }
    .deletedata{
        width: 400px;
        height: 200px;
    }
</style>
