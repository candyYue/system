<template>
    <div class="temp2">
        <div class="phoneresult" v-for="(item, index) in category">
            <img src="../../../../static/img/editphoneresult.gif" alt="">
            <p>{{item.cm_result}}</p>
            <div>
                <button class="edit" @click='editmark(index)'>编辑</button>
                <button class="del" @click='removemark(index)'>删除</button>
            </div>
        </div>
        
        <!-- 新建 -->
        <transition enter-active-class="animated fadeIn">
            <div class="mark" v-if="changebox" @click="changebox=false"></div>
        </transition>
        <transition enter-active-class="animated fadeIn">
            <div class="changebox" v-if="changebox">
                <a href="javascript:;" class="delete" @click="changebox=false"></a>
                <h2>新建分类</h2>
                <div class="item1 additem">
                    <span>结果分类名称：</span>
                    <input type="text" v-model='addtype[0]'>
                    
                    <a href="Javascript:;" class="addcategory" @click="addinput"></a>
                </div>
                <div class="item4">
                    <button class="giveup" @click="changebox=false">取消</button>
                    <button class="confirm" @click='addcategroy'>确认</button>
                </div>
            </div>
        </transition>
        <!-- 編輯 -->
        <transition enter-active-class="animated fadeIn">
            <div class="mark" v-if="editbox" @click="editbox=false"></div>
        </transition>
        <transition enter-active-class="animated fadeIn">
            <div class="changebox" v-if="editbox">
                <a href="javascript:;" class="delete" @click="editbox=false"></a>
                <h2>编辑分类</h2>
                <div class="item1">
                    <span>结果分类名称：</span>
                    <input v-model="type" class='editphonebox'>
                </div>
                <div class="item4">
                    <button class="giveup" @click="editbox=false">取消</button>
                    <button class="confirm" @click='editcategroy'>确认</button>
                </div>
            </div>
        </transition>
        <!-- 删除 -->
        <transition enter-active-class="animated fadeIn">
            <div class="mark" v-if="removebox" @click="removebox=false"></div>
        </transition>
        <transition enter-active-class="animated fadeIn">
            <div class="changebox deletebox" v-if="removebox">
                <a href="javascript:;" class="delete" @click="removebox=false"></a>
                <h2>删除分类</h2>
                <div class="item1">
                    <span>删除后，该分类将被删除，分类下的客户将被移至未分类</span> 
                </div>
                <div class="item4">
                    <button class="giveup" @click="removebox=false">取消</button>
                    <button class="confirm" @click="removecategroy">删除</button>
                </div>
            </div>
        </transition>

        <div class="phoneresult">
            <a href="javascript:;" class="el-icon-plus newphoneresult" @click="addlimite"></a>
            <p>新建分类</p>  
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                changebox:false,
                editbox:false,
                removebox:false,
                select:-1,
                type:'',
                addtype:[],
                category:[],
                inputs:[]
            }
        },
        methods: {
            addinput(){
                var all=this.category.length+this.inputs.length
                if (all<9) {
                    var input=document.createElement("input")
                    var item1=document.getElementsByClassName("item1")[0];
                    item1.appendChild(input)
                    input.style.width="25.625rem"
                    input.style.border="1px solid #dddee1"
                    input.style.paddingLeft="5px"
                    
                    this.inputs=document.querySelectorAll('.additem input')
                }else{
                    this.$Message.warning('通话结果最多只能有10个分类');
                    return;
                }
                
            },
            addlimite(){
                if (this.category.length<=9) {
                    this.changebox=true
                }else{
                    this.$Message.warning('通话结果最多只能有10个分类');
                }
                
            },
            addcategroy(){

                for (var i = 0; i < this.inputs.length; i++) {
                    this.addtype.push(this.inputs[i].value)
                };
                
                var that=this;
                if (this.addtype.length==1) {
                    axios.get('/account/Customer/addCallResult',{
                    params: {
                        categroy_name:that.addtype[0]
                        }
                    })
                    .then(function(response){
                        if (response.data.status==0) {
                            that.getresult()
                            that.changebox=false
                            that.addtype[0]=''
                        };
                    })
                    .catch(function(err){
                        console.log(err);
                    }); 
                };
                if (this.addtype.length>1) {
                    this.addtype=this.addtype.slice(1, this.addtype.length)
                    this.addtype=JSON.stringify(this.addtype);
                    // console.log(this.addtype)
                    axios.get('/account/Customer/addCallResult',{
                    params: {
                        categroy_name:that.addtype
                        }
                    })
                    .then(function(response){
                        console.log(response)
                        if (response.data.status==0) {
                            that.getresult()
                            that.changebox=false
                        };
                        
                    })
                    .catch(function(err){
                        console.log(err);
                    }); 
                }; 
            },
            //删除
            removemark(index){
                this.removebox=true
                this.select=index
            },
            removecategroy(){
                var that=this;
                
                axios.get('/account/Customer/deleteCallResult',{
                    params: {
                        rid:that.category[that.select].id,
                    }
                })
                .then(function(response){
                    that.getresult()
                    that.removebox=false
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
            editmark(index){
                this.editbox=true
                this.select=index;
                this.type=this.category[index].cm_result
            },
            editcategroy(){
                // console.log(this.type);
                var that=this;
                
                axios.get('/account/Customer/modifyCallResult',{
                    params: {
                        rid:that.category[that.select].id,
                        categroy_name:that.type
                    }
                })
                .then(function(response){
                    that.getresult()
                    that.editbox=false
                })
                .catch(function(err){
                    console.log(err);
                }); 
                
            },
            getresult(){
                var that=this;
                    
                axios.get('/account/Customer/GetCallresult')
                .then(function(response){
                    if (response.data.status==0) {
                       that.category=response.data.data
                    };
                    
                })
                .catch(function(err){
                    console.log(err);
                }); 
            },
        },
        
        mounted(){
            this.getresult()
        }
    }
</script>

<style scoped>
.temp2{
    overflow: hidden;
}
    .phoneresult{
        width: 198px;
        height: 140.8px;
        border-radius: 2px;
        background-color: #fff;
        border: 1px solid #e6e6e6;
        margin-right: 14px;
        margin-bottom: 14px;
        float: left;
        text-align: center;
        color: #666;
        padding-top: 12px;
        position: relative;
    }
    .phoneresult p{
        margin: 10px 0 15px;
        cursor: pointer;
        font-size: 12px;
    }
    .edit,.del{
        width: 60px;
        height: 26px;
        margin: 0 6px;
        
    }
    .phoneresult img{
        width: 38.88px;
        height: 38px;
    }
    .edit{
        
        background-color: #00b5ff;
        color: #fff
    }
    .newphoneresult{
        margin: 32px auto 0;
        width: 36px;
        height: 36px;
        display: block;
        font-size: 36px;
        text-align: center;
    }

    .item1{
        padding-right: 50px;
    }
    .changebox>.item1 input{
        width: 410px;
        border:1px solid #dddee1;
        padding-left: 5px;
        margin-bottom: 10px
    }
    .changebox>.item1>div{
        width: 400px;
        margin-bottom: 8px
    }
    .addcategory{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #666;
        background-color: #F4F4F4;
        position: absolute;
        right: 15px;
        top: 65px;
        background:url(../../../../static/img/newphoneresult.gif) no-repeat center;
    }
    .changebox .item4{
        position: static;
    }
</style>