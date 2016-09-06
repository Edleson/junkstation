var $buoop = { c: 2 };

function $buo_f() {
    var e = document.createElement("script");
    e.src = "//browser-update.org/update.min.js";
    document.body.appendChild(e);
};
try {
    document.addEventListener("DOMContentLoaded", $buo_f, false)
} catch (e) {
    window.attachEvent("onload", $buo_f)
}

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-71575762-1', 'auto');
ga('send', 'pageview');

window.$zopim || (function(d, s) {
    var z = $zopim = function(c) { z._.push(c) },
        $ = z.s =
        d.createElement(s),
        e = d.getElementsByTagName(s)[0];
    z.set = function(o) {
        z.set.
        _.push(o)
    };
    z._ = [];
    z.set._ = [];
    $.async = !0;
    $.setAttribute("charset", "utf-8");
    $.src = "//v2.zopim.com/?3QoDyXP9DETIe11M2LR1ZEjQCrmCtIUo";
    z.t = +new Date;
    $.
    type = "text/javascript";
    e.parentNode.insertBefore($, e)
})(document, "script");