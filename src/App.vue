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
                axios.get('/account/CallRecord/getCallRecord',{
                    params:{
                        first_id:0,
                        count:20
                    }
                })
                .then(function (response) {
                    console.log(response)
                    if (response.data.status=='102002') {
                       window.location.hash="/login";
                       return;
                    };
                    if (response.data.status=='102005') {
                       that.$store.state.firstlogin=true;
                       return;
                    };
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
    }
</script>
