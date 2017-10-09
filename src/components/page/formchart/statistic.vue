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
            <p slot="title">接通率</p><p>{{overviewData.outcall_rate}}<span>%</span></p>
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

      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </div>

    <!-- 统计明细 -->
    <div class="details">
        <h4>统计明细</h4>
        <Table :columns="detailsColumns" :data="detailsData" size="small"></Table>

        <Button type="primary" class="exportcsv" @click='exportdetail'><Icon type="forward"></Icon> 导出 </Button>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
import echarts from 'echarts'

export default {
  name: "statistic",
  props: ['type'],
  watch:{
    type(val, oldVal){
      this.renderData(this.totalData[this.type])
    }
  },
  data: () => ({
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
        key:'outcall_count',
        label:'拨打次数',
        color:'#8e66e1',
        unit:'（次）'
      },{
        value:1,
        key:'outcall_total_count',
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
        unit:'（秒）'
      }
    ],
    chart:null,
    seletChart:0,  // 当前选中折线图
    ChartX:[],
    ChartY:[],

    // 表格
    detailsColumns:[{
      title:"栏目",
      key:"column",
      fixed: "left",
      width:202,
      render: (h, params) => {
          return h('div', [
              h('span', params.row.column),
              h('Button', {
                  props: {
                      icon: 'arrow-swap',
                      type:'text'
                  },
                  on: {
                      click: () => {
                        this.default.methods.detailSort(params);
                      }
                  }
              })
          ]);
      }
    }],
    detailsData:[{
      "column":"拨打次数"
    },{
      "column":"接听次数"
    },{
      "column":"接通率"
    },{
      "column":"通话时长"
    }]
  }),
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
          if(res.status===200){
            this.totalData[d] = res.data.data;
            this.renderData(this.totalData[this.type]);
          }
        })
        .catch(()=>{})
      })
    },
    detailSort(params){
      console.log(params);
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
          // console.log(data);
          this.overviewData = data[0]

          // this.ChartX = Object.keys(data).slice(1);     // x 轴
          // this.statisticList.map((item,j)=>{
          //   item.list = Object.values(data).map(d=>{return d[item.key]}).slice(1)
          //   // item.list.map((d,i)=>{
          //   //   this.detailsData[j][i]= d
          //   // })
          // })
          // this.ChartY = this.statisticList[0].list      // y 轴
          // this.drawLine();

          new Promise((resole,reject)=>{
            self.ChartX = Object.keys(data).slice(1);     // x 轴
            self.statisticList.map((item,j)=>{
              item.list = Object.values(data).map(d=>{return d[item.key]}).slice(1)
              item.list.map((d,i)=>{
                this.detailsData[j][i]= d
              })
            })
            self.ChartY = this.statisticList[0].list      // y 轴
            resole(self.ChartY)
          }).then((value)=>{
            self.drawLine();
          }).then((value)=>{
            let detailsColumn = Object.keys(data).map((d,i)=>{
              return ({
                "title":d,
                "key":i-1,
                "width":179
              })
            });
            detailsColumn.slice(1).map(d=>{
              this.detailsColumns.push(d)   //时间
            })
          })


    },
    changeChart(selet){
      this.seletChart = selet;
      this.ChartY = this.statisticList.filter((d)=>{return d.value == selet})[0].list
      this.drawLine();
    },
    drawLine(){
        const self = this;
        // 绘制图表
        this.chart.setOption({
            grid: {
              left: '3%',
              right: '3%'
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
                }]
            },
            xAxis: {
                data:self.ChartX,
                type: 'category',
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
            },
            color:[self.statisticList[self.seletChart].color],
            yAxis: {
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
                    lineStyle:{
                        color:'#ccc'
                    }
                },
                axisLabel:{//坐标轴标签相关设置,距离颜色等
                    margin:7,
                    textStyle:{
                        color:"#999",  //坐标轴刻度文字的颜色
                        fontSize:'12px' //坐标轴刻度文字的大小
                    },
                }
            },
            series: [ {
                name:self.statisticList[self.seletChart].label,
                type:'line',
                data:self.ChartY
            }]
        });
    },
    exportdetail(){
      axios.get('/account/CallRecord/getStatistic?type=cc_day_callinout_statistic',{
          params: {
              searchType:this.type,
              needExport:this.type
          }
      })
      .then(function(err){
          console.log(err);
      })
      .catch(function(err){
          console.log(err);
      });
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('myChart'))
    this.renderAllData();
  }
}
</script>
<style>
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
  .overview .ivu-card-body span{
    font-size: 15px;
  }

  .chartbox{
    margin-top: 20px;
  }
  .chartbox .ivu-select{
    width: 148px;
  }
  .chartbox .ivu-select-selection{
    border-radius: 2px;
    background: #fafafa;
    border: 1px solid #ebebeb;
  }

  /* 表格 */
  .ivu-table{
    overflow: scroll;
  }
  .details h4{
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: normal;
  }
  .ivu-btn-text{
    float: right;
    color: #ccc;
  }
  .exportcsv{
    margin-top: 20px;
  }

</style>
