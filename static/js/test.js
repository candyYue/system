function myTest() {
'$route' (to, from) {
                var that=this
                axios.get('/account/Customer/GetCallresult')
                .then(function (response) {
                    console.log(response)
                    if (response.data.status=='102002') {
                       window.location.hash="/login"
                    };
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
}
export { 
  myfun
}