module.exports = function(app) {
    /***********************************************************
    * Variáveis que lista os domínios da JUnkstation           * 
    ***********************************************************/
    //var marca             = new app.models.admin.marca({});
    var Marca             = app.models.admin.marca;
    var modelo            = new app.models.admin.modelo({});
    var ano               = new app.models.admin.anoFabricacao({});
    var cambio            = new app.models.admin.cambio({});
    var cor               = new app.models.admin.cor({});
    var categoria         = new app.models.admin.categoria({});
    var combustivel       = new app.models.admin.combustivel({});
    var uf                = new app.models.admin.uf({});
    var estilo            = new app.models.admin.estilo({});
    /***********************************************************
    * Função que faz a mimificação da resposta http.           * 
    ***********************************************************/
    var htmlMinify        = app.get("html-minify");
    /***********************************************************
    * Objetos que serão expostos nas páginas EJSs              * 
    ***********************************************************/
    var createResponseAPI = app.models.admin.responseAPI;
    var responseObject = {}; 
    /***********************************************************
    * Objeto que será exposto com controller para toda app     * 
    ***********************************************************/
    var controller     = {};
    /***********************************************************
    * Lista todas as marcas ativas do collections de marcas    * 
    ***********************************************************/
    controller.listMarca = function(req, res, next) {  
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        Marca.find(query).sort({nome : 1}).populate("categoria", "nome").exec(function(err, marcas){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as marcas!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = marcas;
                res.status(200).json(ResponseAPI);
            }
        });
    }

    /***********************************************************
    * Lista todos os modelos de uma marca                      * 
    ***********************************************************/
    controller.listModeloByMarca = function(req, res, next) {
        var marcaId     = req.params.id;  
        var query       = {situacao : true , marca : marcaId};
        var ResponseAPI = createResponseAPI();
        modelo.findByQuery(function(err, modelos){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os modelos!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = modelos;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todos anos de fabricação dos veículos              * 
    ***********************************************************/
    controller.listAnoFabricacao = function(req, res, next) {  
        var query       = {situacao : true };
        var ResponseAPI = createResponseAPI();
        ano.findByQuery(function(err, anos){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os anos de fabricação!" ;
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = anos;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todos os cambios ativos da aplicação               * 
    ***********************************************************/
    controller.listCambio = function(req, res, next) {
        var query       = {situacao : true };
        var ResponseAPI = createResponseAPI();
        cambio.findByQuery(function(err, cambios){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os câmbios!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = cambios;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todas as cores da aplicação                        * 
    ***********************************************************/
    controller.listCor = function(req, res, next) {  
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        cor.findByQuery(function(err, cores){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as cores!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = cores;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todas as categorias da aplicação                   * 
    ***********************************************************/
    controller.listCategoria = function(req, res, next) { 
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        categoria.findByQuery(function(err, categorias){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as categorias!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = categorias;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todas as marcas para uma categoria                 * 
    ***********************************************************/
    controller.findMarcaByCategoria = function(req, res, next) {
        var categoriaId = req.params.id; 
        var query       = {situacao : true , categoria : categoriaId};
        var ResponseAPI = createResponseAPI();
        Marca.find(query).deepPopulate("categoria").exec(function(err, marcas){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as marcas !";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = marcas;
                res.status(200).json(ResponseAPI);
            }
        });
    }

    /**********************************************************
    * Lista todas os combustíveis da aplicação                * 
    ***********************************************************/
    controller.listCombustivel = function(req, res, next) {
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        combustivel.findByQuery(function(err, combustiveis){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os combustíveis!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = combustiveis;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todas os combustíveis da aplicação                * 
    ***********************************************************/
    controller.listUf = function(req, res, next) {
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        uf.findByQuery(function(err, ufs){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as ufs!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = ufs;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    /***********************************************************
    * Lista todas os combustíveis da aplicação                * 
    ***********************************************************/
    controller.listEstilo = function(req, res, next) {
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        estilo.findByQuery(function(err, estilos){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os estilos!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = estilos;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }
    
 
    return controller; 
};   
