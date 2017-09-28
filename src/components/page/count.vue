<template>
    <div class="temp1">
        <h3>坐席统计</h3>
        <!-- 选择日期 -->
        <div class="time">
            <DatePicker type="date" placeholder="选择日期" @on-change='startT'></DatePicker>
             至
            <DatePicker type="date" placeholder="选择日期" @on-change='endT'></DatePicker>
            <Button type="primary" @click='searchdate' size="small">搜索</Button>
            <div class="fr">
                <!-- <i></i> -->
                <input type="text" placeholder="请输入姓名或号码进行模糊匹配" class="search" v-model="sname">
                <Button  class="searchicon" @click="snamefilter">搜索</Button>  
                <Button @click="exportData"><Icon :type="exporticon"></Icon>{{exportcsv}}</Button>
            </div>
        </div>
        <!-- 坐席管理 -->
        <div>
            <Table :columns="columns" border :data="list" ref="table" ></Table>
            
            <div class="page">
                <Page :total="total" :page-size="pagesize" show-sizer :page-size-opts="[20, 50, 100]" @on-page-size-change="changepagesize" @on-change="changepage"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    // import {myCommon} from '../../assets/common.js';
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data () {
            return {
                ExportOperatorhashcode:'',
                tableheight:0,
                exportcsv:'全部导出',
                exporticon:'reply',
                start_time:'',
                end_time:'',
                pagesize:20,  //每页条数
                page:1,      //页数
                total:0,
                sname:"",
                columns: [
                    {
                        "title": "坐席",
                        "key": "name"
                    },
                    {
                        "title": "呼叫次数",
                        "key": "outcall_total_count",
                        "sortable": true
                    },
                    {
                        "title": "接听次数",
                        "key": "outcall_count",
                        "sortable": true
                    },
                    {
                        "title": "接听率",
                        "key": "outcall_rate",
                        "sortable": true,
                         render: (h, params) => {

                            return h('div',params.row.outcall_rate+'%');  
                        }
                    },
                    {
                        "title": "通话时长",
                        "key": "outcall_time",
                        "sortable": true,
                        render: (h, params) => {

                            return h('div',this.time(params.row.outcall_time));  
                        }
                    }
                ],
                list: [],
                sortlist:[]
            }
        },
        methods:{
            time(second_time){
                var time = parseInt(second_time) + "秒";  
                if( parseInt(second_time )> 60){  
                  
                    var second = parseInt(second_time) % 60;  
                    var min = parseInt(second_time / 60);  
                    time = min + "分" + second + "秒";  
                      
                    if( min > 60 ){  
                        min = parseInt(second_time / 60) % 60;  
                        var hour = parseInt( parseInt(second_time / 60) /60 );  
                        time = hour + "小时" + min + "分" + second + "秒";  
                  
                        if( hour > 24 ){  
                            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
                            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
                            time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
                        }  
                    }  
                      
                  
                }  
  
            return time;
            },
            //日期搜索
            startT(a){
                this.start_time=a
            },
            endT(b){
                this.end_time=b
            },
            searchdate(){
                var that=this
                this.getOperatorsStatistic('/account/CallRecord/getOperatorStatistic',{
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        start_time:this.start_time,
                        end_time:this.end_time
                    }
                })
            },
            //模糊匹配
            snamefilter(){
                var that=this
                this.getOperatorsStatistic('/account/CallRecord/getOperatorStatistic',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    search:that.sname
                    } 
                })
            },

            //进入获取所有坐席信息
            getOperatorsStatistic(url,config){
                var that=this
                axios.get(url,config)
                .then(function (response) {
                    console.log(response)
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
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    } 
               })

            },
            //切换页数
            changepage(index){
                this.page=index;
                var that=this;
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    }
               })
            },
            //导出csv
            exportData(){
                window.location.href='/account/Operator/ExportStatistic'
            }
        },
        mounted () {
            // this.tableheight=document.body.clientHeight-277.5;
            var that=this;
            this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
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
        div.dataTables_wrapper {
            width: 800px;
            margin: 0 auto;
        }
        .table.dataTable thead th, table.dataTable thead td{
            border-bottom: none;
            font-size: 14px;
            color: #333;
        }
        table.dataTable.no-footer {
            border: 1px solid #ccc;
            border-right: none;
        }
        table.dataTable.display tbody tr.odd > .sorting_1, table.dataTable.order-column.stripe tbody tr.odd > .sorting_1{
            background-color: none;
        }
        #table_id_example{
            font-size: 14px;
        }
        td{
            border-right: 1px solid #ccc;
        }
        .time{
            margin: 10px 0 20px;
            position: relative;
        }
        .fr{
            float: right;
            position: relative;
        }
        .fr>i{
            position: absolute;
            left: 7px; 
            top: 10px;
            width: 15px;
            height: 15px;
            background: url(../../../static/img/2.png) no-repeat 0-30px ;
        }
        .search{
            width: 280px;
            height: 34px;
            padding-left: 24px;
        }
        .searchicon{
            margin-right: 8px
        }
        /* 导出按钮 */
        .ivu-btn{
            color: #fff;
            background-color: #00b5ff;
        }
        .ivu-btn .ivu-icon{
            color: #fff
        }
        .temp1>div:nth-of-type(2){
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
</style>