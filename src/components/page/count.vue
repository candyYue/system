<template>
    <div>
        <h3>坐席统计</h3>
        <div class="temp">
        <!-- 选择日期 -->
        <div class="time clearfix">
            <div class="fl">
                <DatePicker type="date" placeholder="选择日期" @on-change='startT'></DatePicker>
                 至
                <DatePicker type="date" placeholder="选择日期" @on-change='endT'></DatePicker>
                <Button @click='searchdate'>搜索</Button>
            </div>
            <div class="fr">
                <Input v-model="sname" placeholder="请输入姓名或号码进行模糊匹配" style="width: 280px" @on-enter='searchAction'></Input>
                <Button  class="searchicon" @click="searchAction">搜索</Button>  
                <Button @click="exportData"><Icon :type="exporticon"></Icon>{{exportcsv}}</Button>
            </div>
        </div>
        <!-- 坐席管理 -->
        <div class="tableContent">
            <Table :columns="columns" border :data="list" ref="table"  size="small"></Table>
            
            <div class="page">
                <Page :total="total" :page-size="pagesize" show-sizer :page-size-opts="[20, 50, 100]" @on-page-size-change="changepagesize" @on-change="changepage"></Page>
            </div>
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

                            return h('div',Number(params.row.outcall_rate).toFixed(2)+'%');  
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
                list: []
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

                this.page=1
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
            searchAction(){
                this.page=1
                this.initstatistic()
            },

            //进入获取所有坐席信息
            getOperatorsStatistic(url,config){
                var that=this
                axios.get(url,config)
                .then(function (response) {
                    console.log(response)
                    if (response.data.data==null) {
                        that.list=[];
                        return
                    };
                    if (response.data.status==0) {
                        that.total=response.data.data.total;
                        // that.list=response.data.data.content
                        let newList=[];
                        response.data.data.content.map((item,index)=>{
                          newList[index] = {}
                          for(var prop in item){
                            if(prop=='name'){
                              newList[index][prop] = item[prop]
                            }else{
                              newList[index][prop] = Number(item[prop])
                            }
                          }
                        })
                        that.list = newList;
                       
                    };
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            initstatistic(){
                var that=this;
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        search:that.sname
                    } 
                })
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
            this.initstatistic()
  　　  }
    }
</script>

<style scoped>
        .time{
            margin: 10px 0 20px;
            position: relative;
        }
        .fl div{
            display: inline-block;
        }
        .fr>i{
            position: absolute;
            left: 7px; 
            top: 10px;
            width: 15px;
            height: 15px;
            background: url(../../../static/img/2.png) no-repeat 0-30px ;
        }
        /* 导出按钮 */
        .ivu-btn{
            color: #fff;
            background-color: #00b5ff;
        }
        .ivu-btn .ivu-icon{
            color: #fff
        }
        .page{
            position: absolute;
            right: 0px;
        }

</style>