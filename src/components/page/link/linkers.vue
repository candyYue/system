<template>
    <div class="temp2"> 

        <div class="dosth">
            <Select class="select" @on-change="catselect" v-model='typelaber'>
                <Option v-for="item in category" :value="item.value"  :key="item.value">{{item.label}}</Option>
            </Select>
            <!-- <Checkbox>全选</Checkbox> -->
            <div class="fr">
                
                <button class="bgw" @click="deletedata=true"><Icon type="trash-a"></Icon>清空线索</button>
                <button class="bgw" @click='deletemore=true'><Icon type="trash-a"></Icon>批量删除</button>
                <button class="bgw" @click="changebox2=true"><Icon type="android-person"></Icon>一键分配</button>
                <button class="bgw" @click="changebox=true"><Icon type="android-person"></Icon>分配线索</button>
                <button class="bgw" @click="newclint=true"><Icon type="plus"></Icon>新建线索</button>
                <Button @click="$store.state.importclient=true"><Icon type="forward"></Icon>批量导入</Button>
                <Button @click="exportData"><Icon :type="exporticon"></Icon>{{exportcsv}}</Button>        
               
            </div>
            
        </div>
        <!-- 删除全部 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="deletedata" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="deletedata changebox" v-if="deletedata">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>删除提醒</h2>
                <div class="item1">
                    删除后，线索将无法恢复。确认删除{{total}}条线索？
                </div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="deleteall">确认</button>
                </div>
            </div>
        </transition>

        <!-- 单条删除提醒 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="deleteone" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="deletedata changebox" v-if="deleteone">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>删除提醒</h2>
                <div class="item1">
                    删除后，线索将无法恢复。确定删除线索？
                </div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="removesingle">确认</button>
                </div>
            </div>
        </transition>
        <!-- 多条删除提醒 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="deletemore" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="deletedata changebox" v-if="deletemore">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>删除提醒</h2>
                <div class="item1">
                    删除后，线索将无法恢复。确定删除线索？

                </div>
                <p class="wrongtip">{{tip}}</p>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="removemore">确认</button>
                </div>
            </div>
        </transition>
        <!-- 分配坐席 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="changebox" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="changebox" v-if="changebox" style='width:600px'>
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>分配坐席</h2>
                <Transfer :data="seatlist" :target-keys="targetKeys" :list-style="listStyle" :titles="['所有坐席', '已选坐席']" :render-format="render" :operations="['左移','右移']" filterable :filter-method="filterMethod" @on-change="handleChange" >
                </Transfer>
                <div class="explain">多选情况下线索是按勾选员工的顺序平均分配的,如果无法平均分配,则顺序靠前的员工被分配到的线索多</div>
                <p class="wrongtip">{{tip}}</p>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click='average'>确认</button>
                </div>
            </div>
        </transition>

        <!-- 一键分配 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="changebox2" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="changebox" v-if="changebox2" style='width:600px'>
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>一键分配</h2>
                <Transfer :data="seatlist" :target-keys="targetKeys" :list-style="listStyle" :titles="['所有坐席', '已选坐席']" :render-format="render" :operations="['左移','右移']" filterable :filter-method="filterMethod" @on-change="handleChange" >
                </Transfer>
                <div class="explain">多选情况下线索是按勾选员工的顺序平均分配的,如果无法平均分配,则顺序靠前的员工被分配到的线索多</div>
                <p class="wrongtip">{{tip}}</p>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click='average2'>确认</button>
                </div>
            </div>
        </transition>

        <!-- 新建线索 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="newclint" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="newclint changebox" v-if="newclint">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>新建线索</h2>
                <div class="item1">客户名称<Input v-model="newlistname" ></Input></div>
                <div class="item1">客户电话<Input v-model="newlisttel" ></Input></div>
                <div class="item1">分配坐席
                    <Select v-model="oid" @on-change="chooseseatid">
                        <Option v-for="item in seatlist" :value="item.id" :key="item.number">{{item.name}}</Option>
                    </Select>
                </div>
                <div class="item1">公司名称<Input v-model="newlistcompany" ></Input></div>
                <div class="item1">公司地址<Input v-model="newlistaddress" ></Input></div>
                <div class="item1"><p>{{tip}}</p></div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="confirmnew">确认</button>
                </div>
            </div>
        </transition>
        
        <!-- 编辑线索 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="editclient" @click="cancel"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="editclient changebox" v-if="editclient">
                <a href="javascript:;" class="delete" @click="cancel"></a>
                <h2>编辑线索</h2>
                <div class="item1">客户名称<Input v-model="list[select].cm_name" ></Input></div>
                <div class="item1">客户电话<Input v-model="list[select].cm_mobile" ></Input></div>
                <div class="item1">分配坐席
                    <Select disabled @on-change="chooseseatid" v-model="editlistseatindex" >
                        <Option v-for="item in seatlist" :value="item.id" :key="item.number">{{ item.laber}}</Option>
                    </Select>
                </div>
                <div class="item1">公司名称<Input v-model="list[select].cm_company" ></Input></div>
                <div class="item1">公司地址<Input v-model="list[select].address" ></Input></div>
                <div class="item1"><p>{{tip}}</p></div>
                <div class="item4">
                    <button class="giveup" @click="cancel">取消</button>
                    <button class="confirm" @click="confirmedit">确认</button>
                </div>
            </div>
        </transition>

        <!-- 批量导入 -->
        <transition  enter-active-class="animated fadeIn">
            <div class="mark" v-if="$store.state.importclient" @click="cancelimport"></div>
        </transition>
        <transition  enter-active-class="animated fadeIn">
            <div class="importclient changebox" v-if="$store.state.importclient">
                <a href="javascript:;" class="delete" @click="cancelimport"></a>
                <h2>导入线索</h2>

                <!-- <router-view></router-view> -->
                <stepone v-if="$store.state.steponemark"></stepone>
                <steptwo v-if="$store.state.steptwomark"></steptwo>
                <stepthree v-if="$store.state.stepthreemark"></stepthree>
            
            </div>
        </transition>
        
        <div class="content">
            <!-- 表单 -->
            <Table :columns="columns7" :data="list" @on-select="tableselect" @on-select-all="cidselectall"   size="small" ></Table>
        
            <!-- 分页 -->
            <div class="page">
                <Page :total="total" :page-size="pagesize" show-sizer @on-page-size-change="changepagesize" @on-change="changepage" :page-size-opts="[20, 50, 100]"></Page>
            </div>
        </div>
        
         
    </div>
</template>

<script>
    // import {config} from '../../../assets/common';
    import axios from 'axios';
    import qs from 'qs';
    import stepone from '../importclient/stepone.vue' 
    import steptwo from '../importclient/steptwo.vue' 
    import stepthree from '../importclient/stepthree.vue' 
    export default {
        data() {
            return {
                editlistseatindex:"",//编辑线索默认显示的value值
                typelaber:'',
                typevalue:-1,
                deletemore:false,
                deleteone:false,
                //分配坐席穿梭框
                data: [],   //所有坐席
                targetKeys: [], //选中坐席的keyarr
                listStyle: {
                    width: '230px',
                    height: '350px'
                },
                tip:"",
                pagesize:20,  //每页条数
                page:1,      //页数
                total:0,
                newlistname:'',
                newlisttel:'',
                // newlistseat:'',
                newlistcompany:'',
                newlistaddress:'',
                // newlist:{},
                deletedata:false,
                changebox:false,
                changebox2:false,
                newclint:false,
                editclient:false,
                select:-1,
                oid:0, //新建/编辑时选择的坐席id
                averageoid:'',  //选择分配的坐席id
                ExportCustomerhashcode:'',
                exportcsv:'全部导出',
                exporticon:'reply',
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
                                
                                    h('span', params.row.operator.name    ),
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
                        key: 'action',
                        align: 'center',
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
                                        marginRight: '0.3rem',
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
                list: [],   //线索列表
                seatlist:[], //坐席列表
                tablesel:"",  //选择分配的线索id
            }
        },
        components: {
            stepone,
            steptwo,
            stepthree,
        },
        methods: {
            cancel(){
                this.deletedata=false
                this.changebox=false
                this.changebox2=false
                this.newclint=false
                this.editclient=false
                this.deleteone=false
                this.deletemore=false
                this.targetKeys=[]
                this.total=0
                this.tip=''
                this.oid=0
                this.newlistname=''
                this.newlisttel=''
                this.newlistcompany=''
                this.newlistaddress=''
                this.getclientlist('/account/Customer/getCustomer',{
                    params:{
                        first_id:(this.page-1)*this.pagesize,
                        count:this.pagesize,
                        type:this.typevalue
                    } 
                });
            },
            cancelimport(){
                this.$store.state.importclient=false;
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
                clearInterval(this.$store.state.getper)
            },
            // 选择分配（右边列表）数组--数据的 key 值
            handleChange (newTargetKeys) {
               // console.log(newTargetKeys)
                this.targetKeys = newTargetKeys;
            },
            
            //每行数据渲染函数，该函数的入参为 data 中的项
            render(item) {
                return item.name;
            },
            //搜索
            filterMethod (data, query) {
                return data.name.indexOf(query) > -1;
            },
            //select-cid
            tableselect(selection){
                console.log(selection)
                var arr=[]
                for (var i = 0; i < selection.length; i++) {
                    arr.push(selection[i].id)
                };
                this.tablesel=arr.join(",")
            },
            cidselectall(selection){
                var arr=[]
                for (var i = 0; i < selection.length; i++) {
                    arr.push(selection[i].id)
                };
                this.tablesel=arr.join(",")
            },
            //平均分配
            average(){
                if (this.tablesel=='') {
                    this.tip='请勾选需要分配的线索'
                    return;
                };
                if (this.targetKeys.length==0) {
                    this.tip='请勾选需要分配的坐席'
                    return;
                };
                var that=this
                // 坐席全选
                if (this.targetKeys.length==this.seatlist.length) {
                    axios.get('/account/Customer/AverageCustomer',{
                        params:{
                            cid:that.tablesel,
                            oid:'all'
                        }
                    })
                    .then(function (response) {
                        console.log(response)
                        if (response.data.status==0) {
                            that.$Message.success('坐席分配成功');
                            that.getclientlist('/account/Customer/getCustomer',{
                                params:{
                                    first_id:(that.page-1)*that.pagesize,
                                    count:that.pagesize,
                                    type:that.typevalue
                                } 
                            });

                            that.changebox=false
                        }else{
                            that.tip=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }else{
                    var arr=[];
                    for (var i = 0; i < this.seatlist.length; i++) {
                        for (var j = 0; j < this.targetKeys.length; j++) {
                            if (this.seatlist[i].key==this.targetKeys[j]) {
                                arr.push(this.seatlist[i].id)
                            };
                            
                        };
                    };
                    this.averageoid=arr.join(",")
                    axios.get('/account/Customer/AverageCustomer',{
                        params:{
                            cid:that.tablesel,
                            oid:that.averageoid
                        }
                    })
                    .then(function (response) {
                        if (response.data.status==0) {
                            that.$Message.success('坐席分配成功');
                            that.getclientlist('/account/Customer/getCustomer',{
                                params:{
                                    first_id:(that.page-1)*that.pagesize,
                                    count:that.pagesize,
                                    type:that.typevalue
                                } 
                            });
                            that.changebox=false
                        }else{
                            that.tip=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }   
            },

            //一键分配
            average2(){
                // if (this.tablesel=='') {
                //     this.tip='请勾选需要分配的线索'
                //     return;
                // };
                if (this.targetKeys.length==0) {
                    this.tip='请勾选需要分配的坐席'
                    return;
                };
                var that=this
                // 坐席全选
                if (this.targetKeys.length==this.seatlist.length) {
                    axios.get('/account/Customer/AverageCustomer',{
                        params:{
                            cid:'all',
                            oid:'all'
                        }
                    })
                    .then(function (response) {
                        console.log(response)
                        if (response.data.status==0) {
                            that.$Message.success('坐席分配成功');
                            that.getclientlist('/account/Customer/getCustomer',{
                                params:{
                                    first_id:(that.page-1)*that.pagesize,
                                    count:that.pagesize,
                                    type:that.typevalue
                                } 
                            });

                            that.changebox=false
                        }else{
                            that.tip=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }else{
                    var arr=[];
                    for (var i = 0; i < this.seatlist.length; i++) {
                        for (var j = 0; j < this.targetKeys.length; j++) {
                            if (this.seatlist[i].key==this.targetKeys[j]) {
                                arr.push(this.seatlist[i].id)
                            };
                            
                        };
                    };
                    this.averageoid=arr.join(",")
                    axios.get('/account/Customer/AverageCustomer',{
                        params:{
                            cid:'all',
                            oid:that.averageoid
                        }
                    })
                    .then(function (response) {
                        if (response.data.status==0) {
                            that.$Message.success('坐席分配成功');
                            that.getclientlist('/account/Customer/getCustomer',{
                                params:{
                                    first_id:(that.page-1)*that.pagesize,
                                    count:that.pagesize,
                                    type:that.typevalue
                                } 
                            });
                            that.changebox=false
                        }else{
                            that.tip=response.data.info
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }   
            },
            //新建线索分配坐席时选择坐席id
            chooseseatid(value){
                console.log(value)
                
                this.oid=value;
            },
            //编辑~
            confirmedit(){
                var that=this
                console.log(that.oid)
                axios.get('/account/Customer/modifyCustomer', {
                params: {
                        id:that.list[that.select].id,
                        cname:that.list[that.select].cm_name,
                        phone:that.list[that.select].cm_mobile,
                        oid:that.oid,
                        company:that.list[that.select].cm_company,
                        address:that.list[that.select].address
                    }
                })
                .then(function(response){
                    console.log(response.data)
                    if(response.data.status==0){
                        that.getclientlist('/account/Customer/getCustomer',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize
                            } 
                        });
                        that.editclient=false;
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
                if(this.newlisttel.trim()=='') {
                    this.tip="请输入客户电话"
                }else{
                    var that=this; 
                    axios.post('/account/Customer/addCustomer',qs.stringify({
                        cname:that.newlistname,
                        phone:that.newlisttel,
                        oid:that.oid,
                        company:that.newlistcompany,
                        address:that.newlistaddress,
    
                    }))
                    .then(function(response){
                        if(response.data.status==0){
                            that.cancel()
                            that.typelaber=''
                            that.$Message.success('新建线索成功');
                        }else{
                            
                            that.tip=response.data.info

                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    }); 
                }   
            },
            //批量删除
            removemore(){
                console.log(this.tablesel)
                var that=this;
                axios.get('/account/Customer/deleteCustomer',{
                params: {
                    cid:that.tablesel,
                }
                })
                .then(function(response){
                    if (that.tablesel=='') {
                        that.tip='请选择要删除的企业'
                    };
                    if (response.data.status==0) {
                        //删除成功重新加载数据
                        that.getclientlist('/account/Customer/getCustomer',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize
                            } 
                        });
                        that.cancel()
                    }; 
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
            //清空
            deleteall(){
                var that=this
                console.log()
                axios.get("/account/Customer/deleteCustomer",{
                    params:{
                    cid:"all"
                    } 
                })
                .then(function (response) { 
                    if (response.data.status==0) {
                        console.log(response)
                        that.getclientlist('/account/Customer/getCustomer',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize
                            } 
                        });
                        that.deletedata=false;
                        // that.list=[],
                        that.getclientlist('/account/Customer/getCustomer',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize
                            } 
                        });
                    };
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //删除单条线索
            remove(index) {
                this.select=index;
                this.deleteone=true     
            },
            removesingle(){
                var that=this;
                axios.get('/account/Customer/deleteCustomer',{
                params: {
                    cid:that.list[that.select].id,
                }
                })
                .then(function(response){
                    console.log(response)
                    if (response.data.status==0) {
                        that.getclientlist('/account/Customer/getCustomer',{
                            params:{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize
                            } 
                        });
                        that.cancel()
                    }; 
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
            //编辑线索
            edit (index) {
                this.select=index;
                this.editclient=true
                if (this.list[index].operator) {
                    for (var i = 0; i < this.seatlist.length; i++) {
                        if (this.seatlist[i].laber==this.list[index].operator.name) {
                            this.editlistseatindex=this.seatlist[i].value
                            return;
                        };
                    };
                }else{
                    this.editlistseatindex=''
                }
                
            },
            //分类选择
            catselect(value){
                console.log(value)
                var that=this;
                this.typevalue=value;
                this.getclientlist('/account/Customer/getCustomer',{
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        type:value
                    } 
                });
            },
            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                var that=this;
                this.getclientlist('/account/Customer/getCustomer',{
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
                this.getclientlist('/account/Customer/getCustomer',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    value:that.typevalue
                    }
               })
            },
            //进入获取线索列表
            getclientlist(url,config){
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
            //导出csv
            exportData () {
                var that=this;
                axios.get('/account/Customer/ExportCustomer')
                .then(function (response) {

                    if (response.data.status==0) {
                        that.ExportCustomerhashcode=response.data.data.hash_code;
                        that.exportcsv='正在导出'
                        that.exporticon='load-d'
                        //导出进度
                        console.log(that.ExportCustomerhashcode)
                        var getper=setInterval(function () {
                            axios.get('/account/Customer/getPercent',{
                                params:{
                                    hash_code:that.ExportCustomerhashcode
                                }
                            })
                            .then(function (response) {
                                console.log(response)
                                if (response.data.data.per==100) {
                                    that.exportcsv='全部导出'
                                    that.exporticon='reply'
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
            this.getclientlist('/account/Customer/getCustomer',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                } 
            });
            //获取坐席
            axios.get('/account/Operator/getAllmembers')
            .then(function (response) { 
                if (response.data.status==0) {
                    that.seatlist=response.data.data.content
                    for (var i = 0; i < that.seatlist.length; i++) {
                        for(var k in that.seatlist[i]){
                            that.seatlist[i].key=i.toString();
                        }
                        that.seatlist[i].value=that.seatlist[i].id
                        that.seatlist[i].laber=that.seatlist[i].name
                    };
                };
                
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
</script>

<style scoped>
    .select{
        width: 12.375rem;
        height: 2.125rem;
        padding: 0 0.875rem;
        overflow: hidden
    }
    .fr button{
        border-radius: 3px;
        margin-left: 0.875rem;
    }
    .bgw{
        width: 75px;
        height: 32px;
        background-color: #fafafa;
    }
    .dosth{
        margin-bottom: 1.25rem
    }
    .fr{
        float: right;
        overflow: hidden;
    }
    .changebox{
        height: 38rem;
        /* width: 37.5px; */
    }
    .changebox .chooseseat{
        width: 30rem;
        margin: 0.625rem auto;
        height: 21.25rem;
        background-color: #eee;
        padding: 1.25rem;
    }
    .chooseseat .search{
        display: block;
        width: 13.125rem;
        height: 2.125rem;
        background-color: #fff;
        padding-left: 1.125rem;
        margin-bottom: 1.5rem;
    }
    .seat{
        margin-top: 1.5rem;
    }
    .seat label{
        display: block;
        margin-bottom: 1rem;
        
    }
    input[type="checkbox"]{
        vertical-align: middle;
        margin-right: 0.75rem
    }
    .ivu-icon{
        color: #333;
        margin-right: 0.5rem;
        transition: color .2s linear,background-color .2s linear,border .2s linear;
    }
    .ivu-btn{
        color: #fff;
        background-color: #00b5ff;
        padding:  6px 10px;
    }
    .ivu-btn .ivu-icon{
        color: #fff
    }
    .page ul{
        float: right;
    }
    .newclint,.editclient{
        height: 25rem;
    }
    .importclient{
        height: 18.75rem;
    }
    .deletedata{
        width: 25rem;
        height: 12.5rem;
    }
    .deletedata .item4{
        position: fixed;
        bottom: 0;
        right: -1.875rem;
    }
    .newclint>.item1,.editclient>.item1,.deletedata>.item1{
        line-height: 2.125rem;
        overflow: hidden;
    }
    
    .newclint>.item1>div,.editclient>.item1>div{
        width: 27.375rem;
        height: 2.125rem;
        background-color: #fff;
        border-radius: 3px;
        margin-bottom: 0.8125rem;
        float: right;
        max-height: 12.5rem
    }
    .item1 p{
        position: absolute;
        bottom: 4.6875rem;
        left: 7.1875rem;
        color:#ff5e5e;
    }
    .explain{
        margin-top: 1.875rem;
        color: #999
    }
    .wrongtip{
        position: absolute;
        bottom: 4.6875rem;
        left: 1.875rem;
        color:#ff5e5e;
    }
</style>