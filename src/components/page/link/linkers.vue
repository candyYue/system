<template>
    <div>
        <!-- 操作栏 -->
        <div class="dosth clearfix">
            <Select class="select" @on-change="catselect" v-model='typevalue'>
                <Option v-for="item in category" :value="item.value"  :key="item.value">{{item.label}}</Option>
            </Select>
            <div class="btns">
                <Button @click="deleteAction(0)"><Icon type="trash-a"></Icon>清空线索</Button>
                <Button @click="deleteAction(2)"><Icon type="trash-a"></Icon>批量删除</Button>
                <Button @click="averageCustomer(0)" v-if="averageCustomerButton"><Icon type="android-person"></Icon>全部分配</Button>
                <Button @click="averageCustomer(1)" v-if="averageCustomerButton"><Icon type="android-person"></Icon>分配线索</Button>
                <Button @click="clientAction(0)"><Icon type="plus"></Icon>新建线索</Button>
                <Button type="primary" @click="$store.state.importclient=true"><Icon type="forward"></Icon>批量导入</Button>
                <Button type="primary" @click="exportData"  :loading="loadingreply"><Icon type="reply" v-if='exporticon'></Icon>{{exportcsv}}</Button>
            </div>
        </div>
        <!-- 删除弹框  start -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="deleteModal"
             v-model="deleteModal" title="删除提醒">
             <div class="item1"> {{deleteMsg}}</div>
             <div slot="footer">
               <Button type="primary" size="large"  :loading="loading" @click="deleteComfirm">确定</Button>
               <Button size="large" @click="cancel">取消</Button>
             </div>
          </Modal>
        </transition>
        <!-- 删除弹框  end -->

        <!-- 客服弹框  start -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-model="customerModal" v-if="customerModal" :title="customerTitle" width="615" :mask-closable="false" :loading="true" class-name='handle2'>
            <a slot="close" @click="averageAllCancel"><i class="ivu-icon ivu-icon-ios-close-empty"></i></a>
            <Transfer :data="seatlist"
                      :target-keys="targetKeys"
                      :titles="['所有坐席', '已选坐席']"  :operations="['左移','右移']" :list-style="listStyle"
                      :render-format="render"  filterable :filter-method="filterMethod"
                      @on-change="handleChange" >
            </Transfer>
            <div class="explain">多选情况下线索是按勾选员工的顺序平均分配的,如果无法平均分配,则顺序靠前的员工被分配到的线索多</div>
            <div class="error">
                <p>{{tip}}</p>
            </div>
            <div slot="footer">
              <Button type="primary" size="large"  :loading="loading" @click="averageAction">确定</Button>
              <Button size="large" @click="averageAllCancel">取消</Button>
            </div>
          </Modal>
        </transition>

        <!-- <transition enter-active-class="animated fadeIn">
          <Modal v-if="maxCustomModal"
             v-model="maxCustomModal" title="提醒">
             <div class="item1">单次分配坐席，最多只能分配2000人，选择继续分配将分配2000人给该坐席。</div>
             <div slot="footer">
               <Button type="primary" size="large" @click='maxCustomModal=false'>继续分配</Button>
               <Button size="large" @click="averageAllCancel">取消</Button>
             </div>
          </Modal>
        </transition> -->
        <!-- 客服弹框  end -->

        <!-- 线索弹框  start -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="clientModal" v-model="clientModal" :title="clientTitle"  class-name='linker-modal'>
              <Form  :label-width="69">
                <FormItem label="客户名称">
                   <Input v-model="clientName" ></Input>
                </FormItem>
                <FormItem label="客户电话">
                   <Input v-model="clientTel" ></Input>
                </FormItem>
                <FormItem label="分配坐席">
                    <Select v-model="oid" :disabled="clientCustomer" @on-change="chooseseatid">
                        <Option v-for="item in seatlist" :value="item.id" :key="item.number">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="公司名称">
                   <Input v-model="clientCompany"></Input>
                </FormItem>
                <FormItem label="公司地址">
                   <Input v-model="clientAddress"></Input>
                </FormItem>
              </Form>

              <div class="error"><p>{{tip}}</p></div>
              <div slot="footer">
                <Button type="primary" size="large" @click="clientModalComfirm">确定</Button>
                <Button size="large" @click="cancel">取消</Button>
              </div>
          </Modal>
        </transition>
        <!-- 线索弹框  end -->

        <!-- 批量导入 -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="$store.state.importclient" v-model="$store.state.importclient" title="导入线索"
                 :mask-closable="false" width="580" :footer-hide="true"  class="import-modal">
            <a slot="close" @click="cancelimport"><Icon type="ios-close-empty"></Icon></a>
            <stepone v-if="$store.state.steponemark"></stepone>
            <steptwo v-if="$store.state.steptwomark"></steptwo>
            <stepthree v-if="$store.state.stepthreemark" :render="renderInit"></stepthree>
          </Modal>
        </transition>
        
        <div class="content">
            <!-- 表单 -->
            <Table :columns="columns7" :data="$store.state.clientlist" @on-selection-change="tableselect" size="small" ref="selection"></Table>
            <!-- 分页 -->
            <div class="page clearfix pageleft">
                <Page :total="$store.state.clienttotal" :current="page" :page-size="pagesize" show-sizer @on-page-size-change="changepagesize" :page-size-opts="[20, 50, 100]"  @on-change="changepage"></Page>
            </div>    
        </div>
        <div class="spin" v-if="spinShow">
            <Spin size="large" fix></Spin>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import stepone from '../importclient/stepone.vue'
    import steptwo from '../importclient/steptwo.vue'
    import stepthree from '../importclient/stepthree.vue'
    export default {
        data() {
            return {
              loadingreply:false,
                spinShow:false,
                // 分页
                pagesize:20,   // 每页条数
                page:1,        // 当前页数
                // total:0,       // 数据总数目

                // 弹框loading
                loading:false,
                // 数据
                seatlist:[],   // 坐席列表

                // 删除弹框 deleteModal
                deleteModal:false,
                deleteMsg:'删除后，线索将无法恢复。确定删除线索？',
                deleteComfirm:()=>{},

                // 坐席弹框 customerModal
                customerModal:false,
                maxCustomModal:false,
                customerTitle:'一键分配',
                averageCustomerButton:true,
                averageAction:()=>{},
                  //分配坐席穿梭框
                data: [],   //所有坐席
                targetKeys: [], //选中坐席的key arr
                listStyle: {width: '230px',height: '350px'},  // 穿梭框列表样式
                tip:"",


                // 线索弹框 clientModal
                clientModal:false,
                clientTitle:"新建线索",
                clientComfirm:()=>{},
                clientName:'',
                clientTel:'',
                oid:'', //新建/编辑时选择的坐席id
                clientCustomer:false,
                clientCompany:'',
                clientAddress:'',

                editlistseatindex:"",//编辑线索默认显示的value值
                typelaber:'',
                typevalue:0,
                deletedata:false,
                averageoid:'',  //选择分配的坐席id
                ExportCustomerhashcode:'',
                exportcsv:'全部导出',
                exporticon:true,
                category: [
                    {
                        value:1,
                        label:'已分配'
                    },
                    {
                        value:0,
                        label:'未分配'
                    },
                ],
                // 表格相关
                tablesel:"",   //选择分配的线索id
                select:0,     // 当前操作id
                // list: [],      // 线索列表
                columns7: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'cm_mobile'
                    },
                    {
                        title: '名称',
                        key: 'cm_name'
                    },
                    {
                        title: '公司名称',
                        key: 'cm_company'
                    },
                    {
                        title: '坐席',
                        key: 'seat',
                        render: (h, params) => {
                            if(params.row.operator){
                                return h('div',[
                                    h('span', params.row.operator.name),
                                    h('span', '  ('+params.row.operator.number+')')
                                ]);
                            }

                        }
                    },
                    {
                        title: '通话结果',
                        key: 'cm_result'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                    {
                        title: '备注',
                        key: 'cm_detail'
                    },
                    {
                        title: '操作',
                        width:120,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                      size:'small',
                                      type: 'text',
                                      icon: "ios-compose-outline"
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                      size:'small',
                                      type: 'text',
                                      icon: "ios-trash-outline"
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
            }
        },
        components: {
            stepone,
            steptwo,
            stepthree,
        },
        // props: ['page','pagesize','typevalue'],
        methods: {
            /* 删除弹框 start*/
            deleteAction(type){
              this.deleteMsg = '删除后，线索将无法恢复。确定删除线索？'
              if(type===0){   // 清空线索
                this.deleteMsg = `删除后，线索将无法恢复。确认删除${this.$store.state.clienttotal}条线索？`;
                this.deleteComfirm = this.deleteall;
              }
              else if(type==1){  // 单条数据删除
                this.deleteComfirm = this.removesingle;
              }
              else{           // 批量删除
                if (this.tablesel=='') {
                    this.$Message.warning('请选择需要删除的线索');
                    return;
                };
                this.deleteComfirm = this.removemore;
              }
              this.deleteModal = true
            },
            // 删除方法
            removeData(cid){
              console.log(cid);
              var that=this;
              if(!cid){
                this.$Modal.warning({content:'请选择要删除的线索'})
                return false;
              }
              that.loading=true;
              axios.get('/account/Customer/deleteCustomer',{params: {cid}})
              .then(function(response){
                  if (response.data.status==0) {
                      //删除成功重新加载数据
                      that.getclientlist({
                          params:{
                              first_id:(that.page-1)*that.pagesize,
                              count:that.pagesize,
                              type:that.typevalue
                          }
                      });
                      that.cancel()
                      that.loading=false;
                  };
              })
              .catch(function(err){
                  console.log(err);
              });
            },
            //批量删除
            removemore(){
                this.removeData(this.tablesel);
            },
            // 删除单条
            removesingle(){
              this.removeData(this.select);
            },
            //清空
            deleteall(){
                this.removeData("all");
            },
            /* 删除弹框 end*/


            /* 坐席弹框 start */
              //坐席弹框搜索
            filterMethod (data, query) {
                return data.name.indexOf(query) > -1;
            },
              // 每行数据渲染函数，该函数的入参为 data 中的项
            render(item) {
                return item.name;
            },
            // 选择分配（右边列表）数组--数据的 key 值
            handleChange (newTargetKeys) {
                this.targetKeys = newTargetKeys;
                newTargetKeys.length ? (this.tip = '') : (this.tip = '请勾选需要分配的坐席')
            },
            averageCustomer(type){
              
              if(type===0){   // 一键分配
                this.customerTitle = "一键分配"
                this.averageAction = this.averageAll
                this.$refs.selection.selectAll(true);
              }else{          // type==1 分配线索
                if (this.tablesel=='') {
                    this.$Message.warning('请选择需要分配的线索');
                    return;
                };
                this.customerTitle = "分配坐席"
                this.averageAction = this.averageSeleted
              }

              this.customerModal = true
            },
            // 一键分配关闭
            averageAllCancel(){
              this.cancel();
              this.$refs.selection.selectAll(false);
            },
            // 一键分配
            averageAll(){
              this.average(0);
              this.page=1
            },
            // 分配线索
            averageSeleted(){
              this.average(1);
              this.page=1
            },
            // 分配坐席
            average(type){
              var that=this
              if (this.targetKeys.length==0) {
                  this.tip='请勾选需要分配的坐席'
                  return;
              };
              var config = {
                cid:type==1?that.tablesel:'all',
                oid:that.targetKeys.length==that.seatlist.length ? 'all' : that.targetKeys.toString()
              };
              this.loading = true
              axios.get('/account/Customer/AverageCustomer',{params:config})
                   .then(function (response) {
                        if (response.data.status==0) {
                            
                            that.getclientlist({
                                params:{
                                    first_id:(that.page-1)*that.pagesize,
                                    count:that.pagesize,
                                    type:that.typevalue
                                }
                            });
                            that.cancel();
                            that.$Message.success('坐席分配成功');
                        }else{
                            that.tip=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            /* 坐席弹框 end */

            /* 线索弹框 start */
            //select-cid
            tableselect(selection){
                let selArr = selection.map(item=>{return item.id});
                this.tablesel=selArr.join(",")
            },
            //新建线索分配坐席时选择坐席id
            chooseseatid(value){
                this.oid=value;
            },
            clientAction(type){
              this.clientModal = true
              if(type===0){  // 新建线索
                this.clientTitle = "新建线索"
                this.clientName=''
                this.clientTel=''
                this.oid=''
                this.clientCustomer = false
                this.clientCompany=''
                this.clientAddress=''
              }
            },
            // 提交线索方法
            clientModalComfirm(){
                var that=this;
                var url = '';
                if(this.clientTel.trim()=='') {
                    this.tip="请输入客户电话"
                    return;
                }
                var config = {
                  cname:that.clientName,
                  phone:that.clientTel,
                  oid:that.oid,
                  company:that.clientCompany,
                  address:that.clientAddress,
                }
                console.log(this.select);
                console.log(!!this.select);
                if(this.select){
                  url = '/account/Customer/modifyCustomer'
                  config.id = this.select
                }else{
                  url = '/account/Customer/addCustomer'
                }
                axios.get(url,{params:config})
                     .then((response)=>{
                       if(response.data.status===0){
                          if(this.select==0){
                             that.$Message.success('新建线索成功');
                          }
                          that.getclientlist({
                               params:{
                                   first_id:(that.page-1)*that.pagesize,
                                   count:that.pagesize,
                                   type:that.typevalue
                               }
                          });
                          that.cancel();
                          //  that.typelaber=''
                          
                       }
                       else{
                          that.tip=response.data.info
                       }
                     })
                     .catch((err)=>{
                       console.log(err);
                     });

            },
            /* 线索弹框 end */

            // 弹框关闭方法
            cancel(){
                this.deleteModal = false
                this.customerModal = false
                this.clientModal = false
                this.targetKeys=[]
                this.tip=''
                this.select=0
                this.loading=false
                this.maxCustomModal=false
            },
            cancelimport(){
                this.$store.state.importclient=false;
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
                clearInterval(this.$store.state.getper)
            },

            //编辑线索
            edit (row) {
                this.select=row.id;
                this.clientModal = true;
                this.clientTitle = "编辑线索"
                this.clientName=row.cm_name
                this.clientTel=row.cm_mobile
                this.clientCompany=row.cm_company
                this.clientAddress=row.address
                if(row.operator){
                  this.clientCustomer = true
                  this.oid=row.operator.id
                }else{
                  this.clientCustomer = false
                  this.oid=''
                }
            },
            // 删除线索
            remove(id) {
                this.select = id;
                this.deleteAction(1);
            },

            /* 操作栏操作   start*/
            //分类选择：已分配、未分配
            catselect(value){
              // console.log(value)
                var that=this;
                this.typevalue=value;

                value==0 ? (this.averageCustomerButton=true) : (this.averageCustomerButton=false)
                this.page = 1
                this.getclientlist({
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        type:value
                    }
                });
            },

            /* 操作栏操作   end*/


            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                var that=this;
                this.getclientlist({
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    type:that.typevalue
                    }
               })
            },

            //切换页数
            changepage(index){
                this.page=index;
                var that=this;
                this.getclientlist({
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    type:that.typevalue
                    }
               })
            },
            //获取线索列表
            getclientlist(config){
                var that=this;
                that.spinShow = true;
                axios.get('/account/Customer/getCustomer',config)
                .then(function (response) {
                    if (response.data.status==0) {
                        that.$store.state.clienttotal=response.data.data.total;
                        that.$store.state.clientlist=response.data.data.content;
                    };
                    that.spinShow = false;
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            // 初始获取线索
            renderInit(){
              var that = this;
              this.getclientlist({
                  params:{
                      first_id:(that.page-1)*that.pagesize,
                      count:that.pagesize,
                      type:that.typevalue
                  }
              });
            },
            //导出csv
            exportData () {
                this.loadingreply=true;
                this.exporticon=false;
                var that=this;
                axios.get('/account/Customer/ExportCustomer')
                .then(function (response) {

                    if (response.data.status==0) {
                        that.ExportCustomerhashcode=response.data.data.hash_code;
                        //导出进度
                        var getper=setInterval(function () {
                            axios.get('/account/Customer/getPercent',{
                                params:{
                                    hash_code:that.ExportCustomerhashcode
                                }
                            })
                            .then(function (response) {
                                console.log(response)
                                if (response.data.data.per==100) {
                                    that.loadingreply=false
                                    that.exporticon=true
                                    clearInterval(getper)
                                    window.location.href='/account/Customer/getExportFile?hash_code=' +that.ExportCustomerhashcode
                                };
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        },1000)
                    };
                })
                .catch(function (error) {
                    console.log(error);
                });

            }
        },
        mounted(){
            var that=this;
            //获取线索
            this.renderInit();
            //获取坐席
            axios.get('/account/Operator/getAllmembers')
            .then(function (response) {
                if (response.data.status==0) {
                    that.seatlist=response.data.data.content
                    that.seatlist.map(item=>{
                      item.key = item.id
                      item.label = item.name
                    })
                };

            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
</script>
<style>
.linker-modal .ivu-select-dropdown{
  position: absolute !important;
}
</style>
<style scoped>

    .spin{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .spin .ivu-spin-fix{
      background-color: rgba(255,255,255,.6);
    }

    .select{
        width: 198px;
        height: 34px;
    }
    .btns{
      float: right;
    }
    .btns button{
        margin-left: 14px;
    }
    .ivu-icon{
        margin-right: 8px;
    }

    .dosth{
        margin-bottom: 20px
    }
    .changebox{
      height: 608px;
    }
  .changebox .chooseseat{
      width: 480px;
      margin: 10px auto;
      height: 340px;
      background-color: #eee;
      padding: 20px;
  }
  .chooseseat .search{
      display: block;
      width: 210px;
      height: 34px;
      background-color: #fff;
      padding-left: 18px;
      margin-bottom: 24px;
  }
  /* .seat{
      margin-top: 24px;
  }
  .seat label{
      display: block;
      margin-bottom: 16px;

  } */
  input[type="checkbox"]{
      vertical-align: middle;
      margin-right: 12px
  }

  .page ul{
       float: right;
   }
   .explain{
      margin-top: 30px;
      color: #999
  }
  .wrongtip{
      position: absolute;
      bottom: 75px;
      left: 30px;
      color:#ff5e5e;
  }


</style>
