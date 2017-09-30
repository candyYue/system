<template>
	<div>
    	<div class="item1">
    	    <ul>
                <li class="start"><div>1</div>上传文档<span></span></li>
    	        <li class="doing"><div>2</div>导入数据<span></span></li>
    	        <li class="finish active"><div>3</div>导入完成</li>
    	    </ul>
    	    <Progress :percent="100" status="active"></Progress>
            <p>导入完成，共 {{$store.state.all}} 条，已成功 {{$store.state.already}} 条</p>
    	    <p><a :href="'/account/Operator/getImportreport?hash_code=' + alink" class="downfailure">下载错误报告,</a>&nbsp;查看失败原因</p>
    	</div>
    	<div class="item4">
    	    <Button class="confirm" @click="finish">完成</Button>   
    	</div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                alink:''
            }
        },
        methods:{
            finish(){
                this.$store.state.importseat=false
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
            }
        },
        mounted(){
             this.alink=this.$store.state.hash_code;
        }
    }
</script>

<style scoped>
	@import "../../../../static/css/importclient.css";
</style>
