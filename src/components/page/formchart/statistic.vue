<template>
  <div id="statistic">
    <!-- 概况预览 -->
    <Row :gutter="16" class="overview">
        <Col span="6">
           <Card :dis-hover='true'>
             <p slot="title">拨打次数</p><p>{{overviewData.outcall_total_count}}</p>
           </Card>
        </Col>
        <Col span="6">
          <Card :dis-hover='true'>
            <p slot="title">接听次数</p><p>{{overviewData.outcall_count}}</p>
          </Card>
        </Col>
        <Col span="6">
          <Card :dis-hover='true'>
            <p slot="title">接通率</p><p>{{overviewData.outcall_rate}}%</p>
          </Card>
        </Col>
        <Col span="6">
          <Card :dis-hover='true'>
            <p slot="title">拨通话时长</p><p>{{ this.formatTime(overviewData.outcall_time)}}</p>
          </Card>
        </Col>
    </Row>

    <!-- 折线图 -->
    <div class="chartbox">
      <Select v-model="seletChart" @on-change="changeChart">
          <Option v-for="item in statisticList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>

      <div id="myChart" :style="{width: '100%', height: '350px'}"></div>
    </div>

    <!-- 统计明细 -->
    <div class="details">
        <h4>统计明细</h4>
        <Table :columns="detailsColumns" :data="detailsData" size="small" border></Table>
        <div class="clearfix">
          <Button type="primary" class="exportcsv" @click='exportdetail'><Icon type="reply"></Icon> 导出 </Button>
        </div>
    </div>
    <!-- <div class="details">
      <h4>统计明细</h4>
      <div class="tables clearfix">
          <Table :columns="detailsColumns" :data="detailsData"></Table>
          <Table :columns="tableColumns" :data="tableData" class="data"></Table>
      </div>
    </div> -->

  </div>
</template>
<script>
import axios from 'axios';
import echarts from 'echarts'
import Bus from '../../../../static/js/bus.js';
export default {
  name: "statistic",
  props: ['type'],
  watch:{
    type(val, oldVal){
      this.renderData(this.totalData[this.type])
    }
  },


  data () {
   const self = this;
   return {
    totalData:{},       // 年月日所有数据
    overviewData:{      // 概况预览数据
      outcall_count:0,
      outcall_total_count:0,
      outcall_rate:0,
      outcall_time:0
    },
    // 折线图部分
    statisticList:[
      {
        value:0,
        key:'outcall_total_count',
        label:'拨打次数',
        color:'#8e66e1',
        unit:'（次）'
      },{
        value:1,
        key:'outcall_count',
        label:'接听次数',
        color:'#0cb8ff',
        unit:'（次）'
      },{
        value:2,
        key:'outcall_rate',
        label:'接通率',
        color:'#33c881',
        unit:'（%）'
      },{
        value:3,
        key:'outcall_time',
        label:'通话时长',
        color:'#f5a100',
        unit:'（时长）'
      }
    ],
    chart:null,
    seletChart:0,  // 当前选中折线图
    ChartX:[],
    ChartY:[],
    // 表格 new
    // tableColumns:[],
    // tableData:[],
    sort:1,   // 1由大到小，2有小到大
    // 表格
    detailsColumns:[{
      title:"栏目",
      key:"column",
      fixed: "left",
      width:202,
      render: (h, params) => {
          return h('div', [
              h('span', params.row.column),
              h('span', [
                h('Button', {
                    props: {
                        icon: 'ios-arrow-thin-left',
                        type:'text'
                    },
                    on: {
                        click: () => {
                          this.detailSort(params,2);
                        }
                    }
                }),
                h('Button', {
                    props: {
                        icon: 'ios-arrow-thin-right',
                        type:'text'
                    },
                    on: {
                        click: () => {
                          this.detailSort(params,1);
                        }
                    }
                })
              ])
          ]);
      }
    }],
    detailsData:[{"column":"拨打次数"},{"column":"接听次数"},{"column":"接通率"},{"column":"通话时长"}]
  }},
  methods: {
    // 初次加载，渲染全部数据
    renderAllData(){
      [1,30,365].forEach(d=>{
        axios.get('/account/CallRecord/getStatistic?type=cc_day_callinout_statistic',{
            params: {
                searchType:d
            }
        })
        .then(res=>{
          if (res.data.status=='102002') {
             window.location.hash="/login"
          };
          if(res.status===200){
            this.totalData[d] = res.data.data;
            if(d==this.type){
              this.renderData(this.totalData[d]);
            }
          }
        })
        .catch(()=>{})
      })
    },
    detailSort(params,sort){
      this.sort = sort
      this.calculateTable(this.sort,params.index);
      console.log(this.sort);
    },
    formatTime(second_time){
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
    renderData(data) {
          const self = this;
          this.overviewData = data[0]
          this.statisticList.map((item,j)=>{
            item.list = Object.values(data).slice(1).map(d=>{return d[item.key]})
          })

          // 绘折线图
          this.ChartX = Object.keys(data).slice(1);     // x 轴
          this.ChartY = this.statisticList[this.seletChart].list      // y 轴
          this.drawLine();

          // 表格
          this.calculateTable()
    },
    changeChart(selet){
      this.seletChart = selet;
      this.ChartY = this.statisticList.filter((d)=>{return d.value == selet})[0].list
      this.drawLine();
    },
    drawLine(){
        const self = this;
        let format = null,ChartX=this.ChartX;
        if(self.seletChart==3){
          format = self.formatTime.bind(self)
        }
        if(this.type==1){
          ChartX = self.ChartX.map((item)=>{return self.formatXAxis(item)})
        }

        // 绘制图表
        this.chart.setOption({


            grid: {
                left: '60',
                right: '0'
            },
            title: {
               show:false,
               text: self.statisticList[self.seletChart].label
            },
            tooltip: {
               trigger: 'axis'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                x:"center",
                y:"bottom",
                data:[{
                  name: self.statisticList[self.seletChart].label,
                  icon:'circle'
                }],
                selectedMode:false,
            },
            xAxis: {
              boundaryGap:['20%', '20%'], 
              axisTick:{
                  show:false
                },
                data:ChartX,
                type: 'category',
                nameGap:10,  //名称与X轴的距离
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
            },
            color:[self.statisticList[self.seletChart].color],
            yAxis: {
                // splitNumber:5,
                type: 'value',
                nameGap:10,  //名称与Y轴的距离
                name:self.statisticList[self.seletChart].unit,    //坐标轴名称
                nameTextStyle:{     //名称的样式
                    color:'#999',
                    fontSize:'12px'
                },
                axisTick:{ //坐标轴刻度相关设置
                    length:'0' //设置成0了
                },
                axisLine:{//坐标轴线条相关设置(颜色等)
                    show:false
                },
                axisLabel:{//坐标轴标签相关设置,距离颜色等
                    margin:7,
                    textStyle:{
                        color:"#999",  //坐标轴刻度文字的颜色
                        fontSize:'12px' //坐标轴刻度文字的大小
                    },
                    formatter:format,
                    interval:100
                }
            },
            series: [ {
                name:self.statisticList[self.seletChart].label,
                type:'line',
                data:self.ChartY
            }]
        });
    },
    formatXAxis(data){
      let base = Number(data.slice(11,13));
      function zero(x){
        if(x<9){
          return `0${x}`
        }
        return x
      }
      return `${zero(base)}:00 - ${zero(base)}:59`
    },
    exportdetail(){
      var downloadStatistic='/account/CallRecord/getStatistic?type=cc_day_callinout_statistic&searchType='+this.type+'&needExport='+this.type
      window.location.href=downloadStatistic
    },
    calculateTable(sort,index){
      let itemMap = ['outcall_total_count','outcall_count','outcall_rate','outcall_time'];
      let arr = []
      for (let [k, v] of Object.entries(this.totalData[this.type])) {
        arr.push({time:k,data:v})
      }
      arr = arr.slice(1)


      if(sort){    // 排序
        var len = arr.length;
        arr.sort((a,b)=>{
          let flag = (Number(a.data[itemMap[index]]) - Number(b.data[itemMap[index]]))>=0 ? -1 : 1;
          if(sort==2){
            return flag;
          }else{
            return -flag;
          }
        })
      }

      let detailsColumns = arr.map((d,i)=>{
        return ({
          title:d.time,
          key:d.time,    // arr 第几项，key就是多少
          width:179,
          align:'center'
        })
      })
      itemMap.map((item,i)=>{
        arr.map((d)=>{
          this.detailsData[i][d.time] = `${d.data[item]}次`
          if(i==2){   // 通话率
            this.detailsData[i][d.time] =  `${Number(d.data[item]).toFixed(2)}%`
          }
          if(i==3){   // 通话时长
            this.detailsData[i][d.time] = this.formatTime(d.data[item])
          }
        })
      })
      this.detailsColumns = this.detailsColumns.slice(0,1).concat(detailsColumns)
      arr = []
      // console.log(this.detailsData);
    },
  },
  mounted() {
    Bus.$on('renderSummary',this.renderAllData)
    
    this.chart = echarts.init(document.getElementById('myChart'))
    this.renderAllData();
  }
}
</script>

<style>
  #myChart{
  margin-top: -20px;
  }
  .overview{
    text-align: center;
  }
  .overview .ivu-card-head{
    background: #fafafa;
  }
  .overview .ivu-card-head p{
    font-weight: normal;
    font-size: 16px;
  }
  .overview .ivu-card-body{
    padding: 0;
    height: 115px;
    line-height: 115px;
    font-size: 30px;
    color: #00b5ff;
  }
  .chartbox{
    margin-top: 20px;
    position: relative;
  }
  .chartbox .ivu-select{
    position: relative;
    width: 148px;
    z-index: 9;
  }
  .chartbox .ivu-select-selection{
    border-radius: 2px;
    background: #fafafa;
    border: 1px solid #ebebeb;
  }

  /* 表格 */
 /*  .details .ivu-table{
    overflow: scroll;
  } */
  .details h4{
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: normal;
  }
  .details .ivu-table-cell{
    line-height: 36px;
  }
  .details  .ivu-table-cell span:nth-child(2){
    float: right;
    padding-top: 2px;
  }
  .details .ivu-btn-text{
    border: 0;
    font-size: 15px;
    display: block;
    padding: 0;
    margin: 0;
    line-height: 1;
    /*margin-top: 5px;*/
  }
  /*.details .ivu-btn-text*/

  .details .ivu-btn-text + .ivu-btn-text{
    /*margin-top: -10px;*/
  }
  .details .exportcsv{
      margin-top: 20px;
      float: right;
  }
</style>
