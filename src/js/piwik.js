var _paq = _paq || [];
var setCustomVariable = "setCustomVariable",
    piwikparam = $('.getUrlPiwik').attr('data-param') || '',
    getUrlPiwik = piwikparam === '' ? document.URL : piwikparam;
    
var piwikdefault = {
    url: getUrlPiwik,
    page: 'page',
    visit: 'visit',
    siteId:"2"  //pc端为1 h5为2
}
var piwikutils = {
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getCookie:function(name) {
        var strcookie = document.cookie;
        var arrcookie = strcookie.split("; ");
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) return arr[1];
        }
        return "";
    }
}

/*
 *  url地址解析
 */
function stringUrlParse(param1){
    var anchor = document.createElement('a');
    anchor.href = param1;
    return {
        source: param1,
        protocol: anchor.protocol.replace(':', ''),
        host: anchor.hostname,
        port: anchor.port,
        query: anchor.search,
        params: (function() {
            var ret = {},
                seg = anchor.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                str;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                str = seg[i].split('=');
                ret[str[0]] = str[1];
            }
            return ret;
        })(),
        file: (anchor.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: anchor.hash.replace('#', ''),
        path: anchor.pathname.replace(/^([^\/])/, '/$1'),
        relative: (anchor.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: anchor.pathname.replace(/^\//, '').split('/')
    };
}

var piwikstat = {
    init: function () {
        var referer = this.getReferrer().substr(0, 255),
            getSource = this.getQueryStringRegExp("utm_source"),
            getCampaign = this.getQueryStringRegExp("utm_campaign"),
            getTerm = this.getQueryStringRegExp("utm_term"),
            getContent = this.getQueryStringRegExp("utm_content"),
            getKeyword = this.getQueryStringRegExp("utm_kw"),
            getMedium = this.getQueryStringRegExp("utm_medium");
        var url = piwikdefault.url;
        if (url.indexOf("utm_source=") !== -1) {
            url = url.replace("&utm_medium=" + getMedium, "");
            _paq.push([setCustomVariable, 7, "utm_medium", getMedium, piwikdefault.visit]);

            url = url.replace("&utm_campaign=" + getCampaign, "");
            _paq.push([setCustomVariable, 8, "utm_campaign", getCampaign, piwikdefault.visit]);

            url = url.replace("&utm_term=" + getTerm, "");
            _paq.push([setCustomVariable, 9, "utm_term", getTerm, piwikdefault.visit]);

            url = url.replace("&utm_content=" + getContent, "");
            _paq.push([setCustomVariable, 10, "utm_content", getContent, piwikdefault.visit]);

            url = url.replace("&utm_kw=" + getKeyword, "");
            _paq.push([setCustomVariable, 11, "utm_kw", getKeyword, piwikdefault.visit]);

            url = url.replace("utm_medium=" + getMedium + "&", "");
            url = url.replace("utm_campaign=" + getCampaign + "&", "");
            url = url.replace("utm_term=" + getTerm + "&", "");
            url = url.replace("utm_content=" + getContent + "&", "");

            var newAtt = "pk_campaign=" + getSource + "-" + getCampaign + "-" + getTerm + "&pk_kwd=" + getContent + "-" + getMedium;
            url = url.replace("utm_source=" + getSource, newAtt);
            _paq.push([setCustomVariable, 6, "utm_source", getSource, piwikdefault.visit]);

        }

        var onlynumber = function (str) {
            if (str !== '') {
                var reg = new RegExp(str + "\\d+", "");
                //var matchstr = location.href.match(reg);
                var matchstr = piwikdefault.url.match(reg);
                if (matchstr != null) {
                    return matchstr[0].match(/\d+/);
                }
            }
            return null;
        }

 
        /*订单号*/
        var psysn = piwikutils.getQueryString("pay_sn");
        if (psysn !== null) {
            _paq.push([setCustomVariable, 5, "pay_sn", psysn, piwikdefault.page]);
        }

        /*专场号*/
        var showid = onlynumber('special_id=');
        if (showid !== null) {
            _paq.push([setCustomVariable, 2, "special_id", showid, piwikdefault.page]);
        }

        /*商品号*/
        var goodsid = onlynumber('goods_id=');
        if (goodsid !== null) {
            _paq.push([setCustomVariable, 3, "goods_id", goodsid, piwikdefault.page]);
        }

        /*类别号*/
        var category = onlynumber('category=');
        if (category !== null) {
            _paq.push([setCustomVariable, 11, "category", category, piwikdefault.page]);
        }

        /*用户id*/
        var userid = piwikutils.getCookie('memberid');
        if (userid) {
            _paq.push([setCustomVariable, 1, "userid", userid, piwikdefault.visit]);
            _paq.push([setCustomVariable, 1, "userid", userid, piwikdefault.page]);
        }

        if (getKeyword !== "non") {
            _paq.push([setCustomVariable, 4, "utm_kw", getKeyword, piwikdefault.visit]);
        }
        _paq.push([setCustomVariable, 10, "referer", referer, piwikdefault.page]);
        _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
        _paq.push(["setCustomUrl", url]);
        try {
            _paq.push(["trackPageView", url]);
        } catch (error) { }
    },
    isUndefined: function (v) {
        if (v !== "undefined") {
            if (v !== "") {
                return true;
            }
        }
        return false;
    },
    getReferrer: function () {
        var referrer = "";
        try {
            referrer = window.top.document.referrer;
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer;
                } catch (e2) {
                    referrer = "";
                }
            }
        }
        if (referrer === "") {
            referrer = document.referrer;
        }
        return referrer;
    },
    getQueryStringRegExp: function (name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        //if (reg.test(location.href)) {
        if (reg.test(piwikdefault.url)) {
            if (name === "utm_kw") {
                return decodeURI(RegExp.$2.replace(/\+/g, " "));
            } else {
                return unescape(RegExp.$2.replace(/\+/g, " "));
            }
        }
        return "non";
    },
    loadpiwik: function () {
        var hostfiler = function () {
            var host = document.location.hostname;
            var domain = ["shenmeibaby.com", "shendad.com", "shenba.com"];
            var accessList = ["test"]; //排除列表，不跟踪的加入数组
            var sum = 0;
            for (var i = 0; i < domain.length; i++) {
                var fordomain = domain[i];
                if (host.indexOf(fordomain) != -1) {
                    var str = host.slice(0, -(fordomain.length + 1));
                    for (var k = 0; k < accessList.length; k++) {
                        if (str === accessList[k]) {
                            sum++;
                            break;
                        }
                    }
                }
            }
            if (sum > 0) {
                return false;
            } else {
                return true;
            }
        };
        //     if (hostfilter()) {
        //         var u = (("https:" === document.location.protocol) ? "https" : "http") + "://120.26.78.247:88/";
        //     } else {
        //         var u = (("https:" === document.location.protocol) ? "https" : "http") + "://120.26.78.247:88/";
        //     }

        var u = (("https:" === document.location.protocol) ? "https" : "http") + "://bi.shenba.com/";
        _paq.push(["setTrackerUrl", u + "piwik.php"]);
        _paq.push(["setSiteId", piwikdefault.siteId]);
        var d = document,
            g = d.createElement("script"),
            s = d.getElementsByTagName("script")[0];
        g.type = "text/javascript";
        g.defer = true;
        g.async = true;
        g.src = u + "piwik.js";
        s.parentNode.insertBefore(g, s);
    },
    struc: function () {
        this.init();
        this.loadpiwik();
    }
};
piwikstat.struc();
var piwikTracker = {
    /**
     * 跟踪
     * piwikTracker.track(el,objAry[,baseDataStr])
     * @el {Object} jquery封装的对象 像:$('selector')
     * @objAry {Array}
     * @baseDataStr {String} 基础数据字符串 如:register|button|1|1 如果设置该值, 则会增加基础的"交互"数据
     * 如  var specialtrack =[{index:5,key:'age',value:age,scope:'page'}];
           index: 自定义字段的索引 
           key:   自定义字段的key
           value: 自定义字段的值 
           scope: 自定义字段的范围 默认:page
     * @return 无
     */
    track: function (el, objAry, baseDataStr) {
        if (this._isObjectType("Array", objAry)) {
            var thisobj;
            for (var i = 0, len = objAry.length; i < len; i++) {
                thisobj = objAry[i];
                _paq.push([setCustomVariable, thisobj.index || "", thisobj.key || "", thisobj.value || "", thisobj.scope || piwikdefault.page]);
            };
            if (typeof baseDataStr !== "undefined") {
                this._pushBase(baseDataStr);
                try {
                    _paq.push(["trackContentInteraction", el[0].tagName, "click", "", ""]);
                } catch (error) {
                }
            }
            else if (typeof (el).attr('data-myinteraction') !== "undefined") {
                try {
                    _paq.push(["trackContentInteraction", el[0].tagName, "click", "", ""]);
                } catch (error) {
                }
            }
            /* 删除跟踪变量 */
            for (var j = 0; j <= 100; j++) {
                _paq.push(['deleteCustomVariable', j, "page"]);
            }
        }
    },
    /*
     * 基础交互数据 一般情况点击时 会发送以下索引的数据
     */
    _pushBase: function (datastr) {
        var page = piwikdefault.page;
        var data;
        if (this._isObjectType("Array", datastr)) {
            data = datastr;
        } else {
            data = datastr.split("|");
        }
        _paq.push([setCustomVariable, 6, page, data[0], page]);
        _paq.push([setCustomVariable, 7, "module", data[1], page]);
        _paq.push([setCustomVariable, 8, "paging_number", data[2], page]);
        _paq.push([setCustomVariable, 9, "position_1", data[3], page]);
        _paq.push([setCustomVariable, 10, "referer", piwikdefault.url, page]); 
    },
    /*
     * YAOLAN APP检测
    */
    yaoLanPiwik:function(){
        _paq.push([setCustomVariable, 6,"utm_source", "YaoLan_YunYuApp", piwikdefault.visit]);
        _paq.push([setCustomVariable, 7,"utm_medium", "non", piwikdefault.visit]);
        _paq.push([setCustomVariable, 8,"utm_campaign", "non", piwikdefault.visit]);
        _paq.push([setCustomVariable, 9,"utm_term", "non", piwikdefault.visit]);
        _paq.push([setCustomVariable, 10,"utm_content", "non", piwikdefault.visit]);

        try {
            _paq.push(["trackPageView",piwikdefault.url]);
        } catch (error) { }
    },
    /**
     * private 发送跟踪内容
     * @el {Object} jquery封装的对象 像:$('selector')
     * @attrName {String} 元素的属性名,跟踪会跟踪attrName去区别获取跟踪的内容
     * @return 无
     */
    _send: function (el, attrName) {

        var trackAttr = 'interaction';
        if (typeof attrName !== "undefined") {
            trackAttr = attrName + trackAttr;
        }
        var $this = $(el);
        var data = $this.data(trackAttr) || $this.attr("data-" + trackAttr);
        if (data != undefined) {
            data = data.split("|");
            this._particularTracker.track($this, data);
            this._pushBase(data);
            if (attrName !== 'my') {
                try {
                    _paq.push(["trackContentInteraction", $this[0].tagName, "click", "", ""]);
                } catch (error) { }
            }
        }
    },
    /**
     * 特殊跟踪对象
     * 主要针对特殊业务逻辑的跟踪
     */
    _particularTracker: {
        track: function (el, data) {
            //调用所有方法
            var obj = piwikTracker._particularTracker;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (prop !== "track") {
                        //是Function
                        if (piwikTracker._isObjectType("Function", obj[prop])) {
                            obj[prop](el, data);
                        }
                    }
                }
            }
        }
    },
    /**
     * 判断-javascript对象类型
     * @param1 {javascript对象类型} Array|Boolean|Date|Math|Number|String|RegExp .....
     * @param2 {Object}
     * @return {Boolean}
     */
    _isObjectType: function (type, obj) {
        return toString.call(obj).indexOf('[object ' + type) === 0;
    }
};

$(document).ready(function () {
    var $interaction = $("[data-interaction]"),
        $myinteraction = $("[data-myinteraction]");
    
    //兼容低版本jquery:是否存在on函数
    if (typeof $interaction.on == "function") {
        $interaction.on("click", function () {
            piwikTracker._send($(this));
        });
        $myinteraction.on("click", function () {
            piwikTracker._send($(this), 'my');
        });
    } else {
        //没有on函数就使用click方法
        $interaction.click(function () {
            piwikTracker._send($(this));
        });
        $myinteraction.click(function () {
            piwikTracker._send($(this), 'my');
        });
    }
});

window.piwikTracker = piwikTracker;
