<template>
    <div id="app">
        <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
</template>
<script>
    import axios from 'axios';
    import qs from 'qs';
	export default {
        data: function(){
            return {
            	
            }
        },
        
        watch: {
          '$route' (to, from) {
                var that=this
                axios.get('/account/Customer/GetCallresult')
                .then(function (response) {
                    if (response.data.status=='102002') {
                       window.location.hash="/login"
                    };
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
    }
</script>
<style>
    @import "../static/css/main.css";
    /* @import "../static/css/color-dark.css";    */
</style>