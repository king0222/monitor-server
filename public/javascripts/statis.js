'use strict';

(function () {

	var W = window,
	    D = W.document,
	    X = W.XMLHttpRequest;

	if (!W.performance || !W.performance.getEntriesByType) {
		console.info('your browser needs to upgrade!');
		return false;
	}

	String.prototype.startsWith || (String.prototype.startsWith = function (e, r) {
		r = r || 0;
		return this.indexOf(e, r) === r;
	});

	var guid = function guid() {
		function e() {
			return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
		}
		return e() + "-" + e() + e() + new Date().getTime();
	};

	var attachEvent = function () {
		if (document.addEventListener) {
			return function (el, type, fn) {
				if (el.length) {
					for (var i = 0; i < el.length; i++) {
						attachEvent(el[i], type, fn);
					}
				} else {
					el.addEventListener(type, fn, false);
				}
			};
		} else {
			return function (el, type, fn) {
				if (el.length) {
					for (var i = 0; i < el.length; i++) {
						attachEvent(el[i], type, fn);
					}
				} else {
					el.attachEvent('on' + type, function () {
						return fn.call(el, window.event);
					});
				}
			};
		}
	}();

	var Statis = W.Statis = {
		host: 'localhost:3000',
		hash: true,
		rspath: 'pf',
		pvpath: 'pv',
		option: {
			key: xxx,
			pvid: guid(),
			title: D.title,
			charset: D.characterSet,
			url: D.URL,
			referrer: D.referrer,
			self: W.top && W.self && W.top === W.self ? 0 : 1,
			av: navigator.appVersion,
			ua: navigator.userAgent,
			cw: W.screen && W.screen.height || 0,
			ch: W.screen && W.screen.width || 0
		},
		xhr: [], //xhr call
		rs: [] //resource call


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
		clearResourceTimings: function clearResourceTimings() {
			var supported = typeof performance.clearResourceTimings == 'function';
			if (supported) {
				performance.clearResourceTimings();
			}
		},
		trim: function trim(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
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
   			option.hf = location.href;
   			url += '://' + host + '/' + path + '?' + this.toStr(option);
			//var url = '/' + path + '?' + this.toStr(option);
			return url;
		},
		GET: function GET(url, cb) {

			function docb() {
				cb && cb.apply(this, arguments);
				img.parentNode && img.parentNode.removeChild(img);
			}
			if (W.navigator && W.navigator.sendBeacon && url.startsWith('http')) {
				return W.navigator.sendBeacon(url, null);
			}

			var img = D.createElement('img');
			img.setAttribute('src', url);
			img.style.display = 'none';
			attachEvent(img, 'readystatechange', function () {
				(img.readyState == 'loaded' || img.readyState == 4) && docb('loaded');
			}, false);
			attachEvent(img, 'load', function () {
				docb('load');
				return true;
			}, false);
			attachEvent(img, 'error', function () {
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
			if (data && STool.getTypeof(data) === '[object String]') {
				this.POST(url, data, option, cb);
			} else {
				if (STool.getTypeof(data) === '[object Function]') {
					cb = data;
					this.GET(url, cb);
				}
			}
		}

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

			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(STool.clone({ er: [msg] }, Statis.option)), {}, function () {});
		}, 0);

		return false;
	};

	var pushInfo = function pushInfo() {
		if (STool.canPerforramce) {
			var resources = W.performance.getEntriesByType('resource'
			);if (!resources.length && !Statis.xhr.length) {
				return false;
			}
			if (resources.length == 1 && resources[0].name && (resources[0].name.indexOf(Statis.host + '/' + Statis.rspath) != -1)) {
				STool.clearResourceTimings();
				return false;
			}
			for (var i = 0; i < resources.length; i++) {
				var item = resources[i],
				    _obj = {};
				if (item.name && (item.name.indexOf(Statis.host + '/' + Statis.rspath) != -1 || item.name.indexOf(Statis.host + '/' + Statis.pvpath) != -1)) {
					continue;
				} else {
					for (var key in item) {
						if (typeof item[key] !== 'function') {
							_obj[key] = item[key];
						}
					}
					Statis.rs.push(_obj);
				}
			}

			if (!Statis.rs.length && !Statis.xhr.length) {
				return false;
			}

			var obj = {};
			if (Statis.rs.length) {
				obj.rs = Statis.rs;
			}
			if (Statis.xhr.length) {
				obj.xhr = Statis.xhr;
			}

			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(STool.clone(obj, Statis.option)), {}, function () {});
		} else {
			if (Statis.xhr.length) {
				var _obj2 = { xhr: Statis.xhr };
				STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(STool.clone(_obj2, Statis.option)), {}, function () {});
			}
		}
		STool.clearResourceTimings();
		Statis.xhr = [];
		Statis.rs = [];
	};

	var pushTimingInfo = function pushTimingInfo() {
		if (STool.canPerforramce) {
			var timing = W.performance.timing;
			STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(STool.clone({ pt: [timing] }, Statis.option)), {}, function () {});
		}
	};

	attachEvent(W, 'unload', pushInfo);

	/*********************************************************************/

	if (STool.canPerforramce) {
		attachEvent(W, 'load', function() {
			setTimeout(function() {
				pushTimingInfo();
			}, 0);
		});

		if (Statis.hash) {
			attachEvent(W, 'hashchange', function () {
				Statis.option.pvid = guid();
				STool.logInfo(STool.mkurl(Statis.host, Statis.rspath, Statis.option), JSON.stringify(Statis.option), {}, function () {});
			});
		}
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
			if (proxy.readyState == 4 && proxy.status != 200) {
				var msg = {
					status: proxy.status,
					responseURL: proxy.responseURL,
					statusText: proxy.statusText,
					timeout: proxy.timeout
				};

				var resHeaders = proxy.getAllResponseHeaders();

				var ar = resHeaders.split(/\n/),
				    opt = {};
				for (var i = 0; i < ar.length; i++) {
					var o = ar[i].split(':');
					if (o[0] && o[1]) {
						opt[o[0]] = STool.trim(o[1]);
					}
				}
				msg = STool.clone(msg, opt);
				Statis.xhr.push(msg);
			}
		}, false);
	})();

	setInterval(function () {
		pushInfo();
	}, 3000);
})();