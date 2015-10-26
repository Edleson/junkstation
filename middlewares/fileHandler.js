var AWS      = require('aws-sdk') 	;

module.exports = function(context){
	var handler  = {}; 
	var s3       = new AWS.S3();

	/**********************************************************
 	* Configura o acesso aos recursos AWS                     *
 	**********************************************************/
	AWS.config.update({
        accessKeyId     : context.aws.access_key  ,
        secretAccessKey : context.aws.secret_key
    });

	console.log(JSON.stringify(context));
    /*********************************************************
 	* Função responsável por realizar o upload de um único   *
 	* arquivo                                                *
 	**********************************************************/
    handler.uploadSingleFile = function(req, object, callback){
    	var file = req.file;
    	uploadFile(file, context, object, callback);
    };

    /*********************************************************
 	* Função responsável por realizar o upload de um único   *
 	* arquivo                                                *
 	**********************************************************/
    handler.uploadMultiploFile = function(req, object, callback){
    	var files = req.files;
    	if(files){
    		files.forEach(function(file){
    			uploadFile(file, context, null, callback);
    		});	
    	}
    };

    function uploadFile(file , context, object, callback){
    	var bytes = file.buffer;

    	var params = {
            Bucket              : context.aws.S3.Bucket 		  ,
            Key                 : file.originalname     		  ,
            ACL                 : context.aws.S3.ACL    		  ,
            Body                : bytes                 		  ,
            CacheControl        : context.aws.S3.CacheControl     ,
            ContentDisposition  : file.originalname     		  ,
            ContentEncoding     : file.encoding         		  ,
            ContentLanguage     : context.aws.S3.ContentLanguage  ,
            ContentLength       : file.size             		  ,
            ContentType         : file.mimetype        			  ,
            Expires             : context.aws.S3.Expires 
        };

       //console.log(JSON.stringify(params));

        s3.putObject(params, function (error, response) {
            callback(error, response, object);
        });
    };

    return handler;

};