(function(){
/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var g, ba = ba || {}, k = this || self;
function ca(a) {
  var b = typeof a;
  b = "object" != b ? b : a ? Array.isArray(a) ? "array" : b : "null";
  return "array" == b || "object" == b && "number" == typeof a.length;
}
function n(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
}
function da(a) {
  return Object.prototype.hasOwnProperty.call(a, ea) && a[ea] || (a[ea] = ++fa);
}
var ea = "closure_uid_" + (1e9 * Math.random() >>> 0), fa = 0;
function ha(a, b, c) {
  return a.call.apply(a.bind, arguments);
}
function ia(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(b, e);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}
function r(a, b, c) {
  r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ha : ia;
  return r.apply(null, arguments);
}
function ja(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = c.slice();
    d.push.apply(d, arguments);
    return a.apply(this, d);
  };
}
function t(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.oa = b.prototype;
  a.prototype = new c();
  a.prototype.constructor = a;
  a.Pd = function(d, e, f) {
    for (var h = Array(arguments.length - 2), l = 2; l < arguments.length; l++) {
      h[l - 2] = arguments[l];
    }
    return b.prototype[e].apply(d, h);
  };
}
;function ka(a) {
  switch(a) {
    case 0:
      return "No Error";
    case 1:
      return "Access denied to content document";
    case 2:
      return "File not found";
    case 3:
      return "Firefox silently errored";
    case 4:
      return "Application custom error";
    case 5:
      return "An exception occurred";
    case 6:
      return "Http response at 400 or 500 level";
    case 7:
      return "Request was aborted";
    case 8:
      return "Request timed out";
    case 9:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
}
;function u() {
  0 != la && (ma[da(this)] = this);
  this.wa = this.wa;
  this.Ba = this.Ba;
}
var la = 0, ma = {};
u.prototype.wa = !1;
u.prototype.qd = function() {
  return this.wa;
};
u.prototype.hb = function() {
  if (!this.wa && (this.wa = !0, this.O(), 0 != la)) {
    var a = da(this);
    if (0 != la && this.Ba && 0 < this.Ba.length) {
      throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");
    }
    delete ma[a];
  }
};
u.prototype.O = function() {
  if (this.Ba) {
    for (; this.Ba.length;) {
      this.Ba.shift()();
    }
  }
};
function pa(a, b) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, pa);
  } else {
    const c = Error().stack;
    c && (this.stack = c);
  }
  a && (this.message = String(a));
  void 0 !== b && (this.cause = b);
}
t(pa, Error);
pa.prototype.name = "CustomError";
function qa(a, b) {
  a = a.split("%s");
  let c = "";
  const d = a.length - 1;
  for (let e = 0; e < d; e++) {
    c += a[e] + (e < b.length ? b[e] : "%s");
  }
  pa.call(this, c + a[d]);
}
t(qa, pa);
qa.prototype.name = "AssertionError";
function ra(a, b, c) {
  if (null == a) {
    var d = [a];
    let e = "Assertion failed";
    b ? (e += ": " + b, d = Array.prototype.slice.call(arguments, 2)) : e += ": Expected to exist: %s.";
    throw new qa("" + e, d || []);
  }
  return a;
}
function sa(a, b) {
  throw new qa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;function ta(a) {
  const b = a.length;
  if (0 < b) {
    const c = Array(b);
    for (let d = 0; d < b; d++) {
      c[d] = a[d];
    }
    return c;
  }
  return [];
}
function ua(a, b) {
  for (let c = 1; c < arguments.length; c++) {
    const d = arguments[c];
    if (ca(d)) {
      const e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (let h = 0; h < f; h++) {
        a[e + h] = d[h];
      }
    } else {
      a.push(d);
    }
  }
}
;var va = Object.freeze || function(a) {
  return a;
};
function v(a, b) {
  this.type = a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.Ta = !1;
}
v.prototype.stopPropagation = function() {
  this.Ta = !0;
};
v.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
};
var wa = function() {
  if (!k.addEventListener || !Object.defineProperty) {
    return !1;
  }
  var a = !1, b = Object.defineProperty({}, "passive", {get:function() {
    a = !0;
  }});
  try {
    const c = () => {
    };
    k.addEventListener("test", c, b);
    k.removeEventListener("test", c, b);
  } catch (c) {
  }
  return a;
}();
function xa(a) {
  return /^[\s\xa0]*$/.test(a);
}
;function ya() {
  var a = k.navigator;
  return a && (a = a.userAgent) ? a : "";
}
function w(a) {
  return -1 != ya().indexOf(a);
}
;function za(a) {
  za[" "](a);
  return a;
}
za[" "] = function() {
};
var Aa = w("Trident") || w("MSIE"), Ba = w("Gecko") && !(-1 != ya().toLowerCase().indexOf("webkit") && !w("Edge")) && !(w("Trident") || w("MSIE")) && !w("Edge"), Ca = -1 != ya().toLowerCase().indexOf("webkit") && !w("Edge");
function x(a, b) {
  v.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.key = "";
  this.charCode = this.keyCode = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.La = null;
  if (a) {
    var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    if (b = a.relatedTarget) {
      if (Ba) {
        a: {
          try {
            za(b.nodeName);
            var e = !0;
            break a;
          } catch (f) {
          }
          e = !1;
        }
        e || (b = null);
      }
    } else {
      "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);
    }
    this.relatedTarget = b;
    d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.offsetX = Ca || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = Ca || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 
    0);
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.key = a.key || "";
    this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = "string" === typeof a.pointerType ? a.pointerType : Da[a.pointerType] || "";
    this.state = a.state;
    this.La = a;
    a.defaultPrevented && x.oa.preventDefault.call(this);
  }
}
t(x, v);
var Da = va({2:"touch", 3:"pen", 4:"mouse"});
x.prototype.stopPropagation = function() {
  x.oa.stopPropagation.call(this);
  this.La.stopPropagation ? this.La.stopPropagation() : this.La.cancelBubble = !0;
};
x.prototype.preventDefault = function() {
  x.oa.preventDefault.call(this);
  var a = this.La;
  a.preventDefault ? a.preventDefault() : a.returnValue = !1;
};
var Ea = "closure_listenable_" + (1e6 * Math.random() | 0);
function Fa(a) {
  return !(!a || !a[Ea]);
}
;var Ga = 0;
function Ha(a, b, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b;
  this.type = c;
  this.capture = !!d;
  this.mb = e;
  this.key = ++Ga;
  this.Ua = this.fb = !1;
}
function Ia(a) {
  a.Ua = !0;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.mb = null;
}
;function Ja(a, b, c) {
  for (const d in a) {
    b.call(c, a[d], d, a);
  }
}
function Ka(a, b) {
  for (const c in a) {
    b.call(void 0, a[c], c, a);
  }
}
function La(a) {
  const b = {};
  for (const c in a) {
    b[c] = a[c];
  }
  return b;
}
const Ma = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Na(a, b) {
  let c, d;
  for (let e = 1; e < arguments.length; e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (let f = 0; f < Ma.length; f++) {
      c = Ma[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
}
;function y(a) {
  this.src = a;
  this.G = {};
  this.$a = 0;
}
y.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.G[f];
  a || (a = this.G[f] = [], this.$a++);
  var h = Oa(a, b, d, e);
  -1 < h ? (b = a[h], c || (b.fb = !1)) : (b = new Ha(b, this.src, f, !!d, e), b.fb = c, a.push(b));
  return b;
};
y.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.G)) {
    return !1;
  }
  var e = this.G[a];
  b = Oa(e, b, c, d);
  return -1 < b ? (Ia(e[b]), Array.prototype.splice.call(e, b, 1), 0 == e.length && (delete this.G[a], this.$a--), !0) : !1;
};
function Pa(a, b) {
  var c = b.type;
  if (c in a.G) {
    var d = a.G[c], e = Array.prototype.indexOf.call(d, b, void 0), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (Ia(b), 0 == a.G[c].length && (delete a.G[c], a.$a--));
  }
}
y.prototype.xb = function() {
  var a = 0, b;
  for (b in this.G) {
    for (var c = this.G[b], d = 0; d < c.length; d++) {
      ++a, Ia(c[d]);
    }
    delete this.G[b];
    this.$a--;
  }
};
y.prototype.Oa = function(a, b, c, d) {
  a = this.G[a.toString()];
  var e = -1;
  a && (e = Oa(a, b, c, d));
  return -1 < e ? a[e] : null;
};
function Oa(a, b, c, d) {
  for (var e = 0; e < a.length; ++e) {
    var f = a[e];
    if (!f.Ua && f.listener == b && f.capture == !!c && f.mb == d) {
      return e;
    }
  }
  return -1;
}
;var Qa = "closure_lm_" + (1e6 * Math.random() | 0), Ra = {}, Sa = 0;
function Ta(a, b, c, d, e) {
  if (d && d.once) {
    return Ua(a, b, c, d, e);
  }
  if (Array.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      Ta(a, b[f], c, d, e);
    }
    return null;
  }
  c = Va(c);
  return Fa(a) ? a.rb(b, c, n(d) ? !!d.capture : !!d, e) : Wa(a, b, c, !1, d, e);
}
function Wa(a, b, c, d, e, f) {
  if (!b) {
    throw Error("Invalid event type");
  }
  var h = n(e) ? !!e.capture : !!e, l = Xa(a);
  l || (a[Qa] = l = new y(a));
  c = l.add(b, c, d, h, f);
  if (c.proxy) {
    return c;
  }
  d = $a();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener) {
    wa || (e = h), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e);
  } else if (a.attachEvent) {
    a.attachEvent(ab(b.toString()), d);
  } else if (a.addListener && a.removeListener) {
    a.addListener(d);
  } else {
    throw Error("addEventListener and attachEvent are unavailable.");
  }
  Sa++;
  return c;
}
function $a() {
  function a(c) {
    return b.call(a.src, a.listener, c);
  }
  const b = bb;
  return a;
}
function Ua(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      Ua(a, b[f], c, d, e);
    }
    return null;
  }
  c = Va(c);
  return Fa(a) ? a.Lc(b, c, n(d) ? !!d.capture : !!d, e) : Wa(a, b, c, !0, d, e);
}
function cb(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      cb(a, b[f], c, d, e);
    }
  } else {
    d = n(d) ? !!d.capture : !!d, c = Va(c), Fa(a) ? a.kc(b, c, d, e) : a && (a = Xa(a)) && (b = a.Oa(b, c, d, e)) && db(b);
  }
}
function db(a) {
  if ("number" !== typeof a && a && !a.Ua) {
    var b = a.src;
    if (Fa(b)) {
      Pa(b.W, a);
    } else {
      var c = a.type, d = a.proxy;
      b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(ab(c), d) : b.addListener && b.removeListener && b.removeListener(d);
      Sa--;
      (c = Xa(b)) ? (Pa(c, a), 0 == c.$a && (c.src = null, b[Qa] = null)) : Ia(a);
    }
  }
}
function ab(a) {
  return a in Ra ? Ra[a] : Ra[a] = "on" + a;
}
function bb(a, b) {
  if (a.Ua) {
    a = !0;
  } else {
    b = new x(b, this);
    var c = a.listener, d = a.mb || a.src;
    a.fb && db(a);
    a = c.call(d, b);
  }
  return a;
}
function Xa(a) {
  a = a[Qa];
  return a instanceof y ? a : null;
}
var eb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
function Va(a) {
  if ("function" === typeof a) {
    return a;
  }
  a[eb] || (a[eb] = function(b) {
    return a.handleEvent(b);
  });
  return a[eb];
}
;function fb(a) {
  u.call(this);
  this.m = a;
  this.za = {};
}
t(fb, u);
var gb = [];
g = fb.prototype;
g.rb = function(a, b, c, d) {
  Array.isArray(b) || (b && (gb[0] = b.toString()), b = gb);
  for (var e = 0; e < b.length; e++) {
    var f = Ta(a, b[e], c || this.handleEvent, d || !1, this.m || this);
    if (!f) {
      break;
    }
    this.za[f.key] = f;
  }
  return this;
};
g.Lc = function(a, b, c, d) {
  return hb(this, a, b, c, d);
};
function hb(a, b, c, d, e, f) {
  if (Array.isArray(c)) {
    for (var h = 0; h < c.length; h++) {
      hb(a, b, c[h], d, e, f);
    }
  } else {
    b = Ua(b, c, d || a.handleEvent, e, f || a.m || a);
    if (!b) {
      return a;
    }
    a.za[b.key] = b;
  }
  return a;
}
g.kc = function(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      this.kc(a, b[f], c, d, e);
    }
  } else {
    c = c || this.handleEvent, d = n(d) ? !!d.capture : !!d, e = e || this.m || this, c = Va(c), d = !!d, b = Fa(a) ? a.Oa(b, c, d, e) : a ? (a = Xa(a)) ? a.Oa(b, c, d, e) : null : null, b && (db(b), delete this.za[b.key]);
  }
};
g.xb = function() {
  Ja(this.za, function(a, b) {
    this.za.hasOwnProperty(b) && db(a);
  }, this);
  this.za = {};
};
g.O = function() {
  fb.oa.O.call(this);
  this.xb();
};
g.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
class ib {
  constructor(a, b) {
    this.sd = 100;
    this.ed = a;
    this.Hd = b;
    this.vb = 0;
    this.nb = null;
  }
  get() {
    let a;
    0 < this.vb ? (this.vb--, a = this.nb, this.nb = a.next, a.next = null) : a = this.ed();
    return a;
  }
  put(a) {
    this.Hd(a);
    this.vb < this.sd && (this.vb++, a.next = this.nb, this.nb = a);
  }
}
;class jb {
  constructor() {
    this.Bb = this.Ha = null;
  }
  add(a, b) {
    const c = kb.get();
    c.set(a, b);
    this.Bb ? this.Bb.next = c : this.Ha = c;
    this.Bb = c;
  }
  remove() {
    let a = null;
    this.Ha && (a = this.Ha, this.Ha = this.Ha.next, this.Ha || (this.Bb = null), a.next = null);
    return a;
  }
}
var kb = new ib(() => new lb(), a => a.reset());
class lb {
  constructor() {
    this.next = this.scope = this.Nb = null;
  }
  set(a, b) {
    this.Nb = a;
    this.scope = b;
    this.next = null;
  }
  reset() {
    this.next = this.scope = this.Nb = null;
  }
}
;const mb = k.console && k.console.createTask ? k.console.createTask.bind(k.console) : void 0, nb = mb ? Symbol("consoleTask") : void 0;
function ob(a) {
  function b(...d) {
    return c.run(() => a.call(this, ...d));
  }
  if (!mb || a[ra(nb)]) {
    return a;
  }
  const c = mb(a.name || "goog.async.run");
  b[ra(nb)] = c;
  return b;
}
;var qb = class {
  constructor(a) {
    if (pb !== pb) {
      throw Error("SafeUrl is not meant to be built directly");
    }
    this.Dd = a;
  }
  toString() {
    return this.Dd.toString();
  }
}, pb = {};
new qb("about:invalid#zClosurez");
new qb("about:blank");
const rb = {};
class sb {
  constructor() {
    if (rb !== rb) {
      throw Error("SafeStyle is not meant to be built directly");
    }
    this.Cd = "";
  }
  toString() {
    return this.Cd.toString();
  }
}
new sb();
const tb = {};
class ub {
  constructor() {
    if (tb !== tb) {
      throw Error("SafeStyleSheet is not meant to be built directly");
    }
    this.Bd = "";
  }
  toString() {
    return this.Bd.toString();
  }
}
new ub();
const vb = {};
class wb {
  constructor() {
    var a = k.trustedTypes && k.trustedTypes.emptyHTML || "";
    if (vb !== vb) {
      throw Error("SafeHtml is not meant to be built directly");
    }
    this.Ad = a;
  }
  toString() {
    return this.Ad.toString();
  }
}
new wb();
function xb(a) {
  var b = 1;
  a = a.split(":");
  const c = [];
  for (; 0 < b && a.length;) {
    c.push(a.shift()), b--;
  }
  a.length && c.push(a.join(":"));
  return c;
}
;function yb() {
  var a = document;
  var b = "IFRAME";
  "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
  return a.createElement(b);
}
;var zb;
function Ab() {
  var a = k.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !w("Presto") && (a = function() {
    var e = yb();
    e.style.display = "none";
    document.documentElement.appendChild(e);
    var f = e.contentWindow;
    e = f.document;
    e.open();
    e.close();
    var h = "callImmediate" + Math.random(), l = "file:" == f.location.protocol ? "*" : f.location.protocol + "//" + f.location.host;
    e = r(function(q) {
      if (("*" == l || q.origin == l) && q.data == h) {
        this.port1.onmessage();
      }
    }, this);
    f.addEventListener("message", e, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      f.postMessage(h, l);
    }};
  });
  if ("undefined" !== typeof a && !w("Trident") && !w("MSIE")) {
    var b = new a(), c = {}, d = c;
    b.port1.onmessage = function() {
      if (void 0 !== c.next) {
        c = c.next;
        var e = c.rc;
        c.rc = null;
        e();
      }
    };
    return function(e) {
      d.next = {rc:e};
      d = d.next;
      b.port2.postMessage(0);
    };
  }
  return function(e) {
    k.setTimeout(e, 0);
  };
}
;function Bb(a) {
  k.setTimeout(() => {
    throw a;
  }, 0);
}
;let Cb, Db = !1, Eb = new jb(), Gb = (a, b) => {
  Cb || Fb();
  Db || (Cb(), Db = !0);
  a = ob(a);
  Eb.add(a, b);
}, Fb = () => {
  if (k.Promise && k.Promise.resolve) {
    const a = k.Promise.resolve(void 0);
    Cb = () => {
      a.then(Ib);
    };
  } else {
    Cb = () => {
      var a = Ib;
      "function" !== typeof k.setImmediate || k.Window && k.Window.prototype && !w("Edge") && k.Window.prototype.setImmediate == k.setImmediate ? (zb ||= Ab(), zb(a)) : k.setImmediate(a);
    };
  }
};
var Ib = () => {
  let a;
  for (; a = Eb.remove();) {
    try {
      a.Nb.call(a.scope);
    } catch (b) {
      Bb(b);
    }
    kb.put(a);
  }
  Db = !1;
};
function z() {
  u.call(this);
  this.W = new y(this);
  this.$c = this;
  this.$b = null;
}
t(z, u);
z.prototype[Ea] = !0;
g = z.prototype;
g.addEventListener = function(a, b, c, d) {
  Ta(this, a, b, c, d);
};
g.removeEventListener = function(a, b, c, d) {
  cb(this, a, b, c, d);
};
g.dispatchEvent = function(a) {
  var b, c = this.$b;
  if (c) {
    for (b = []; c; c = c.$b) {
      b.push(c);
    }
  }
  c = this.$c;
  var d = a.type || a;
  if ("string" === typeof a) {
    a = new v(a, c);
  } else if (a instanceof v) {
    a.target = a.target || c;
  } else {
    var e = a;
    a = new v(d, c);
    Na(a, e);
  }
  e = !0;
  if (b) {
    for (var f = b.length - 1; !a.Ta && 0 <= f; f--) {
      var h = a.currentTarget = b[f];
      e = Kb(h, d, !0, a) && e;
    }
  }
  a.Ta || (h = a.currentTarget = c, e = Kb(h, d, !0, a) && e, a.Ta || (e = Kb(h, d, !1, a) && e));
  if (b) {
    for (f = 0; !a.Ta && f < b.length; f++) {
      h = a.currentTarget = b[f], e = Kb(h, d, !1, a) && e;
    }
  }
  return e;
};
g.O = function() {
  z.oa.O.call(this);
  this.W && this.W.xb();
  this.$b = null;
};
g.rb = function(a, b, c, d) {
  return this.W.add(String(a), b, !1, c, d);
};
g.Lc = function(a, b, c, d) {
  return this.W.add(String(a), b, !0, c, d);
};
g.kc = function(a, b, c, d) {
  this.W.remove(String(a), b, c, d);
};
function Kb(a, b, c, d) {
  b = a.W.G[String(b)];
  if (!b) {
    return !0;
  }
  b = b.concat();
  for (var e = !0, f = 0; f < b.length; ++f) {
    var h = b[f];
    if (h && !h.Ua && h.capture == c) {
      var l = h.listener, q = h.mb || h.src;
      h.fb && Pa(a.W, h);
      e = !1 !== l.call(q, d) && e;
    }
  }
  return e && !d.defaultPrevented;
}
g.Oa = function(a, b, c, d) {
  return this.W.Oa(String(a), b, c, d);
};
function Lb(a, b, c) {
  if ("function" === typeof a) {
    c && (a = r(a, c));
  } else if (a && "function" == typeof a.handleEvent) {
    a = r(a.handleEvent, a);
  } else {
    throw Error("Invalid listener argument");
  }
  return 2147483647 < Number(b) ? -1 : k.setTimeout(a, b || 0);
}
;function Mb(a) {
  a.pa = Lb(() => {
    a.pa = null;
    a.Fa && !a.Sa && (a.Fa = !1, Mb(a));
  }, a.pd);
  const b = a.bb;
  a.bb = null;
  a.td.apply(null, b);
}
class Nb extends u {
  constructor(a, b) {
    super();
    this.td = a;
    this.pd = b;
    this.bb = null;
    this.Fa = !1;
    this.Sa = 0;
    this.pa = null;
  }
  hd(a) {
    this.bb = arguments;
    this.pa || this.Sa ? this.Fa = !0 : Mb(this);
  }
  stop() {
    this.pa && (k.clearTimeout(this.pa), this.pa = null, this.Fa = !1, this.bb = null);
  }
  pause() {
    this.Sa++;
  }
  resume() {
    this.Sa--;
    this.Sa || !this.Fa || this.pa || (this.Fa = !1, Mb(this));
  }
  O() {
    super.O();
    this.stop();
  }
}
;function Ob() {
}
Ob.prototype.qc = null;
Ob.prototype.getOptions = function() {
  return this.qc || (this.qc = this.Hc());
};
function A() {
}
function Pb() {
}
function Qb() {
  v.call(this, "d");
}
t(Qb, v);
function Rb() {
  v.call(this, "c");
}
t(Rb, v);
var Sb = k.JSON.stringify;
var B = class {
  constructor(a, b) {
    this.name = a;
    this.value = b;
  }
  toString() {
    return this.name;
  }
}, Tb = new B("OFF", Infinity), Ub = new B("SEVERE", 1000), C = new B("WARNING", 900), Vb = new B("INFO", 800), Wb = new B("CONFIG", 700), Xb = new B("FINE", 500), Yb = class {
  constructor() {
    this.gb = 0;
    this.clear();
  }
  Ub() {
    return this.Vb;
  }
  clear() {
    this.pc = Array(this.gb);
    this.zc = -1;
    this.Vb = !1;
  }
}, Zb, $b = class {
  constructor(a, b, c) {
    this.reset(a || Tb, b, c, void 0, void 0);
  }
  reset() {
  }
};
function ac(a) {
  if (a.level) {
    return a.level;
  }
  if (a.parent) {
    return ac(a.parent);
  }
  sa("Root logger has no level set.");
  return Tb;
}
function bc(a, b) {
  for (; a;) {
    a.od.forEach(c => {
      c(b);
    }), a = a.parent;
  }
}
var cc = class {
  constructor(a, b = null) {
    this.level = null;
    this.od = [];
    this.parent = b || null;
    this.children = [];
    this.sb = {Rb:() => a};
  }
};
function D(a, b) {
  var c = a.entries[b];
  if (c) {
    return c;
  }
  c = D(a, b.slice(0, Math.max(b.lastIndexOf("."), 0)));
  const d = new cc(b, c);
  a.entries[b] = d;
  c.children.push(d);
  return d;
}
var dc = class {
  constructor() {
    this.entries = {};
    const a = new cc("");
    a.level = Wb;
    this.entries[""] = a;
  }
}, ec;
function E() {
  ec ||= new dc();
  return ec;
}
function F(a, b, c) {
  var d;
  if (d = a) {
    if (d = a && b) {
      d = b.value;
      var e = a ? ac(D(E(), a.Rb())) : Tb;
      d = d >= e.value;
    }
  }
  if (d) {
    b = b || Tb;
    d = D(E(), a.Rb());
    "function" === typeof c && (c = c());
    Zb ||= new Yb();
    e = Zb;
    a = a.Rb();
    if (0 < e.gb) {
      var f = (e.zc + 1) % e.gb;
      e.zc = f;
      e.Vb ? (e = e.pc[f], e.reset(b, c, a), a = e) : (e.Vb = f == e.gb - 1, a = e.pc[f] = new $b(b, c, a));
    } else {
      a = new $b(b, c, a);
    }
    bc(d, a);
  }
}
function fc(a, b) {
  a && F(a, Ub, b);
}
function H(a, b) {
  a && F(a, Xb, b);
}
;function J() {
  this.j = D(E(), "goog.labs.net.webChannel.WebChannelDebug").sb;
  this.ac = !0;
}
J.prototype.disableRedact = function() {
  this.ac = !1;
};
function gc(a, b, c, d, e, f) {
  a.info(function() {
    if (a.ac) {
      if (f) {
        var h = "";
        var l = f.split("&");
        for (let I = 0; I < l.length; I++) {
          var q = l[I].split("=");
          if (1 < q.length) {
            const p = q[0];
            q = q[1];
            const m = p.split("_");
            h = 2 <= m.length && "type" == m[1] ? h + (p + "=" + q + "&") : h + (p + "=redacted&");
          }
        }
      } else {
        h = null;
      }
    } else {
      h = f;
    }
    return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
  });
}
function hc(a, b, c, d, e, f, h) {
  a.info(function() {
    return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
  });
}
function K(a, b, c, d) {
  a.info(function() {
    return "XMLHTTP TEXT (" + b + "): " + ic(a, c) + (d ? " " + d : "");
  });
}
function jc(a, b) {
  a.info(function() {
    return "TIMEOUT: " + b;
  });
}
J.prototype.debug = function(a) {
  H(this.j, a);
};
function L(a, b) {
  fc(a.j, b || "Exception");
}
J.prototype.info = function(a) {
  var b = this.j;
  b && F(b, Vb, a);
};
function M(a, b) {
  (a = a.j) && F(a, C, b);
}
function N(a, b) {
  fc(a.j, b);
}
function ic(a, b) {
  if (!a.ac) {
    return b;
  }
  if (!b) {
    return null;
  }
  try {
    const f = JSON.parse(b);
    if (f) {
      for (let h = 0; h < f.length; h++) {
        if (Array.isArray(f[h])) {
          var c = f[h];
          if (!(2 > c.length)) {
            var d = c[1];
            if (Array.isArray(d) && !(1 > d.length)) {
              var e = d[0];
              if ("noop" != e && "stop" != e && "close" != e) {
                for (let l = 1; l < d.length; l++) {
                  d[l] = "";
                }
              }
            }
          }
        }
      }
    }
    return Sb(f);
  } catch (f) {
    return a.debug("Exception parsing expected JS array - probably was not JS"), b;
  }
}
;var kc;
function lc() {
}
t(lc, Ob);
lc.prototype.createInstance = function() {
  const a = mc(this);
  return a ? new ActiveXObject(a) : new XMLHttpRequest();
};
lc.prototype.Hc = function() {
  const a = {};
  mc(this) && (a[0] = !0, a[1] = !0);
  return a;
};
function mc(a) {
  if (!a.Gc && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    const b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for (let c = 0; c < b.length; c++) {
      const d = b[c];
      try {
        return new ActiveXObject(d), a.Gc = d;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return a.Gc;
}
kc = new lc();
function nc(a) {
  return (a = /\/\/([^\/]+)\//.exec(a)) ? a[1].endsWith("google.com") : !1;
}
let oc = !1;
function pc(a, b) {
  if (!oc) {
    oc = !0;
    var c;
    a: {
      if (c = k.navigator) {
        if (c = c.userAgent) {
          break a;
        }
      }
      c = "";
    }
    (-1 == c.indexOf("Chrome") || -1 != c.indexOf("Edg") ? 0 : 90 <= parseInt(/Chrome\/(\d+)/.exec(c)[1], 10)) && nc(a) && window && window.document && nc(window.document.URL) && (a = document.createElement("meta"), a.httpEquiv = "origin-trial", a.content = "A0eNbltY1nd4MP7XTHXnTxWogDL6mWTdgIIKfKOTJoUHNbFFMZQBoiHHjJ9UK9lgYndWFaxOWR7ld8uUjcWmcwIAAAB/eyJvcmlnaW4iOiJodHRwczovL2dvb2dsZS5jb206NDQzIiwiZmVhdHVyZSI6IkZldGNoVXBsb2FkU3RyZWFtaW5nIiwiZXhwaXJ5IjoxNjM2NTAyMzk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==", 
    document.head.appendChild(a), (new Request("", {body:new ReadableStream(), method:"POST"})).headers.has("Content-Type") || b("OriginTrial unexpected."));
  }
}
;let qc = null;
function rc() {
  return qc = qc || new z();
}
function sc(a, b) {
  v.call(this, "serverreachability", a);
  this.reachabilityType = b;
}
t(sc, v);
function tc(a) {
  const b = rc();
  b.dispatchEvent(new sc(b, a));
}
function uc(a, b) {
  v.call(this, "statevent", a);
  this.stat = b;
}
t(uc, v);
function vc() {
  return rc();
}
function O(a) {
  const b = rc();
  b.dispatchEvent(new uc(b, a));
}
function wc(a, b, c, d) {
  v.call(this, "timingevent", a);
  this.size = b;
  this.rtt = c;
  this.retries = d;
}
t(wc, v);
function xc(a, b, c) {
  const d = rc();
  d.dispatchEvent(new wc(d, a, b, c));
}
function yc(a, b) {
  if ("function" !== typeof a) {
    throw Error("Fn must not be null and must be a function");
  }
  return k.setTimeout(function() {
    a();
  }, b);
}
;function zc(a, b, c, d, e) {
  this.i = a;
  this.g = b;
  this.ea = c;
  this.N = d;
  this.dc = e || 1;
  this.Bc = new fb(this);
  this.Ga = Ac;
  this.J = null;
  this.Y = !1;
  this.ba = this.ca = this.ha = this.ab = this.Da = this.lc = this.ra = null;
  this.T = [];
  this.l = null;
  this.ga = 0;
  this.B = this.fa = null;
  this.Kc = -1;
  this.Ia = !1;
  this.Ca = 0;
  this.wb = null;
  this.Cc = this.Qa = this.Ac = this.Jb = !1;
  this.K = new Bc();
}
function Bc() {
  this.hc = null;
  this.Va = "";
  this.cc = !1;
}
var Ac = 45E3;
function Cc(a, b) {
  switch(a) {
    case 0:
      return "Non-200 return code (" + b + ")";
    case 1:
      return "XMLHTTP failure (no data)";
    case 2:
      return "HttpConnection timeout";
    default:
      return "Unknown error";
  }
}
var Dc = {}, Ec = {};
g = zc.prototype;
g.Wa = function(a) {
  this.J = a;
};
g.setTimeout = function(a) {
  this.Ga = a;
};
g.Wc = function(a) {
  this.Ca = a;
};
g.aa = function() {
  return this.T;
};
function Fc(a, b, c) {
  a.ab = 1;
  a.ha = Gc(b.clone());
  a.ba = c;
  a.Jb = !0;
  Hc(a, null);
}
function Hc(a, b) {
  a.Da = Date.now();
  Jc(a);
  a.ca = a.ha.clone();
  var c = a.ca, d = a.dc;
  P(c);
  Array.isArray(d) || (d = [String(d)]);
  Kc(c.I, "t", d);
  a.ga = 0;
  c = a.i.Ya;
  a.K = new Bc();
  a.l = Lc(a.i, c ? b : null, !a.ba);
  0 < a.Ca && (a.wb = new Nb(r(a.Zc, a, a.l), a.Ca));
  a.Bc.rb(a.l, "readystatechange", a.Fd);
  b = a.J ? La(a.J) : {};
  a.ba ? (a.fa || (a.fa = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.l.send(a.ca, a.fa, a.ba, b)) : (a.fa = "GET", a.l.send(a.ca, a.fa, null, b));
  tc(1);
  gc(a.g, a.fa, a.ca, a.N, a.dc, a.ba);
}
g.Fd = function(a) {
  a = a.target;
  const b = this.wb;
  b && 3 == Q(a) ? (this.g.debug("Throttling readystatechange."), b.hd()) : this.Zc(a);
};
g.Zc = function(a) {
  try {
    a == this.l ? Mc(this) : M(this.g, "Called back with an unexpected xmlhttp");
  } catch (b) {
    if (this.g.debug("Failed call to OnXmlHttpReadyStateChanged_"), Nc(this)) {
      const c = this;
      L(this.g, function() {
        return "ResponseText: " + Oc(c.l);
      });
    } else {
      L(this.g, "No response text");
    }
  } finally {
  }
};
function Mc(a) {
  const b = Q(a.l);
  var c = a.l.Aa, d = R(a.l);
  if (!(3 > b || 3 == b && !Nc(a))) {
    a.Ia || 4 != b || 7 == c || (8 == c || 0 >= d ? tc(3) : tc(2));
    Pc(a);
    var e = R(a.l);
    a.Kc = e;
    c = Qc(a);
    Nc(a) || a.g.debug(function() {
      return "No response text for uri " + a.ca + " status " + e;
    });
    a.Y = 200 == e;
    hc(a.g, a.fa, a.ca, a.N, a.dc, b, e);
    if (a.Y) {
      if (a.Ac && !a.Qa) {
        if (d = Rc(a)) {
          K(a.g, a.N, d, "Initial handshake response via X-HTTP-Initial-Response"), a.Qa = !0, Sc(a, d);
        } else {
          a.Y = !1;
          a.B = 3;
          O(12);
          M(a.g, "XMLHTTP Missing X_HTTP_INITIAL_RESPONSE (" + a.N + ")");
          S(a);
          Tc(a);
          return;
        }
      }
      a.Jb ? Uc(a, b, c) : (K(a.g, a.N, c, null), Sc(a, c));
      4 == b && S(a);
      a.Y && !a.Ia && (4 == b ? Vc(a.i, a) : (a.Y = !1, Jc(a)));
    } else {
      Wc(a.l), 400 == e && 0 < c.indexOf("Unknown SID") ? (a.B = 3, O(12), M(a.g, "XMLHTTP Unknown SID (" + a.N + ")")) : (a.B = 0, O(13), M(a.g, "XMLHTTP Bad status " + e + " (" + a.N + ")")), S(a), Tc(a);
    }
  }
}
function Rc(a) {
  return a.l && (a = a.l, (a = a.h ? a.h.getResponseHeader("X-HTTP-Initial-Response") : null) && !xa(a)) ? a : null;
}
function Qc(a) {
  if (!Xc(a)) {
    return Oc(a.l);
  }
  const b = Yc(a.l);
  if ("" === b) {
    return "";
  }
  let c = "";
  const d = b.length, e = 4 == Q(a.l);
  if (!a.K.hc) {
    if ("undefined" === typeof TextDecoder) {
      return N(a.g, "TextDecoder is not supported by this browser."), S(a), Tc(a), "";
    }
    a.K.hc = new k.TextDecoder();
  }
  for (let f = 0; f < d; f++) {
    a.K.cc = !0, c += a.K.hc.decode(b[f], {stream:!(e && f == d - 1)});
  }
  b.length = 0;
  a.K.Va += c;
  a.ga = 0;
  return a.K.Va;
}
function Nc(a) {
  return a.l ? a.K.cc ? !0 : !(!Oc(a.l) && !Yc(a.l)) : !1;
}
function Xc(a) {
  return a.l ? "GET" == a.fa && 2 != a.ab && a.i.Xc : !1;
}
function Uc(a, b, c) {
  let d = !0, e;
  for (; !a.Ia && a.ga < c.length;) {
    if (e = Zc(a, c), e == Ec) {
      4 == b && (a.B = 4, O(14), d = !1);
      K(a.g, a.N, null, "[Incomplete Response]");
      break;
    } else if (e == Dc) {
      a.B = 4;
      O(15);
      K(a.g, a.N, c, "[Invalid Chunk]");
      d = !1;
      break;
    } else {
      K(a.g, a.N, e, null), Sc(a, e);
    }
  }
  Xc(a) && 0 != a.ga && (a.K.Va = a.K.Va.slice(a.ga), a.ga = 0);
  4 != b || 0 != c.length || a.K.cc || (a.B = 1, O(16), d = !1);
  a.Y = a.Y && d;
  d ? 0 < c.length && !a.Cc && (a.Cc = !0, b = a.i, b.s == a && b.Kb && !b.eb && (b.g.info("Great, no buffering proxy detected. Bytes received: " + c.length), $c(b), b.eb = !0, O(11))) : (K(a.g, a.N, c, "[Invalid Chunked Response]"), S(a), Tc(a));
}
function Zc(a, b) {
  var c = a.ga, d = b.indexOf("\n", c);
  if (-1 == d) {
    return Ec;
  }
  c = Number(b.substring(c, d));
  if (isNaN(c)) {
    return Dc;
  }
  d += 1;
  if (d + c > b.length) {
    return Ec;
  }
  b = b.slice(d, d + c);
  a.ga = d + c;
  return b;
}
g.cancel = function() {
  this.Ia = !0;
  S(this);
};
function Jc(a) {
  a.lc = Date.now() + a.Ga;
  ad(a, a.Ga);
}
function ad(a, b) {
  if (null != a.ra) {
    throw Error("WatchDog timer not null");
  }
  a.ra = yc(r(a.zd, a), b);
}
function Pc(a) {
  a.ra && (k.clearTimeout(a.ra), a.ra = null);
}
g.zd = function() {
  this.ra = null;
  const a = Date.now();
  0 <= a - this.lc ? (this.Y && N(this.g, "Received watchdog timeout even though request loaded successfully"), jc(this.g, this.ca), 2 != this.ab && (tc(3), O(17)), S(this), this.B = 2, Tc(this)) : (M(this.g, "WatchDog timer called too early"), ad(this, this.lc - a));
};
function Tc(a) {
  0 == a.i.C || a.Ia || Vc(a.i, a);
}
function S(a) {
  Pc(a);
  var b = a.wb;
  b && "function" == typeof b.hb && b.hb();
  a.wb = null;
  a.Bc.xb();
  a.l && (b = a.l, a.l = null, b.abort(), b.hb());
}
g.Ec = function() {
  return this.B;
};
g.Qb = function() {
  return this.Kc;
};
function Sc(a, b) {
  try {
    var c = a.i;
    if (0 != c.C && (c.s == a || bd(c.A, a))) {
      if (!a.Qa && bd(c.A, a) && 3 == c.C) {
        try {
          var d = c.Yc.Tc.parse(b);
        } catch (p) {
          d = null;
        }
        if (Array.isArray(d) && 3 == d.length) {
          var e = d;
          if (0 == e[0]) {
            a: {
              if (c.g.debug("Server claims our backchannel is missing."), c.$) {
                c.g.debug("But we are currently starting the request.");
              } else {
                if (c.s) {
                  if (c.s.Da + 3E3 < a.Da) {
                    cd(c), dd(c);
                  } else {
                    break a;
                  }
                } else {
                  M(c.g, "We do not have a BackChannel established");
                }
                ed(c);
                O(18);
              }
            }
          } else {
            c.Jc = e[1];
            var f = c.Jc - c.X;
            if (0 < f) {
              var h = e[2];
              c.g.debug(h + " bytes (in " + f + " arrays) are outstanding on the BackChannel");
              37500 > h && c.Ka && 0 == c.ta && !c.ja && (c.ja = yc(r(c.wd, c), 6E3));
            }
          }
          if (1 >= fd(c.A) && c.Ob) {
            try {
              c.Ob();
            } catch (p) {
              L(c.g, "Exception from forwardChannelFlushedCallback_ ");
            }
            c.Ob = void 0;
          }
        } else {
          c.g.debug("Bad POST response data returned"), T(c, 11);
        }
      } else {
        if ((a.Qa || c.s == a) && cd(c), !xa(b)) {
          e = c.Yc.Tc.parse(b);
          const p = c.m && c.m.Fb ? [] : null;
          for (f = 0; f < e.length; f++) {
            let m = e[f];
            const G = m[0];
            if (G <= c.X) {
              M(c.g, "Ignoring out-of-order or duplicate message with arrayId: " + G + ", lastArrayId: " + c.X);
            } else if (G > c.X + 1 && -1 < c.X && M(c.g, "Received non-consecutive message with arrayId: " + G + ", lastArrayId: " + c.X), c.X = G, m = m[1], 2 == c.C) {
              if ("c" == m[0]) {
                c.ea = m[1];
                c.Sb = c.Ib(m[2]);
                const aa = m[3];
                null != aa && (c.Gb = aa, c.g.info("VER=" + c.Gb));
                const na = m[4];
                null != na && (c.Uc = na, c.g.info("SVER=" + c.Uc));
                const Ya = m[5];
                null != Ya && "number" === typeof Ya && 0 < Ya && (h = 1.5 * Ya, c.cb = h, c.g.info("backChannelRequestTimeoutMs_=" + h));
                h = c;
                const oa = a.l;
                if (oa) {
                  const Za = oa.h ? oa.h.getResponseHeader("X-Client-Wire-Protocol") : null;
                  if (Za) {
                    var l = h.A;
                    l.u || -1 == Za.indexOf("spdy") && -1 == Za.indexOf("quic") && -1 == Za.indexOf("h2") || (l.tb = l.Nc, l.u = new Set(), l.D && (gd(l, l.D), l.D = null));
                  }
                  if (h.ya) {
                    const Jb = oa.h ? oa.h.getResponseHeader("X-HTTP-Session-Id") : null;
                    Jb ? (h.Fc = Jb, U(h.Na, h.ya, Jb)) : M(h.g, "Missing X_HTTP_SESSION_ID in the handshake response");
                  }
                }
                c.C = 3;
                c.m && c.m.wc();
                c.Kb && (c.Pa = Date.now() - a.Da, c.g.info("Handshake RTT: " + c.Pa + "ms"));
                h = c;
                b = a;
                var q = d = h;
                const Ic = hd(q, q.Ya ? h.Sb : null, h.M);
                q.g.debug("GetBackChannelUri: " + Ic);
                d.oc = Ic;
                if (b.Qa) {
                  h.g.debug("Upgrade the handshake request to a backchannel.");
                  id(h.A, b);
                  d = b;
                  var I = h.cb;
                  I && d.setTimeout(I);
                  d.ra && (Pc(d), Jc(d));
                  h.s = b;
                } else {
                  jd(h);
                }
                0 < c.v.length && kd(c);
              } else {
                "stop" != m[0] && "close" != m[0] || T(c, 7);
              }
            } else {
              3 == c.C && ("stop" == m[0] || "close" == m[0] ? (p && 0 !== p.length && (c.m.Fb(c, p), p.length = 0), "stop" == m[0] ? T(c, 7) : c.disconnect()) : "noop" != m[0] && (p ? p.push(m) : c.m && c.m.uc(m)), c.ta = 0);
            }
          }
          p && 0 !== p.length && c.m.Fb(c, p);
        }
      }
    }
    tc(4);
  } catch (p) {
    L(a.g, "Error in httprequest callback");
  }
}
;function ld(a) {
  this.nc = a.Rd || null;
  this.Xa = a.Md || !1;
  this.va = this.ia = void 0;
}
t(ld, Ob);
ld.prototype.createInstance = function() {
  const a = new md(this.nc, this.Xa);
  this.ia && a.ec(this.ia);
  this.va && a.Vc(this.va);
  return a;
};
ld.prototype.Hc = function(a) {
  return function() {
    return a;
  };
}({});
ld.prototype.ec = function(a) {
  this.ia = a;
};
ld.prototype.Vc = function(a) {
  this.va = a;
};
function md(a, b) {
  z.call(this);
  this.nc = a;
  this.Xa = b;
  this.va = this.ia = void 0;
  this.readyState = nd;
  this.status = 0;
  this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = this.responseXML = null;
  this.bc = new Headers();
  this.Ea = null;
  this.Oc = "GET";
  this.U = "";
  this.S = !1;
  this.j = D(E(), "goog.net.FetchXmlHttp").sb;
  this.ic = this.Ja = this.kb = null;
}
t(md, z);
var nd = 0;
g = md.prototype;
g.open = function(a, b) {
  if (this.readyState != nd) {
    throw this.abort(), Error("Error reopening a connection");
  }
  this.Oc = a;
  this.U = b;
  this.readyState = 1;
  od(this);
};
g.send = function(a) {
  if (1 != this.readyState) {
    throw this.abort(), Error("need to call open() first. ");
  }
  this.S = !0;
  const b = {headers:this.bc, method:this.Oc, credentials:this.ia, cache:this.va};
  a && (b.body = a);
  (this.nc || k).fetch(new Request(this.U, b)).then(this.nd.bind(this), this.lb.bind(this));
};
g.abort = function() {
  this.response = this.responseText = "";
  this.bc = new Headers();
  this.status = 0;
  this.Ja && this.Ja.cancel("Request was aborted.").catch(() => {
    var a = this.j;
    a && F(a, C, "Fetch reader cancellation error.");
  });
  1 <= this.readyState && this.S && 4 != this.readyState && (this.S = !1, pd(this));
  this.readyState = nd;
};
g.nd = function(a) {
  if (this.S && (this.kb = a, this.Ea || (this.status = this.kb.status, this.statusText = this.kb.statusText, this.Ea = a.headers, this.readyState = 2, od(this)), this.S && (this.readyState = 3, od(this), this.S))) {
    if ("arraybuffer" === this.responseType) {
      a.arrayBuffer().then(this.ld.bind(this), this.lb.bind(this));
    } else if ("undefined" !== typeof k.ReadableStream && "body" in a) {
      this.Ja = a.body.getReader();
      if (this.Xa) {
        if (this.responseType) {
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        }
        this.response = [];
      } else {
        this.response = this.responseText = "", this.ic = new TextDecoder();
      }
      qd(this);
    } else {
      a.text().then(this.md.bind(this), this.lb.bind(this));
    }
  }
};
function qd(a) {
  a.Ja.read().then(a.kd.bind(a)).catch(a.lb.bind(a));
}
g.kd = function(a) {
  if (this.S) {
    if (this.Xa && a.value) {
      this.response.push(a.value);
    } else if (!this.Xa) {
      var b = a.value ? a.value : new Uint8Array(0);
      if (b = this.ic.decode(b, {stream:!a.done})) {
        this.response = this.responseText += b;
      }
    }
    a.done ? pd(this) : od(this);
    3 == this.readyState && qd(this);
  }
};
g.md = function(a) {
  this.S && (this.response = this.responseText = a, pd(this));
};
g.ld = function(a) {
  this.S && (this.response = a, pd(this));
};
g.lb = function() {
  var a = this.j;
  a && F(a, C, "Failed to fetch url " + this.U);
  this.S && pd(this);
};
function pd(a) {
  a.readyState = 4;
  a.kb = null;
  a.Ja = null;
  a.ic = null;
  od(a);
}
g.setRequestHeader = function(a, b) {
  this.bc.append(a, b);
};
g.getResponseHeader = function(a) {
  return this.Ea ? this.Ea.get(a.toLowerCase()) || "" : ((a = this.j) && F(a, C, "Attempting to get response header but no headers have been received for url: " + this.U), "");
};
g.getAllResponseHeaders = function() {
  if (!this.Ea) {
    var a = this.j;
    a && F(a, C, "Attempting to get all response headers but no headers have been received for url: " + this.U);
    return "";
  }
  a = [];
  const b = this.Ea.entries();
  for (var c = b.next(); !c.done;) {
    c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
  }
  return a.join("\r\n");
};
g.ec = function(a) {
  this.ia = a;
};
g.Vc = function(a) {
  this.va = a;
};
function od(a) {
  a.onreadystatechange && a.onreadystatechange.call(a);
}
Object.defineProperty(md.prototype, "withCredentials", {get:function() {
  return "include" === this.ia;
}, set:function(a) {
  this.ec(a ? "include" : "same-origin");
}});
var rd = class {
  constructor(a, b) {
    this.Xb = a;
    this.map = b;
    this.context = null;
  }
};
function sd(a) {
  this.Nc = a || td;
  k.PerformanceNavigationTiming ? (a = k.performance.getEntriesByType("navigation"), a = 0 < a.length && ("hq" == a[0].nextHopProtocol || "h2" == a[0].nextHopProtocol)) : a = !!(k.Hb && k.Hb.Mc && k.Hb.Mc() && k.Hb.Mc().Qd);
  this.tb = a ? this.Nc : 1;
  this.u = null;
  1 < this.tb && (this.u = new Set());
  this.D = null;
  this.T = [];
}
var td = 10;
sd.prototype.Ub = function() {
  return this.D ? !0 : this.u ? this.u.size >= this.tb : !1;
};
function fd(a) {
  return a.D ? 1 : a.u ? a.u.size : 0;
}
function bd(a, b) {
  return a.D ? a.D == b : a.u ? a.u.has(b) : !1;
}
function gd(a, b) {
  a.u ? a.u.add(b) : a.D = b;
}
function id(a, b) {
  a.D && a.D == b ? a.D = null : a.u && a.u.has(b) && a.u.delete(b);
}
sd.prototype.cancel = function() {
  this.T = this.aa();
  if (this.D) {
    this.D.cancel(), this.D = null;
  } else {
    if (this.u && 0 !== this.u.size) {
      for (const a of this.u.values()) {
        a.cancel();
      }
      this.u.clear();
    }
  }
};
sd.prototype.aa = function() {
  if (null != this.D) {
    return this.T.concat(this.D.aa());
  }
  if (null != this.u && 0 !== this.u.size) {
    let a = this.T;
    for (const b of this.u.values()) {
      a = a.concat(b.aa());
    }
    return a;
  }
  return ta(this.T);
};
function ud(a, b) {
  a.T = a.T.concat(b);
}
;function vd(a) {
  if (a.la && "function" == typeof a.la) {
    return a.la();
  }
  if ("undefined" !== typeof Map && a instanceof Map || "undefined" !== typeof Set && a instanceof Set) {
    return Array.from(a.values());
  }
  if ("string" === typeof a) {
    return a.split("");
  }
  if (ca(a)) {
    for (var b = [], c = a.length, d = 0; d < c; d++) {
      b.push(a[d]);
    }
    return b;
  }
  b = [];
  c = 0;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
}
function wd(a) {
  if (a.Pb && "function" == typeof a.Pb) {
    return a.Pb();
  }
  if (!a.la || "function" != typeof a.la) {
    if ("undefined" !== typeof Map && a instanceof Map) {
      return Array.from(a.keys());
    }
    if (!("undefined" !== typeof Set && a instanceof Set)) {
      if (ca(a) || "string" === typeof a) {
        var b = [];
        a = a.length;
        for (var c = 0; c < a; c++) {
          b.push(c);
        }
        return b;
      }
      b = [];
      c = 0;
      for (const d in a) {
        b[c++] = d;
      }
      return b;
    }
  }
}
function xd(a, b, c) {
  if (a.forEach && "function" == typeof a.forEach) {
    a.forEach(b, c);
  } else if (ca(a) || "string" === typeof a) {
    Array.prototype.forEach.call(a, b, c);
  } else {
    for (var d = wd(a), e = vd(a), f = e.length, h = 0; h < f; h++) {
      b.call(c, e[h], d && d[h], a);
    }
  }
}
;var yd = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
function zd(a, b) {
  if (a) {
    a = a.split("&");
    for (var c = 0; c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else {
        f = a[c];
      }
      b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
    }
  }
}
;function V(a) {
  this.V = this.qa = this.da = "";
  this.na = null;
  this.ka = this.M = "";
  this.L = this.rd = !1;
  if (a instanceof V) {
    this.L = a.L;
    Ad(this, a.da);
    var b = a.qa;
    P(this);
    this.qa = b;
    Bd(this, a.V);
    Cd(this, a.na);
    Dd(this, a.M);
    Ed(this, a.I.clone());
    a = a.ka;
    P(this);
    this.ka = a;
  } else {
    a && (b = String(a).match(yd)) ? (this.L = !1, Ad(this, b[1] || "", !0), a = b[2] || "", P(this), this.qa = Fd(a), Bd(this, b[3] || "", !0), Cd(this, b[4]), Dd(this, b[5] || "", !0), Ed(this, b[6] || "", !0), a = b[7] || "", P(this), this.ka = Fd(a)) : (this.L = !1, this.I = new Gd(null, this.L));
  }
}
g = V.prototype;
g.toString = function() {
  var a = [], b = this.da;
  b && a.push(Hd(b, Id, !0), ":");
  var c = this.V;
  if (c || "file" == b) {
    a.push("//"), (b = this.qa) && a.push(Hd(b, Id, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.na, null != c && a.push(":", String(c));
  }
  if (c = this.M) {
    this.V && "/" != c.charAt(0) && a.push("/"), a.push(Hd(c, "/" == c.charAt(0) ? Jd : Kd, !0));
  }
  (c = this.I.toString()) && a.push("?", c);
  (c = this.ka) && a.push("#", Hd(c, Ld));
  return a.join("");
};
g.resolve = function(a) {
  var b = this.clone(), c = !!a.da;
  c ? Ad(b, a.da) : c = !!a.qa;
  if (c) {
    var d = a.qa;
    P(b);
    b.qa = d;
  } else {
    c = !!a.V;
  }
  c ? Bd(b, a.V) : c = null != a.na;
  d = a.M;
  if (c) {
    Cd(b, a.na);
  } else {
    if (c = !!a.M) {
      if ("/" != d.charAt(0)) {
        if (this.V && !this.M) {
          d = "/" + d;
        } else {
          var e = b.M.lastIndexOf("/");
          -1 != e && (d = b.M.slice(0, e + 1) + d);
        }
      }
      e = d;
      if (".." == e || "." == e) {
        d = "";
      } else {
        if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
          d = 0 == e.lastIndexOf("/", 0);
          e = e.split("/");
          for (var f = [], h = 0; h < e.length;) {
            var l = e[h++];
            "." == l ? d && h == e.length && f.push("") : ".." == l ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(), d && h == e.length && f.push("")) : (f.push(l), d = !0);
          }
          d = f.join("/");
        } else {
          d = e;
        }
      }
    }
  }
  c ? Dd(b, d) : c = "" !== a.I.toString();
  c ? Ed(b, a.I.clone()) : c = !!a.ka;
  c && (a = a.ka, P(b), b.ka = a);
  return b;
};
g.clone = function() {
  return new V(this);
};
function Ad(a, b, c) {
  P(a);
  a.da = c ? Fd(b, !0) : b;
  a.da && (a.da = a.da.replace(/:$/, ""));
}
function Bd(a, b, c) {
  P(a);
  a.V = c ? Fd(b, !0) : b;
}
function Cd(a, b) {
  P(a);
  if (b) {
    b = Number(b);
    if (isNaN(b) || 0 > b) {
      throw Error("Bad port number " + b);
    }
    a.na = b;
  } else {
    a.na = null;
  }
}
function Dd(a, b, c) {
  P(a);
  a.M = c ? Fd(b, !0) : b;
}
function Ed(a, b, c) {
  P(a);
  b instanceof Gd ? (a.I = b, a.I.fc(a.L)) : (c || (b = Hd(b, Md)), a.I = new Gd(b, a.L));
}
g.getQuery = function() {
  return this.I.toString();
};
function U(a, b, c) {
  P(a);
  a.I.set(b, c);
}
function Gc(a) {
  P(a);
  U(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
  return a;
}
g.removeParameter = function(a) {
  P(this);
  this.I.remove(a);
  return this;
};
function P(a) {
  if (a.rd) {
    throw Error("Tried to modify a read-only Uri");
  }
}
g.fc = function(a) {
  this.L = a;
  this.I && this.I.fc(a);
};
function Fd(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
}
function Hd(a, b, c) {
  return "string" === typeof a ? (a = encodeURI(a).replace(b, Nd), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
}
function Nd(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
}
var Id = /[#\/\?@]/g, Kd = /[#\?:]/g, Jd = /[#\?]/g, Md = /[#\?@]/g, Ld = /#/g;
function Gd(a, b) {
  this.F = this.o = null;
  this.H = a || null;
  this.L = !!b;
}
function W(a) {
  a.o || (a.o = new Map(), a.F = 0, a.H && zd(a.H, function(b, c) {
    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
  }));
}
g = Gd.prototype;
g.add = function(a, b) {
  W(this);
  this.H = null;
  a = Od(this, a);
  var c = this.o.get(a);
  c || this.o.set(a, c = []);
  c.push(b);
  this.F += 1;
  return this;
};
g.remove = function(a) {
  W(this);
  a = Od(this, a);
  return this.o.has(a) ? (this.H = null, this.F -= this.o.get(a).length, this.o.delete(a)) : !1;
};
g.clear = function() {
  this.o = this.H = null;
  this.F = 0;
};
function Pd(a, b) {
  W(a);
  b = Od(a, b);
  return a.o.has(b);
}
g.forEach = function(a, b) {
  W(this);
  this.o.forEach(function(c, d) {
    c.forEach(function(e) {
      a.call(b, e, d, this);
    }, this);
  }, this);
};
g.Pb = function() {
  W(this);
  const a = Array.from(this.o.values()), b = Array.from(this.o.keys()), c = [];
  for (let d = 0; d < b.length; d++) {
    const e = a[d];
    for (let f = 0; f < e.length; f++) {
      c.push(b[d]);
    }
  }
  return c;
};
g.la = function(a) {
  W(this);
  let b = [];
  if ("string" === typeof a) {
    Pd(this, a) && (b = b.concat(this.o.get(Od(this, a))));
  } else {
    a = Array.from(this.o.values());
    for (let c = 0; c < a.length; c++) {
      b = b.concat(a[c]);
    }
  }
  return b;
};
g.set = function(a, b) {
  W(this);
  this.H = null;
  a = Od(this, a);
  Pd(this, a) && (this.F -= this.o.get(a).length);
  this.o.set(a, [b]);
  this.F += 1;
  return this;
};
g.get = function(a, b) {
  if (!a) {
    return b;
  }
  a = this.la(a);
  return 0 < a.length ? String(a[0]) : b;
};
function Kc(a, b, c) {
  a.remove(b);
  0 < c.length && (a.H = null, a.o.set(Od(a, b), ta(c)), a.F += c.length);
}
g.toString = function() {
  if (this.H) {
    return this.H;
  }
  if (!this.o) {
    return "";
  }
  const a = [], b = Array.from(this.o.keys());
  for (var c = 0; c < b.length; c++) {
    var d = b[c];
    const f = encodeURIComponent(String(d)), h = this.la(d);
    for (d = 0; d < h.length; d++) {
      var e = f;
      "" !== h[d] && (e += "=" + encodeURIComponent(String(h[d])));
      a.push(e);
    }
  }
  return this.H = a.join("&");
};
g.clone = function() {
  var a = new Gd();
  a.H = this.H;
  this.o && (a.o = new Map(this.o), a.F = this.F);
  return a;
};
function Od(a, b) {
  b = String(b);
  a.L && (b = b.toLowerCase());
  return b;
}
g.fc = function(a) {
  a && !this.L && (W(this), this.H = null, this.o.forEach(function(b, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), Kc(this, d, b));
  }, this));
  this.L = a;
};
g.extend = function(a) {
  for (var b = 0; b < arguments.length; b++) {
    xd(arguments[b], function(c, d) {
      this.add(d, c);
    }, this);
  }
};
var Qd = class {
  constructor() {
    this.Jd = this.Gd = void 0;
  }
  stringify(a) {
    return k.JSON.stringify(a, this.Gd);
  }
  parse(a) {
    return k.JSON.parse(a, this.Jd);
  }
};
function Rd() {
  this.Tc = new Qd();
}
;function Sd(a) {
  z.call(this);
  this.headers = new Map();
  this.sa = a || null;
  this.Z = !1;
  this.Cb = this.h = null;
  this.Ic = this.qb = "";
  this.Aa = 0;
  this.B = "";
  this.ma = this.Tb = this.ob = this.Lb = !1;
  this.Za = 0;
  this.zb = null;
  this.yb = Td;
  this.Ab = this.Ed = this.mc = !1;
  this.jc = null;
}
t(Sd, z);
var Td = "";
Sd.prototype.j = D(E(), "goog.net.XhrIo").sb;
var Ud = /^https?$/i, Vd = ["POST", "PUT"];
g = Sd.prototype;
g.setTrustToken = function(a) {
  this.jc = a;
};
g.send = function(a, b, c, d) {
  if (this.h) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.qb + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.qb = a;
  this.B = "";
  this.Aa = 0;
  this.Ic = b;
  this.Lb = !1;
  this.Z = !0;
  this.h = this.sa ? this.sa.createInstance() : kc.createInstance();
  this.Cb = this.sa ? this.sa.getOptions() : kc.getOptions();
  this.h.onreadystatechange = r(this.Qc, this);
  this.Ed && "onprogress" in this.h && (this.h.onprogress = r(function(f) {
    this.Pc(f, !0);
  }, this), this.h.upload && (this.h.upload.onprogress = r(this.Pc, this)));
  try {
    H(this.j, X(this, "Opening Xhr")), this.Tb = !0, this.h.open(b, String(a), !0), this.Tb = !1;
  } catch (f) {
    H(this.j, X(this, "Error opening Xhr: " + f.message));
    Wd(this, f);
    return;
  }
  a = c || "";
  c = new Map(this.headers);
  if (d) {
    if (Object.getPrototypeOf(d) === Object.prototype) {
      for (var e in d) {
        c.set(e, d[e]);
      }
    } else if ("function" === typeof d.keys && "function" === typeof d.get) {
      for (const f of d.keys()) {
        c.set(f, d.get(f));
      }
    } else {
      throw Error("Unknown input type for opt_headers: " + String(d));
    }
  }
  d = Array.from(c.keys()).find(f => "content-type" == f.toLowerCase());
  e = k.FormData && a instanceof k.FormData;
  !(0 <= Array.prototype.indexOf.call(Vd, b, void 0)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  for (const [f, h] of c) {
    this.h.setRequestHeader(f, h);
  }
  this.yb && (this.h.responseType = this.yb);
  "withCredentials" in this.h && this.h.withCredentials !== this.mc && (this.h.withCredentials = this.mc);
  if ("setTrustToken" in this.h && this.jc) {
    try {
      this.h.setTrustToken(this.jc);
    } catch (f) {
      H(this.j, X(this, "Error SetTrustToken: " + f.message));
    }
  }
  try {
    Xd(this), 0 < this.Za && (this.Ab = Yd(this.h), H(this.j, X(this, "Will abort after " + this.Za + "ms if incomplete, xhr2 " + this.Ab)), this.Ab ? (this.h.timeout = this.Za, this.h.ontimeout = r(this.Ga, this)) : this.zb = Lb(this.Ga, this.Za, this)), H(this.j, X(this, "Sending request")), this.ob = !0, this.h.send(a), this.ob = !1;
  } catch (f) {
    H(this.j, X(this, "Send error: " + f.message)), Wd(this, f);
  }
};
function Yd(a) {
  return Aa && "number" === typeof a.timeout && void 0 !== a.ontimeout;
}
g.Ga = function() {
  "undefined" != typeof ba && this.h && (this.B = "Timed out after " + this.Za + "ms, aborting", this.Aa = 8, H(this.j, X(this, this.B)), this.dispatchEvent("timeout"), this.abort(8));
};
function Wd(a, b) {
  a.Z = !1;
  a.h && (a.ma = !0, a.h.abort(), a.ma = !1);
  a.B = b;
  a.Aa = 5;
  Zd(a);
  $d(a);
}
function Zd(a) {
  a.Lb || (a.Lb = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"));
}
g.abort = function(a) {
  this.h && this.Z && (H(this.j, X(this, "Aborting")), this.Z = !1, this.ma = !0, this.h.abort(), this.ma = !1, this.Aa = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), $d(this));
};
g.O = function() {
  this.h && (this.Z && (this.Z = !1, this.ma = !0, this.h.abort(), this.ma = !1), $d(this, !0));
  Sd.oa.O.call(this);
};
g.Qc = function() {
  this.wa || (this.Tb || this.ob || this.ma ? ae(this) : this.yd());
};
g.yd = function() {
  ae(this);
};
function ae(a) {
  if (a.Z && "undefined" != typeof ba) {
    if (a.Cb[1] && 4 == Q(a) && 2 == R(a)) {
      H(a.j, X(a, "Local request error detected and ignored"));
    } else {
      if (a.ob && 4 == Q(a)) {
        Lb(a.Qc, 0, a);
      } else {
        if (a.dispatchEvent("readystatechange"), 4 == Q(a)) {
          H(a.j, X(a, "Request complete"));
          a.Z = !1;
          try {
            const h = R(a);
            a: {
              switch(h) {
                case 200:
                case 201:
                case 202:
                case 204:
                case 206:
                case 304:
                case 1223:
                  var b = !0;
                  break a;
                default:
                  b = !1;
              }
            }
            var c;
            if (!(c = b)) {
              var d;
              if (d = 0 === h) {
                var e = String(a.qb).match(yd)[1] || null;
                !e && k.self && k.self.location && (e = k.self.location.protocol.slice(0, -1));
                d = !Ud.test(e ? e.toLowerCase() : "");
              }
              c = d;
            }
            if (c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success");
            } else {
              a.Aa = 6;
              try {
                var f = 2 < Q(a) ? a.h.statusText : "";
              } catch (l) {
                H(a.j, "Can not get status: " + l.message), f = "";
              }
              a.B = f + " [" + R(a) + "]";
              Zd(a);
            }
          } finally {
            $d(a);
          }
        }
      }
    }
  }
}
g.Pc = function(a, b) {
  this.dispatchEvent(be(a, "progress"));
  this.dispatchEvent(be(a, b ? "downloadprogress" : "uploadprogress"));
};
function be(a, b) {
  return {type:b, lengthComputable:a.lengthComputable, loaded:a.loaded, total:a.total};
}
function $d(a, b) {
  if (a.h) {
    Xd(a);
    const c = a.h, d = a.Cb[0] ? () => {
    } : null;
    a.h = null;
    a.Cb = null;
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d;
    } catch (e) {
      fc(a.j, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
}
function Xd(a) {
  a.h && a.Ab && (a.h.ontimeout = null);
  a.zb && (k.clearTimeout(a.zb), a.zb = null);
}
g.isActive = function() {
  return !!this.h;
};
function Q(a) {
  return a.h ? a.h.readyState : 0;
}
function R(a) {
  try {
    return 2 < Q(a) ? a.h.status : -1;
  } catch (b) {
    return -1;
  }
}
function Oc(a) {
  try {
    return a.h ? a.h.responseText : "";
  } catch (b) {
    return H(a.j, "Can not get responseText: " + b.message), "";
  }
}
function Yc(a) {
  try {
    if (!a.h) {
      return null;
    }
    if ("response" in a.h) {
      return a.h.response;
    }
    switch(a.yb) {
      case Td:
      case "text":
        return a.h.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.h) {
          return a.h.mozResponseArrayBuffer;
        }
    }
    fc(a.j, "Response type " + a.yb + " is not supported on this browser");
    return null;
  } catch (b) {
    return H(a.j, "Can not get response: " + b.message), null;
  }
}
g.getResponseHeader = function(a) {
  if (this.h && 4 == Q(this)) {
    return a = this.h.getResponseHeader(a), null === a ? void 0 : a;
  }
};
g.getAllResponseHeaders = function() {
  return this.h && 2 <= Q(this) ? this.h.getAllResponseHeaders() || "" : "";
};
function Wc(a) {
  const b = {};
  a = a.getAllResponseHeaders().split("\r\n");
  for (let d = 0; d < a.length; d++) {
    if (xa(a[d])) {
      continue;
    }
    var c = xb(a[d]);
    const e = c[0];
    c = c[1];
    if ("string" !== typeof c) {
      continue;
    }
    c = c.trim();
    const f = b[e] || [];
    b[e] = f;
    f.push(c);
  }
  Ka(b, function(d) {
    return d.join(", ");
  });
}
g.Ec = function() {
  return "string" === typeof this.B ? this.B : String(this.B);
};
function X(a, b) {
  return b + " [" + a.Ic + " " + a.qb + " " + R(a) + "]";
}
;function ce(a) {
  let b = "";
  Ja(a, function(c, d) {
    b += d;
    b += ":";
    b += c;
    b += "\r\n";
  });
  return b;
}
function de(a, b, c) {
  a: {
    for (d in c) {
      var d = !1;
      break a;
    }
    d = !0;
  }
  d || (c = ce(c), "string" === typeof a ? (encodeURIComponent(String(b)), null != c && encodeURIComponent(String(c))) : U(a, b, c));
}
;function ee(a, b) {
  const c = new J();
  c.debug("TestLoadImage: loading " + a);
  if (k.Image) {
    const d = new Image();
    d.onload = ja(Y, c, "TestLoadImage: loaded", !0, b, d);
    d.onerror = ja(Y, c, "TestLoadImage: error", !1, b, d);
    d.onabort = ja(Y, c, "TestLoadImage: abort", !1, b, d);
    d.ontimeout = ja(Y, c, "TestLoadImage: timeout", !1, b, d);
    k.setTimeout(function() {
      if (d.ontimeout) {
        d.ontimeout();
      }
    }, 10000);
    d.src = a;
  } else {
    b(!1);
  }
}
function fe(a, b) {
  const c = new J(), d = new AbortController(), e = setTimeout(() => {
    d.abort();
    Y(c, "TestPingServer: timeout", !1, b);
  }, 10000);
  fetch(a, {signal:d.signal}).then(f => {
    clearTimeout(e);
    f.ok ? Y(c, "TestPingServer: ok", !0, b) : Y(c, "TestPingServer: server error", !1, b);
  }).catch(() => {
    clearTimeout(e);
    Y(c, "TestPingServer: error", !1, b);
  });
}
function Y(a, b, c, d, e) {
  try {
    a.debug(b), e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
  } catch (f) {
    L(a);
  }
}
;function ge(a, b, c) {
  return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
}
function he(a) {
  this.xc = 22;
  this.Uc = 0;
  this.v = [];
  this.g = new J();
  this.Sb = this.oc = this.Na = this.M = this.s = this.Fc = this.ya = this.Ma = this.R = this.pb = this.J = null;
  this.ad = !0;
  this.vd = this.ub = 0;
  this.gd = ge("failFast", !1, a);
  this.Ka = this.ja = this.$ = this.P = this.m = null;
  this.Db = !0;
  this.Mb = this.Jc = this.X = -1;
  this.Eb = this.ta = this.xa = 0;
  this.cd = ge("baseRetryDelayMs", 5E3, a);
  this.Id = ge("retryDelaySeedMs", 1E4, a);
  this.jd = ge("forwardChannelMaxRetries", 2, a);
  this.Dc = ge("forwardChannelRequestTimeoutMs", 2E4, a);
  this.sa = a && a.xmlHttpFactory || void 0;
  this.ud = a && a.networkTestUrl || void 0;
  this.Xc = a && a.useFetchStreams || !1;
  this.cb = void 0;
  this.Ca = 0;
  this.Ya = a && a.supportsCrossDomainXhr || !1;
  this.ea = "";
  this.A = new sd(a && a.concurrentRequestLimit);
  this.Ra = Math.min(a && a.maxMessagesPerRequest || 1000, 1000);
  this.Yc = new Rd();
  this.jb = a && a.fastHandshake || !1;
  this.ib = a && a.encodeInitMessageHeaders || !1;
  this.jb && this.ib && (M(this.g, "Ignore encodeInitMessageHeaders because fastHandshake is set."), this.ib = !1);
  this.dd = a && a.blockingHandshake || !1;
  a && a.disableRedact && this.g.disableRedact();
  a && a.forceLongPolling && (this.Db = !1);
  this.Kb = !this.jb && this.Db && a && a.detectBufferingProxy || !1;
  this.Wb = void 0;
  a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.Wb = a.longPollingTimeout);
  this.Ob = void 0;
  this.Pa = 0;
  this.eb = !1;
  this.ua = null;
  this.fd = !1;
  this.Zb = null;
}
g = he.prototype;
g.Gb = 8;
g.C = 1;
g.connect = function(a, b, c, d) {
  this.g.debug("connect()");
  this.fd && (this.g.info("Origin Trials enabled."), Gb(r(this.Kd, this, a)));
  O(0);
  this.M = a;
  this.Ma = b || {};
  c && void 0 !== d && (this.Ma.OSID = c, this.Ma.OAID = d);
  this.Ka = this.Db;
  this.g.debug("connectChannel_()");
  a = hd(this, null, this.M);
  this.g.debug("GetForwardChannelUri: " + a);
  this.Na = a;
  kd(this);
};
g.disconnect = function() {
  this.g.debug("disconnect()");
  ie(this);
  if (3 == this.C) {
    var a = this.ub++, b = this.Na.clone();
    U(b, "SID", this.ea);
    U(b, "RID", a);
    U(b, "TYPE", "terminate");
    je(this, b);
    a = new zc(this, this.g, this.ea, a);
    a.ab = 2;
    a.ha = Gc(b.clone());
    b = !1;
    if (k.navigator && k.navigator.sendBeacon) {
      try {
        b = k.navigator.sendBeacon(a.ha.toString(), "");
      } catch {
      }
    }
    !b && k.Image && ((new Image()).src = a.ha, b = !0);
    b || (a.l = Lc(a.i, null), a.l.send(a.ha));
    a.Da = Date.now();
    Jc(a);
  }
  ke(this);
};
g.Kd = function(a) {
  try {
    pc(a, () => {
      L(this.g, "Error in running origin trials");
    }), this.g.info("Origin Trials invoked: " + a);
  } catch (b) {
    L(this.g, "Error in running origin trials");
  }
};
function dd(a) {
  a.s && ($c(a), a.s.cancel(), a.s = null);
}
function ie(a) {
  dd(a);
  a.$ && (k.clearTimeout(a.$), a.$ = null);
  cd(a);
  a.A.cancel();
  a.P && ("number" === typeof a.P && k.clearTimeout(a.P), a.P = null);
}
g.Wa = function(a) {
  this.J = a;
};
g.Wc = function(a) {
  this.Ca = a;
};
function le(a, b) {
  a.v.length == a.Ra && N(a.g, () => "Already have " + a.Ra + " queued maps upon queueing " + Sb(b));
  a.v.push(new rd(a.vd++, b));
  3 == a.C && kd(a);
}
g.getState = function() {
  return this.C;
};
g.Qb = function() {
  return this.Mb;
};
function kd(a) {
  a.A.Ub() || a.P || (a.P = !0, Gb(a.Sc, a), a.xa = 0);
}
function me(a, b) {
  if (fd(a.A) >= a.A.tb - (a.P ? 1 : 0)) {
    return N(a.g, "Unexpected retry request is scheduled."), !1;
  }
  if (a.P) {
    return a.g.debug("Use the retry request that is already scheduled."), a.v = b.aa().concat(a.v), !0;
  }
  if (1 == a.C || 2 == a.C || a.xa >= (a.gd ? 0 : a.jd)) {
    return !1;
  }
  a.g.debug("Going to retry POST");
  a.P = yc(r(a.Sc, a, b), ne(a, a.xa));
  a.xa++;
  return !0;
}
g.Sc = function(a) {
  if (this.P) {
    if (this.P = null, this.g.debug("startForwardChannel_"), 1 == this.C) {
      if (a) {
        N(this.g, "Not supposed to retry the open");
      } else {
        this.g.debug("open_()");
        this.ub = Math.floor(100000 * Math.random());
        a = this.ub++;
        const e = new zc(this, this.g, "", a);
        let f = this.J;
        this.pb && (f ? (f = La(f), Na(f, this.pb)) : f = this.pb);
        null !== this.R || this.ib || (e.Wa(f), f = null);
        if (this.jb) {
          a: {
            var b = 0;
            for (var c = 0; c < this.v.length; c++) {
              b: {
                var d = this.v[c];
                if ("__data__" in d.map && (d = d.map.__data__, "string" === typeof d)) {
                  d = d.length;
                  break b;
                }
                d = void 0;
              }
              if (void 0 === d) {
                break;
              }
              b += d;
              if (4096 < b) {
                b = c;
                break a;
              }
              if (4096 === b || c === this.v.length - 1) {
                b = c + 1;
                break a;
              }
            }
            b = this.Ra;
          }
        } else {
          b = this.Ra;
        }
        b = oe(this, e, b);
        c = this.Na.clone();
        U(c, "RID", a);
        0 < this.xc && U(c, "CVER", this.xc);
        this.ya && U(c, "X-HTTP-Session-Id", this.ya);
        je(this, c);
        f && (this.ib ? b = "headers=" + encodeURIComponent(String(ce(f))) + "&" + b : this.R && de(c, this.R, f));
        gd(this.A, e);
        this.dd && U(c, "TYPE", "init");
        this.jb ? (U(c, "$req", b), U(c, "SID", "null"), e.Ac = !0, Fc(e, c, null)) : Fc(e, c, b);
        this.C = 2;
      }
    } else {
      3 == this.C && (a ? pe(this, a) : 0 == this.v.length ? this.g.debug("startForwardChannel_ returned: nothing to send") : this.A.Ub() ? N(this.g, "startForwardChannel_ returned: connection already in progress") : (pe(this), this.g.debug("startForwardChannel_ finished, sent request")));
    }
  }
};
function pe(a, b) {
  var c = b ? b.N : a.ub++;
  const d = a.Na.clone();
  U(d, "SID", a.ea);
  U(d, "RID", c);
  U(d, "AID", a.X);
  je(a, d);
  a.R && a.J && de(d, a.R, a.J);
  c = new zc(a, a.g, a.ea, c, a.xa + 1);
  null === a.R && c.Wa(a.J);
  b && (a.v = b.aa().concat(a.v));
  b = oe(a, c, a.Ra);
  c.setTimeout(Math.round(0.50 * a.Dc) + Math.round(0.50 * a.Dc * Math.random()));
  gd(a.A, c);
  Fc(c, d, b);
}
function je(a, b) {
  a.Ma && Ja(a.Ma, function(c, d) {
    U(b, d, c);
  });
  a.m && Ja({}, function(c, d) {
    U(b, d, c);
  });
}
function oe(a, b, c) {
  c = Math.min(a.v.length, c);
  const d = a.m ? r(a.m.bd, a.m, a) : null;
  a: {
    var e = a.v;
    let l = -1;
    for (;;) {
      const q = ["count=" + c];
      -1 == l ? 0 < c ? (l = e[0].Xb, q.push("ofs=" + l)) : l = 0 : q.push("ofs=" + l);
      let I = !0;
      for (let p = 0; p < c; p++) {
        var f = e[p].Xb;
        const m = e[p].map;
        f -= l;
        if (0 > f) {
          l = Math.max(0, e[p].Xb - 100), I = !1;
        } else {
          try {
            f = "req" + f + "_" || "";
            try {
              var h = m instanceof Map ? m : Object.entries(m);
              for (const [G, aa] of h) {
                let na = aa;
                n(aa) && (na = Sb(aa));
                q.push(f + G + "=" + encodeURIComponent(na));
              }
            } catch (G) {
              throw q.push(f + "type=" + encodeURIComponent("_badmap")), G;
            }
          } catch (G) {
            d && d(m);
          }
        }
      }
      if (I) {
        h = q.join("&");
        break a;
      }
    }
  }
  a = a.v.splice(0, c);
  b.T = a;
  return h;
}
function jd(a) {
  a.s || a.$ || (a.Eb = 1, Gb(a.Rc, a), a.ta = 0);
}
function ed(a) {
  if (a.s || a.$) {
    return N(a.g, "Request already in progress"), !1;
  }
  if (3 <= a.ta) {
    return !1;
  }
  a.g.debug("Going to retry GET");
  a.Eb++;
  a.$ = yc(r(a.Rc, a), ne(a, a.ta));
  a.ta++;
  return !0;
}
g.Rc = function() {
  this.$ = null;
  qe(this);
  if (this.Kb && !this.eb) {
    if (null == this.s || 0 >= this.Pa) {
      M(this.g, "Skip bpDetectionTimerId_ " + this.s + " " + this.Pa);
    } else {
      var a = 4 * this.Pa;
      this.g.info("BP detection timer enabled: " + a);
      this.ua = yc(r(this.xd, this), a);
    }
  }
};
g.xd = function() {
  if (this.ua) {
    this.ua = null;
    this.g.info("BP detection timeout reached.");
    if (null != this.s.l) {
      const a = Oc(this.s.l);
      a && M(this.g, "Timer should have been cancelled : " + a);
    }
    this.g.info("Buffering proxy detected and switch to long-polling!");
    this.Ka = !1;
    this.eb = !0;
    O(10);
    dd(this);
    qe(this);
  } else {
    M(this.g, "Invalid operation.");
  }
};
function $c(a) {
  null != a.ua && (a.g.debug("Cancel the BP detection timer."), k.clearTimeout(a.ua), a.ua = null);
}
function qe(a) {
  a.g.debug("Creating new HttpRequest");
  a.s = new zc(a, a.g, a.ea, "rpc", a.Eb);
  null === a.R && a.s.Wa(a.J);
  a.s.Wc(a.Ca);
  var b = a.oc.clone();
  U(b, "RID", "rpc");
  U(b, "SID", a.ea);
  U(b, "AID", a.X);
  U(b, "CI", a.Ka ? "0" : "1");
  !a.Ka && a.Wb && U(b, "TO", a.Wb);
  U(b, "TYPE", "xmlhttp");
  je(a, b);
  a.R && a.J && de(b, a.R, a.J);
  a.cb && a.s.setTimeout(a.cb);
  var c = a.s, d = a.Sb;
  c.ab = 1;
  c.ha = Gc(b.clone());
  c.ba = null;
  c.Jb = !0;
  Hc(c, d);
  a.g.debug("New Request created");
}
g.Ib = function(a) {
  return this.ad ? this.m ? this.m.Ib(a) : a : null;
};
g.wd = function() {
  null != this.ja && (this.ja = null, dd(this), ed(this), O(19));
};
function cd(a) {
  null != a.ja && (k.clearTimeout(a.ja), a.ja = null);
}
function Vc(a, b) {
  a.g.debug("Request complete");
  let c, d = null;
  if (a.s == b) {
    cd(a), $c(a), a.s = null, c = 2;
  } else if (bd(a.A, b)) {
    d = b.aa(), id(a.A, b), c = 1;
  } else {
    return;
  }
  if (0 != a.C) {
    if (b.Y) {
      1 == c ? (xc(b.ba ? b.ba.length : 0, Date.now() - b.Da, a.xa), kd(a)) : jd(a);
    } else {
      var e = b.Qb(), f = b.Ec();
      if (3 == f || 0 == f && 0 < e) {
        a.g.debug("Not retrying due to error type"), 200 < e && (a.Mb = b.Qb());
      } else {
        a.g.debug(function() {
          return "Maybe retrying, last error: " + Cc(f, a.Mb);
        });
        if (1 == c && me(a, b) || 2 == c && ed(a)) {
          return;
        }
        a.g.debug("Exceeded max number of retries");
      }
      d && 0 < d.length && ud(a.A, d);
      a.g.debug("Error: HTTP request failed");
      switch(f) {
        case 1:
          T(a, 5);
          break;
        case 4:
          T(a, 10);
          break;
        case 3:
          T(a, 6);
          break;
        default:
          T(a, 2);
      }
    }
  }
}
function ne(a, b) {
  let c = a.cd + Math.floor(Math.random() * a.Id);
  a.isActive() || (a.g.debug("Inactive channel"), c *= 2);
  return c * b;
}
function T(a, b) {
  a.g.info("Error code " + b);
  if (2 == b) {
    var c = r(a.Od, a), d = a.ud;
    const e = !d;
    d = new V(d || "//www.google.com/images/cleardot.gif");
    k.location && "http" == k.location.protocol || Ad(d, "https");
    Gc(d);
    e ? ee(d.toString(), c) : fe(d.toString(), c);
  } else {
    O(2);
  }
  a.g.debug("HttpChannel: error - " + b);
  a.C = 0;
  a.m && a.m.tc(b);
  ke(a);
  ie(a);
}
g.Od = function(a) {
  a ? (this.g.info("Successfully pinged google.com"), O(2)) : (this.g.info("Failed to ping google.com"), O(1));
};
function ke(a) {
  a.C = 0;
  a.Zb = [];
  if (a.m) {
    const b = a.A.aa();
    if (0 != b.length || 0 != a.v.length) {
      a.g.debug(() => "Number of undelivered maps, pending: " + b.length + ", outgoing: " + a.v.length), ua(a.Zb, b), ua(a.Zb, a.v), a.A.T.length = 0, ta(a.v), a.v.length = 0;
    }
    a.m.sc();
  }
}
function hd(a, b, c) {
  var d = c instanceof V ? c.clone() : new V(c);
  if ("" != d.V) {
    b && Bd(d, b + "." + d.V), Cd(d, d.na);
  } else {
    var e = k.location;
    d = e.protocol;
    b = b ? b + "." + e.hostname : e.hostname;
    e = +e.port;
    var f = new V(null);
    d && Ad(f, d);
    b && Bd(f, b);
    e && Cd(f, e);
    c && Dd(f, c);
    d = f;
  }
  c = a.ya;
  b = a.Fc;
  c && b && U(d, c, b);
  U(d, "VER", a.Gb);
  je(a, d);
  return d;
}
function Lc(a, b, c) {
  if (b && !a.Ya) {
    throw Error("Can't create secondary domain capable XhrIo object.");
  }
  b = a.Xc && !a.sa ? new Sd(new ld({Md:c})) : new Sd(a.sa);
  b.mc = a.Ya;
  return b;
}
g.isActive = function() {
  return !!this.m && this.m.isActive(this);
};
function re() {
}
g = re.prototype;
g.Fb = null;
g.wc = function() {
};
g.uc = function() {
};
g.tc = function() {
};
g.sc = function() {
};
g.isActive = function() {
  return !0;
};
g.bd = function() {
};
g.Ib = function(a) {
  return a;
};
function se() {
}
se.prototype.yc = function(a, b) {
  return new Z(a, b);
};
function Z(a, b) {
  z.call(this);
  this.i = new he(b);
  this.U = a;
  this.j = D(E(), "goog.labs.net.webChannel.WebChannelBaseTransport").sb;
  this.Yb = b && b.messageUrlParams || null;
  a = b && b.messageHeaders || null;
  b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = {"X-Client-Protocol":"webchannel"});
  this.i.Wa(a);
  a = b && b.initMessageHeaders || null;
  b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = {"X-WebChannel-Content-Type":b.messageContentType});
  b && b.clientProfile && (a ? a["X-WebChannel-Client-Profile"] = b.clientProfile : a = {"X-WebChannel-Client-Profile":b.clientProfile});
  this.i.pb = a;
  (a = b && b.httpHeadersOverwriteParam) && !xa(a) && (this.i.R = a);
  this.Nd = b && b.supportsCrossDomainXhr || !1;
  this.Ld = b && b.sendRawJson || !1;
  (b = b && b.httpSessionIdParam) && !xa(b) && (this.i.ya = b, a = this.Yb, null !== a && b in a && (a = this.Yb, b in a && delete a[b], (a = this.j) && F(a, C, "Ignore httpSessionIdParam also specified with messageUrlParams: " + b)));
  this.vc = new te(this);
}
t(Z, z);
Z.prototype.open = function() {
  this.i.m = this.vc;
  this.Nd && (this.i.Ya = !0);
  this.i.connect(this.U, this.Yb || void 0);
};
Z.prototype.close = function() {
  this.i.disconnect();
};
Z.prototype.send = function(a) {
  var b = this.i;
  if ("string" === typeof a) {
    var c = {};
    c.__data__ = a;
    a = c;
  } else {
    this.Ld && (c = {}, c.__data__ = Sb(a), a = c);
  }
  le(b, a);
};
Z.prototype.O = function() {
  this.i.m = null;
  delete this.vc;
  this.i.disconnect();
  delete this.i;
  Z.oa.O.call(this);
};
function ue(a) {
  Qb.call(this);
  a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
  var b = a.__sm__;
  if (b) {
    a: {
      for (const c in b) {
        a = c;
        break a;
      }
      a = void 0;
    }
    if (this.metadataKey = a) {
      a = this.metadataKey, b = null !== b && a in b ? b[a] : void 0;
    }
    this.data = b;
  } else {
    this.data = a;
  }
}
t(ue, Qb);
function ve(a) {
  Rb.call(this);
  this.status = 1;
  this.errorCode = a;
}
t(ve, Rb);
function te(a) {
  this.i = a;
}
t(te, re);
te.prototype.wc = function() {
  var a = this.i.j;
  a && F(a, Vb, "WebChannel opened on " + this.i.U);
  this.i.dispatchEvent("a");
};
te.prototype.uc = function(a) {
  this.i.dispatchEvent(new ue(a));
};
te.prototype.tc = function(a) {
  var b = this.i.j;
  b && F(b, Vb, "WebChannel aborted on " + this.i.U + " due to channel error: " + a);
  this.i.dispatchEvent(new ve(a));
};
te.prototype.sc = function() {
  var a = this.i.j;
  a && F(a, Vb, "WebChannel closed on " + this.i.U);
  this.i.dispatchEvent("b");
};
se.prototype.createWebChannel = se.prototype.yc;
Z.prototype.open = Z.prototype.open;
Z.prototype.send = Z.prototype.send;
Z.prototype.close = Z.prototype.close;
z.prototype.listen = z.prototype.rb;
u.prototype.dispose = u.prototype.hb;
u.prototype.isDisposed = u.prototype.qd;
"symbol" !== typeof Symbol.dispose && Object.defineProperty(Symbol, "dispose", {value:Symbol("Symbol.dispose"), configurable:!0, writable:!0});
u.prototype[Symbol.dispose] = function() {
  this.dispose();
};
A.EventType = {OPEN:"a", CLOSE:"b", ERROR:"c", MESSAGE:"d"};
A.ErrorStatus = {OK:0, NETWORK_ERROR:1, SERVER_ERROR:2};
A.FailureRecovery = Pb;
Pb.State = {INIT:"init", FAILED:"failed", RECOVERING:"recovering", CLOSED:"closed"};
Pb.FailureCondition = {HTTP_ERROR:"http_error", ABORT:"abort", TIMEOUT:"timeout", EXCEPTION:"exception"};
A.MessageEvent = Qb;
A.ErrorEvent = Rb;
A.X_CLIENT_PROTOCOL = "X-Client-Protocol";
A.X_CLIENT_PROTOCOL_WEB_CHANNEL = "webchannel";
A.X_CLIENT_WIRE_PROTOCOL = "X-Client-Wire-Protocol";
A.X_HTTP_SESSION_ID = "X-HTTP-Session-Id";
A.X_HTTP_INITIAL_RESPONSE = "X-HTTP-Initial-Response";
A.X_WEBCHANNEL_CONTENT_TYPE = "X-WebChannel-Content-Type";
A.X_WEBCHANNEL_CLIENT_PROFILE = "X-WebChannel-Client-Profile";
"undefined" !== typeof module && module.exports && (module.exports.createWebChannelTransport = function() {
  const a = new se(), b = a.yc;
  a.createWebChannel = function(c, d) {
    if (d && d.xmlHttpFactory && "function" !== typeof d.xmlHttpFactory.getOptions) {
      const e = d.xmlHttpFactory;
      d = Object.assign({}, d, {xmlHttpFactory:{createInstance:function() {
        return e.createInstance();
      }, getOptions:function() {
        return {};
      }}});
    }
    return b.call(a, c, d);
  };
  return a;
}, module.exports.getStatEventTarget = vc, module.exports.Event = {STAT_EVENT:"statevent", SERVER_REACHABILITY_EVENT:"serverreachability", TIMING_EVENT:"timingevent"}, module.exports.Stat = {CONNECT_ATTEMPT:0, ERROR_NETWORK:1, ERROR_OTHER:2, TEST_STAGE_ONE_START:3, TEST_STAGE_TWO_START:4, TEST_STAGE_TWO_DATA_ONE:5, TEST_STAGE_TWO_DATA_TWO:6, TEST_STAGE_TWO_DATA_BOTH:7, TEST_STAGE_ONE_FAILED:8, TEST_STAGE_TWO_FAILED:9, PROXY:10, NOPROXY:11, REQUEST_UNKNOWN_SESSION_ID:12, REQUEST_BAD_STATUS:13, REQUEST_INCOMPLETE_DATA:14, 
REQUEST_BAD_DATA:15, REQUEST_NO_DATA:16, REQUEST_TIMEOUT:17, BACKCHANNEL_MISSING:18, BACKCHANNEL_DEAD:19, BROWSER_OFFLINE:20}, module.exports.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9, getDebugMessage:ka}, module.exports.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", 
PROGRESS:"progress", DOWNLOAD_PROGRESS:"downloadprogress", UPLOAD_PROGRESS:"uploadprogress"}, module.exports.WebChannel = A);

}).apply(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
