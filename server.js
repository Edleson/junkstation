/**********************************************************
 * Configuração do forver-monitor                         *
 **********************************************************/
 var forever = require('forever-monitor');
 var Monitor = forever.Monitor;

 var child = new Monitor('app.js', {
	max 	 : 10,
	silent 	 : true,
	killTree : true,
	logFile  : './logs/forever.log',
	outFile  : './logs/app.log',
	errFile  : './logs/error.log'
});

child.on('exit', function () {
	console.log('O servidor foi finalizado.');
});

child.start();