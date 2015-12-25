var AWS      = require('aws-sdk') 	;
var fs       = require('fs');
var gm       = require('gm').subClass({imageMagick: true});
var path     = require('path');

module.exports = function(context){
	var handler         = {};
	var accessKeyId     = process.env.AWS_ACCESS_KEY   || null;
    var secretAccessKey = process.env.AWS_SECRET_KEY   || null; 
	var s3              = new AWS.S3();
    var S3_STORAGE      = "S3Storage";
    var LOCAL_STORAGE   = "LocalStorage";

	/**********************************************************
 	* Configura o acesso aos recursos AWS                     *
 	**********************************************************/
	AWS.config.update({
        accessKeyId     : accessKeyId       ,
        secretAccessKey : secretAccessKey   ,
        sslEnabled      : true
    });

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
    handler.uploadMultiploFile = function(req, model, callback){
        callback(req, model);
    };

    function uploadFile(file , context, object, callback){
        if(context.storage.storageType === LOCAL_STORAGE){
            uploadLocalStorage(file , context, object, callback);
        }else if(context.storage.storageType === S3_STORAGE){
            //uploadS3Storage(file , context, object, callback);
        }else{
            throw new Error("Não foi definida nenhuma estratégia de armazenamento de arquivos! Revise o arquivo de configuração context.js.");
        }	
    }; 

    function uploadS3Storage(file , context, object, callback){
        var bytes = file.buffer;

        var params = {
            Bucket              : context.aws.S3.Bucket           ,
            Key                 : file.originalname               ,
            ACL                 : context.aws.S3.ACL              ,
            Body                : bytes                           ,
            CacheControl        : context.aws.S3.CacheControl     ,
            ContentDisposition  : file.originalname               ,
            ContentEncoding     : file.encoding                   ,
            ContentLanguage     : context.aws.S3.ContentLanguage  ,
            ContentLength       : file.size                       ,
            ContentType         : file.mimetype                   ,
            Expires             : context.aws.S3.Expires 
        };

       console.log(params);

        s3.putObject(params, function (error, response) {
            callback(error, response, object);
        });
    };

    function uploadLocalStorage(file , context, object, callback){
        var watermark =  path.join(__dirname, "../public/real_images" , "watermark.png");
        var data      =  file.buffer;
        var tempDir   = '../public/tmp';
        
        if(context.watermark){
            gm(data, file.originalname)
            .draw(['image Over 0,0 0,0 "'+ watermark + '"' ])
            .write(path.join(__dirname, tempDir , file.originalname), function (err) {
                if (err){
                    console.log(err)
                    return next(err);    
                }

                callback();
            });    
        }else{
             gm(data, file.originalname).write(path.join(__dirname, tempDir , file.originalname), function (err) {
                if (err){
                    console.log(err)
                    return next(err);    
                }

                callback();

            }); 
        }
    };

    return handler;

};