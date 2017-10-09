<template>
    <div>
        <h3>坐席管理</h3>
        <div class="temp">
        <div class="manage">
            <div class="handle">
                <Input v-model="sname" placeholder="搜索" class="sname" @on-keyup='osearch'></Input>
                 
                <div class="fr">
                    <Button @click="seatAction" icon="plus">新建坐席</Button>
                    <Button type="info" @click="$store.state.importseat=true"><Icon type="forward"></Icon>批量导入</Button>
                </div>
            </div>
            <div class="tableContent">
                <Table   :columns="columns7" :data="list" size="small"></Table>
                            <!-- 分页 -->
                <div class="page">
                    <Page :total="total" :page-size="pagesize" show-sizer @on-page-size-change="changepagesize" @on-change="changepage" :page-size-opts="[20, 50, 100]"></Page>
                </div>
            </div>    
        </div>
        <!-- 新建坐席 -->
         <transition enter-active-class="animated fadeIn">
            <Modal v-model="seatbox" :title="seattitle" v-if="seatbox">
                <Form  :label-width="69">
                    <FormItem label="坐席名称">
                       <Input v-model="newlistname" placeholder='必填'></Input>
                    </FormItem>
                    <FormItem label="坐席号">
                       <Input v-model="newlistnumber"  placeholder='选填  (首位不为零的6-8个数字)'></Input>
                    </FormItem>
                    <FormItem label="手机号">
                        <Input v-model="newlistmobile" placeholder='必填'></Input>
                    </FormItem>
                    <FormItem label="登录密码">
                       <Input v-model="newlistpwd"  placeholder='必填' type='password'></Input>
                    </FormItem>
                    <div class="error"><p>{{tip}}</p></div>
                  </Form>
                <div slot="footer">
                    <Button type="info" @click="confirmnew">确认</Button>
                    <Button @click="cancel">取消</Button>
                </div>
            </Modal>
        </transition>
        <!-- 单条删除提醒 -->
        <!-- <transition  enter-active-class="animated fadeIn">
            
        </transition> -->
        <transition enter-active-class="animated fadeIn">
            <Modal v-model="deleteone" width="360" v-if="deleteone">
                <p slot="header">
                    <span>删除提醒</span>
                </p>
                <div style="text-align:center">
                    <p>删除后，线索将无法恢复。确定删除线索？</p>
                </div>
                <div slot="footer">
                    <Button @click="cancel">取消</Button>
                    <Button type="info" @click="removesingle">确认</Button>
                </div>
            </Modal>
        </transition>
        
        <!-- 导入坐席 -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="$store.state.importseat" v-model="$store.state.importseat" title="导入坐席"
                 :mask-closable="false" width="600" :footer-hide="true"  class="import-modal">
            <a slot="close" @click="cancelimport"><Icon type="ios-close-empty"></Icon></a>
            <stepone v-if="$store.state.steponemark"></stepone>
            <steptwo v-if="$store.state.steptwomark"></steptwo>
            <stepthree v-if="$store.state.stepthreemark"></stepthree>
          </Modal>
        </transition>
    </div>
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
                tableheight:0,
                sname:'',
                newlistname:"",
                newlistnumber:"",
                newlistmobile:"",
                newlistpwd:'',
                oid:'',
                seattitle:'',
                tip:"",
                select:0,
                // editseat:false,
                deleteone:false,
                seatbox:false,
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
                                        icon:"ios-compose-outline"
                                    },
                                    style: {
                                        border:'none',
                                        marginRight: '1.5rem',
                                        paddingLeft: '0.3rem',
                                        paddingRight: '0.3rem',
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
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
                this.select=0
                this.seatbox=false
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
            seatAction(){
                this.seatbox=true
                this.seattitle='新建坐席'
                this.tip=''
                this.newlistname=""
                this.newlistnumber=""
                this.newlistmobile=""
                this.newlistpwd=''
            },
            //坐席弹框~
            confirmnew(){
                if(this.newlistname.trim()=='') {
                    this.tip="请输入坐席名称"
                    return;
                }
                if(this.newlistmobile.trim()=='') {
                    this.tip="请输入坐席手机号"
                    return;
                }
                if(this.newlistpwd.trim()=='') {
                    this.tip="请输入坐席登录密码"
                    return;
                }
                var that=this; 
                var url=''
                if (this.oid=='') {
                    url='/account/Operator/addOperator'
                } else {
                    url='/account/Operator/modifyOperator'
                }
                axios.get(url,{
                    params:{
                        name:that.newlistname,
                        number:that.newlistnumber,
                        phone:that.newlistmobile,
                        pwd:that.newlistpwd,
                        id:that.oid
                        }
                    }
                )
                .then(function(response){
                    console.log(response)
                    if(response.data.status==0){ 
                        that.cancel()
                        if(this.select){
                            that.$Message.success('新建坐席成功');
                        }
                    }else{
                        that.tip=response.data.info
                        
                    }
                })
                .catch(function(err){
                    console.log(err);
                }); 
                
            },
            edit (row) {
                // console.log(row)
                this.select=row._index;
                this.seattitle = "编辑坐席"
                
                // this.editseat=true
                this.newlistname=this.list[this.select].name
                this.newlistnumber=this.list[this.select].number
                this.newlistmobile=this.list[this.select].mobile
                this.newlistpwd=this.list[this.select].pwd
                this.oid=this.list[this.select].id
                this.seatbox=true
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
    }
    .fr{
        float: right;
    }
    .handle button{
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