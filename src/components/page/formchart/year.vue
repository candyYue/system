<template>  
    <div class="temp2"> 
        <ul class="statistic">
            <li>
                <span>拨打次数</span>
                <p>{{typelist.outcall_count}}</p>
            </li>
            <li>
                <span>接听次数</span>
                <p>{{typelist.outcall_count}}</p>
            </li>
            <li>
                <span>接通率</span>
                <p>{{typelist.outcall_rate}}</p>
            </li>
            <li>
                <span>通话时长</span>
                <p>{{typelist.outcall_time}}</p>
            </li>
        </ul> 
        <!-- 图表 -->
        <div id="line"></div>  

        <!-- 统计明细表 -->
    <h3 class="tabletitle">统计明细表</h3>
    <div class="table">
        <table class="posl data_table">
                 <thead>
                    <tr>
                        <td @click='calloutsort("fDay")'><a href="javascript:;">栏目<Icon type="arrow-swap"></Icon></a></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td @click='calloutsort("outcall_total_count")'><a href="javascript:;">拨打次数<Icon type="arrow-swap"></Icon></a></td>
                    </tr>
                    <tr>
                        <td @click='calloutsort("outcall_count")'><a href="javascript:;">接听次数<Icon type="arrow-swap"></Icon></a></td>
                    </tr>
                    <tr>
                        <td @click='calloutsort("outcall_total_count")'><a href="javascript:;">接通率<Icon type="arrow-swap"></Icon></a></td>
                    </tr>
                    <tr>
                        <td @click='calloutsort("outcall_time")'><a href="javascript:;">通话时长<Icon type="arrow-swap"></Icon></a></td>
                    </tr>
                </tbody> 
        </table>
        <div class="ivu-table">
            
            <table class="data_table" ref='data_table'>
                <thead>
                    <tr>
                        <td v-for='item in xaxis'>{{item}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for='item in outcallxaxis'>{{item}}</td>
                    </tr>
                    <tr>
                        <td v-for='item in outcallxaxis'>{{item}}</td>
                    </tr>
                    <tr>
                        <td v-for='item in outcallxaxis'>{{item}}</td>
                    </tr>
                    <tr>
                        <td v-for='item in outcallxaxis'>{{item}}</td>
                    </tr>
                </tbody> 
            </table>
        </div>
        <br>
        <Button type="primary" size="small" class="exportcsv"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
    </div>

    </div>
    
</template>  
  
<script>
    import axios from 'axios';
    import qs from 'qs';
    import Schart from 'vue-schart';

export default {
    components: {
        Schart
    },
    data () {
        return {
            typelist:[],
            xaxis:[],  //x轴（日期）
            outcallxaxis:[], //拨打次数
            incallxaxis:[], //接听次数
            ratexaxis:[], //接通率
            timexaxis:[], //通话时长 
            sortlist:[],
        }
    },
    methods:{
        
        calloutsort(val){
            function sortStatistic(map,key,type="ase"){

                return  map.sort(function(a,b){
                    return a[key]<b[key];
                });
            }
            
            sortStatistic(this.sortlist,val)

            //重新渲染
            this.xaxis=[];
            this.outcallxaxis=[];
            this.incallxaxis=[];
            this.ratexaxis=[];
            this.timexaxis=[];
            for (var i = 0; i < this.sortlist.length; i++) {
                this.xaxis.push(this.sortlist[i].fDay) //x轴
                this.outcallxaxis.push(this.sortlist[i].outcall_total_count)
                this.incallxaxis.push(this.sortlist[i].outcall_count)
                this.ratexaxis.push(this.sortlist[i].outcall_time/this.sortlist[i].outcall_total_count)
                this.timexaxis.push(this.sortlist[i].outcall_time)
            } 

        }
    },
    mounted(){

        var that=this
        axios.get('/account/CallRecord/getStatistic?type=cc_day_callinout_statistic',{
            params: {
                searchType:365  //日报
            }
        })
        .then(function(response){
            if (response.data.status==0) {
               var res=response.data.data
            that.typelist=res[0]  //拨打次数 接听次数 接通率 通话时长
            
            var chart = document.getElementById('line');    
            var echart = echarts.init(chart);   
            
            //对象转数组
            for (var k in res) {
                var item = res[k];
                item["key"] = k;
                that.sortlist.push(item);
            };
            
            that.sortlist.shift() //去除第一项
            for (var i = 0; i < that.sortlist.length; i++) {
                that.xaxis.push(that.sortlist[i].fDay) //x轴
                that.outcallxaxis.push(that.sortlist[i].outcall_total_count)
                that.incallxaxis.push(that.sortlist[i].outcall_count)
                that.ratexaxis.push(that.sortlist[i].outcall_time/that.sortlist[i].outcall_total_count)
                that.timexaxis.push(that.sortlist[i].outcall_time)
            } 
            
            var length=that.xaxis.length*150+'px'
            that.$refs.data_table.style.width=length  //动态设置table宽度
            var option = {
                tooltip : { //提示框
                    trigger: 'axis'
                },
                legend: {
                    x:"center",
                    y:"bottom",
                    data:['呼叫次数统计','接听次数','接通率','通话时长统计']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        name:'(月)',        //X轴名称单位
                        nameLocation:'end', //名称的位置
                        nameTextStyle:{     //名称的样式
                            color:'#999',
                            fontSize:'12px'
                        },
                        nameGap:10,  //名称与X轴的距离
                        boundaryGap : false,//坐标的刻度是否在中间
                        axisLine:{//坐标轴线条相关设置(颜色等)
                            lineStyle:{
                                color:'#ccc'
                            }
                        },
                         axisLabel:{ //坐标轴刻度标签
                            margin:7, //刻度标签与轴线之间的距离
                            textStyle:{
                                color:"#999",  //坐标轴刻度文字的颜色
                                fontSize:'12px' //坐标轴刻度文字的大小
                            }
                        },
                        data : that.xaxis //x轴时间
                    }
                ],
                yAxis : [
                    {
                        type : 'value', //类型数值轴
                        name:'(人)',    //坐标轴名称
                        nameTextStyle:{     //名称的样式
                            color:'#999',
                            fontSize:'12px'
                        },
                        nameGap:10,  //名称与Y轴的距离
                        axisTick:{ //坐标轴刻度相关设置
                            length:'0' //设置成0了
                        },
                        axisLine:{//坐标轴线条相关设置(颜色等)
                            lineStyle:{
                                color:'#ccc'
                            }
                        },
                        axisLabel:{//坐标轴标签相关设置,距离颜色等
                            margin:7,
                            //formatter: '{value} °C',//标签内容内置的格式转化器比如这个表示在后面加一个c
                            textStyle:{
                                color:"#999",  //坐标轴刻度文字的颜色
                                fontSize:'12px' //坐标轴刻度文字的大小
                            },
                        },
                        splitLine:{    //坐标轴分隔线。默认数值轴显示，类目轴不显示。
                            show:false
                        }
                    }
                ],
                series : [
                    {
                        name:'呼叫次数统计',   //系列名称 用于tooltip的显示
                        type:'line',
                        data:that.outcallxaxis,
                        itemStyle:{  //折线拐点的样式
                            normal:{
                                color:'#20aefc',  //折线拐点的颜色
                            }
                        },
                        lineStyle:{  //线条的样式
                            normal:{
                                color:'#20aefc',  //折线颜色
                            }
                        },
                    },
                    {
                        name:'接听次数',
                        type:'line',
                        stack: '总量',
                        data:that.incallxaxis,
                        itemStyle:{  //折线拐点的样式
                            normal:{
                                color:'#8e66e1',  //折线拐点的颜色
                            }
                        },
                        lineStyle:{  //线条的样式
                            normal:{
                                color:'#8e66e1',  //折线颜色
                            }
                        },                 
                    },
                    {
                        name:'接通率',
                        type:'line',
                        stack: '总量',
                        data:that.ratexaxis,
                        itemStyle:{  //折线拐点的样式
                            normal:{
                                color:'#33c881',  //折线拐点的颜色
                            }
                        },
                        lineStyle:{  //线条的样式
                            normal:{
                                color:'#33c881',  //折线颜色
                            }
                        }, 
                    },
                    {
                        name:'通话时长统计',   //系列名称 用于tooltip的显示
                        type:'line',
                        data:that.timexaxis,
                        itemStyle:{  //折线拐点的样式
                            normal:{
                                color:'#f5a100',  //折线拐点的颜色
                            }
                        },
                        lineStyle:{  //线条的样式
                            normal:{
                                color:'#f5a100',  //折线颜色
                            }
                        },
                    }
                ]
            };
                                         
            echart.setOption(option);
            };
            
        })
        .catch(function(err){
            console.log(err);
        });
    }
}
</script>  
<!-- Add "scoped" attribute to limit CSS to this component only -->  
<style scoped> 
    @import "../../../../static/css/count.css";
    .table{
        padding-left: 12.5rem;
        position: relative;
    }
    .posl{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
    }
    .posl td{
        height: 2rem;
    }
    .ivu-table{
        overflow: scroll;
        cursor: pointer;
    }
    .ivu-table td, .ivu-table th {
        min-width: 0;
        height: 2rem;
    }
    .data_table{
        /* width: 300rem; */
        border-collapse: collapse;
    }
    .data_table thead td{
        background-color: #fafafb;
        color: #000
    }
    td{
        position: relative;
    }
    td i{
        position: absolute;
        right: 1.25rem;
        top: 0.625rem;
    }
    .ivu-table:before{
        height: 0;
    }
    .posl a{
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 1.875rem;
        color: #495060
    }
    .posl td{
        width: 12.5rem;
    }
    .posl a:hover{
        color: #000;
    }
    .posl a:focus{
        color: #2d8cf0;
    }
</style> 