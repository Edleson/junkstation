var mongoose = require('mongoose');
mongoose.set('debug', false);
/*************************************************************************
 * Essa função é responsável por toda a configuração com Banco de dados, *
 *registrando alguns evento para a conexão com MONGODB.   
 ************************************************************************/
module.exports = function(context){
    var uri = context.database.url;
    mongoose.connect(uri);
    
    mongoose.connection.on('connected', function() {
        console.log('Mongoose! Conectado em ' + uri);
    });
    
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose! Desconectado de ' + uri);
    });
    
    mongoose.connection.on('error', function(erro) {
        console.log('Mongoose! Erro na conexão: ' + erro);
    });
    
    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log('Mongoose! Desconectado pelo término da aplicação');
            process.exit(0);
        });
    });
}