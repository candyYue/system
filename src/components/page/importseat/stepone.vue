<template>
	<div>
    	<div class="item1">
    	    <ul>
    	        <li class="start active"><div>1</div>上传文档</li>
    	        <li class="doing"><div>2</div>导入数据</li>
    	        <li class="finish"><div>3</div>导入完成</li>
    	    </ul>
    	
    	    <p>一、请按照数据模板的格式准备要导入的数据，<a href="../../../../static/customer_templets.xlsx" class="downtemp" download="01">下载导入模板</a></p>
    	    <p>二、准备要导入的excel文件</p>
            <Upload action="/account/Operator/ImportOperator" name="ccsv" class="file" :show-upload-list=false :on-success="handleSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                <span class="uptip">{{uptip}}</span>
            </Upload>
    	</div>
    	<div class="item4">
    	    <button class="giveup" @click="$store.state.importseat=false">取消</button>
    	    <button class="confirm" @click="startimport">开始导入</button>   
    	</div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                uptip:''
            }
        },
        // props:["message"],
        methods:{
            //文件上传成功返回hash_code
            handleSuccess (res, file) {
                if (res.status==0) {
                    this.uptip="csv文件上传成功";
                    this.$store.state.hash_code=res.data.hash_code
                }else{
                    this.uptip=res.info;
                }
                
                console.log(file)
            },
            startimport(){
                var that=this
                var hashCode=this.$store.state.hash_code
                axios.get('/account/Operator/getPercent',{
                    params:{
                        hash_code:hashCode
                    }
                })
                .then(function (response) {
                    if(response.data.status===0){
                         that.$store.state.steponemark=false
                         that.$store.state.steptwomark=true
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
	@import "../../../../static/css/importclient.css";
</style>
