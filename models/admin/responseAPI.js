module.exports = function(app){
    var ResponseAPI =  function(){
        return {
            header : {
                status  : 200 ,
                url     : "",
                message : "Processamento efeutado com sucesso",
                error   : {}
            },
            data : {}
        };
    };

    return ResponseAPI;
};
