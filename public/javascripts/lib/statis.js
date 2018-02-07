(() => {

	let W = window, D = W.document, X = W.XMLHttpRequest

	String.prototype.startsWith || (String.prototype.startsWith = function(e, r) {
		r = r || 0;
		return this.indexOf(e, r) === r
	});

	let guid = function() {
	    /*return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });*/
	    function e() {
			return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
		}
		return e() + "-" + e() + e()
	};

	var attachEvent = (function(){
		if(document.addEventListener){
			return function(el, type, fn){
				if(el.length){
					for(var i=0;i < el.length;i++){
						addEvent(el[i],type,fn);
					}
				}else{
					el.addEventListener(type, fn, false);
				}
			};
		}else{
			return function(el, type, fn){
				if(el.length){
					for(var i=0; i < el.length; i++){
						addEvent(el[i], type, fn);
					}
				}else{
					el.attachEvent('on' + type, function(){
						return fn.call(el, window.event);
					});
				}
			};
		}
	})();


	//统计对象，数据格式定义
	let Statis = W.Statis = {
		host: 'localhost:3000',
		rspath: 'pf',
		pvpath: 'pv',
		option: {
			key: 'xxxx',
			pvid: guid(),
			title: D.title,
			charset: D.characterSet,
			url: D.URL,
			referrer: D.referrer,
			self: (W.top && W.self && W.top === W.self ? 0 : 1),
			av: navigator.appVersion,
			ua: navigator.userAgent,
			cw: ((W.screen && W.screen.height) || 0),
			ch: ((W.screen && W.screen.width) || 0)
		},
		xhr: [], //xhr call
		rs: [] //resource call
	}


	//工具包
	let STool = {
		canPerforramce: function() {
			if(!('performance' in W) || !('getEntriesByType' in W.performance) || !(W.performance.getEntriesByType('resource') instanceof Array)) {
				return false;
			} else {
				return true;
			}
		},
		encodeURIComponent: function(r) {
			return W.encodeURIComponent ? W.encodeURIComponent(r) : r
		},
		clearResourceTimings: function() {
			let supported = typeof performance.clearResourceTimings == 'function'
			if (supported) {
				performance.clearResourceTimings()
			}
		},
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g,"");
		},
		clone: function(obj, option) {
			let newObj = new Object();
			for (let i in obj) {
				newObj[i] = obj[i];
			}
			for (let i in option) {
				newObj[i] = option[i];
			}
			return newObj;
		},
		extend: function(obj, option) {
			if (obj && option) {
				for (var t in option) {
					option.hasOwnProperty(t) && (obj[t] = option[t])
				}
			}
			return obj
		},
		getTypeof: function(obj) {
			return Object.prototype.toString.call(obj);
		},
		XHR: function() {
			var xhr;
			try {xhr = new XMLHttpRequest();}
			catch(e) {
				var IEXHRVers =["Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
				for (var i=0,len=IEXHRVers.length;i< len;i++) {
					try {xhr = new ActiveXObject(IEXHRVers[i]);}
					catch(e) {continue;}
				}
			}
			return xhr;
		},
		attachEvent: function(ele, event, fn, bubbo) {
			return ele.addEventListener ? ele.addEventListener(event, fn, bubbo) : ele.attachEvent ? ele.attachEvent('on' + event, fn) : false
		},
		toStr: function(obj) {
			let str = [];
			for (let i in obj) {
				str.push(`${i}=${obj[i]}`);
			}
			return str.join('&');
		},
		mkurl: function(host, path, option) {
			let url = /^https/i.test(W.URL) ? 'https' : 'http';
			option.hf = location.href;
			url += '://' + host + '/' + path + '?' + this.toStr(option);
			return url;
		},
		GET: function(url, cb) {

			function docb() {
				cb && cb.apply(this, arguments);
				img.parentNode && img.parentNode.removeChild(img)
			}
			if (W.navigator && W.navigator.sendBeacon && url.startsWith('http')) {
				return W.navigator.sendBeacon(url, null)
			}

			let img = D.createElement('img');
			img.setAttribute('src', url);
			img.style.display = 'none';
			attachEvent(img, 'readystatechange', function() {
				(img.readyState == 'loaded' || img.readyState == 4) && docb('loaded')
			}, false);
			attachEvent(img, 'load', function() {
				docb('load');
				return true;
			}, false);
			attachEvent(img, 'error', function() {
				docb('error');
				return true;
			}, false);
			D.body.appendChild(img);
		},
		POST: function(url, data, option, cb) {
			if (navigator && navigator.sendBeacon && url.startsWith('http')) {
				let s = navigator.sendBeacon(url, data)
				return s
			}

			let i = null, o = W.XDomainRequest
			if (o) {
				i = new o;
				i.open('POST', url)
				i.onload = function() {
					cb(null, i.responseText)
				};
				i.onerror = function() {
					cb(`POST(${url})error`)
				}
				attachEvent(i, 'load', function() {
					cb(null, i.responseText)
				}, false);
				attachEvent(i, 'error', function() {
					cb(`POST(${url})error`)
				}, false);
				i.send(data);
				return true;
			}
			if(!X) {
				return false
			}
			i = new X;
			i.onreadystatechange = function() {
				4 == i.readyState && 200 == i.status && (cb && cb(null, i.responseText))
			}
			i.onerror = function() {
				cb(`POST(${url})error`)
			}
			try {
				i.open('POST', url, true)
			} catch(e) {}
			for (var c in option) {
				i.setRequestHeader && i.setRequestHeader(c, option[c])
			}
			let h = i.getAllResponseHeaders();
			i.send(data);
			return true
		},
		logInfo: function(url, data, option, cb) {
			if (data && STool.getTypeof(data) === '[object String]') {
				this.POST(url, data, option, cb);
			} else {
				if (STool.getTypeof(data) === '[object Function]') {
					cb = data;
					this.GET(url, cb);
				}
			}
		}
	}


	//监听js错误
	W.onerror = (message, url, line, col, error) => {
		if (message != "Script error." && !url) return

		setTimeout(function(){
			let msg = {}
			col = col || (W.event && W.event.errorCharacter) || 0;
			msg.ua = W.navigator.userAgent
			msg.message = message
			msg.url = url
			msg.line = line
			msg.page = W.location.href

			if (!!error && !!error.stack){
	            msg.stack = error.stack.toString();
	        }else if (!!arguments.callee){
	            let ext = []
	            let f = arguments.callee.caller, c = 3;

	            while (f && (--c>0)) {
	               ext.push(f.toString())
	               if (f  === f.caller) {
	                    break
	               }
	               f = f.caller
	            }
	            ext = ext.join(",")
	            msg.stack = ext
	        }

	        //发生脚本错误的时候记录er信息到日志
			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify({er: msg}), {}, function() {});
			
		}, 0)
		
		return false
	}


	//网页关闭的时候，发送xhr数组，res数组
	//每隔一段时间也要发送一次数据
	let pushInfo = function() {
		if (STool.canPerforramce) {
			let resources = W.performance.getEntriesByType('resource')
			/*console.log('resources is:', resources);
			connectEnd:111.20500000000001
			connectStart:111.20500000000001
			domainLookupEnd:111.20500000000001
			domainLookupStart:111.20500000000001
			duration:3.344999999999999
			entryType:"resource"
			fetchStart:111.20500000000001
			initiatorType:"xmlhttprequest"
			name:"http://localhost:3000/logger"
			redirectEnd:0
			redirectStart:0
			requestStart:112.44000000000001
			responseEnd:114.55000000000001
			responseStart:113.77500000000002
			secureConnectionStart:0
			startTime:111.20500000000001
			workerStart:0*/
			if (!resources.length && !Statis.xhr.length) {
				return false
			}
			if (resources.length == 1 && resources[0].name && (resources[0].name.indexOf(`${Statis.host}/${Statis.rspath}`) != -1 || resources[0].name.indexOf(`${Statis.host}/${Statis.pvpath}`) != -1)) {
				STool.clearResourceTimings();
				return false;
			}
			for (let i = 0; i < resources.length; i++) {
				let item = resources[i], obj = {};
				if (item.name && (item.name.indexOf(`${Statis.host}/${Statis.rspath}`) != -1 || item.name.indexOf(`${Statis.host}/${Statis.pvpath}`) != -1)) {
					continue;
				} else {
					for (let key in item) {
						if (typeof(item[key]) !== 'function') {
							obj[key] = item[key];
						}
					}
					//资源加载push到rs数组中
					Statis.rs.push(obj);
				}
				
			}

			if (!Statis.rs.length && !Statis.xhr.length) {
				return false;
			}

			let obj = {};
			if (Statis.rs.length) {
				obj.rs = Statis.rs
			}
			if (Statis.xhr.length) {
				obj.xhr = Statis.xhr
			}

			//rs在onload的时候记录一次，按照一定的时间间隔再记录，最后网页关闭的时候记录一次
			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(obj), {}, function(){});
	
		} else {
			if (Statis.xhr.length) {
				let obj = {xhr: Statis.xhr};
				STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(obj), {}, function(){});
			}
		}
		//每一次轮询操作完成后都要清空一下相关数据
		STool.clearResourceTimings();
		Statis.xhr = [];
		Statis.rs = [];
		
	}

	

	//监听网页关闭事件
	W.addEventListener('unload', pushInfo, false);

	/*********************************************************************/


	if (STool.canPerforramce) {
		W.addEventListener('load', function() {
			pushInfo();
	   	});

		W.addEventListener('hashchange', function() {
			//哈希变化的时候记录pv信息到日志
			let url = STool.mkurl(Statis.host, Statis.pvpath, Statis.option)
			STool.logInfo(STool.mkurl(Statis.host, Statis.pvpath, Statis.option), function(){});
			Statis.option.pvid = guid();
		});
	} else {
		//console.log('your browser not support performance API');
	}


	/***************************************************************************/

	(function () {
		if (typeof W.CustomEvent === "function") return false;

		function CustomEvent (event, params ) {
			params = params || {bubbles: false, cancelable: false, detail: undefined};
			let evt = D.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}

		CustomEvent.prototype = W.Event.prototype;

		W.CustomEvent = CustomEvent;
	})();


	(function () {
		function ajaxEventTrigger(event) {
			let ajaxEvent = new CustomEvent(event, {detail: this });
			W.dispatchEvent(ajaxEvent);
		}

		let oldXHR = W.XMLHttpRequest;

		function newXHR() {
			let realXHR = new oldXHR();

			realXHR.addEventListener('abort', function () {console.log('abort');ajaxEventTrigger.call(this, 'ajaxAbort');}, false);

			realXHR.addEventListener('error', function () {console.log('error');ajaxEventTrigger.call(this, 'ajaxError');}, false);

			realXHR.addEventListener('load', function () {ajaxEventTrigger.call(this, 'ajaxLoad');}, false);

			realXHR.addEventListener('loadstart', function () {ajaxEventTrigger.call(this, 'ajaxLoadStart');}, false);

			realXHR.addEventListener('progress', function () {ajaxEventTrigger.call(this, 'ajaxProgress');}, false);

			realXHR.addEventListener('timeout', function () {ajaxEventTrigger.call(this, 'ajaxTimeout');}, false);

			realXHR.addEventListener('loadend', function () {ajaxEventTrigger.call(this, 'ajaxLoadEnd');}, false);

			realXHR.addEventListener('readystatechange', function() {ajaxEventTrigger.call(this, 'ajaxReadyStateChange');}, false);

			return realXHR;
		}

		W.XMLHttpRequest = newXHR;
		W.addEventListener('ajaxReadyStateChange', function (e) {
			let proxy = e.detail;
			if (proxy.readyState == 4 && proxy.status != 200) {
				let msg = {
					status: proxy.status,
					responseURL: proxy.responseURL,
					statusText: proxy.statusText,
					timeout: proxy.timeout
				};

				let resHeaders = proxy.getAllResponseHeaders();
				
				let ar = resHeaders.split(/\n/), opt = {};
				for (let i = 0; i < ar.length; i++) {
					let o = ar[i].split(':');
					if (o[0] && o[1]) {
						opt[o[0]] = STool.trim(o[1]);
					}
				}
				msg = STool.clone(msg, opt);
				Statis.xhr.push(msg);
			}
		}, false);
	})();
	

	setInterval(function() {pushInfo();}, 3000)

})()
