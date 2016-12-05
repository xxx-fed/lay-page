/*!
 
 @Name : layPage v1.3- 分页插件
 @Author: 贤心
 @Site：http://sentsin.com/layui/laypage
 @License：MIT
 
 */

//;!function(){
    //"use strict";

    function laypage(options){

        new Page(options);

    }

    /**
     * 包含函数
     * @method contains
     * @param element 目标
     * @param oParent 父亲元素
     * @return {boolean}
     */
    function contains(element,oParent){
        if(oParent.contains) {
            return oParent.contains(element)
        }
        else if(oParent.compareDocumentPosition) {
            return !!(oParent.compareDocumentPosition(element) & 16)
        }
    }

    /**
     * 判断子元素是否在包含的元素
     * @method isParent
     * @param element
     * @param tagName
     * @return {boolean}
     */
    function isParent(element, tagName) {
        while(element != undefined && element != null && element.tagName.toUpperCase() !== "BODY") {
            if(element.tagName.toUpperCase() == tagName.toUpperCase())
                return element;
            element = element.parentNode;
        }
        return false
    }

    laypage.v = '1.3';

    var doc = document, id = 'getElementById', tag = 'getElementsByTagName';

    var index = 0, Page = function(options){
        var that = this;
        var conf = that.config = options || {};
        var type = that.type();

        conf.item = index++;

        if(type === 2){
            conf.cont = conf.cont;
        } else if(type === 3){
            conf.cont = conf.cont[0];
        } else {
            conf.cont = doc[id](conf.cont);
        }

        
        that.render(true);
        that.jump(conf.cont);
    };

    Page.on = function(elem, even, fn){
        elem.attachEvent ? elem.attachEvent('on'+ even, function(){
            fn.call(elem, window.even); //for ie, this指向为当前dom元素
        }) : elem.addEventListener(even, fn, false);
        return Page;
    };



    //判断传入的容器类型
    Page.prototype.type = function(){
        var conf = this.config;
        if(typeof conf.cont === 'object'){
            return conf.cont.length === undefined ? 2 : 3;
        }
    };

    //分页视图
    Page.prototype.view = function(){
        var that = this, conf = that.config, view = [], dict = {};
        conf.pages = conf.pages|0;
        conf.curr = (conf.curr|0) || 1;

        conf.groups = 'groups' in conf ? (conf.groups|0) : 5;
        //首页
        conf.first = 'first' in conf ? conf.first : '&#x9996;&#x9875;';
        //尾页 
        conf.last = 'last' in conf ? conf.last : '&#x5C3E;&#x9875;';
        //上一页
        conf.prev = 'prev' in conf ? conf.prev : '&#x4E0A;&#x4E00;&#x9875;';
        //下一页
        conf.next = 'next' in conf ? conf.next : '&#x4E0B;&#x4E00;&#x9875;';
        
        //只有一页的话
        if(conf.pages <= 1){
            return '';
        }

        //分组数大于总页数
        if(conf.groups > conf.pages){
            conf.groups = conf.pages;
        }
        
        //计算当前组
        //dict.index = Math.ceil((conf.curr + ((conf.groups > 1 && conf.groups !== conf.pages) ? 1 : 0))/(conf.groups === 0 ? 1 : conf.groups));


        if(conf.groups === 0){
            dict.index = conf.curr;
        }else{
            dict.index =  Math.ceil((conf.curr+1)/conf.groups);
        }

        
        
        //当前页非首页，则输出上一页
        if(conf.curr > 1 && conf.prev){
            view.push('<a href="javascript:;" class="laypage_prev" data-page="'+ (conf.curr - 1) +'">'+ conf.prev +'</a>');
        }
        
        //当前组非首组，则输出首页
        if(dict.index > 1 && conf.first && conf.groups !== 0){
            view.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+ conf.first +'</a><span>&#x2026;</span>');
        }
        
        //输出当前页组,当前的页码左右取值,比如5    34 5 67
        dict.poor = Math.floor((conf.groups-1)/2);
        //大于第一组，
        dict.start = dict.index > 1 ? conf.curr - dict.poor : 1;

        dict.end = dict.index > 1 ? (function(){
            var max = conf.curr + (conf.groups - dict.poor - 1);
            return max > conf.pages ? conf.pages : max;
        }()) : conf.groups;



        if(dict.end - dict.start < conf.groups - 1){ //最后一组状态
            dict.start = dict.end - conf.groups + 1;
        }


        for(; dict.start <= dict.end; dict.start++){
            if(dict.start === conf.curr){
                view.push('<span class="laypage_curr" '+ (/^#/.test(conf.skin) ? 'style="background-color:'+ conf.skin +'"' : '') +'>'+ dict.start +'</span>');
            } else {
                view.push('<a href="javascript:;" data-page="'+ dict.start +'">'+ dict.start +'</a>');
            }
        }

        
        //总页数大于连续分页数，且当前组最大页小于总页，输出尾页
        if(conf.pages > conf.groups && dict.end < conf.pages && conf.last && conf.groups !== 0){
             view.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
        }
        
        //当前页不为尾页时，输出下一页
        dict.flow = !conf.prev && conf.groups === 0;
        if(conf.curr !== conf.pages && conf.next || dict.flow){
            view.push((function(){
                return (dict.flow && conf.curr === conf.pages) 
                ? '<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+ conf.next +'</span>'
                : '<a href="javascript:;" class="laypage_next" data-page="'+ (conf.curr + 1) +'">'+ conf.next +'</a>';
            }()));
        }
        
        return '<div name="laypage'+ laypage.v +'" class="laypage_main laypageskin_'+ (conf.skin ? (function(skin){
            return /^#/.test(skin) ? 'molv' : skin;
        }(conf.skin)) : 'default') +'" id="laypage_'+ that.config.item +'">'+ view.join('') + function(){
            return conf.skip 
            ? '<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label>'
            + '<button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>' 
            : '';
        }() +'</div>';
    };

    //跳页
    Page.prototype.jump = function(elem){
        if(!elem) return;

        var that = this, conf = that.config;
        elem.onclick=function(e){
            var e = e || event,
                oTarget = e.target || e.srcElement;

            if(contains(oTarget, this)) {

                if(isParent(oTarget, "a")){

                    var curr = oTarget.getAttribute('data-page')|0;
                    conf.curr = curr;
                    that.render();

                }else if(isParent(oTarget, "button")){

                    var input = elem[tag]('input')[0];
                    var curr = input.value.replace(/\s|\D/g, '')|0;
                    if(curr && curr <= conf.pages){
                        conf.curr = curr;
                        that.render();
                    }
                }
                
            }


        }
    };

    //渲染分页
    Page.prototype.render = function(load){
        var that = this, conf = that.config;
        var view = that.view();

        conf.cont.innerHTML = view;

        conf.jump && conf.jump(conf, load);

        if(conf.hash && !load){
            location.hash = '!'+ conf.hash +'='+ conf.curr;
        }
    };

    //for 页面模块加载、Node.js运用、页面普通应用
    
    //window.laypage = laypage;
    module.exports = laypage
//}();