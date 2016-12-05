分页组件
=========

> 简介：layPage是一款多功能的js分页组件，即适用于异步分页，又可用于传统的整页刷新跳页，还支持信息流加载，并且可无缝迁移至Node.js平台。layPage不依赖于任何第三方库，直接拿来用即可

参考 ： 

[http://laypage.layui.com/](http://laypage.layui.com/)


##先看个实例

![](http://img.hb.aicdn.com/2c263dae44140a60a83e7c710747b27db5189fb41578-JmJTH7_fw658)


	//以下将以jquery.ajax为例，演示一个异步分页
	function demo(curr){
	  $.getJSON('test/demo1.json', {
	    page: curr || 1 //向服务端传的参数，此处只是演示
	  }, function(res){
	    //此处仅仅是为了演示变化的内容
	    var demoContent = (new Date().getTime()/Math.random()/1000)|0;
	    document.getElementById('view1').innerHTML = res.content + demoContent;
	    //显示分页
	    laypage({
	      cont: 'page1', //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
	      pages: res.pages, //通过后台拿到的总页数
	      curr: curr || 1, //当前页
	      jump: function(obj, first){ //触发分页后的回调
	        if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
	          demo(obj.curr);
	        }
	      }
	    });
	  });
	};
	//运行
	demo();



## 整页刷新式跳转

![](http://img.hb.aicdn.com/50f7075979c70f38b80a1f507d2d0d1dba2a4a3572b-0xskjc_fw658)

	//好像很实用的样子，后端的同学再也不用写分页逻辑了。
	laypage({
	  cont: 'page11',
	  pages: 18, //可以叫服务端把总页数放在某一个隐藏域，再获取。假设我们获取到的是18
	  curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
	    var page = location.search.match(/page=(\d+)/);
	    return page ? page[1] : 1;
	  }(), 
	  jump: function(e, first){ //触发分页后的回调
	    if(!first){ //一定要加此判断，否则初始时会无限刷新
	      location.href = '?page='+e.curr;
	    }
	  }
	})

## 自定义皮肤

![](http://img.hb.aicdn.com/e4e02820417799f01a81837e3f14ae4155057142757-UR5yQe_fw658)

	laypage({
	  cont: document.getElementById('page2'), //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 100, //总页数
	  skin: 'yahei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
	  groups: 7 //连续显示分页数
	});

## 开启跳页

![](http://img.hb.aicdn.com/425658e71019656a96477694492eb36208ccda91c22-Y09uxz_fw658)

	laypage({
	  cont: $('#page3'), //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 100, //总页数
	  skip: true, //是否开启跳页
	  skin: '#AF0000',
	  groups: 3 //连续显示分页数
	});


## 自定义文本

![](http://img.hb.aicdn.com/2e8cdcba20d50491da0532cae8e63fe94780af84656-8rm2ec_fw658)

	laypage({
	  cont: 'page4', //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 11, //总页数
	  skin: 'molv', //皮肤
	  first: 1, //将首页显示为数字1,。若不显示，设置false即可
	  last: 11, //将尾页显示为总页数。若不显示，设置false即可
	  prev: '<', //若不显示，设置false即可
	  next: '>' //若不显示，设置false即可
	});

## 隐藏首页和尾页

![](http://img.hb.aicdn.com/c2558e0ba5fe7e5a143e291e51019b261de630225a1-L52WQG_fw658)

	laypage({
	  cont: 'page5', //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 11, //总页数
	  first: false,
	  last: false
	});

## 开启hash

![](http://img.hb.aicdn.com/78b3e9fb33b8762a37b6cb31ecda9f7739d31c3f15e0-eGnzke_fw658)

	laypage({
	  cont: 'page6', //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 68, //总页数
	  curr: location.hash.replace('#!fenye=', ''), //获取hash值为fenye的当前页
	  hash: 'fenye', //自定义hash值
	    jump: function(obj){
	    $('#view6').html('看看URL的变化。通过hash，你可以记录当前页。当前正处于第'+obj.curr+'页');
	  }
	});

## 只出现上一页/下一页

![](http://img.hb.aicdn.com/2dab92de981f5cec4ebeaa4499458e99833ca56884b-5Eyik9_fw658)

	laypage({
	  cont: 'page7', //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 11, //总页数
	  groups: 0,
	  first: false,
	  last: false,
	  jump: function(obj){
	    $('#view7').html('目前正在第'+ obj.curr +'页，一共有：'+ obj.pages +'页');
	  }
	});

## 信息流

![](http://img.hb.aicdn.com/6a81eb7fe8c0f7c67ad206f08b4e4fb0f1f7b7ee807-HT1VCh_fw658)

	laypage({
	  cont: 'page8', //容器。值支持id名、原生dom对象，jquery对象,
	  pages: 7, //总页数
	  groups: 0, //连续分数数0
	  prev: false, //不显示上一页
	  next: '查看更多',
	  skin: 'flow', //设置信息流模式的样式
	  jump: function(obj){
	    if(obj.curr === 6){
	      this.next = '没有更多了';
	    }
	    $('#view8').append(appendimg(obj.curr));
	  }
	});