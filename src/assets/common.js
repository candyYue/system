import axios from 'axios';
import qs from 'qs';

const config = {
    request_prefix: 'http://localhost:10003',
    base_img: 'http://www.baidu.com',
    changepagesize:function(index){
        this.pagesize=index;
        // var that=this;
        this.getclientlist('/account/Customer/getCustomer',{
        params:{
        first_id:(this.page-1)*this.pagesize,
        count:this.pagesize
        } 
      })
    },
    changepage:function(index){
        this.page=index;
        // var that=this;
        this.getclientlist('/account/Customer/getCustomer',{
        params:{
        first_id:(this.page-1)*this.pagesize,
        count:this.pagesize
        }
      })
    }
  
}


// const keyCode = function(ev){
//     console.log(13)
//     if(ev.keyCode==13){
//         this.searchAction()
//     }
// }

//去除所有空格
const trim = function(s){
    return s.replace(/\s+/g, "");
}

export { 
  config,keyCode,trim
}