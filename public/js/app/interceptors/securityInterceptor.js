app.factory('securityInterceptor', function($location, $q, $window){
    var schema = "https://";
    var host   = $location.$$host;
    var port   = $location.$$port;
    var redirect = schema + host  + "/login"

    return function (promise) {
        return promise.then(
            
            function (res) {
                console.log("SUCCESS REQUEST : " + res.status);
                return res;
            },

            function (res) {
                console.log("ERROR REQUEST : " + res.status);
                if(res.status == 404 || res.status == 301){
                    window.location.hash = '/error';
                    return;
                }
                return $q.reject(res);
            }
        );
    };
});