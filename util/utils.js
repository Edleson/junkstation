var numeral = require("numeral");

module.exports = function(app) {
    var moment = app.get("moment");

    numeral.defaultFormat('0,0.00');
    numeral.language('br', {
        delimiters: {
            thousands : '.',
            decimal   : ','
        },

        abbreviations: {
            thousand : 'k'  ,
            million  : 'm'  ,
            billion  : 'b'  ,
            trillion : 't'
        },

        ordinal : function (number) {
            return number === 1 ? 'pri' : 'pri';
        },

        currency: {
            symbol: 'R$'
        }
    });
    
    numeral.language('br');

    var isBlankOrEmpty = function(value){
        return (!value || /^\s*$/.test(value));
    };

    var replaceAll = function replaceAll(str, needle, replacement) {
        var i = 0;
        while ((i = str.indexOf(needle, i)) != -1) {
            str = str.replace(needle, replacement);
        }
        return str;
    };

    var unFormatMoeda = function(value){
        if(!isBlankOrEmpty(value)){
            value = replaceAll(value, ".", "");
            value = replaceAll(value, ",", ".");
            return parseFloat(value);
        }else{
            return 0.0;
        }
    };

    var Util = {
        moment         : moment          ,
        numeral        : numeral         ,
        unFormatMoeda  : unFormatMoeda   ,
        isBlankOrEmpty : isBlankOrEmpty
    };

    return Util; 
};   
