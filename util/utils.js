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

    var embedVideoGenerator = function(url) {
        this.url = url;

        if(this.url && this.url.indexOf("https") > -1){
            this.url = this.url.replace("https", "http");
        }

        this.defaults = {
          width: 400,
          height: 300,
          previewWidth: 320,
          previewHeight: 200
        };
        
        this.services = {
          dailymotion: {
            pattern: /^((http:\/\/)?(www\.)?dailymotion\.com\/video\/)([a-z0-9]+)(_(.*)?)$/,
            replace: 'http://www.dailymotion.com/swf/$4'
          },

          vimeo: {
            pattern: /^((http:\/\/)?(www\.)?vimeo\.com\/)(\d+)(.*)?$/,
            replace: 'http://vimeo.com/moogaloop.swf?clip_id=$4&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1'
          },
          
          youtube: {
            pattern: /^((http:\/\/)?(www\.)?youtube\.com\/watch\?v=)([a-zA-Z0-9-]+)(.*)?$/,
            replace: 'http://www.youtube.com/v/$4&amp;fs=1'
          }
        };
        
        this.debug = function(o) {
          try {
            console.log(o);
          } catch (e) {
          }
        };
        
        this.parse = function() {
            for (var serviceName in this.services) {
                var service = this.services[serviceName];
                var movieUrl = this.url.replace(service.pattern, service.replace);
                if (this.url != movieUrl) {
                    return movieUrl;
                }
            }
            //throw 'Não foi possível fazer o parse da ' + this.url;
        };
        
        this.getEmbedCode = function(width, height) {
            var movieUrl = this.parse();
            
            width  = width  ? width  : this.defaults.width;
            height = height ? height : this.defaults.height;
            
            return '<object width="' + width + '" height="' + height + '">'
            + "\n" + '  <param name="allowfullscreen" value="true" />'
            + "\n" + '  <param name="allowscriptaccess" value="always" />'
            + "\n" + '  <param name="movie" value="' + movieUrl + '" />'
            + "\n" + '  <embed src="' + movieUrl + '" '
            + "\n" + '    type="application/x-shockwave-flash" '
            + "\n" + '    allowfullscreen="true" '
            + "\n" + '    allowscriptaccess="always" '
            + "\n" + '    width="' + width + '" '
            + "\n" + '    height="' + height + '"></embed>'
            + "\n" + '</object>';
        };
    };


    var Util = {
        moment              : moment              ,
        numeral             : numeral             ,
        unFormatMoeda       : unFormatMoeda       ,
        isBlankOrEmpty      : isBlankOrEmpty      ,
        embedVideoGenerator : embedVideoGenerator
    };


    return Util; 
};   
