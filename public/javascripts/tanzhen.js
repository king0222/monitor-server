window._meda_runtime && window._meda_runtime.server ||
function(e) {
	var r = document.cookie.split(";"),
		t;
	function u(e) {
		switch (typeof e) {
		case "object":
			if (!e) return "null";
			if (e instanceof Array) {
				for (var r = "[", t = 0; t < e.length; t++) r += (t > 0 ? "," : "") + u(e[t]);
				return r + "]"
			}
			var r = "{",
				t = 0;
			for (var n in e) if ("function" != typeof e[n]) {
				var a = u(e[n]);
				r += (t > 0 ? "," : "") + u(n) + ":" + a, t++
			}
			return r + "}";
		case "string":
			return '"' + e.replace(/([\"\\])/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
		case "number":
			return e.toString();
		case "boolean":
			return e ? "true" : "false";
		case "function":
			return u(e.toString());
		case "undefined":
		default:
			return '"undefined"'
		}
	}
	function c() {
		return e.location.host || ""
	}
	function f() {
		return document.domain || ""
	}
	function l(r) {
		return e.encodeURIComponent ? e.encodeURIComponent(r) : r
	}
	function d() {
		return Date.now ? Date.now() : (new Date).valueOf()
	}
	function p(e) {
		return function(e, r) {}
	}
	function h(e) {
		if (q.sended && (this.ready() || e) && this.errors.length) {
			var r = [],
				t = {};
			x.each(this.errors, function(e, r, n) {
				var r = S(e.e1, e.e2, e.e3, e.e6),
					a = t[r];
				a ? a.ep = a.ep + 1 : t[r] = {
					o: e.e0 - q.st,
					e: e.e1,
					ec: n.length,
					ep: 1,
					l: e.e2 || 0,
					c: e.e3 || 0,
					m: e.e6 || "",
					r: e.e4,
					s: e.e5 || ""
				}
			});
			for (var n in t) {
				r.push(t[n])
			}
			var a = x.mkurl(q.server.beacon, "er", {});
			var s = r.length;
			x.POST(a, x.stringify({
				err: r
			}), {}, function(e, r) {
				e || N.errors.splice(0, s)
			})
		}
	}
	function v() {
		N.initend()
	}
	function m() {
		L.readyState === "complete" && N.initend()
	}
	function g(e) {
		function r() {
			N.send()
		}
		return q.load_time ? true : (N.initend(), q.load_time = d(), e ? r() : setTimeout(r, 0))
	}
	function y() {
		N.flush || g(true);
		x.bind(h, N)(true);
		N.sa(true);
		N.flush = true
	}
	function _() {
		x.bind(h, N)(true);
		N.sa(true)
	}
	function b() {
		N.touch || (N.touch = d())
	}
	function S(e, r, t, n) {
		return e + r + t + (n || "")
	}
	function w(r) {
		var t = arguments;
		if (t.length != 0) {
			var n = {};
			n.e0 = d();
			n.e1 = "";
			n.e2 = 0;
			n.e3 = 0;
			n.e4 = "";
			if ("string" == typeof r) {
				n.e1 = t[0];
				t.length > 2 && (n.e2 = t[2] || 0, n.e4 = t[1]);
				t.length > 3 && (n.e3 = t[3] || 0)
			} else if (r instanceof Event || e.ErrorEvent && r instanceof ErrorEvent) {
				n.e1 = r.message || (r.error && r.error.constructor.name) + (r.error && r.error.message) || "";
				n.e2 = r.lineno || 0;
				n.e3 = r.colno || 0;
				n.e4 = r.filename || r.error && r.error.fileName || r.target && r.target.baseURI || "";
				n.e4 == L.URL && (e4 = "#");
				n.e5 = null;
				n.e6 = null;
				n.e7 = 0;
				if (r.error) {
					n.e5 = r.error.stack || "";
					n.e6 = r.error.moduleName || "";
					var a = S(n.e1, n.e2, n.e3, n.e6);
					n.e7 = P[a] ? 0 : 1
				}
				if (n.e1 === "unknown" && n.e4 === "unknown") return
			}
			N.errors && N.errors.push(n)
		}
	}
	function T(e) {
		if (typeof e === "string") {
			return e.length
		}
		if (window.ArrayBuffer && e instanceof ArrayBuffer) {
			return e.byteLength
		}
		if (window.Blob && e instanceof Blob) {
			return e.size
		}
		if (e && e.length) {
			return e.length
		}
		return 0
	}
	function E(e) {
		return function() {
			var r = arguments;
			if (!this._ignore) {
				var t = x.args.apply(this, r);
				this._runtime = {
					method: t[0],
					url: t[1],
					start: d()
				}
			}
			try {
				return e.apply(this, r)
			} catch (t) {
				return Function.prototype.apply.call(e, this, r)
			}
		}
	}
	function k(r) {
		return function() {
			function t(e) {
				var r, t = f._runtime;
				if (t) {
					t.readyState !== 4 && (t.end = d());
					t.endAll = d();
					t.s = f.status;
					if (f.responseType == "" || f.responseType == "text") {
						t.res = T(f.responseText)
					} else if (f.response) {
						t.res = T(f.response)
					} else {
						try {
							t.res = T(f.responseText)
						} catch (e) {
							t.res = 0
						}
					}
					r = {
						n: t.url,
						m: t.method,
						st: t.s,
						o: t.start - q.st,
						req: t.req,
						res: t.res,
						e: t.endAll - t.start,
						f: t.fb ? t.fb - t.start : 0,
						rd: t.fb ? t.end - t.fb : 0,
						cb: l || 0,
						p: t.param
					};
					f.getAllResponseHeaders && (r.h = (f.getAllResponseHeaders() || "").substring(0, 2e3));
					
					q.aa && q.aa.push(r);
					if (q.server.custom_urls && q.server.custom_urls.length && !N.ct) {
						if (!q.pattern) {
							q.pattern = [];
							for (var n = 0; n < q.server.custom_urls.length; n++) {
								q.pattern.push(new RegExp(q.server.custom_urls[n]))
							}
						}
						for (var n = 0; n < q.pattern.length; n++) {
							if (a.url.match(q.pattern[n])) {
								N.ct = a.end + l;
								break
							}
						}
					}
					N.sa();
					f._runtime = null
				}
			}
			function n() {
				f.readyState == 3 && f._runtime && (f._runtime.fb = f._runtime.fb || d());
				f.readyState == 4 && t(0)
			}
			function s(e) {
				return function() {
					var r, t;
					f.readyState == 3 && f._runtime && (f._runtime.fb = f._runtime.fb || d());
					f.readyState == 4 && f._runtime && (f._runtime.end = r = d(), f._runtime.readyState = 4);
					try {
						t = e && e.apply(this, arguments)
					} catch (e) {
						throw e
					}
					f.readyState == 4 && (l = d() - r);
					n();
					return t
				}
			}
			function o(e) {
				return function() {
					var r = f._runtime;
					if (r) {
						switch (e) {
						case "abort":
							t(905);
							break;
						case "error":
							t(990);
							break;
						case "timeout":
							t(903);
							break;
						case "loadstart":
							r.start = d();
							break;
						case "progress":
						case "load":
						case "loadend":
						default:
							break
						}
					}
					return true
				}
			}
			function u(e, r) {
				for (var t = 0; t < r.length; t++) {
					var n = r[t];
					x.sh(e, n, o(n), false)
				}
			}
			var c = arguments;
			if (!this._ignore) {
				this._runtime.start = d();
				this._runtime.req = c[0] ? T(c[0]) : 0;
				this._runtime.param = (c[0] || "").substring(0, 2e3);
				var f = this,
					l = 0,
					p = x.wrap(false, this, "onreadystatechange", s);
				p || x.sh(this, "readystatechange", n, false);
				u(this, ["error", "progress", "abort", "load", "loadstart", "loadend", "timeout"]);
				p || setTimeout(function() {
					x.wrap(false, f, "onreadystatechange", s)
				}, 0)
			}
			var h = function() {
					function r(e) {
						var r = {},
							t = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?/.exec(e);
						t && (r.protocol = (t[1] || "http") + ":", r.hostname = t[3], r.port = t[4] || "");
						return r
					}
					return function(t) {
						var n = e.location;
						t = x.trim(t);
						if (t) {
							t = t.toLowerCase();
							t.startsWith("//") && (t = n.protocol + t);
							if (!t.startsWith("http")) {
								return true
							}
							var a = r(t),
								s = a.protocol === n.protocol && a.hostname === n.hostname;
							s && (s = a.port === n.port ? true : !n.port && (n.protocol === "http:" && a.port === "80" || n.protocol === "https" && a.port === "443"));
							return s
						}
						return false
					}
				}();
			var v = function() {
					return (new Date).getTime() % 1e8
				}();
			try {
				var m = q.server;
				m && m.id && this._runtime && h(this._runtime.url) && (this._runtime.r = v, this.setRequestHeader && this.setRequestHeader("X-Request-Id", m.id + ";r=" + v))
			} catch (e) {}
			try {
				return r.apply(this, c)
			} catch (e) {
				return Function.prototype.apply.call(r, this, c)
			}
		}
	}
	var R = e.XMLHttpRequest,
		L = document,
		C = function() {
			var e = L.getElementsByTagName("base") || [];
			return e.length && (_b = e[e.length - 1] && e[e.length - 1].href || "") || ""
		}();
	var x = {
		wrap: function(e, r, t, n, a) {
			try {
				var s = r[t]
			} catch (r) {
				if (!e) return false
			}
			if (!s && !e) return false;
			if (s && s._wraped) return false;
			try {
				r[t] = n(s, a)
			} catch (e) {
				return false
			}
			r[t]._wraped = s;
			return true
		},
		unwrap: function(e, r) {
			try {
				var t = e[r]._wraped;
				t && (e[r] = t)
			} catch (e) {}
		},
		each: function(e, r) {
			if (e) {
				for (var t = 0; t < e.length; t++) {
					e[t] && r && r(e[t], t, e)
				}
			}
		},
		mkurl: function(r, t, n) {
			var a = /^https/i.test(L.URL) ? "https" : "http";
			a += "://" + r + "/" + t;
			a += "?key=" + l(q.server.key);
			a += "&ref=" + l(L.URL);
			a += "&referer=" + l(L.referrer);
			a += "&base=" + l(C);
			a += "&rand=" + d();
			a += "&pvid=" + A;
			a += "&aid=" + q.server.id;
			a += "&if=" + (e.top && e.self && e.top === e.self ? 0 : 1);
			q.server.get_ip ? a += "&cip=" + q.cip + "&ua=" + q.ua : "";
			t !== "pf" && q && (q.agent = q.agent || e._meda_runtime.agent, q.agent && (a += "&n=" + l(q.agent.n)));
			for (var s in n || {}) {
				a += "&" + s + "=" + n[s]
			}
			return a
		},
		scriptGet: function(e, r) {
			function t() {
				r && r.apply(this, arguments);
				n.parentNode && n.parentNode.removeChild(n)
			}
			var n = L.createElement("script");
			n.setAttribute("src", e);
			this.sh(n, "readystatechange", function(e) {
				("loaded" == n.readyState || 4 == n.readyState) && t("loaded")
			}, false);
			this.sh(n, "load", function(e) {
				t("load");
				return true
			}, false);
			this.sh(n, "error", function() {
				t("error");
				return true
			}, false);
			var a = L.getElementsByTagName("script")[0];
			a && a.parentNode.insertBefore(n, a)
		},
		GET: function(r, t) {
			function n() {
				t && t.apply(this, arguments);
				a.parentNode && a.parentNode.removeChild(a)
			}
			if (e.navigator && e.navigator.sendBeacon && r.startsWith("http")) {
				return e.navigator.sendBeacon(r, null)
			}
			var a = L.createElement("img");
			a.setAttribute("src", r);
			a.setAttribute("style", "display:none");
			this.sh(a, "readystatechange", function() {
				("loaded" == a.readyState || 4 == a.readyState) && n("loaded")
			}, false);
			this.sh(a, "load", function() {
				n("load");
				return true
			}, false);
			this.sh(a, "error", function() {
				n("error");
				return true
			}, false);
			L.body.appendChild(a)
		},
		fpt: function(e, r, t) {
			function n(e, r, t) {
				var n = L.createElement(e);
				try {
					for (var a in r) {
						n[a] = r[a]
					}
				} catch (i) {
					var s = "<" + e;
					for (var a in r) {
						s += " " + a + '="' + r[a] + '"'
					}
					s += ">";
					t || (s += "</" + e + ">");
					n = L.createElement(s)
				}
				return n
			}
			var a = n("div", {
				style: "display:none;"
			});
			var s = n("iframe", {
				name: "_br_post_frm",
				width: 0,
				height: 0,
				style: "display:none;"
			});
			var i = n("form", {
				style: "display:none;",
				action: e,
				enctype: "application/x-www-form-urlencoded",
				method: "post",
				target: "_br_post_frm"
			});
			var o = n("input", {
				name: "data",
				type: "hidden"
			}, true);
			o.value = r;
			i.appendChild(o);
			a.appendChild(s);
			a.appendChild(i);
			L.body.appendChild(a);
			i.submit();
			s.onreadystatechange = function() {
				("complete" === s.readyState || 4 === s.readyState) && (t && t(null, s.innerHTML), L.body.removeChild(a))
			};
			return true
		},
		POST: function(e, r, t, n, a) {
			if (!a && navigator && navigator.sendBeacon && e.startsWith("http")) {
				var s = navigator.sendBeacon(e, r);
				n(!s);
				return s
			}
			var i = null,
				o = window.XDomainRequest;
			if (o) {
				i = new o;
				i.open("POST", e);
				i.onload = function() {
					n(null, i.responseText)
				};
				this.sh(i, "load", function() {
					n(null, i.responseText)
				}, false);
				this.sh(i, "error", function() {
					n("POST(" + e + ")error")
				}, false);
				this.wrap(true, i, "onerror", function(e) {
					return function() {
						n && n("post error", i.responseText);
						return true
					}
				});
				i.send(r);
				return true
			}
			if (!R) {
				return false
			}
			i = new R;
			i.overrideMimeType && i.overrideMimeType("text/html");
			try {
				i._ignore = true
			} catch (e) {}
			var u = 0;
			i.onreadystatechange = function() {
				4 == i.readyState && 200 == i.status && (0 == u && n && n(null, i.responseText), u++)
			};
			a && this.sh(i, "error", function() {
				n && n("post error", i.responseText)
			});
			i.onerror && this.wrap(true, i, "onerror", function(e) {
				return function() {
					n && n("post error", i.responseText);
					return typeof e == "function" ? e.apply(this, arguments) : true
				}
			});
			try {
				i.open("POST", e, true)
			} catch (e) {}
			for (var c in t) {
				i.setRequestHeader && i.setRequestHeader(c, t[c])
			}
			i.send(r);
			return true
		},
		sh: function(e, r, t, n) {
			return e.addEventListener ? e.addEventListener(r, t, n) : e.attachEvent ? e.attachEvent("on" + r, t) : false
		},
		args: function() {
			var e = [];
			![].push.apply(e, arguments);
			return e
		},
		stringify: u,
		parseJSON: function(r) {
			if (r && typeof r == "string") {
				var t = e.JSON ? e.JSON.parse : function(e) {
						return new Function("return " + e)()
					};
				return t(r)
			}
		},
		trim: String.prototype.trim ?
		function(e) {
			return null == e ? "" : String.prototype.trim.call(e)
		} : function(e) {
			return null == e ? "" : e.toString().replace(/(^\s+)|(\s+$)/g, "")
		},
		extend: function(e, r) {
			if (e && r) {
				for (var t in r) {
					r.hasOwnProperty(t) && (e[t] = r[t])
				}
			}
			return e
		},
		bind: function(e, r) {
			return function() {
				e.apply(r, arguments)
			}
		}
	};
	var q = e._meda_runtime = x.extend({
		st: d(),
		ra: [],
		c_ra: [],
		aa: [],
		snd_du: function() {
			return this.server.adu ? this.server.adu * 1e3 : 1e4
		},
		cc: function() {
			return this.server.ac || 10
		}
	}, e._meda_runtime || {});
	var O = c();
	q.cip = "";
	e._meda_runtime.ua = e.navigator && e.navigator.userAgent.replace(/;/g, "");
	q.server = {
		get_ip: true,
		id: "1184",
		beacon: this.get_ip ? O : "localhost:3000",
		key: "iRiIZP9b7eQ",
		trace_threshold: 10000.0,
		sr: 100,
		upload_time: 120,
		sip: "127.0.0.1",
		get_ip_url: "http://118.194.50.25:9020/getIp"
	};
	//init events with a probability
	(function() {
		if (q.server && (!q.server.sr || Math.random() * 100 <= q.server.sr)) {
			var t = [
				["load", g],
				["beforeunload", y],
				["pagehide", y],
				["unload", y]
			];
			for (var n = 0; n < t.length; n++) {
				x.sh(e, t[n][0], t[n][1], false)
			}
			var a = [
				["scroll", b],
				["keypress", b],
				["click", b],
				["DOMContentLoaded", v],
				["readystatechange", m]
			];
			for (var n = 0; n < a.length; n++) {
				x.sh(L, a[n][0], a[n][1], false)
			}
		} else {
			N.errors = undefined;
			q.aa = undefined
		}
	})();
	
	String.prototype.startsWith || (String.prototype.startsWith = function(e, r) {
		r = r || 0;
		return this.indexOf(e, r) === r
	});
	//create pv key
	var A = function() {
			function e() {
				return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
			}
			return e() + "-" + e() + e()
		}();
	var B = e.performance ? e.performance : e.Performance;
	B && (x.sh(B, "resourcetimingbufferfull", function() {
		var e = B.getEntriesByType("resource");
		e && (q.ra = q.ra.concat(e), B.clearResourceTimings())
	}, false), x.sh(B, "webkitresourcetimingbufferfull", function() {
		var e = B.getEntriesByType("resource");
		e && (q.ra = q.ra.concat(e), B.webkitClearResourceTimings())
	}, false));
	var N = q.metric = {
		ready: function() {
			return q.load_time
		},
		initend: function() {
			function e() {
				N.sa()
			}
			q.end_time || (q.end_time = d(), this._h = setInterval(e, 2e3))
		},
		send: function(r) {
			function n() {
				function r(e) {
					return a[e] > 0 ? a[e] - s : 0
				}
				var n = {};
				if (B && B.timing) {
					var a = B.timing,
						s = a.navigationStart;
					var i = r("domainLookupStart"),
						o = r("domainLookupEnd"),
						u = r("connectStart"),
						c = r("connectEnd");
					n = {
						ns: s,
						f: r("fetchStart"),
						qs: r("requestStart"),
						rs: r("responseStart"),
						re: r("responseEnd"),
						os: r("domContentLoadedEventStart"),
						oe: r("domContentLoadedEventEnd"),
						ol: r("domLoading"),
						oi: r("domInteractive"),
						oc: r("domComplete"),
						ls: r("loadEventStart"),
						le: r("loadEventEnd"),
						tus: r("unloadEventStart"),
						tue: r("unloadEventEnd"),
						sl: r("secureConnectionStart"),
						es: r("redirectStart"),
						ee: r("redirectEnd")
					};
					c - u > 0 && (n.cs = u, n.ce = c);
					o - i > 0 && (n.ds = i, n.de = o);
					0 == n.le && (n.ue = q.load_time - s);
					n.ue < n.ls && (n.ue = n.ls)
				} else {
					s = q.st;
					n = {
						t: s,
						os: q.end_time - s,
						ls: q.load_time - s
					}
				}
				n.je = N.errors.length;
				n.gid = t || "";
				var f = q.agent || e._meda_runtime && e._meda_runtime.agent;
				f && (n.id = l(f.id), n.a = f.a, n.q = f.q, n.tid = l(f.tid), n.n = l(f.n));
				n.sh = e.screen && e.screen.height;
				n.sw = e.screen && e.screen.width;
				return n
			}
			function a() {
				function e(e) {
					return i[e] > 0 ? Math.round(i[e] * 1e3) / 1e3 : 0
				}
				if (r < q.server.trace_threshold) {
					return null
				}
				if (B && B.getEntriesByType) {
					var t = {
						tr: true,
						tt: l(L.title),
						charset: L.characterSet
					},
						n = B.getEntriesByType("resource"),
						a = q.ra;
					if (n) {
						a = a.concat(n);
						if (B.clearResourceTimings) {
							B.clearResourceTimings()
						} else if (B.webkitClearResourceTimings) {
							B.webkitClearResourceTimings()
						}
					}
					t.res = [];
					for (var s = 0; s < a.length; s++) {
						var i = a[s],
							o = {
								o: e("startTime"),
								rt: i.initiatorType,
								n: i.name,
								f: e("fetchStart"),
								ds: e("domainLookupStart"),
								de: e("domainLookupEnd"),
								cs: e("connectStart"),
								ce: e("connectEnd"),
								sl: e("secureConnectionStart"),
								qs: e("requestStart"),
								re: e("responseStart"),
								rs: e("responseEnd"),
								es: e("redirectStart"),
								ee: e("redirectEnd")
							};
						t.res.push(o)
					}
					return t
				}
			}
			if (this.sended || !this.ready()) {
				return false
			}
			var s = q.st,
				i = {},
				o = {};
			try {
				o = n();
				i = a(o.ls > 0 ? o.ls : q.load_time - s)
			} catch (e) {}
			i = i ? x.stringify(i) : "";
			var u = this;
			q.sended = this.sended;
			var c = function(r, t) {
					if (r && r.substr("error")) {
						e._meda_runtime.cip = q.server.sip
					} else {
						e._meda_runtime.cip = t || ""
					}
					q.sended = true;
					var n = x.mkurl(q.server.beacon, "pf", o);
					i.length && x.POST(n, i, {}, p("POST")) || x.GET(n);
					u.sa();
					var a = x.bind(h, u);
					a();
					N._k = setInterval(a, 1e4);
					q.server.upload_time && setTimeout(function() {
						_() && clearInterval(N._k) && clearInterval(N._h);
						q.sended = false
					}, q.server.upload_time * 1e3)
				};
			q.server.get_ip ? x.POST(q.server.get_ip_url, null, null, c, true) : c();
			return true
		},
		sa: function(e) {
			if (q.sended && (this.ready() || e) && q.aa.length) {
				var r = e || !this._last_send || d() - this._last_send > q.snd_du() || q.aa.length >= q.cc();
				if (r) {
					var t = x.mkurl(q.server.beacon, "as"),
						n = x.stringify({
							xhr: q.aa
						}),
						a = q.aa.length;
					x.POST(t, n, {}, function(e, r) {
						e || q.aa.splice(0, a)
					});
					this._last_send = d()
				}
			}
		},
		errors: []
	};
	var P = {};
	e.addEventListener ? x.sh(e, "error", w, false) : e.onerror = function(e, r, t, n, a) {
		var s = {};
		s.e0 = d();
		s.e1 = e;
		s.e2 = t;
		s.e3 = n;
		s.e4 = r == L.URL ? "#" : r;
		if (a) {
			var i = S(e, t, n, a.moduleName);
			s.e5 = a.stack || "";
			s.e6 = a.moduleName || "";
			s.e7 = P[i] ? 0 : 1;
			P[i] = true
		}
		N.errors && N.errors.push(s)
	};
	x.wrap(false, e, "requestAnimationFrame", function(r) {
		return function() {
			return q.firstPaint = d(), e.requestAnimationFrame = r, r.apply(this, arguments)
		}
	});
	if (R) {
		if (R.prototype) {
			x.wrap(false, R.prototype, "open", E);
			x.wrap(false, R.prototype, "send", k)
		} else {
			x.ie = 7;
			var H = R;
			e.XMLHttpRequest = function() {
				var e = new H;
				x.wrap(false, e, "open", E);
				x.wrap(false, e, "send", k);
				return e
			}
		}
	} else {
		e.ActiveXObject && (x.ie = 6)
	}
}(window);