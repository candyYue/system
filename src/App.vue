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
                    console.log(that.$store.state.endday)
                    // if (0<that.$store.state.endday&&that.$store.state.endday<=30) {
                    //     that.instance()  //过期提醒
                    // }
                    // 账号未登录
                    if (response.data.status=='102002') {
                        that.$store.state.endday=0
                        window.location.hash="/login";
                        return;
                    };
                    // 账号首次登录
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

        methods:{
            // instance () {
            //     const title = '过期提醒';
            //     const content = '<p>您的云电销将于'+this.$store.state.endday+'天后到期，为了不影响您的继续使用，请联系客户经理进行续费。</p>';
            //     this.$Modal.warning({
            //         title: title,
            //         content: content,
            //         onOk: () => {
            //             this.$store.state.endday=0
            //         },
            //     });
            // },
        }
    }
</script>
