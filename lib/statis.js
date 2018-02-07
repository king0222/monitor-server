'use strict';

(function () {

	var W = window,
	    D = W.document,
	    X = W.XMLHttpRequest;

	String.prototype.startsWith || (String.prototype.startsWith = function (e, r) {
		r = r || 0;
		return this.indexOf(e, r) === r;
	});

	var guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
			    v = c == 'x' ? r : r & 0x3 | 0x8;
			return v.toString(16);
		});
	}();

	//统计对象，数据格式定义
	var Statis = W.Statis = {
		host: 'localhost:3000',
		rspath: 'pf',
		pvpath: 'pv',
		option: {
			key: 'xxxx',
			pvid: guid,
			title: D.title,
			charset: D.characterSet,
			url: D.URL,
			referrer: D.referrer,
			self: W.top && W.self && W.top === W.self ? 0 : 1,
			av: navigator.appVersion,
			ua: navigator.userAgent
		},
		xt: [], //xhr tem
		xhr: [], //xhr call
		rs: [], //resource call
		er: []

		//工具包
	};var STool = {
		canPerforramce: function canPerforramce() {
			if (!('performance' in W) || !('getEntriesByType' in W.performance) || !(W.performance.getEntriesByType('resource') instanceof Array)) {
				return false;
			} else {
				return true;
			}
		},
		encodeURIComponent: function encodeURIComponent(r) {
			return W.encodeURIComponent ? W.encodeURIComponent(r) : r;
		},
		clone: function clone(obj, option) {
			var newObj = new Object();
			for (var i in obj) {
				newObj[i] = obj[i];
			}
			for (var _i in option) {
				newObj[_i] = option[_i];
			}
			return newObj;
		},
		extend: function extend(obj, option) {
			if (obj && option) {
				for (var t in option) {
					option.hasOwnProperty(t) && (obj[t] = option[t]);
				}
			}
			return obj;
		},
		getTypeof: function getTypeof(obj) {
			return Object.prototype.toString.call(obj);
		},
		XHR: function XHR() {
			var xhr;
			try {
				xhr = new XMLHttpRequest();
			} catch (e) {
				var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
				for (var i = 0, len = IEXHRVers.length; i < len; i++) {
					try {
						xhr = new ActiveXObject(IEXHRVers[i]);
					} catch (e) {
						continue;
					}
				}
			}
			return xhr;
		},
		attachEvent: function attachEvent(ele, event, fn, bubbo) {
			return ele.addEventListener ? ele.addEventListener(event, fn, bubbo) : ele.attachEvent ? ele.attachEvent('on' + event, fn) : false;
		},
		toStr: function toStr(obj) {
			var str = [];
			for (var i in obj) {
				str.push(i + '=' + obj[i]);
			}
			return str.join('&');
		},
		mkurl: function mkurl(host, path, option) {
			var url = /^https/i.test(W.URL) ? 'https' : 'http';
			url += '://' + host + '/' + path + '?' + this.toStr(option);
			return url;
		},
		GET: function GET(url, cb) {

			function docb() {
				cb && cb.apply(this, arguments);
				img.parentNode && img.parentNode.removeChild(img);
			}
			url = STool.encodeURIComponent(url);
			/*if (W.navigator && W.navigator.sendBeacon && url.startsWith('http')) {
   	return W.navigator.sendBeacon(url, null)
   }*/

			var img = D.createElement('img');
			img.setAttribute('src', url);
			img.style.display = 'none';
			this.attachEvent(img, 'readystatechange', function () {
				(img.readyState == 'loaded' || img.readyState == 4) && docb('loaded');
			}, false);
			this.attachEvent(img, 'load', function () {
				docb('load');
				return true;
			}, false);
			this.attachEvent(img, 'error', function () {
				docb('error');
				return true;
			}, false);
			D.body.appendChild(img);
		},
		POST: function POST(url, data, option, cb) {
			if (navigator && navigator.sendBeacon && url.startsWith('http')) {
				var s = navigator.sendBeacon(url, data);
				return s;
			}
			url = STool.encodeURIComponent(url);

			var i = null,
			    o = W.XDomainRequest;
			if (o) {
				i = new o();
				i.open('POST', url);
				i.onload = function () {
					cb(null, i.responseText);
				};
				i.onerror = function () {
					cb('POST(' + url + ')error');
				};
				this.attachEvent(i, 'load', function () {
					cb(null, i.responseText);
				}, false);
				this.attachEvent(i, 'error', function () {
					cb('POST(' + url + ')error');
				}, false);
				i.send(data);
				return true;
			}
			if (!X) {
				return false;
			}
			i = new X();
			i.onreadystatechange = function () {
				4 == i.readyState && 200 == i.status && cb && cb(null, i.responseText);
			};
			i.onerror = function () {
				cb('POST(' + url + ')error');
			};
			try {
				i.open('POST', url, true);
			} catch (e) {}
			for (var c in option) {
				i.setRequestHeader && i.setRequestHeader(c, option[c]);
			}
			var h = i.getAllResponseHeaders();
			i.send(data);
			return true;
		},
		logInfo: function logInfo(url, data, option, cb) {
			console.log('url is:', url);
			if (data && STool.getTypeof(data) === '[object String]') {
				this.POST(url, data, option, cb);
			} else {
				if (STool.getTypeof(data) === '[object Function]') {
					cb = data;
					this.GET(url, cb);
				}
			}
		}

		//监听js错误
	};W.onerror = function (message, url, line, col, error) {
		if (message != "Script error." && !url) return;

		setTimeout(function () {
			var msg = {};
			col = col || W.event && W.event.errorCharacter || 0;
			msg.ua = W.navigator.userAgent;
			msg.message = message;
			msg.url = url;
			msg.line = line;
			msg.page = W.location.href;

			if (!!error && !!error.stack) {
				msg.stack = error.stack.toString();
			} else if (!!arguments.callee) {
				var ext = [];
				var f = arguments.callee.caller,
				    c = 3;

				while (f && --c > 0) {
					ext.push(f.toString());
					if (f === f.caller) {
						break;
					}
					f = f.caller;
				}
				ext = ext.join(",");
				msg.stack = ext;
			}

			Statis.er.push(msg);

			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify({ er: msg }), {}, function () {});
		}, 0);

		return false;
	};

	//网页关闭的时候，发送xhr数组，er数组，res数组
	var sendInfo = function sendInfo() {
		if (Statis.xhr.length || Statis.er.length || Statis.rs.length) {
			var obj = {};
			if (Statis.xhr.length) obj.xhr = Statis.xhr;
			if (Statis.er.length) obj.er = Statis.er;
			if (Statis.rs.length) obj.rs = Statis.rs;
			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(obj), {}, function () {});
		}
	};

	//仅用来轮询处理
	var handleInfo = function handleInfo() {
		sendInfo();
		/*Statis.xhr = [];
  Statis.er = [];
  Statis.rs = [];*/
	};

	//监听网页关闭事件
	W.addEventListener('unload', sendInfo, false);

	/*********************************************************************/

	//清除resourceTiming
	var cleanResourceTimings = function cleanResourceTimings(e) {
		var supported = typeof performance.clearResourceTimings == 'function';
		if (supported) {
			performance.clearResourceTimings();
		}
	};

	var getTimings = function getTimings() {
		performance.onresourcetimingbufferfull = cleanResourceTimings;

		var t = performance.timing;
		//页面加载的耗时、
		var pageloadtime = t.loadEventStart - t.navigationStart;
		//域名解析的耗时、
		var dns = t.domainLookupEnd - t.domainLookupStart;
		//TCP连接的耗时、
		var tcp = t.connectEnd - t.connectStart;
		//读取页面第一个字节之前的耗时
		var ttfb = t.responseStart - t.navigationStart;

		var resources = W.performance.getEntriesByType('resource'
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
		);for (var i = 0; i < resources.length; i++) {
			var item = resources[i],
			    obj = {};
			for (var key in item) {
				if (typeof item[key] !== 'function') {
					obj[key] = item[key];
				}
			}
			Statis.rs.push(obj);
		}
		STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, STool.clone(Statis.option, { pv: true })), JSON.stringify({ rs: Statis.rs }), {}, function () {});
	};

	if (STool.canPerforramce) {
		W.addEventListener('load', function () {
			getTimings();
		});

		W.addEventListener('hashchange', function () {
			STool.logInfo(STool.mkurl(Statis.host, Statis.pvpath, Statis.option));
		});
	} else {}
	//console.log('your browser not support performance API');


	/***************************************************************************/

	(function () {
		if (typeof W.CustomEvent === "function") return false;

		function CustomEvent(event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = D.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}

		CustomEvent.prototype = W.Event.prototype;

		W.CustomEvent = CustomEvent;
	})();

	(function () {
		function ajaxEventTrigger(event) {
			var ajaxEvent = new CustomEvent(event, { detail: this });
			W.dispatchEvent(ajaxEvent);
		}

		var oldXHR = W.XMLHttpRequest;

		function newXHR() {
			var realXHR = new oldXHR();

			realXHR.addEventListener('abort', function () {
				ajaxEventTrigger.call(this, 'ajaxAbort');
			}, false);

			realXHR.addEventListener('error', function () {
				ajaxEventTrigger.call(this, 'ajaxError');
			}, false);

			realXHR.addEventListener('load', function () {
				ajaxEventTrigger.call(this, 'ajaxLoad');
			}, false);

			realXHR.addEventListener('loadstart', function () {
				ajaxEventTrigger.call(this, 'ajaxLoadStart');
			}, false);

			realXHR.addEventListener('progress', function () {
				ajaxEventTrigger.call(this, 'ajaxProgress');
			}, false);

			realXHR.addEventListener('timeout', function () {
				ajaxEventTrigger.call(this, 'ajaxTimeout');
			}, false);

			realXHR.addEventListener('loadend', function () {
				ajaxEventTrigger.call(this, 'ajaxLoadEnd');
			}, false);

			realXHR.addEventListener('readystatechange', function () {
				ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
			}, false);

			return realXHR;
		}

		W.XMLHttpRequest = newXHR;
		W.addEventListener('ajaxReadyStateChange', function (e) {
			var proxy = e.detail;
			//let resHeaders = proxy.getAllResponseHeaders();
			if (proxy.readyState == 4) {
				var msg = {
					status: proxy.status,
					responseURL: proxy.responseURL,
					statusText: proxy.statusText,
					timeout: proxy.timeout,
					contentType: proxy.getResponseHeader('Content-Type'),
					date: proxy.getResponseHeader('Date')
				};
				if (STool.canPerforramce) {
					var resource = W.performance.getEntriesByType('resource');
					for (var i = 0; i < resource.length; i++) {
						if (resource[i].initiatorType === 'xmlhttprequest') {
							Statis.xt = resource[i];
						}
					}
				}
				Statis.xhr.push(msg);
			}
		});
	})();

	//setInterval(function() {handleInfo();}, 3000)
})();