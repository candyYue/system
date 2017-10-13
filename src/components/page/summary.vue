<template>
    <div class="">
        <h3>统计概况</h3>
        <div class="temp">
          <ul class="cate clearfix">
              <li v-for="elem in catalog" :key="elem.key" :class="{'active' : elem.active}"
                  @click="tabChange(elem)"
              >{{elem.name}}</li>
          </ul>
          <Statistic :type="type"></Statistic>
        </div>
    </div>
</template>

<script>
    import Statistic from './formchart/statistic.vue'
    export default {
        data () {
            return {
              catalog:[{name:"日报",active:true,key:1},
                      {name:"月报",active:false,key:30},
                      {name:"年报",active:false,key:365}],
              type:1,
              // this.data
            }
        },
        components: {
          Statistic
        },
        methods:{
          tabChange(elem){
            this.catalog.map(d=>d.active = false)
            elem.active = true;
            this.type = elem.key;
          }
        }
    }
</script>

<style scoped>
    .cate{
        margin-bottom: 20px;
        border: 1px solid #ccc;
        display: inline-block;
    }
    .cate li{
        text-align: center;
        float: left;
        width: 60px;
        line-height: 34px;
        border-right: 0;
        cursor: pointer;
        font-size: 14px;
    }
    .cate li+li{
      border-left:  1px solid #ccc;
    }
    .active{
      color: #fff;
      background-color: #00b5ff;

    }

</style>
