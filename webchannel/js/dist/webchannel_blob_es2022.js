/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0

*/
(function() {/** @const */ 
var $jscomp = $jscomp || {};
/** @const */ 
$jscomp.scope = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ASSUME_ES5 = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ASSUME_ES6 = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ASSUME_ES2020 = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ASSUME_NO_NATIVE_SET = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.ISOLATE_POLYFILLS = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.FORCE_POLYFILL_PROMISE = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
$jscomp.INSTRUMENT_ASYNC_CONTEXT = !0;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == "function" ? Object.defineProperty : function(target, property, descriptor) {
  if (target == Array.prototype || target == Object.prototype) {
    return target;
  }
  target[property] = descriptor.value;
  return target;
};
/** @noinline */ 
$jscomp.getGlobal = function(passedInThis) {
  for (var possibleGlobals = ["object" == typeof globalThis && globalThis, passedInThis, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global], i = 0; i < possibleGlobals.length; ++i) {
    var maybeGlobal = possibleGlobals[i];
    if (maybeGlobal && maybeGlobal.Math == Math) {
      return maybeGlobal;
    }
  }
  throw Error("Cannot find global object");
};
/** @const */ 
$jscomp.global = $jscomp.ASSUME_ES2020 ? globalThis : $jscomp.getGlobal(this);
/** @const */ 
$jscomp.IS_SYMBOL_NATIVE = typeof Symbol === "function" && typeof Symbol("x") === "symbol";
/** @const */ 
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
/** @const */ 
$jscomp.polyfills = {};
/** @const */ 
$jscomp.propertyToPolyfillSymbol = {};
/** @const */ 
$jscomp.POLYFILL_PREFIX = "$jscp$";
var JSCompiler_inline_result$jscomp$0, classes$jscomp$inline_12 = "Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64".split(" ");
$jscomp.global.BigInt64Array && (classes$jscomp$inline_12.push("BigInt64"), classes$jscomp$inline_12.push("BigUint64"));
JSCompiler_inline_result$jscomp$0 = classes$jscomp$inline_12;
/** @const */ 
$jscomp.TYPED_ARRAY_CLASSES = JSCompiler_inline_result$jscomp$0;
/** @noinline */ 
$jscomp.polyfillTypedArrayMethod = function(methodName, polyfill, fromLang, toLang) {
  if (polyfill) {
    for (var i = 0; i < $jscomp.TYPED_ARRAY_CLASSES.length; i++) {
      var target = $jscomp.TYPED_ARRAY_CLASSES[i] + "Array.prototype." + methodName;
      $jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(target, polyfill, fromLang, toLang) : $jscomp.polyfillUnisolated(target, polyfill, fromLang, toLang);
    }
  }
};
/** @noinline */ 
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  polyfill && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(target, polyfill, fromLang, toLang) : $jscomp.polyfillUnisolated(target, polyfill, fromLang, toLang));
};
$jscomp.polyfillUnisolated = function(target, polyfill) {
  for (var obj = $jscomp.global, split = target.split("."), i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      return;
    }
    obj = obj[key];
  }
  var property = split[split.length - 1], orig = obj[property], impl = polyfill(orig);
  impl != orig && impl != null && $jscomp.defineProperty(obj, property, {configurable:!0, writable:!0, value:impl});
};
$jscomp.polyfillIsolated = function(target, polyfill, fromLang) {
  var split = target.split("."), isSimpleName = split.length === 1, root = split[0];
  var ownerObject = !isSimpleName && root in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in ownerObject)) {
      return;
    }
    ownerObject = ownerObject[key];
  }
  var property = split[split.length - 1], nativeImpl = $jscomp.IS_SYMBOL_NATIVE && fromLang === "es6" ? ownerObject[property] : null, impl = polyfill(nativeImpl);
  if (impl != null) {
    if (isSimpleName) {
      $jscomp.defineProperty($jscomp.polyfills, property, {configurable:!0, writable:!0, value:impl});
    } else if (impl !== nativeImpl) {
      if ($jscomp.propertyToPolyfillSymbol[property] === void 0) {
        var BIN_ID = Math.random() * 1E9 >>> 0;
        $jscomp.propertyToPolyfillSymbol[property] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(property) : $jscomp.POLYFILL_PREFIX + BIN_ID + "$" + property;
      }
      /** @const */ 
      var obfuscatedName = $jscomp.propertyToPolyfillSymbol[property];
      $jscomp.defineProperty(ownerObject, obfuscatedName, {configurable:!0, writable:!0, value:impl});
    }
  }
};
$jscomp.asyncContextEnter = function() {
  return $jscomp.asyncContextIdentity;
};
$jscomp.asyncContextStart = function() {
  return $jscomp.asyncContextEnter;
};
$jscomp.asyncContextIdentity = function(x) {
  return x;
};
$jscomp.asyncContextWrap = function(fn) {
  var state = $jscomp.asyncContextState;
  if (!state[0]) {
    return fn;
  }
  var context = state[0], wrapped = function() {
    var save = state[0];
    state[0] = context;
    try {
      return fn.apply(this, arguments);
    } finally {
      state[0] = save;
    }
  };
  return wrapped;
};
$jscomp.arrayIteratorImpl = function(array) {
  var index = 0;
  return function() {
    return index < array.length ? {done:!1, value:array[index++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(array) {
  return {next:$jscomp.arrayIteratorImpl(array)};
};
/** @noinline */ 
$jscomp.initSymbol = function() {
};
$jscomp.iteratorPrototype = function(next) {
  var iterator = {next};
  /**
   * @this {JSDocSerializer_placeholder_type}
   */
  iterator[Symbol.iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == "function" ? Object.create : function(prototype) {
  /** @constructor */ 
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor();
};
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:!0}, y = {};
  try {
    return y.__proto__ = x, y.a;
  } catch (e) {
  }
  return !1;
};
$jscomp.setPrototypeOf = $jscomp.ASSUME_ES6 || $jscomp.TRUST_ES6_POLYFILLS && typeof Object.setPrototypeOf == "function" ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + " is not extensible");
  }
  return target;
} : null;
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.ASSUME_ES6 || $jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p != "prototype") {
        if (Object.defineProperties) {
          var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
          descriptor && Object.defineProperty(childCtor, p, descriptor);
        } else {
          childCtor[p] = parentCtor[p];
        }
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.getConstructImplementation = function() {
  function reflectConstructWorks() {
    /** @constructor */ 
    function Base() {
    }
    /** @constructor */ 
    function Derived() {
    }
    new Base();
    Reflect.construct(Base, [], Derived);
    return new Base() instanceof Base;
  }
  function construct(target, argList, opt_newTarget) {
    opt_newTarget === void 0 && (opt_newTarget = target);
    var proto = opt_newTarget.prototype || Object.prototype, obj = $jscomp.objectCreate(proto), apply = Function.prototype.apply, out = apply.call(target, obj, argList);
    return out || obj;
  }
  if ($jscomp.TRUST_ES6_POLYFILLS && typeof Reflect != "undefined" && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct, patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      opt_newTarget && Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      return out;
    };
    return patchedConstruct;
  }
  return construct;
};
/** @const */ 
$jscomp.construct = {valueOf:$jscomp.getConstructImplementation}.valueOf();
$jscomp.polyfill("Symbol.dispose", function(orig) {
  return orig ? orig : Symbol("Symbol.dispose");
}, "es_next", "es3");
var CLOSURE_TOGGLE_ORDINALS = {GoogFlags__async_throw_on_unicode_to_byte__enable:!1, GoogFlags__batch_fc_data_fetches_in_microtask__enable:!1, GoogFlags__check_fc_data_parser_breakers__disable:!1, GoogFlags__client_only_wiz_context_per_component__enable:!1, GoogFlags__client_only_wiz_lazy_tsx__disable:!1, GoogFlags__client_only_wiz_queue_effect_and_on_init_initial_runs__disable:!1, GoogFlags__fixed_noopener_behavior__enable:!1, GoogFlags__jspb_coerce_int64_by_jstype__enable:!1, GoogFlags__jspb_disallow_message_tojson__enable:!1, 
GoogFlags__jspb_serialize_with_dynamic_pivot_selector__enable:!1, GoogFlags__jspb_throw_in_array_constructor_if_array_is_already_constructed__disable:!1, GoogFlags__jspb_use_constant_default_pivot__enable:!1, GoogFlags__log_correct_xhr_error_statuses__disable:!1, GoogFlags__minimize_rpc_id_url_params__enable:!1, GoogFlags__optimize_decode_graph__enable:!1, GoogFlags__optimize_get_ei_from_ved__enable:!1, GoogFlags__optimize_loading_module_ids__enable:!1, GoogFlags__optimize_module_info_callbacks__enable:!1, 
GoogFlags__override_disable_toggles:!1, GoogFlags__testonly_debug_flag__enable:!1, GoogFlags__testonly_disabled_flag__enable:!1, GoogFlags__testonly_stable_flag__disable:!1, GoogFlags__testonly_staging_flag__disable:!1, GoogFlags__use_maps_and_sets_in_module_manager__enable:!1, GoogFlags__use_toggles:!1, GoogFlags__use_unobfuscated_rpc_method_names__disable:!1, GoogFlags__use_user_agent_client_hints__enable:!1, GoogFlags__wiz_enable_native_promise__enable:!1, GoogFlags__xpc_use_page_hide__disable:!1};
/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
/** @const */ 
var goog = goog || {};
/** @const */ 
goog.global = this || self;
goog.exportPath_ = function(name, object, overwriteImplicit, objectToExportTo) {
  for (var parts = name.split("."), cur = objectToExportTo || goog.global, part; parts.length && (part = parts.shift());) {
    if (parts.length || object === void 0) {
      cur = cur[part] && cur[part] !== Object.prototype[part] ? cur[part] : cur[part] = {};
    } else {
      if (!overwriteImplicit && goog.isObject(object) && goog.isObject(cur[part])) {
        for (var prop in object) {
          object.hasOwnProperty(prop) && (cur[part][prop] = object[prop]);
        }
      } else {
        cur[part] = object;
      }
    }
  }
};
goog.CLOSURE_DEFINES = typeof CLOSURE_DEFINES !== "undefined" ? CLOSURE_DEFINES : goog.global.CLOSURE_DEFINES;
goog.CLOSURE_UNCOMPILED_DEFINES = typeof CLOSURE_UNCOMPILED_DEFINES !== "undefined" ? CLOSURE_UNCOMPILED_DEFINES : goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  return value;
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.FEATURESET_YEAR = 2022;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.DEBUG = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.LOCALE = "en";
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.TRUSTED_SITE = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.DISALLOW_TEST_ONLY_CODE = !goog.DEBUG;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.readFlagInternalDoNotUseOrElse = function(googFlagId, defaultValue) {
  var obj = goog.getObjectByName(goog.FLAGS_OBJECT_), val = obj && obj[googFlagId];
  return val != null ? val : defaultValue;
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.FLAGS_OBJECT_ = "CLOSURE_FLAGS";
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.FLAGS_STAGING_DEFAULT = !0;
goog.CLOSURE_TOGGLE_ORDINALS = typeof CLOSURE_TOGGLE_ORDINALS === "object" ? CLOSURE_TOGGLE_ORDINALS : goog.global.CLOSURE_TOGGLE_ORDINALS;
goog.readToggleInternalDoNotCallDirectly = function(name) {
  var ordinals = goog.CLOSURE_TOGGLE_ORDINALS, ordinal = ordinals && ordinals[name];
  return typeof ordinal !== "number" ? !!ordinal : !!(goog.TOGGLES_[Math.floor(ordinal / 30)] & 1 << ordinal % 30);
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.TOGGLE_VAR_ = "_F_toggles";
/** @const */ 
goog.TOGGLES_ = goog.global[goog.TOGGLE_VAR_] || [];
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.GENDERED_MESSAGES_ENABLED = !0;
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.GrammaticalGender_ = {OTHER:0, MASCULINE:1, FEMININE:2, NEUTER:3};
/** @const */ 
goog.GRAMMATICAL_GENDER_MAP_ = {FEMININE:goog.GrammaticalGender_.FEMININE, MASCULINE:goog.GrammaticalGender_.MASCULINE, NEUTER:goog.GrammaticalGender_.NEUTER};
/** @const */ 
goog.viewerGrammaticalGender_ = goog.GRAMMATICAL_GENDER_MAP_[goog.GENDERED_MESSAGES_ENABLED && goog.global._F_VIEWER_GRAMMATICAL_GENDER] || goog.GrammaticalGender_.OTHER;
/** @const */ 
goog.msgKind = {};
/** @const @noinline */ 
goog.msgKind.MASCULINE = goog.viewerGrammaticalGender_ === goog.GrammaticalGender_.MASCULINE;
/** @const @noinline */ 
goog.msgKind.FEMININE = goog.viewerGrammaticalGender_ === goog.GrammaticalGender_.FEMININE;
/** @const @noinline */ 
goog.msgKind.NEUTER = goog.viewerGrammaticalGender_ === goog.GrammaticalGender_.NEUTER;
goog.LEGACY_NAMESPACE_OBJECT_ = goog.global;
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide cannot be used within a module.");
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, object, overwriteImplicit) {
  goog.exportPath_(name, object, overwriteImplicit, goog.LEGACY_NAMESPACE_OBJECT_);
};
/** @const */ 
goog.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
goog.getScriptNonce_ = function(opt_window) {
  var doc = (opt_window || goog.global).document, script = doc.querySelector && doc.querySelector("script[nonce]");
  if (script) {
    var nonce = script.nonce || script.getAttribute("nonce");
    if (nonce && goog.NONCE_PATTERN_.test(nonce)) {
      return nonce;
    }
  }
  return "";
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function() {
};
goog.module.get = function() {
  return null;
};
goog.module.getInternal_ = function() {
  return null;
};
goog.requireDynamic = function() {
  return null;
};
goog.importHandler_ = null;
goog.uncompiledChunkIdHandler_ = null;
goog.setImportHandlerInternalDoNotCallOrElse = function(fn) {
  goog.importHandler_ = fn;
};
goog.setUncompiledChunkIdHandlerInternalDoNotCallOrElse = function(fn) {
  goog.uncompiledChunkIdHandler_ = fn;
};
goog.maybeRequireFrameworkInternalOnlyDoNotCallOrElse = function() {
};
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.ModuleType = {ES6:"es6", GOOG:"goog"};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.isInGoogModuleLoader_() || goog.isInEs6ModuleLoader_();
};
goog.isInGoogModuleLoader_ = function() {
  return !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.GOOG;
};
goog.isInEs6ModuleLoader_ = function() {
  var inLoader = !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.ES6;
  if (inLoader) {
    return !0;
  }
  var jscomp = goog.LEGACY_NAMESPACE_OBJECT_.$jscomp;
  return jscomp ? typeof jscomp.getCurrentModulePath != "function" ? !1 : !!jscomp.getCurrentModulePath() : !1;
};
goog.module.declareLegacyNamespace = function() {
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.module.preventModuleExportSealing = function() {
  goog.moduleLoaderState_.preventModuleExportSealing = !0;
};
goog.declareModuleId = function(namespace) {
  if (goog.moduleLoaderState_) {
    goog.moduleLoaderState_.moduleName = namespace;
  } else {
    var jscomp = goog.LEGACY_NAMESPACE_OBJECT_.$jscomp;
    if (!jscomp || typeof jscomp.getCurrentModulePath != "function") {
      throw Error('Module with namespace "' + namespace + '" has been loaded incorrectly.');
    }
    var exports = jscomp.require(jscomp.getCurrentModulePath());
    goog.loadedModules_[namespace] = {exports, type:goog.ModuleType.ES6, moduleId:namespace};
  }
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function() {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, i = 0; i < parts.length; i++) {
    if (cur = cur[parts[i]], cur == null) {
      return null;
    }
  }
  return cur;
};
goog.addDependency = function() {
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.ENABLE_DEBUG_LOADER = !1;
goog.logToConsole_ = function(msg) {
  goog.global.console && goog.global.console.error(msg);
};
goog.require = function() {
};
goog.requireType = function() {
  return {};
};
goog.basePath = "";
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.instance_ = void 0;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor();
  };
};
goog.instantiatedSingletons_ = [];
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.LOAD_MODULE_USING_EVAL = !0;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
/** @const */ 
goog.loadedModules_ = {};
/** @const */ 
goog.DEPENDENCIES_ENABLED = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.ASSUME_ES_MODULES_TRANSPILED = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.TRUSTED_TYPES_POLICY_NAME = "goog";
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:"", declareLegacyNamespace:!1, preventModuleExportSealing:!1, type:goog.ModuleType.GOOG};
    var origExports = {}, exports = origExports;
    if (typeof moduleDef === "function") {
      exports = moduleDef.call(void 0, exports);
    } else if (typeof moduleDef === "string") {
      exports = goog.loadModuleFromSource_.call(void 0, exports, moduleDef);
    } else {
      throw Error("Invalid module definition");
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (typeof moduleName === "string" && moduleName) {
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        var isDefaultExport = origExports !== exports;
        goog.constructNamespace_(moduleName, exports, isDefaultExport);
      } else {
        goog.SEAL_MODULE_EXPORTS && Object.seal && typeof exports == "object" && exports != null && !goog.moduleLoaderState_.preventModuleExportSealing && Object.seal(exports);
      }
      var data = {exports, type:goog.ModuleType.GOOG, moduleId:goog.moduleLoaderState_.moduleName};
      goog.loadedModules_[moduleName] = data;
    } else {
      throw Error('Invalid module name "' + moduleName + '"');
    }
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
/** @const */ 
goog.loadModuleFromSource_ = function(exports) {
  eval(goog.CLOSURE_EVAL_PREFILTER_.createScript(arguments[1]));
  return exports;
};
goog.normalizePath_ = function(path) {
  for (var components = path.split("/"), i = 0; i < components.length;) {
    components[i] == "." ? components.splice(i, 1) : i && components[i] == ".." && components[i - 1] && components[i - 1] != ".." ? components.splice(--i, 2) : i++;
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  }
  try {
    var xhr = new goog.global.XMLHttpRequest();
    xhr.open("get", src, !1);
    xhr.send();
    return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
  } catch (err) {
    return null;
  }
};
goog.typeOf = function(value) {
  var s = typeof value;
  return s != "object" ? s : value ? Array.isArray(value) ? "array" : s : "null";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return Object.prototype.hasOwnProperty.call(obj, goog.UID_PROPERTY_) && obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  obj !== null && "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (typeof obj.clone === "function") {
      return obj.clone();
    }
    if (typeof Map !== "undefined" && obj instanceof Map) {
      return new Map(obj);
    }
    if (typeof Set !== "undefined" && obj instanceof Set) {
      return new Set(obj);
    }
    var clone = type == "array" ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  goog.TRUSTED_SITE && goog.FEATURESET_YEAR > 2012 || Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.now = function() {
  return Date.now();
};
goog.globalEval = function(script) {
  (0,eval)(script);
};
goog.getCssName = function(className, opt_modifier) {
  if (String(className).charAt(0) == ".") {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + className);
  }
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts : function(a) {
    return a;
  };
  var result = opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
  return goog.global.CLOSURE_CSS_NAME_MAP_FN ? goog.global.CLOSURE_CSS_NAME_MAP_FN(result) : result;
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
/** @interface */ 
goog.GetMsgOptions = function() {
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.USE_GET_MSG_OVERRIDE = !1;
goog.getMsg = function(str, opt_values, opt_options) {
  opt_options && opt_options.html && (str = str.replace(/</g, "&lt;"));
  opt_options && opt_options.unescapeHtmlEntities && (str = str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  opt_values && (str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
    return opt_values != null && key in opt_values ? opt_values[key] : match;
  }));
  return str;
};
goog.getMsgWithFallback = function(a) {
  return a;
};
goog.exportSymbol = function(publicPath, object, objectToExportTo) {
  goog.exportPath_(publicPath, object, !0, objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
/** @noinline */ 
goog.weakUsage = function(name) {
  return name;
};
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */ 
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    for (var args = Array(arguments.length - 2), i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a module.");
  }
  fn.call(goog.global);
};
goog.identity_ = function(s) {
  return s;
};
goog.createTrustedTypesPolicy = function(name) {
  var policy = null, policyFactory = goog.global.trustedTypes;
  if (!policyFactory || !policyFactory.createPolicy) {
    return policy;
  }
  try {
    policy = policyFactory.createPolicy(name, {createHTML:goog.identity_, createScript:goog.identity_, createScriptURL:goog.identity_});
  } catch (e) {
    goog.logToConsole_(e.message);
  }
  return policy;
};
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.CodeLocation = {DO_NOT_USE:"", DO_NOT_USE_ME_EITHER:"."};
goog.callerLocation = function() {
  return "";
};
/** @idGenerator {consistent} */ 
goog.callerLocationIdInternalDoNotCallOrElse = function(id) {
  return id;
};
/** @const */ 
var module$exports$google3$javascript$common$asserts$enable_goog_asserts = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS = goog.DEBUG;
/** @const */ 
var module$exports$google3$javascript$common$async$context$propagate = {};
/** @const */ 
module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? fn => fn && AsyncContext.Snapshot.wrap(fn) : fn => fn;
function module$contents$google3$javascript$typescript$contrib$check_checkExhaustiveAllowing(value, msg = `unexpected value ${value}!`) {
  throw Error(msg);
}
;/** @const */ 
goog.debug = {};
/** @constructor */ 
function module$contents$goog$debug$Error_DebugError(msg, cause) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, module$contents$goog$debug$Error_DebugError);
  } else {
    let stack = Error().stack;
    stack && (this.stack = stack);
  }
  msg && (this.message = String(msg));
  cause !== void 0 && (this.cause = cause);
}
goog.inherits(module$contents$goog$debug$Error_DebugError, Error);
module$contents$goog$debug$Error_DebugError.prototype.name = "CustomError";
/** @const */ 
goog.debug.Error = module$contents$goog$debug$Error_DebugError;
/** @const */ 
goog.dom = {};
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$dom$NodeType_NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
/** @const */ 
goog.dom.NodeType = module$contents$goog$dom$NodeType_NodeType;
/** @const */ 
goog.asserts = {};
/** @const */ 
goog.asserts.ENABLE_ASSERTS = module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS;
/** @constructor */ 
function module$contents$goog$asserts_AssertionError(messagePattern, messageArgs) {
  var JSCompiler_temp_const = module$contents$goog$debug$Error_DebugError, JSCompiler_temp_const$jscomp$0 = JSCompiler_temp_const.call, pattern = messagePattern, subs = messageArgs, splitParts = pattern.split("%s"), returnString = "", subLast = splitParts.length - 1;
  for (let i = 0; i < subLast; i++) {
    let sub = i < subs.length ? subs[i] : "%s";
    returnString += splitParts[i] + sub;
  }
  var JSCompiler_inline_result = returnString + splitParts[subLast];
  JSCompiler_temp_const$jscomp$0.call(JSCompiler_temp_const, this, JSCompiler_inline_result);
}
goog.inherits(module$contents$goog$asserts_AssertionError, module$contents$goog$debug$Error_DebugError);
/** @const */ 
goog.asserts.AssertionError = module$contents$goog$asserts_AssertionError;
module$contents$goog$asserts_AssertionError.prototype.name = "AssertionError";
/** @const */ 
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
let module$contents$goog$asserts_errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
function module$contents$goog$asserts_doAssertFailure(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    defaultMessage && (message += ": " + defaultMessage, args = defaultArgs);
  }
  var e = new module$contents$goog$asserts_AssertionError("" + message, args || []);
  module$contents$goog$asserts_errorHandler_(e);
}
/** @const */ 
goog.asserts.setErrorHandler = function(errorHandler) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && (module$contents$goog$asserts_errorHandler_ = errorHandler);
};
/** @const */ 
goog.asserts.assert = function(condition, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && !condition && module$contents$goog$asserts_doAssertFailure("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  return condition;
};
/** @const */ 
goog.asserts.assertExists = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && value == null && module$contents$goog$asserts_doAssertFailure("Expected to exist: %s.", [value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.fail = function(opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && module$contents$goog$asserts_errorHandler_(new module$contents$goog$asserts_AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
};
/** @const */ 
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && typeof value !== "number" && module$contents$goog$asserts_doAssertFailure("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertString = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && typeof value !== "string" && module$contents$goog$asserts_doAssertFailure("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && typeof value !== "function" && module$contents$goog$asserts_doAssertFailure("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertObject = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && !goog.isObject(value) && module$contents$goog$asserts_doAssertFailure("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertArray = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && !Array.isArray(value) && module$contents$goog$asserts_doAssertFailure("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS && typeof value !== "boolean" && module$contents$goog$asserts_doAssertFailure("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertElement = function(value, opt_message, var_args) {
  !module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS || goog.isObject(value) && value.nodeType == module$contents$goog$dom$NodeType_NodeType.ELEMENT || module$contents$goog$asserts_doAssertFailure("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
/** @const */ 
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  !module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS || value instanceof type || module$contents$goog$asserts_doAssertFailure("Expected instanceof %s but got %s.", [module$contents$goog$asserts_getType(type), module$contents$goog$asserts_getType(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  return value;
};
/** @const */ 
goog.asserts.assertFinite = function(value, opt_message, var_args) {
  !module$exports$google3$javascript$common$asserts$enable_goog_asserts.ENABLE_GOOG_ASSERTS || typeof value == "number" && isFinite(value) || module$contents$goog$asserts_doAssertFailure("Expected %s to be a finite number but it is not.", [value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
function module$contents$goog$asserts_getType(value) {
  return value instanceof Function ? value.displayName || value.name || "unknown type name" : value instanceof Object ? value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value) : value === null ? "null" : typeof value;
}
;/** @const */ 
goog.array = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
/** @define {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS = goog.FEATURESET_YEAR > 2012;
/** @const */ 
goog.array.ASSUME_NATIVE_FUNCTIONS = module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS;
function module$contents$goog$array_peek(array) {
  return array[array.length - 1];
}
/** @const */ 
goog.array.peek = module$contents$goog$array_peek;
/** @const */ 
goog.array.last = module$contents$goog$array_peek;
const module$contents$goog$array_indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (typeof arr === "string") {
    return typeof obj !== "string" || obj.length != 1 ? -1 : arr.indexOf(obj, fromIndex);
  }
  for (let i = fromIndex; i < arr.length; i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
/** @const */ 
goog.array.indexOf = module$contents$goog$array_indexOf;
const module$contents$goog$array_lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  fromIndex < 0 && (fromIndex = Math.max(0, arr.length + fromIndex));
  if (typeof arr === "string") {
    return typeof obj !== "string" || obj.length != 1 ? -1 : arr.lastIndexOf(obj, fromIndex);
  }
  for (let i = fromIndex; i >= 0; i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
/** @const */ 
goog.array.lastIndexOf = module$contents$goog$array_lastIndexOf;
const module$contents$goog$array_forEach = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
/** @const */ 
goog.array.forEach = module$contents$goog$array_forEach;
function module$contents$goog$array_forEachRight(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = l - 1; i >= 0; --i) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
}
/** @const */ 
goog.array.forEachRight = module$contents$goog$array_forEachRight;
const module$contents$goog$array_filter = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length, res = [], resLength = 0, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2) {
      let val = arr2[i];
      f.call(opt_obj, val, i, arr) && (res[resLength++] = val);
    }
  }
  return res;
};
/** @const */ 
goog.array.filter = module$contents$goog$array_filter;
const module$contents$goog$array_map = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length, res = Array(l), arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    i in arr2 && (res[i] = f.call(opt_obj, arr2[i], i, arr));
  }
  return res;
};
/** @const */ 
goog.array.map = module$contents$goog$array_map;
const module$contents$goog$array_reduce = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  opt_obj && (f = goog.TRUSTED_SITE ? f.bind(opt_obj) : goog.bind(f, opt_obj));
  return Array.prototype.reduce.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  module$contents$goog$array_forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
/** @const */ 
goog.array.reduce = module$contents$goog$array_reduce;
const module$contents$goog$array_reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.asserts.assert(f != null);
  opt_obj && (f = goog.TRUSTED_SITE ? f.bind(opt_obj) : goog.bind(f, opt_obj));
  return Array.prototype.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  module$contents$goog$array_forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
/** @const */ 
goog.array.reduceRight = module$contents$goog$array_reduceRight;
const module$contents$goog$array_some = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return !0;
    }
  }
  return !1;
};
/** @const */ 
goog.array.some = module$contents$goog$array_some;
const module$contents$goog$array_every = goog.NATIVE_ARRAY_PROTOTYPES && (module$contents$goog$array_ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return !1;
    }
  }
  return !0;
};
/** @const */ 
goog.array.every = module$contents$goog$array_every;
function module$contents$goog$array_count(arr, f, opt_obj) {
  var count = 0;
  module$contents$goog$array_forEach(arr, function(element, index, arr) {
    f.call(opt_obj, element, index, arr) && ++count;
  }, opt_obj);
  return count;
}
/** @const */ 
goog.array.count = module$contents$goog$array_count;
function module$contents$goog$array_find(arr, f, opt_obj) {
  var i = module$contents$goog$array_findIndex(arr, f, opt_obj);
  return i < 0 ? null : typeof arr === "string" ? arr.charAt(i) : arr[i];
}
/** @const */ 
goog.array.find = module$contents$goog$array_find;
function module$contents$goog$array_findIndex(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
/** @const */ 
goog.array.findIndex = module$contents$goog$array_findIndex;
function module$contents$goog$array_findRight(arr, f, opt_obj) {
  var i = module$contents$goog$array_findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : typeof arr === "string" ? arr.charAt(i) : arr[i];
}
/** @const */ 
goog.array.findRight = module$contents$goog$array_findRight;
function module$contents$goog$array_findIndexRight(arr, f, opt_obj) {
  var l = arr.length, arr2 = typeof arr === "string" ? arr.split("") : arr;
  for (let i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
/** @const */ 
goog.array.findIndexRight = module$contents$goog$array_findIndexRight;
function module$contents$goog$array_contains(arr, obj) {
  return module$contents$goog$array_indexOf(arr, obj) >= 0;
}
/** @const */ 
goog.array.contains = module$contents$goog$array_contains;
function module$contents$goog$array_isEmpty(arr) {
  return arr.length == 0;
}
/** @const */ 
goog.array.isEmpty = module$contents$goog$array_isEmpty;
function module$contents$goog$array_clear(arr) {
  if (!Array.isArray(arr)) {
    for (let i = arr.length - 1; i >= 0; i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
}
/** @const */ 
goog.array.clear = module$contents$goog$array_clear;
function module$contents$goog$array_insert(arr, obj) {
  module$contents$goog$array_contains(arr, obj) || arr.push(obj);
}
/** @const */ 
goog.array.insert = module$contents$goog$array_insert;
function module$contents$goog$array_insertAt(arr, obj, opt_i) {
  module$contents$goog$array_splice(arr, opt_i, 0, obj);
}
/** @const */ 
goog.array.insertAt = module$contents$goog$array_insertAt;
function module$contents$goog$array_insertArrayAt(arr, elementsToAdd, opt_i) {
  goog.partial(module$contents$goog$array_splice, arr, opt_i, 0).apply(null, elementsToAdd);
}
/** @const */ 
goog.array.insertArrayAt = module$contents$goog$array_insertArrayAt;
function module$contents$goog$array_insertBefore(arr, obj, opt_obj2) {
  var i;
  arguments.length == 2 || (i = module$contents$goog$array_indexOf(arr, opt_obj2)) < 0 ? arr.push(obj) : module$contents$goog$array_insertAt(arr, obj, i);
}
/** @const */ 
goog.array.insertBefore = module$contents$goog$array_insertBefore;
function module$contents$goog$array_remove(arr, obj) {
  var i = module$contents$goog$array_indexOf(arr, obj), rv;
  (rv = i >= 0) && module$contents$goog$array_removeAt(arr, i);
  return rv;
}
/** @const */ 
goog.array.remove = module$contents$goog$array_remove;
function module$contents$goog$array_removeLast(arr, obj) {
  var i = module$contents$goog$array_lastIndexOf(arr, obj);
  return i >= 0 ? (module$contents$goog$array_removeAt(arr, i), !0) : !1;
}
/** @const */ 
goog.array.removeLast = module$contents$goog$array_removeLast;
function module$contents$goog$array_removeAt(arr, i) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.call(arr, i, 1).length == 1;
}
/** @const */ 
goog.array.removeAt = module$contents$goog$array_removeAt;
function module$contents$goog$array_removeIf(arr, f, opt_obj) {
  var i = module$contents$goog$array_findIndex(arr, f, opt_obj);
  return i >= 0 ? (module$contents$goog$array_removeAt(arr, i), !0) : !1;
}
/** @const */ 
goog.array.removeIf = module$contents$goog$array_removeIf;
function module$contents$goog$array_removeAllIf(arr, f, opt_obj) {
  var removedCount = 0;
  module$contents$goog$array_forEachRight(arr, function(val, index) {
    f.call(opt_obj, val, index, arr) && module$contents$goog$array_removeAt(arr, index) && removedCount++;
  });
  return removedCount;
}
/** @const */ 
goog.array.removeAllIf = module$contents$goog$array_removeAllIf;
function module$contents$goog$array_concat(var_args) {
  return Array.prototype.concat.apply([], arguments);
}
/** @const */ 
goog.array.concat = module$contents$goog$array_concat;
function module$contents$goog$array_join(var_args) {
  return Array.prototype.concat.apply([], arguments);
}
/** @const */ 
goog.array.join = module$contents$goog$array_join;
function module$contents$goog$array_toArray(object) {
  var length = object.length;
  if (length > 0) {
    let rv = Array(length);
    for (let i = 0; i < length; i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
}
/** @const */ 
goog.array.toArray = module$contents$goog$array_toArray;
/** @const */ 
goog.array.clone = module$contents$goog$array_toArray;
function module$contents$goog$array_extend(arr1, var_args) {
  for (let i = 1; i < arguments.length; i++) {
    let arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      let len1 = arr1.length || 0, len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (let j = 0; j < len2; j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
}
/** @const */ 
goog.array.extend = module$contents$goog$array_extend;
function module$contents$goog$array_splice(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.apply(arr, module$contents$goog$array_slice(arguments, 1));
}
/** @const */ 
goog.array.splice = module$contents$goog$array_splice;
function module$contents$goog$array_slice(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  return arguments.length <= 2 ? Array.prototype.slice.call(arr, start) : Array.prototype.slice.call(arr, start, opt_end);
}
/** @const */ 
goog.array.slice = module$contents$goog$array_slice;
function module$contents$goog$array_removeDuplicates(arr, opt_rv, opt_keyFn) {
  var returnArray = opt_rv || arr;
  if (goog.FEATURESET_YEAR >= 2018) {
    let defaultKeyFn = item => item, keyFn = opt_keyFn || defaultKeyFn, cursorInsert = 0, cursorRead = 0, seen = new Set();
    for (; cursorRead < arr.length;) {
      let current = arr[cursorRead++], key = keyFn(current);
      seen.has(key) || (seen.add(key), returnArray[cursorInsert++] = current);
    }
    returnArray.length = cursorInsert;
  } else {
    let defaultKeyFn = function(item) {
      return goog.isObject(item) ? "o" + goog.getUid(item) : (typeof item).charAt(0) + item;
    }, keyFn = opt_keyFn || defaultKeyFn, cursorInsert = 0, cursorRead = 0, seen = {};
    for (; cursorRead < arr.length;) {
      let current = arr[cursorRead++], key = keyFn(current);
      Object.prototype.hasOwnProperty.call(seen, key) || (seen[key] = !0, returnArray[cursorInsert++] = current);
    }
    returnArray.length = cursorInsert;
  }
}
/** @const */ 
goog.array.removeDuplicates = module$contents$goog$array_removeDuplicates;
function module$contents$goog$array_binarySearch(arr, target, opt_compareFn) {
  return module$contents$goog$array_binarySearch_(arr, opt_compareFn || module$contents$goog$array_defaultCompare, !1, target);
}
/** @const */ 
goog.array.binarySearch = module$contents$goog$array_binarySearch;
function module$contents$goog$array_binarySelect(arr, evaluator, opt_obj) {
  return module$contents$goog$array_binarySearch_(arr, evaluator, !0, void 0, opt_obj);
}
/** @const */ 
goog.array.binarySelect = module$contents$goog$array_binarySelect;
function module$contents$goog$array_binarySearch_(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  for (var left = 0, right = arr.length, found; left < right;) {
    let middle = left + (right - left >>> 1), compareResult;
    compareResult = isEvaluator ? compareFn.call(opt_selfObj, arr[middle], middle, arr) : compareFn(opt_target, arr[middle]);
    compareResult > 0 ? left = middle + 1 : (right = middle, found = !compareResult);
  }
  return found ? left : -left - 1;
}
function module$contents$goog$array_sort(arr, opt_compareFn) {
  arr.sort(opt_compareFn || module$contents$goog$array_defaultCompare);
}
/** @const */ 
goog.array.sort = module$contents$goog$array_sort;
function module$contents$goog$array_stableSort(arr, opt_compareFn) {
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  var compArr = Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    compArr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || module$contents$goog$array_defaultCompare;
  module$contents$goog$array_sort(compArr, stableCompareFn);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = compArr[i].value;
  }
}
/** @const */ 
goog.array.stableSort = module$contents$goog$array_stableSort;
function module$contents$goog$array_sortByKey(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || module$contents$goog$array_defaultCompare;
  module$contents$goog$array_sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
}
/** @const */ 
goog.array.sortByKey = module$contents$goog$array_sortByKey;
function module$contents$goog$array_sortObjectsByKey(arr, key, opt_compareFn) {
  module$contents$goog$array_sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
}
/** @const */ 
goog.array.sortObjectsByKey = module$contents$goog$array_sortObjectsByKey;
function module$contents$goog$array_isSorted(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || module$contents$goog$array_defaultCompare;
  for (let i = 1; i < arr.length; i++) {
    let compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return !1;
    }
  }
  return !0;
}
/** @const */ 
goog.array.isSorted = module$contents$goog$array_isSorted;
function module$contents$goog$array_equals(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return !1;
  }
  var l = arr1.length, equalsFn = opt_equalsFn || module$contents$goog$array_defaultCompareEquality;
  for (let i = 0; i < l; i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return !1;
    }
  }
  return !0;
}
/** @const */ 
goog.array.equals = module$contents$goog$array_equals;
function module$contents$goog$array_compare3(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || module$contents$goog$array_defaultCompare, l = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < l; i++) {
    let result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return module$contents$goog$array_defaultCompare(arr1.length, arr2.length);
}
/** @const */ 
goog.array.compare3 = module$contents$goog$array_compare3;
function module$contents$goog$array_defaultCompare(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
/** @const */ 
goog.array.defaultCompare = module$contents$goog$array_defaultCompare;
function module$contents$goog$array_inverseDefaultCompare(a, b) {
  return -module$contents$goog$array_defaultCompare(a, b);
}
/** @const */ 
goog.array.inverseDefaultCompare = module$contents$goog$array_inverseDefaultCompare;
function module$contents$goog$array_defaultCompareEquality(a, b) {
  return a === b;
}
/** @const */ 
goog.array.defaultCompareEquality = module$contents$goog$array_defaultCompareEquality;
function module$contents$goog$array_binaryInsert(array, value, opt_compareFn) {
  var index = module$contents$goog$array_binarySearch(array, value, opt_compareFn);
  return index < 0 ? (module$contents$goog$array_insertAt(array, value, -(index + 1)), !0) : !1;
}
/** @const */ 
goog.array.binaryInsert = module$contents$goog$array_binaryInsert;
function module$contents$goog$array_binaryRemove(array, value, opt_compareFn) {
  var index = module$contents$goog$array_binarySearch(array, value, opt_compareFn);
  return index >= 0 ? module$contents$goog$array_removeAt(array, index) : !1;
}
/** @const */ 
goog.array.binaryRemove = module$contents$goog$array_binaryRemove;
function module$contents$goog$array_bucket(array, sorter, opt_obj) {
  var buckets = {};
  for (let i = 0; i < array.length; i++) {
    let value = array[i], key = sorter.call(opt_obj, value, i, array);
    if (key !== void 0) {
      let bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
}
/** @const */ 
goog.array.bucket = module$contents$goog$array_bucket;
function module$contents$goog$array_bucketToMap(array, sorter) {
  var buckets = new Map();
  for (let i = 0; i < array.length; i++) {
    let value = array[i], key = sorter(value, i, array);
    if (key !== void 0) {
      let bucket = buckets.get(key);
      bucket || (bucket = [], buckets.set(key, bucket));
      bucket.push(value);
    }
  }
  return buckets;
}
/** @const */ 
goog.array.bucketToMap = module$contents$goog$array_bucketToMap;
function module$contents$goog$array_toObject(arr, keyFunc, opt_obj) {
  var ret = {};
  module$contents$goog$array_forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
}
/** @const */ 
goog.array.toObject = module$contents$goog$array_toObject;
function module$contents$goog$array_toMap(arr, keyFunc) {
  var map = new Map();
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];
    map.set(keyFunc(element, i, arr), element);
  }
  return map;
}
/** @const */ 
goog.array.toMap = module$contents$goog$array_toMap;
function module$contents$goog$array_range(startOrEnd, opt_end, opt_step) {
  var array = [], start = 0, end = startOrEnd, step = opt_step || 1;
  opt_end !== void 0 && (start = startOrEnd, end = opt_end);
  if (step * (end - start) < 0) {
    return [];
  }
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      array.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      array.push(i);
    }
  }
  return array;
}
/** @const */ 
goog.array.range = module$contents$goog$array_range;
function module$contents$goog$array_repeat(value, n) {
  var array = [];
  for (let i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}
/** @const */ 
goog.array.repeat = module$contents$goog$array_repeat;
function module$contents$goog$array_flatten(var_args) {
  var result = [];
  for (let i = 0; i < arguments.length; i++) {
    let element = arguments[i];
    if (Array.isArray(element)) {
      for (let c = 0; c < element.length; c += 8192) {
        let chunk = module$contents$goog$array_slice(element, c, c + 8192), recurseResult = module$contents$goog$array_flatten.apply(null, chunk);
        for (let r = 0; r < recurseResult.length; r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
}
/** @const */ 
goog.array.flatten = module$contents$goog$array_flatten;
function module$contents$goog$array_rotate(array, n) {
  goog.asserts.assert(array.length != null);
  array.length && (n %= array.length, n > 0 ? Array.prototype.unshift.apply(array, array.splice(-n, n)) : n < 0 && Array.prototype.push.apply(array, array.splice(0, -n)));
  return array;
}
/** @const */ 
goog.array.rotate = module$contents$goog$array_rotate;
function module$contents$goog$array_moveItem(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
}
/** @const */ 
goog.array.moveItem = module$contents$goog$array_moveItem;
function module$contents$goog$array_zip(var_args) {
  if (!arguments.length) {
    return [];
  }
  var result = [], minLen = arguments[0].length;
  for (let i = 1; i < arguments.length; i++) {
    arguments[i].length < minLen && (minLen = arguments[i].length);
  }
  for (let i = 0; i < minLen; i++) {
    let value = [];
    for (let j = 0; j < arguments.length; j++) {
      value.push(arguments[j][i]);
    }
    result.push(value);
  }
  return result;
}
/** @const */ 
goog.array.zip = module$contents$goog$array_zip;
function module$contents$goog$array_shuffle(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(randFn() * (i + 1)), tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}
/** @const */ 
goog.array.shuffle = module$contents$goog$array_shuffle;
function module$contents$goog$array_copyByIndex(arr, index_arr) {
  var result = [];
  module$contents$goog$array_forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
}
/** @const */ 
goog.array.copyByIndex = module$contents$goog$array_copyByIndex;
function module$contents$goog$array_concatMap(arr, f, opt_obj) {
  return module$contents$goog$array_concat.apply([], module$contents$goog$array_map(arr, f, opt_obj));
}
/** @const */ 
goog.array.concatMap = module$contents$goog$array_concatMap;
/** @const */ 
goog.async = {};
class module$contents$goog$async$FreeList_FreeList {
  constructor(create, reset, limit) {
    /** @const */ 
    this.limit_ = limit;
    /** @const */ 
    this.create_ = create;
    /** @const */ 
    this.reset_ = reset;
    this.occupants_ = 0;
    this.head_ = null;
  }
  get() {
    if (this.occupants_ > 0) {
      this.occupants_--;
      var item = this.head_;
      this.head_ = item.next;
      item.next = null;
    } else {
      item = this.create_();
    }
    return item;
  }
  put(item) {
    this.reset_(item);
    this.occupants_ < this.limit_ && (this.occupants_++, item.next = this.head_, this.head_ = item);
  }
}
/** @const */ 
goog.async.FreeList = module$contents$goog$async$FreeList_FreeList;
/** @const */ 
goog.debug.entryPointRegistry = {};
/** @interface */ 
goog.debug.entryPointRegistry.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    let monitors = goog.debug.entryPointRegistry.monitors_;
    for (let i = 0; i < monitors.length; i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.unregister = function(callback) {
  var list = goog.debug.entryPointRegistry.refList_;
  list && module$contents$goog$array_remove(list, callback);
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  var transformer = goog.bind(monitor.wrap, monitor);
  for (let i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  var transformer = goog.bind(monitor.unwrap, monitor);
  for (let i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
function module$contents$goog$async$nextTick_nextTick(callback, opt_context) {
  var cb = callback;
  opt_context && (cb = goog.bind(callback, opt_context));
  cb = module$contents$goog$async$nextTick_nextTick.wrapCallback_(cb);
  module$contents$goog$async$nextTick_nextTick.USE_SET_TIMEOUT ? setTimeout(cb, 0) : (cb = module$contents$goog$async$nextTick_nextTick.propagateAsyncContext_(cb), goog.DEBUG && typeof goog.global.setImmediate === "function" && module$contents$goog$async$nextTick_nextTick.useSetImmediate_() ? goog.global.setImmediate(cb) : (module$contents$goog$async$nextTick_nextTick.nextTickImpl || (module$contents$goog$async$nextTick_nextTick.nextTickImpl = module$contents$goog$async$nextTick_nextTick.getNextTickImpl_()), 
  module$contents$goog$async$nextTick_nextTick.nextTickImpl(cb)));
}
/** @const */ 
module$contents$goog$async$nextTick_nextTick.propagateAsyncContext_ = module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext;
/** @define {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$async$nextTick_nextTick.USE_SET_TIMEOUT = !1;
module$contents$goog$async$nextTick_nextTick.useSetImmediate_ = function() {
  return goog.global.Window && goog.global.Window.prototype && goog.global.Window.prototype.setImmediate == goog.global.setImmediate ? !1 : !0;
};
module$contents$goog$async$nextTick_nextTick.getNextTickImpl_ = function() {
  if (typeof MessageChannel !== "undefined") {
    let channel = new MessageChannel(), head = {}, tail = head;
    channel.port1.onmessage = function() {
      if (head.next !== void 0) {
        head = head.next;
        let cb = head.cb;
        head.cb = null;
        cb();
      }
    };
    return function(cb) {
      tail.next = {cb};
      tail = tail.next;
      channel.port2.postMessage(0);
    };
  }
  return function(cb) {
    goog.global.setTimeout(cb, 0);
  };
};
module$contents$goog$async$nextTick_nextTick.wrapCallback_ = callback => callback;
goog.debug.entryPointRegistry.register(function(transformer) {
  module$contents$goog$async$nextTick_nextTick.wrapCallback_ = transformer;
});
/** @const */ 
goog.async.nextTick = module$contents$goog$async$nextTick_nextTick;
function module$contents$goog$async$throwException_throwException(exception) {
  goog.global.setTimeout(() => {
    throw exception;
  }, 0);
}
/** @const */ 
goog.async.throwException = module$contents$goog$async$throwException_throwException;
class module$contents$goog$async$WorkQueue_WorkQueue {
  constructor() {
    this.workTail_ = this.workHead_ = null;
  }
  add(fn, scope) {
    var item = this.getUnusedItem_();
    item.set(fn, scope);
    this.workTail_ ? this.workTail_.next = item : ((0,goog.asserts.assert)(!this.workHead_), this.workHead_ = item);
    this.workTail_ = item;
  }
  remove() {
    var item = null;
    this.workHead_ && (item = this.workHead_, this.workHead_ = this.workHead_.next, this.workHead_ || (this.workTail_ = null), item.next = null);
    return item;
  }
  returnUnused(item) {
    module$contents$goog$async$WorkQueue_WorkQueue.freelist_.put(item);
  }
  getUnusedItem_() {
    return module$contents$goog$async$WorkQueue_WorkQueue.freelist_.get();
  }
}
/** @define {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$async$WorkQueue_WorkQueue.DEFAULT_MAX_UNUSED = 100;
/** @const */ 
module$contents$goog$async$WorkQueue_WorkQueue.freelist_ = new module$contents$goog$async$FreeList_FreeList(() => new module$contents$goog$async$WorkQueue_WorkItem(), item => item.reset(), module$contents$goog$async$WorkQueue_WorkQueue.DEFAULT_MAX_UNUSED);
class module$contents$goog$async$WorkQueue_WorkItem {
  constructor() {
    this.next = this.scope = this.fn = null;
  }
  set(fn, scope) {
    this.fn = fn;
    this.scope = scope;
    this.next = null;
  }
  reset() {
    this.next = this.scope = this.fn = null;
  }
}
/** @const */ 
goog.async.WorkQueue = module$contents$goog$async$WorkQueue_WorkQueue;
/** @const */ 
goog.debug.asyncStackTag = {};
/** @const */ 
const module$contents$goog$debug$asyncStackTag_createTask = goog.DEBUG && goog.global.console && goog.global.console.createTask ? goog.global.console.createTask.bind(goog.global.console) : void 0, module$contents$goog$debug$asyncStackTag_CONSOLE_TASK_SYMBOL = module$contents$goog$debug$asyncStackTag_createTask ? Symbol("consoleTask") : void 0;
function module$contents$goog$debug$asyncStackTag_wrap(fn, name = "anonymous") {
  function wrappedFn(...args) {
    return consoleTask.run(() => fn.call(this, ...args));
  }
  if (!goog.DEBUG || module$contents$goog$debug$asyncStackTag_CONSOLE_TASK_SYMBOL && fn[module$contents$goog$debug$asyncStackTag_CONSOLE_TASK_SYMBOL]) {
    return fn;
  }
  var originalFn = fn, originalTest = module$contents$goog$debug$asyncStackTag_testNameProvider?.();
  fn = function(...args) {
    var currentTest = module$contents$goog$debug$asyncStackTag_testNameProvider?.();
    if (originalTest !== currentTest) {
      throw Error(`${name} was scheduled in '${originalTest}' but called in '${currentTest}'.
Make sure your test awaits all async calls.

TIP: To help investigate, debug the test in Chrome and look at the async portion
of the call stack to see what originally scheduled the callback.  Then, make the
test wait for the relevant asynchronous work to finish.`);
    }
    return originalFn.call(this, ...args);
  };
  if (!module$contents$goog$debug$asyncStackTag_createTask) {
    return fn;
  }
  var consoleTask = module$contents$goog$debug$asyncStackTag_createTask(fn.name || name);
  wrappedFn[(0,goog.asserts.assertExists)(module$contents$goog$debug$asyncStackTag_CONSOLE_TASK_SYMBOL)] = consoleTask;
  return wrappedFn;
}
/** @const */ 
goog.debug.asyncStackTag.wrap = module$contents$goog$debug$asyncStackTag_wrap;
let module$contents$goog$debug$asyncStackTag_testNameProvider;
/** @const */ 
goog.debug.asyncStackTag.setTestNameProvider = provider => {
  if (!goog.DEBUG) {
    throw Error("This feature is debug-only");
  }
  module$contents$goog$debug$asyncStackTag_testNameProvider = provider;
};
/** @const */ 
goog.debug.asyncStackTag.getTestNameProvider = () => {
  if (!goog.DEBUG) {
    throw Error("This feature is debug-only");
  }
  return module$contents$goog$debug$asyncStackTag_testNameProvider;
};
let module$contents$goog$async$run_schedule, module$contents$goog$async$run_workQueueScheduled = !1, module$contents$goog$async$run_workQueue = new module$contents$goog$async$WorkQueue_WorkQueue(), module$contents$goog$async$run_run = (callback, context) => {
  callback = module$contents$goog$debug$asyncStackTag_wrap(callback, "goog.async.run");
  module$contents$goog$async$run_schedule || module$contents$goog$async$run_initializeRunner();
  module$contents$goog$async$run_workQueueScheduled || (module$contents$goog$async$run_schedule(), module$contents$goog$async$run_workQueueScheduled = !0);
  module$contents$goog$async$run_workQueue.add(callback, context);
}, module$contents$goog$async$run_initializeRunner = () => {
  var promise = Promise.resolve(void 0);
  module$contents$goog$async$run_schedule = () => {
    promise.then(module$contents$goog$async$run_processWorkQueueInternal);
  };
};
function module$contents$goog$async$run_processWorkQueueInternal() {
  for (var item; item = module$contents$goog$async$run_workQueue.remove();) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      module$contents$goog$async$throwException_throwException(e);
    }
    module$contents$goog$async$run_workQueue.returnUnused(item);
  }
  module$contents$goog$async$run_workQueueScheduled = !1;
}
/** @const */ 
goog.async.run = module$contents$goog$async$run_run;
function module$contents$goog$dispose_dispose(obj) {
  obj && typeof obj.dispose == "function" && obj.dispose();
}
/** @const */ 
goog.dispose = module$contents$goog$dispose_dispose;
function module$contents$goog$disposeAll_disposeAll(var_args) {
  for (let i = 0, len = arguments.length; i < len; ++i) {
    let disposable = arguments[i];
    goog.isArrayLike(disposable) ? module$contents$goog$disposeAll_disposeAll.apply(null, disposable) : module$contents$goog$dispose_dispose(disposable);
  }
}
/** @const */ 
goog.disposeAll = module$contents$goog$disposeAll_disposeAll;
/** @const */ 
goog.disposable = {};
/** @interface */ 
function module$contents$goog$disposable$IDisposable_IDisposable() {
}
module$contents$goog$disposable$IDisposable_IDisposable.prototype.dispose = function() {
};
module$contents$goog$disposable$IDisposable_IDisposable.prototype.isDisposed = function() {
};
/** @const */ 
goog.disposable.IDisposable = module$contents$goog$disposable$IDisposable_IDisposable;
/** @constructor */ 
function module$contents$goog$Disposable_Disposable() {
  module$contents$goog$Disposable_Disposable.MONITORING_MODE != module$contents$goog$Disposable_Disposable.MonitoringMode.OFF && (module$contents$goog$Disposable_Disposable.instances_[goog.getUid(this)] = this);
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
}
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$Disposable_Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
/** @define {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$Disposable_Disposable.MONITORING_MODE = 0;
module$contents$goog$Disposable_Disposable.instances_ = {};
module$contents$goog$Disposable_Disposable.prototype.disposed_ = !1;
module$contents$goog$Disposable_Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
module$contents$goog$Disposable_Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), module$contents$goog$Disposable_Disposable.MONITORING_MODE != module$contents$goog$Disposable_Disposable.MonitoringMode.OFF)) {
    let uid = goog.getUid(this);
    if (module$contents$goog$Disposable_Disposable.MONITORING_MODE == module$contents$goog$Disposable_Disposable.MonitoringMode.PERMANENT && !module$contents$goog$Disposable_Disposable.instances_.hasOwnProperty(uid)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    if (module$contents$goog$Disposable_Disposable.MONITORING_MODE != module$contents$goog$Disposable_Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {
      throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");
    }
    delete module$contents$goog$Disposable_Disposable.instances_[uid];
  }
};
module$contents$goog$Disposable_Disposable.prototype[Symbol.dispose] = function() {
  this.dispose();
};
module$contents$goog$Disposable_Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (; this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
module$contents$goog$Disposable_Disposable.isDisposed = function(obj) {
  return obj && typeof obj.isDisposed == "function" ? obj.isDisposed() : !1;
};
/** @const */ 
goog.Disposable = module$contents$goog$Disposable_Disposable;
/** @const */ 
goog.events = {};
/** @constructor */ 
function module$contents$goog$events$EventId_EventId(eventId) {
  /** @const */ 
  this.id = eventId;
}
module$contents$goog$events$EventId_EventId.prototype.toString = function() {
  return this.id;
};
/** @const */ 
goog.events.EventId = module$contents$goog$events$EventId_EventId;
/** @constructor */ 
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof module$contents$goog$events$EventId_EventId ? String(type) : type;
  this.currentTarget = this.target = opt_target;
  this.defaultPrevented = this.propagationStopped_ = !1;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
/** @const @enum {!JSDocSerializer_placeholder_type} */ 
goog.events.BrowserFeature = {/** @const */ 
TOUCH_ENABLED:!!(goog.global.navigator && goog.global.navigator.maxTouchPoints || goog.FEATURESET_YEAR < 2018 && ("ontouchstart" in goog.global || goog.global.document && document.documentElement && "ontouchstart" in document.documentElement || goog.global.navigator && goog.global.navigator.msMaxTouchPoints)), /** @const */ 
POINTER_EVENTS:goog.FEATURESET_YEAR >= 2019 || "PointerEvent" in goog.global, /** @const */ 
PASSIVE_EVENTS:goog.FEATURESET_YEAR > 2018 || function() {
  if (!goog.global.addEventListener || !Object.defineProperty) {
    return !1;
  }
  var passive = !1, options = Object.defineProperty({}, "passive", {get:function() {
    passive = !0;
  }});
  try {
    let nullFunction = () => {
    };
    goog.global.addEventListener("test", nullFunction, options);
    goog.global.removeEventListener("test", nullFunction, options);
  } catch (e) {
  }
  return passive;
}()};
/** @const */ 
goog.labs = {};
/** @const */ 
goog.labs.userAgent = {};
/** @const */ 
goog.labs.userAgent.chromiumRebrands = {};
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$labs$userAgent$chromiumRebrands_ChromiumRebrand = {GOOGLE_CHROME:"Google Chrome", BRAVE:"Brave", OPERA:"Opera", EDGE:"Microsoft Edge"};
/** @const */ 
goog.labs.userAgent.chromiumRebrands.ChromiumRebrand = module$contents$goog$labs$userAgent$chromiumRebrands_ChromiumRebrand;
/** @const */ 
var module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles = {TOGGLE_GoogFlags__use_toggles:!1, TOGGLE_GoogFlags__override_disable_toggles:!1, TOGGLE_GoogFlags__use_user_agent_client_hints__enable:!1, TOGGLE_GoogFlags__async_throw_on_unicode_to_byte__enable:!1, TOGGLE_GoogFlags__client_only_wiz_queue_effect_and_on_init_initial_runs__disable:!1, TOGGLE_GoogFlags__client_only_wiz_context_per_component__enable:!1, TOGGLE_GoogFlags__client_only_wiz_lazy_tsx__disable:!1, TOGGLE_GoogFlags__fixed_noopener_behavior__enable:!1, 
TOGGLE_GoogFlags__wiz_enable_native_promise__enable:!1, TOGGLE_GoogFlags__jspb_disallow_message_tojson__enable:!1, TOGGLE_GoogFlags__jspb_use_constant_default_pivot__enable:!1, TOGGLE_GoogFlags__jspb_serialize_with_dynamic_pivot_selector__enable:!1, TOGGLE_GoogFlags__jspb_throw_in_array_constructor_if_array_is_already_constructed__disable:!1, TOGGLE_GoogFlags__optimize_get_ei_from_ved__enable:!1, TOGGLE_GoogFlags__batch_fc_data_fetches_in_microtask__enable:!1, TOGGLE_GoogFlags__use_unobfuscated_rpc_method_names__disable:!1, 
TOGGLE_GoogFlags__minimize_rpc_id_url_params__enable:!1, TOGGLE_GoogFlags__jspb_coerce_int64_by_jstype__enable:!1, TOGGLE_GoogFlags__check_fc_data_parser_breakers__disable:!1, TOGGLE_GoogFlags__log_correct_xhr_error_statuses__disable:!1, TOGGLE_GoogFlags__xpc_use_page_hide__disable:!1, TOGGLE_GoogFlags__optimize_module_info_callbacks__enable:!1, TOGGLE_GoogFlags__optimize_loading_module_ids__enable:!1, TOGGLE_GoogFlags__use_maps_and_sets_in_module_manager__enable:!1, TOGGLE_GoogFlags__optimize_decode_graph__enable:!1, 
TOGGLE_GoogFlags__testonly_disabled_flag__enable:!1, TOGGLE_GoogFlags__testonly_debug_flag__enable:!1, TOGGLE_GoogFlags__testonly_staging_flag__disable:!1, TOGGLE_GoogFlags__testonly_stable_flag__disable:!1};
/** @const */ 
goog.flags = {};
const module$contents$goog$flags_STAGING = goog.readFlagInternalDoNotUseOrElse(1, goog.FLAGS_STAGING_DEFAULT);
/** @const */ 
goog.flags.USE_USER_AGENT_CLIENT_HINTS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_user_agent_client_hints__enable : goog.readFlagInternalDoNotUseOrElse(610401301, !1);
/** @const */ 
goog.flags.ASYNC_THROW_ON_UNICODE_TO_BYTE = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__async_throw_on_unicode_to_byte__enable : goog.readFlagInternalDoNotUseOrElse(899588437, !1);
/** @const */ 
goog.flags.CLIENT_ONLY_WIZ_QUEUE_EFFECT_AND_ON_INIT_INITIAL_RUNS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__client_only_wiz_queue_effect_and_on_init_initial_runs__disable : goog.readFlagInternalDoNotUseOrElse(772657768, 
!0);
/** @const */ 
goog.flags.CLIENT_ONLY_WIZ_CONTEXT_PER_COMPONENT = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__client_only_wiz_context_per_component__enable : goog.readFlagInternalDoNotUseOrElse(513659523, goog.DEBUG);
/** @const */ 
goog.flags.CLIENT_ONLY_WIZ_LAZY_TSX = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__client_only_wiz_lazy_tsx__disable : goog.readFlagInternalDoNotUseOrElse(568333945, !0);
/** @const */ 
goog.flags.FIXED_NOOPENER_BEHAVIOR = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__fixed_noopener_behavior__enable : goog.readFlagInternalDoNotUseOrElse(1331761403, !1);
/** @const */ 
goog.flags.WIZ_ENABLE_NATIVE_PROMISE = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__wiz_enable_native_promise__enable : goog.readFlagInternalDoNotUseOrElse(651175828, goog.DEBUG);
/** @const */ 
goog.flags.JSPB_DISALLOW_MESSAGE_TOJSON = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__jspb_disallow_message_tojson__enable : goog.readFlagInternalDoNotUseOrElse(722764542, goog.DEBUG);
/** @const */ 
goog.flags.JSPB_USE_CONSTANT_DEFAULT_PIVOT = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__jspb_use_constant_default_pivot__enable : goog.readFlagInternalDoNotUseOrElse(748402145, goog.DEBUG);
/** @const */ 
goog.flags.JSPB_SERIALIZE_WITH_DYNAMIC_PIVOT_SELECTOR = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__jspb_serialize_with_dynamic_pivot_selector__enable : goog.readFlagInternalDoNotUseOrElse(748402146, goog.DEBUG);
/** @const */ 
goog.flags.JSPB_THROW_IN_ARRAY_CONSTRUCTOR_IF_ARRAY_IS_ALREADY_CONSTRUCTED = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__jspb_throw_in_array_constructor_if_array_is_already_constructed__disable : goog.readFlagInternalDoNotUseOrElse(748402147, 
!0);
/** @const */ 
goog.flags.OPTIMIZE_GET_EI_FROM_VED = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__optimize_get_ei_from_ved__enable : goog.readFlagInternalDoNotUseOrElse(333098724, !1);
/** @const */ 
goog.flags.BATCH_FC_DATA_FETCHES_IN_MICROTASK = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__batch_fc_data_fetches_in_microtask__enable : goog.readFlagInternalDoNotUseOrElse(861377723, goog.DEBUG);
/** @const */ 
goog.flags.USE_UNOBFUSCATED_RPC_METHOD_NAMES = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.FLAGS_STAGING_DEFAULT && (module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_unobfuscated_rpc_method_names__disable) : goog.readFlagInternalDoNotUseOrElse(861377724, module$contents$goog$flags_STAGING);
/** @const */ 
goog.flags.MINIMIZE_RPC_ID_URL_PARAMS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__minimize_rpc_id_url_params__enable : goog.readFlagInternalDoNotUseOrElse(869336903, goog.DEBUG);
/** @const */ 
goog.flags.JSPB_COERCE_INT64_BY_JSTYPE = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__jspb_coerce_int64_by_jstype__enable : goog.readFlagInternalDoNotUseOrElse(882674507, goog.DEBUG);
/** @const */ 
goog.flags.CHECK_FC_DATA_PARSER_BREAKERS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.FLAGS_STAGING_DEFAULT && (module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__check_fc_data_parser_breakers__disable) : goog.readFlagInternalDoNotUseOrElse(869336904, module$contents$goog$flags_STAGING);
/** @const */ 
goog.flags.LOG_CORRECT_XHR_ERROR_STATUSES = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.FLAGS_STAGING_DEFAULT && (module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__log_correct_xhr_error_statuses__disable) : goog.readFlagInternalDoNotUseOrElse(869336905, module$contents$goog$flags_STAGING);
/** @const */ 
goog.flags.XPC_USE_PAGE_HIDE = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.FLAGS_STAGING_DEFAULT && (module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__xpc_use_page_hide__disable) : goog.readFlagInternalDoNotUseOrElse(1675845485, module$contents$goog$flags_STAGING);
/** @const */ 
goog.flags.OPTIMIZE_MODULE_INFO_CALLBACKS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__optimize_module_info_callbacks__enable : goog.readFlagInternalDoNotUseOrElse(919444824, !1);
/** @const */ 
goog.flags.OPTIMIZE_LOADING_MODULE_IDS = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__optimize_loading_module_ids__enable : goog.readFlagInternalDoNotUseOrElse(916544035, !1);
/** @const */ 
goog.flags.USE_MAPS_AND_SETS_IN_MODULE_MANAGER = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_maps_and_sets_in_module_manager__enable : goog.readFlagInternalDoNotUseOrElse(923536252, !1);
/** @const */ 
goog.flags.OPTIMIZE_DECODE_GRAPH = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__optimize_decode_graph__enable : goog.readFlagInternalDoNotUseOrElse(482019471, !1);
/** @const */ 
goog.flags.TESTONLY_DISABLED_FLAG = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__testonly_disabled_flag__enable : goog.readFlagInternalDoNotUseOrElse(2147483644, !1);
/** @const */ 
goog.flags.TESTONLY_DEBUG_FLAG = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.DEBUG || module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__testonly_debug_flag__enable : goog.readFlagInternalDoNotUseOrElse(2147483645, goog.DEBUG);
/** @const */ 
goog.flags.TESTONLY_STAGING_FLAG = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? goog.FLAGS_STAGING_DEFAULT && (module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__testonly_staging_flag__disable) : goog.readFlagInternalDoNotUseOrElse(2147483646, module$contents$goog$flags_STAGING);
/** @const */ 
goog.flags.TESTONLY_STABLE_FLAG = module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__use_toggles ? module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__override_disable_toggles || !module$exports$google3$third_party$javascript$closure$flags$flags$2etoggles.TOGGLE_GoogFlags__testonly_stable_flag__disable : goog.readFlagInternalDoNotUseOrElse(2147483647, !0);
let module$contents$goog$labs$userAgent_forceClientHintsInTests = !1;
/** @const */ 
goog.labs.userAgent.setUseClientHintsForTesting = use => {
  module$contents$goog$labs$userAgent_forceClientHintsInTests = use;
};
/** @const */ 
goog.labs.userAgent.useClientHints = () => goog.flags.USE_USER_AGENT_CLIENT_HINTS || module$contents$goog$labs$userAgent_forceClientHintsInTests;
/** @const */ 
goog.string = {};
/** @const */ 
goog.string.internal = {};
function module$contents$goog$string$internal_startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
}
function module$contents$goog$string$internal_endsWith(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
}
function module$contents$goog$string$internal_caseInsensitiveStartsWith(str, prefix) {
  return module$contents$goog$string$internal_caseInsensitiveCompare(prefix, str.slice(0, prefix.length)) == 0;
}
function module$contents$goog$string$internal_caseInsensitiveEndsWith(str, suffix) {
  return module$contents$goog$string$internal_caseInsensitiveCompare(suffix, str.slice(str.length - suffix.length)) == 0;
}
function module$contents$goog$string$internal_caseInsensitiveEquals(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
}
function module$contents$goog$string$internal_isEmptyOrWhitespace(str) {
  return /^[\s\xa0]*$/.test(str);
}
const module$contents$goog$string$internal_trim = goog.TRUSTED_SITE && (goog.FEATURESET_YEAR >= 2018 || String.prototype.trim) ? function(str) {
  return str.trim();
} : function(str) {
  return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(str)[1];
};
function module$contents$goog$string$internal_caseInsensitiveCompare(str1, str2) {
  var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
  return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
}
function module$contents$goog$string$internal_newLineToBr(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
}
function module$contents$goog$string$internal_htmlEscape(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(module$contents$goog$string$internal_AMP_RE, "&amp;").replace(module$contents$goog$string$internal_LT_RE, "&lt;").replace(module$contents$goog$string$internal_GT_RE, "&gt;").replace(module$contents$goog$string$internal_QUOT_RE, "&quot;").replace(module$contents$goog$string$internal_SINGLE_QUOTE_RE, "&#39;").replace(module$contents$goog$string$internal_NULL_RE, "&#0;");
  } else {
    if (!module$contents$goog$string$internal_ALL_RE.test(str)) {
      return str;
    }
    str.indexOf("&") != -1 && (str = str.replace(module$contents$goog$string$internal_AMP_RE, "&amp;"));
    str.indexOf("<") != -1 && (str = str.replace(module$contents$goog$string$internal_LT_RE, "&lt;"));
    str.indexOf(">") != -1 && (str = str.replace(module$contents$goog$string$internal_GT_RE, "&gt;"));
    str.indexOf('"') != -1 && (str = str.replace(module$contents$goog$string$internal_QUOT_RE, "&quot;"));
    str.indexOf("'") != -1 && (str = str.replace(module$contents$goog$string$internal_SINGLE_QUOTE_RE, "&#39;"));
    str.indexOf("\x00") != -1 && (str = str.replace(module$contents$goog$string$internal_NULL_RE, "&#0;"));
  }
  return str;
}
/** @const */ 
const module$contents$goog$string$internal_AMP_RE = /&/g, module$contents$goog$string$internal_LT_RE = /</g, module$contents$goog$string$internal_GT_RE = />/g, module$contents$goog$string$internal_QUOT_RE = /"/g, module$contents$goog$string$internal_SINGLE_QUOTE_RE = /'/g, module$contents$goog$string$internal_NULL_RE = /\x00/g, module$contents$goog$string$internal_ALL_RE = /[\x00&<>"']/;
function module$contents$goog$string$internal_whitespaceEscape(str, opt_xml) {
  return module$contents$goog$string$internal_newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
}
function module$contents$goog$string$internal_contains(str, subString) {
  return str.indexOf(subString) != -1;
}
function module$contents$goog$string$internal_caseInsensitiveContains(str, subString) {
  return module$contents$goog$string$internal_contains(str.toLowerCase(), subString.toLowerCase());
}
function module$contents$goog$string$internal_compareVersions(version1, version2) {
  var order = 0, v1Subs = module$contents$goog$string$internal_trim(String(version1)).split("."), v2Subs = module$contents$goog$string$internal_trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length);
  for (let subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    let v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "";
    do {
      let v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ["", "", "", ""], v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ["", "", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      let v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10), v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = module$contents$goog$string$internal_compareElements(v1CompNum, v2CompNum) || module$contents$goog$string$internal_compareElements(v1Comp[2].length == 0, v2Comp[2].length == 0) || module$contents$goog$string$internal_compareElements(v1Comp[2], v2Comp[2]);
      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (order == 0);
  }
  return order;
}
function module$contents$goog$string$internal_compareElements(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
/** @const */ 
goog.string.internal.caseInsensitiveCompare = module$contents$goog$string$internal_caseInsensitiveCompare;
/** @const */ 
goog.string.internal.caseInsensitiveContains = module$contents$goog$string$internal_caseInsensitiveContains;
/** @const */ 
goog.string.internal.caseInsensitiveEndsWith = module$contents$goog$string$internal_caseInsensitiveEndsWith;
/** @const */ 
goog.string.internal.caseInsensitiveEquals = module$contents$goog$string$internal_caseInsensitiveEquals;
/** @const */ 
goog.string.internal.caseInsensitiveStartsWith = module$contents$goog$string$internal_caseInsensitiveStartsWith;
/** @const */ 
goog.string.internal.compareVersions = module$contents$goog$string$internal_compareVersions;
/** @const */ 
goog.string.internal.contains = module$contents$goog$string$internal_contains;
/** @const */ 
goog.string.internal.endsWith = module$contents$goog$string$internal_endsWith;
/** @const */ 
goog.string.internal.htmlEscape = module$contents$goog$string$internal_htmlEscape;
/** @const */ 
goog.string.internal.isEmptyOrWhitespace = module$contents$goog$string$internal_isEmptyOrWhitespace;
/** @const */ 
goog.string.internal.newLineToBr = module$contents$goog$string$internal_newLineToBr;
/** @const */ 
goog.string.internal.startsWith = module$contents$goog$string$internal_startsWith;
/** @const */ 
goog.string.internal.trim = module$contents$goog$string$internal_trim;
/** @const */ 
goog.string.internal.whitespaceEscape = module$contents$goog$string$internal_whitespaceEscape;
/** @const */ 
goog.labs.userAgent.util = {};
function module$contents$goog$labs$userAgent$util_getNativeUserAgentString() {
  var navigator = goog.global.navigator;
  if (navigator) {
    let userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
}
function module$contents$goog$labs$userAgent$util_getNativeUserAgentData() {
  var navigator = goog.global.navigator;
  return navigator ? navigator.userAgentData || null : null;
}
let module$contents$goog$labs$userAgent$util_userAgentInternal = null, module$contents$goog$labs$userAgent$util_userAgentDataInternal = module$contents$goog$labs$userAgent$util_getNativeUserAgentData();
function module$contents$goog$labs$userAgent$util_setUserAgent(userAgent) {
  module$contents$goog$labs$userAgent$util_userAgentInternal = typeof userAgent === "string" ? userAgent : module$contents$goog$labs$userAgent$util_getNativeUserAgentString();
}
function module$contents$goog$labs$userAgent$util_getUserAgent() {
  return module$contents$goog$labs$userAgent$util_userAgentInternal == null ? module$contents$goog$labs$userAgent$util_getNativeUserAgentString() : module$contents$goog$labs$userAgent$util_userAgentInternal;
}
function module$contents$goog$labs$userAgent$util_setUserAgentData(userAgentData) {
  module$contents$goog$labs$userAgent$util_userAgentDataInternal = userAgentData;
}
function module$contents$goog$labs$userAgent$util_resetUserAgentData() {
  module$contents$goog$labs$userAgent$util_userAgentDataInternal = module$contents$goog$labs$userAgent$util_getNativeUserAgentData();
}
function module$contents$goog$labs$userAgent$util_getUserAgentData() {
  return module$contents$goog$labs$userAgent$util_userAgentDataInternal;
}
function module$contents$goog$labs$userAgent$util_matchUserAgentDataBrand(str) {
  if (!(0,goog.labs.userAgent.useClientHints)()) {
    return !1;
  }
  var data = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
  if (!data) {
    return !1;
  }
  for (let i = 0; i < data.brands.length; i++) {
    let {brand} = data.brands[i];
    if (brand && module$contents$goog$string$internal_contains(brand, str)) {
      return !0;
    }
  }
  return !1;
}
function module$contents$goog$labs$userAgent$util_matchUserAgent(str) {
  var userAgent = module$contents$goog$labs$userAgent$util_getUserAgent();
  return module$contents$goog$string$internal_contains(userAgent, str);
}
function module$contents$goog$labs$userAgent$util_matchUserAgentIgnoreCase(str) {
  var userAgent = module$contents$goog$labs$userAgent$util_getUserAgent();
  return module$contents$goog$string$internal_caseInsensitiveContains(userAgent, str);
}
function module$contents$goog$labs$userAgent$util_extractVersionTuples(userAgent) {
  for (var versionRegExp = RegExp("([A-Z][\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), data = [], match; match = versionRegExp.exec(userAgent);) {
    data.push([match[1], match[2], match[3] || void 0]);
  }
  return data;
}
/** @const */ 
goog.labs.userAgent.util.ASSUME_CLIENT_HINTS_SUPPORT = !1;
/** @const */ 
goog.labs.userAgent.util.extractVersionTuples = module$contents$goog$labs$userAgent$util_extractVersionTuples;
/** @const */ 
goog.labs.userAgent.util.getNativeUserAgentString = module$contents$goog$labs$userAgent$util_getNativeUserAgentString;
/** @const */ 
goog.labs.userAgent.util.getUserAgent = module$contents$goog$labs$userAgent$util_getUserAgent;
/** @const */ 
goog.labs.userAgent.util.getUserAgentData = module$contents$goog$labs$userAgent$util_getUserAgentData;
/** @const */ 
goog.labs.userAgent.util.matchUserAgent = module$contents$goog$labs$userAgent$util_matchUserAgent;
/** @const */ 
goog.labs.userAgent.util.matchUserAgentDataBrand = module$contents$goog$labs$userAgent$util_matchUserAgentDataBrand;
/** @const */ 
goog.labs.userAgent.util.matchUserAgentIgnoreCase = module$contents$goog$labs$userAgent$util_matchUserAgentIgnoreCase;
/** @const */ 
goog.labs.userAgent.util.resetUserAgentData = module$contents$goog$labs$userAgent$util_resetUserAgentData;
/** @const */ 
goog.labs.userAgent.util.setUserAgent = module$contents$goog$labs$userAgent$util_setUserAgent;
/** @const */ 
goog.labs.userAgent.util.setUserAgentData = module$contents$goog$labs$userAgent$util_setUserAgentData;
/** @const */ 
var module$exports$goog$labs$userAgent$highEntropy$highEntropyValue = {AsyncValue:class {
  getIfLoaded() {
  }
  load() {
  }
}, HighEntropyValue:class {
  constructor(key) {
    /** @const */ 
    this.key_ = key;
    this.promise_ = this.value_ = void 0;
    this.pending_ = !1;
  }
  getIfLoaded() {
    var userAgentData = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
    if (userAgentData) {
      return this.value_;
    }
  }
  async load() {
    var userAgentData = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
    if (userAgentData) {
      return this.promise_ || (this.pending_ = !0, this.promise_ = (async() => {
        var \u1d43\u1d9cfactorym2110036436$0 = $jscomp.asyncContextStart(), \u1d43\u1d9csuspendm2110036436$0 = \u1d43\u1d9cfactorym2110036436$0(), \u1d43\u1d9cresumem2110036436$0 = \u1d43\u1d9cfactorym2110036436$0(1);
        try {
          try {
            let dataValues = \u1d43\u1d9cresumem2110036436$0(await \u1d43\u1d9csuspendm2110036436$0(userAgentData.getHighEntropyValues([this.key_])));
            return this.value_ = dataValues[this.key_];
          } finally {
            \u1d43\u1d9cresumem2110036436$0(), this.pending_ = !1;
          }
        } finally {
          \u1d43\u1d9csuspendm2110036436$0();
        }
      })()), await this.promise_;
    }
  }
  resetForTesting() {
    if (this.pending_) {
      throw Error("Unsafe call to resetForTesting");
    }
    this.value_ = this.promise_ = void 0;
    this.pending_ = !1;
  }
}, Version:class {
  constructor(versionString) {
    /** @const */ 
    this.versionString_ = versionString;
  }
  isAtLeast(version) {
    return module$contents$goog$string$internal_compareVersions(this.versionString_, version) >= 0;
  }
}};
/** @const */ 
var module$exports$goog$labs$userAgent$highEntropy$highEntropyData = {};
/** @const */ 
module$exports$goog$labs$userAgent$highEntropy$highEntropyData.fullVersionList = new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.HighEntropyValue("fullVersionList");
/** @const */ 
module$exports$goog$labs$userAgent$highEntropy$highEntropyData.platformVersion = new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.HighEntropyValue("platformVersion");
/** @const */ 
goog.labs.userAgent.browser = {};
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$labs$userAgent$browser_Brand = {ANDROID_BROWSER:"Android Browser", CHROMIUM:"Chromium", EDGE:"Microsoft Edge", FIREFOX:"Firefox", IE:"Internet Explorer", OPERA:"Opera", SAFARI:"Safari", SILK:"Silk"};
/** @const */ 
goog.labs.userAgent.browser.Brand = module$contents$goog$labs$userAgent$browser_Brand;
function module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand(ignoreClientHintsFlag = !1) {
  if (!ignoreClientHintsFlag && !(0,goog.labs.userAgent.useClientHints)()) {
    return !1;
  }
  var userAgentData = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
  return !!userAgentData && userAgentData.brands.length > 0;
}
function module$contents$goog$labs$userAgent$browser_matchOpera() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? !1 : module$contents$goog$labs$userAgent$util_matchUserAgent("Opera");
}
function module$contents$goog$labs$userAgent$browser_matchIE() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? !1 : module$contents$goog$labs$userAgent$util_matchUserAgent("Trident") || module$contents$goog$labs$userAgent$util_matchUserAgent("MSIE");
}
function module$contents$goog$labs$userAgent$browser_matchEdgeHtml() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? !1 : module$contents$goog$labs$userAgent$util_matchUserAgent("Edge");
}
function module$contents$goog$labs$userAgent$browser_matchEdgeChromium() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? module$contents$goog$labs$userAgent$util_matchUserAgentDataBrand(module$contents$goog$labs$userAgent$browser_Brand.EDGE) : module$contents$goog$labs$userAgent$util_matchUserAgent("Edg/");
}
function module$contents$goog$labs$userAgent$browser_matchOperaChromium() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? module$contents$goog$labs$userAgent$util_matchUserAgentDataBrand(module$contents$goog$labs$userAgent$browser_Brand.OPERA) : module$contents$goog$labs$userAgent$util_matchUserAgent("OPR");
}
function module$contents$goog$labs$userAgent$browser_matchFirefox() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Firefox") || module$contents$goog$labs$userAgent$util_matchUserAgent("FxiOS");
}
function module$contents$goog$labs$userAgent$browser_matchSafari() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Safari") && !(module$contents$goog$labs$userAgent$browser_matchChrome() || module$contents$goog$labs$userAgent$browser_matchCoast() || module$contents$goog$labs$userAgent$browser_matchOpera() || module$contents$goog$labs$userAgent$browser_matchEdgeHtml() || module$contents$goog$labs$userAgent$browser_matchEdgeChromium() || module$contents$goog$labs$userAgent$browser_matchOperaChromium() || module$contents$goog$labs$userAgent$browser_matchFirefox() || 
  module$contents$goog$labs$userAgent$browser_isSilk() || module$contents$goog$labs$userAgent$util_matchUserAgent("Android"));
}
function module$contents$goog$labs$userAgent$browser_matchCoast() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? !1 : module$contents$goog$labs$userAgent$util_matchUserAgent("Coast");
}
function module$contents$goog$labs$userAgent$browser_matchIosWebview() {
  return (module$contents$goog$labs$userAgent$util_matchUserAgent("iPad") || module$contents$goog$labs$userAgent$util_matchUserAgent("iPhone")) && !module$contents$goog$labs$userAgent$browser_matchSafari() && !module$contents$goog$labs$userAgent$browser_matchChrome() && !module$contents$goog$labs$userAgent$browser_matchCoast() && !module$contents$goog$labs$userAgent$browser_matchFirefox() && module$contents$goog$labs$userAgent$util_matchUserAgent("AppleWebKit");
}
function module$contents$goog$labs$userAgent$browser_matchChrome() {
  return module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() ? module$contents$goog$labs$userAgent$util_matchUserAgentDataBrand(module$contents$goog$labs$userAgent$browser_Brand.CHROMIUM) : (module$contents$goog$labs$userAgent$util_matchUserAgent("Chrome") || module$contents$goog$labs$userAgent$util_matchUserAgent("CriOS")) && !module$contents$goog$labs$userAgent$browser_matchEdgeHtml() || module$contents$goog$labs$userAgent$browser_isSilk();
}
function module$contents$goog$labs$userAgent$browser_matchAndroidBrowser() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Android") && !(module$contents$goog$labs$userAgent$browser_matchChrome() || module$contents$goog$labs$userAgent$browser_matchFirefox() || module$contents$goog$labs$userAgent$browser_matchOpera() || module$contents$goog$labs$userAgent$browser_isSilk());
}
/** @const */ 
goog.labs.userAgent.browser.isOpera = module$contents$goog$labs$userAgent$browser_matchOpera;
/** @const */ 
goog.labs.userAgent.browser.isIE = module$contents$goog$labs$userAgent$browser_matchIE;
/** @const */ 
goog.labs.userAgent.browser.isEdge = module$contents$goog$labs$userAgent$browser_matchEdgeHtml;
/** @const */ 
goog.labs.userAgent.browser.isEdgeChromium = module$contents$goog$labs$userAgent$browser_matchEdgeChromium;
/** @const */ 
goog.labs.userAgent.browser.isOperaChromium = module$contents$goog$labs$userAgent$browser_matchOperaChromium;
/** @const */ 
goog.labs.userAgent.browser.isFirefox = module$contents$goog$labs$userAgent$browser_matchFirefox;
/** @const */ 
goog.labs.userAgent.browser.isSafari = module$contents$goog$labs$userAgent$browser_matchSafari;
/** @const */ 
goog.labs.userAgent.browser.isCoast = module$contents$goog$labs$userAgent$browser_matchCoast;
/** @const */ 
goog.labs.userAgent.browser.isIosWebview = module$contents$goog$labs$userAgent$browser_matchIosWebview;
/** @const */ 
goog.labs.userAgent.browser.isChrome = module$contents$goog$labs$userAgent$browser_matchChrome;
/** @const */ 
goog.labs.userAgent.browser.isAndroidBrowser = module$contents$goog$labs$userAgent$browser_matchAndroidBrowser;
function module$contents$goog$labs$userAgent$browser_isSilk() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Silk");
}
/** @const */ 
goog.labs.userAgent.browser.isSilk = module$contents$goog$labs$userAgent$browser_isSilk;
function module$contents$goog$labs$userAgent$browser_createVersionMap(versionTuples) {
  var versionMap = {};
  versionTuples.forEach(tuple => {
    var key = tuple[0], value = tuple[1];
    versionMap[key] = value;
  });
  return keys => versionMap[keys.find(key => key in versionMap)] || "";
}
function module$contents$goog$labs$userAgent$browser_getVersion() {
  var userAgentString = module$contents$goog$labs$userAgent$util_getUserAgent();
  if (module$contents$goog$labs$userAgent$browser_matchIE()) {
    return module$contents$goog$labs$userAgent$browser_getIEVersion(userAgentString);
  }
  var versionTuples = module$contents$goog$labs$userAgent$util_extractVersionTuples(userAgentString), lookUpValueWithKeys = module$contents$goog$labs$userAgent$browser_createVersionMap(versionTuples);
  if (module$contents$goog$labs$userAgent$browser_matchOpera()) {
    return lookUpValueWithKeys(["Version", "Opera"]);
  }
  if (module$contents$goog$labs$userAgent$browser_matchEdgeHtml()) {
    return lookUpValueWithKeys(["Edge"]);
  }
  if (module$contents$goog$labs$userAgent$browser_matchEdgeChromium()) {
    return lookUpValueWithKeys(["Edg"]);
  }
  if (module$contents$goog$labs$userAgent$browser_isSilk()) {
    return lookUpValueWithKeys(["Silk"]);
  }
  if (module$contents$goog$labs$userAgent$browser_matchChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS", "HeadlessChrome"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
}
/** @const */ 
goog.labs.userAgent.browser.getVersion = module$contents$goog$labs$userAgent$browser_getVersion;
function module$contents$goog$labs$userAgent$browser_isVersionOrHigher(version) {
  return module$contents$goog$string$internal_compareVersions(module$contents$goog$labs$userAgent$browser_getVersion(), version) >= 0;
}
/** @const */ 
goog.labs.userAgent.browser.isVersionOrHigher = module$contents$goog$labs$userAgent$browser_isVersionOrHigher;
function module$contents$goog$labs$userAgent$browser_getIEVersion(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "", msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    let tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
}
function module$contents$goog$labs$userAgent$browser_getFullVersionFromUserAgentString(browser) {
  var userAgentString = module$contents$goog$labs$userAgent$util_getUserAgent();
  if (browser === module$contents$goog$labs$userAgent$browser_Brand.IE) {
    return module$contents$goog$labs$userAgent$browser_matchIE() ? module$contents$goog$labs$userAgent$browser_getIEVersion(userAgentString) : "";
  }
  var versionTuples = module$contents$goog$labs$userAgent$util_extractVersionTuples(userAgentString), lookUpValueWithKeys = module$contents$goog$labs$userAgent$browser_createVersionMap(versionTuples);
  switch(browser) {
    case module$contents$goog$labs$userAgent$browser_Brand.OPERA:
      if (module$contents$goog$labs$userAgent$browser_matchOpera()) {
        return lookUpValueWithKeys(["Version", "Opera"]);
      }
      if (module$contents$goog$labs$userAgent$browser_matchOperaChromium()) {
        return lookUpValueWithKeys(["OPR"]);
      }
      break;
    case module$contents$goog$labs$userAgent$browser_Brand.EDGE:
      if (module$contents$goog$labs$userAgent$browser_matchEdgeHtml()) {
        return lookUpValueWithKeys(["Edge"]);
      }
      if (module$contents$goog$labs$userAgent$browser_matchEdgeChromium()) {
        return lookUpValueWithKeys(["Edg"]);
      }
      break;
    case module$contents$goog$labs$userAgent$browser_Brand.CHROMIUM:
      if (module$contents$goog$labs$userAgent$browser_matchChrome()) {
        return lookUpValueWithKeys(["Chrome", "CriOS", "HeadlessChrome"]);
      }
  }
  if (browser === module$contents$goog$labs$userAgent$browser_Brand.FIREFOX && module$contents$goog$labs$userAgent$browser_matchFirefox() || browser === module$contents$goog$labs$userAgent$browser_Brand.SAFARI && module$contents$goog$labs$userAgent$browser_matchSafari() || browser === module$contents$goog$labs$userAgent$browser_Brand.ANDROID_BROWSER && module$contents$goog$labs$userAgent$browser_matchAndroidBrowser() || browser === module$contents$goog$labs$userAgent$browser_Brand.SILK && module$contents$goog$labs$userAgent$browser_isSilk()) {
    let tuple = versionTuples[2];
    return tuple && tuple[1] || "";
  }
  return "";
}
function module$contents$goog$labs$userAgent$browser_versionOf_(browser) {
  if (module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand() && browser !== module$contents$goog$labs$userAgent$browser_Brand.SILK) {
    let data = module$contents$goog$labs$userAgent$util_userAgentDataInternal, matchingBrand = data.brands.find(({brand}) => brand === browser);
    if (!matchingBrand || !matchingBrand.version) {
      return NaN;
    }
    var versionParts = matchingBrand.version.split(".");
  } else {
    let fullVersion = module$contents$goog$labs$userAgent$browser_getFullVersionFromUserAgentString(browser);
    if (fullVersion === "") {
      return NaN;
    }
    versionParts = fullVersion.split(".");
  }
  if (versionParts.length === 0) {
    return NaN;
  }
  var majorVersion = versionParts[0];
  return Number(majorVersion);
}
function module$contents$goog$labs$userAgent$browser_isAtLeast(brand, majorVersion) {
  (0,goog.asserts.assert)(Math.floor(majorVersion) === majorVersion, "Major version must be an integer");
  return module$contents$goog$labs$userAgent$browser_versionOf_(brand) >= majorVersion;
}
/** @const */ 
goog.labs.userAgent.browser.isAtLeast = module$contents$goog$labs$userAgent$browser_isAtLeast;
function module$contents$goog$labs$userAgent$browser_isAtMost(brand, majorVersion) {
  (0,goog.asserts.assert)(Math.floor(majorVersion) === majorVersion, "Major version must be an integer");
  return module$contents$goog$labs$userAgent$browser_versionOf_(brand) <= majorVersion;
}
/** @const */ 
goog.labs.userAgent.browser.isAtMost = module$contents$goog$labs$userAgent$browser_isAtMost;
class module$contents$goog$labs$userAgent$browser_HighEntropyBrandVersion {
  constructor(brand, useUach, fallbackVersion) {
    /** @const */ 
    this.brand_ = brand;
    /** @const */ 
    this.version_ = new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(fallbackVersion);
    /** @const */ 
    this.useUach_ = useUach;
  }
  getIfLoaded() {
    if (this.useUach_) {
      let loadedVersionList = module$exports$goog$labs$userAgent$highEntropy$highEntropyData.fullVersionList.getIfLoaded();
      if (loadedVersionList !== void 0) {
        let matchingBrand = loadedVersionList.find(({brand}) => this.brand_ === brand);
        (0,goog.asserts.assertExists)(matchingBrand);
        return new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(matchingBrand.version);
      }
    }
    if (module$contents$goog$labs$userAgent$browser_preUachHasLoaded) {
      return this.version_;
    }
  }
  async load() {
    var \u1d43\u1d9cfactory1683157560$0 = $jscomp.asyncContextStart(), \u1d43\u1d9csuspend1683157560$0 = \u1d43\u1d9cfactory1683157560$0(), \u1d43\u1d9cresume1683157560$0 = \u1d43\u1d9cfactory1683157560$0(1);
    try {
      if (this.useUach_) {
        let loadedVersionList = \u1d43\u1d9cresume1683157560$0(await \u1d43\u1d9csuspend1683157560$0(module$exports$goog$labs$userAgent$highEntropy$highEntropyData.fullVersionList.load()));
        if (loadedVersionList !== void 0) {
          let matchingBrand = loadedVersionList.find(({brand}) => this.brand_ === brand);
          (0,goog.asserts.assertExists)(matchingBrand);
          return new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(matchingBrand.version);
        }
      } else {
        \u1d43\u1d9cresume1683157560$0(await \u1d43\u1d9csuspend1683157560$0(0));
      }
      module$contents$goog$labs$userAgent$browser_preUachHasLoaded = !0;
      return this.version_;
    } finally {
      \u1d43\u1d9csuspend1683157560$0();
    }
  }
}
let module$contents$goog$labs$userAgent$browser_preUachHasLoaded = !1;
async function module$contents$goog$labs$userAgent$browser_loadFullVersions() {
  var \u1d43\u1d9cfactory1683157560$1 = $jscomp.asyncContextStart(), \u1d43\u1d9csuspend1683157560$1 = \u1d43\u1d9cfactory1683157560$1(), \u1d43\u1d9cresume1683157560$1 = \u1d43\u1d9cfactory1683157560$1(1);
  try {
    module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand(!0) && \u1d43\u1d9cresume1683157560$1(await \u1d43\u1d9csuspend1683157560$1(module$exports$goog$labs$userAgent$highEntropy$highEntropyData.fullVersionList.load())), module$contents$goog$labs$userAgent$browser_preUachHasLoaded = !0;
  } finally {
    \u1d43\u1d9csuspend1683157560$1();
  }
}
/** @const */ 
goog.labs.userAgent.browser.loadFullVersions = module$contents$goog$labs$userAgent$browser_loadFullVersions;
/** @const */ 
goog.labs.userAgent.browser.resetForTesting = () => {
  module$contents$goog$labs$userAgent$browser_preUachHasLoaded = !1;
  module$exports$goog$labs$userAgent$highEntropy$highEntropyData.fullVersionList.resetForTesting();
};
function module$contents$goog$labs$userAgent$browser_fullVersionOf(browser) {
  var fallbackVersionString = "";
  module$contents$goog$labs$userAgent$browser_isAtLeast(module$contents$goog$labs$userAgent$browser_Brand.CHROMIUM, 98) || (fallbackVersionString = module$contents$goog$labs$userAgent$browser_getFullVersionFromUserAgentString(browser));
  var useUach = browser !== module$contents$goog$labs$userAgent$browser_Brand.SILK && module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand(!0);
  if (useUach) {
    let data = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
    if (!data.brands.find(({brand}) => brand === browser)) {
      return;
    }
  } else if (fallbackVersionString === "") {
    return;
  }
  return new module$contents$goog$labs$userAgent$browser_HighEntropyBrandVersion(browser, useUach, fallbackVersionString);
}
/** @const */ 
goog.labs.userAgent.browser.fullVersionOf = module$contents$goog$labs$userAgent$browser_fullVersionOf;
function module$contents$goog$labs$userAgent$browser_getVersionStringForLogging(browser) {
  if (module$contents$goog$labs$userAgent$browser_useUserAgentDataBrand(!0)) {
    let fullVersionObj = module$contents$goog$labs$userAgent$browser_fullVersionOf(browser);
    if (fullVersionObj) {
      let fullVersion = fullVersionObj.getIfLoaded();
      if (fullVersion) {
        return fullVersion.versionString_;
      }
      let data = module$contents$goog$labs$userAgent$util_userAgentDataInternal, matchingBrand = data.brands.find(({brand}) => brand === browser);
      (0,goog.asserts.assertExists)(matchingBrand);
      return matchingBrand.version;
    }
    return "";
  }
  return module$contents$goog$labs$userAgent$browser_getFullVersionFromUserAgentString(browser);
}
/** @const */ 
goog.labs.userAgent.browser.getVersionStringForLogging = module$contents$goog$labs$userAgent$browser_getVersionStringForLogging;
/** @const */ 
goog.labs.userAgent.engine = {};
function module$contents$goog$labs$userAgent$engine_isPresto() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Presto");
}
function module$contents$goog$labs$userAgent$engine_isTrident() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Trident") || module$contents$goog$labs$userAgent$util_matchUserAgent("MSIE");
}
function module$contents$goog$labs$userAgent$engine_isEdge() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Edge");
}
function module$contents$goog$labs$userAgent$engine_isWebKit() {
  return module$contents$goog$labs$userAgent$util_matchUserAgentIgnoreCase("WebKit") && !module$contents$goog$labs$userAgent$engine_isEdge();
}
function module$contents$goog$labs$userAgent$engine_isGecko() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("Gecko") && !module$contents$goog$labs$userAgent$engine_isWebKit() && !module$contents$goog$labs$userAgent$engine_isTrident() && !module$contents$goog$labs$userAgent$engine_isEdge();
}
function module$contents$goog$labs$userAgent$engine_getVersion() {
  var userAgentString = module$contents$goog$labs$userAgent$util_getUserAgent();
  if (userAgentString) {
    let tuples = module$contents$goog$labs$userAgent$util_extractVersionTuples(userAgentString);
    a: {
      if (module$contents$goog$labs$userAgent$engine_isEdge()) {
        for (let i = 0; i < tuples.length; i++) {
          let tuple = tuples[i];
          if (tuple[0] == "Edge") {
            var JSCompiler_inline_result = tuple;
            break a;
          }
        }
        JSCompiler_inline_result = void 0;
      } else {
        JSCompiler_inline_result = tuples[1];
      }
    }
    let engineTuple = JSCompiler_inline_result;
    if (engineTuple) {
      return engineTuple[0] == "Gecko" ? module$contents$goog$labs$userAgent$engine_getVersionForKey(tuples, "Firefox") : engineTuple[1];
    }
    let browserTuple = tuples[0], info;
    if (browserTuple && (info = browserTuple[2])) {
      let match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
}
function module$contents$goog$labs$userAgent$engine_isVersionOrHigher(version) {
  return module$contents$goog$string$internal_compareVersions(module$contents$goog$labs$userAgent$engine_getVersion(), version) >= 0;
}
function module$contents$goog$labs$userAgent$engine_getVersionForKey(tuples, key) {
  var pair = module$contents$goog$array_find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
}
/** @const */ 
goog.labs.userAgent.engine.getVersion = module$contents$goog$labs$userAgent$engine_getVersion;
/** @const */ 
goog.labs.userAgent.engine.isEdge = module$contents$goog$labs$userAgent$engine_isEdge;
/** @const */ 
goog.labs.userAgent.engine.isGecko = module$contents$goog$labs$userAgent$engine_isGecko;
/** @const */ 
goog.labs.userAgent.engine.isPresto = module$contents$goog$labs$userAgent$engine_isPresto;
/** @const */ 
goog.labs.userAgent.engine.isTrident = module$contents$goog$labs$userAgent$engine_isTrident;
/** @const */ 
goog.labs.userAgent.engine.isVersionOrHigher = module$contents$goog$labs$userAgent$engine_isVersionOrHigher;
/** @const */ 
goog.labs.userAgent.engine.isWebKit = module$contents$goog$labs$userAgent$engine_isWebKit;
/** @const */ 
goog.labs.userAgent.platform = {};
function module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform(ignoreClientHintsFlag = !1) {
  if (!ignoreClientHintsFlag && !(0,goog.labs.userAgent.useClientHints)()) {
    return !1;
  }
  var userAgentData = module$contents$goog$labs$userAgent$util_userAgentDataInternal;
  return !!userAgentData && !!userAgentData.platform;
}
function module$contents$goog$labs$userAgent$platform_isAndroid() {
  return module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform() ? module$contents$goog$labs$userAgent$util_userAgentDataInternal.platform === "Android" : module$contents$goog$labs$userAgent$util_matchUserAgent("Android");
}
function module$contents$goog$labs$userAgent$platform_isIpod() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("iPod");
}
function module$contents$goog$labs$userAgent$platform_isIphone() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("iPhone") && !module$contents$goog$labs$userAgent$util_matchUserAgent("iPod") && !module$contents$goog$labs$userAgent$util_matchUserAgent("iPad");
}
function module$contents$goog$labs$userAgent$platform_isIpad() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("iPad");
}
function module$contents$goog$labs$userAgent$platform_isIos() {
  return module$contents$goog$labs$userAgent$platform_isIphone() || module$contents$goog$labs$userAgent$platform_isIpad() || module$contents$goog$labs$userAgent$platform_isIpod();
}
function module$contents$goog$labs$userAgent$platform_isMacintosh() {
  return module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform() ? module$contents$goog$labs$userAgent$util_userAgentDataInternal.platform === "macOS" : module$contents$goog$labs$userAgent$util_matchUserAgent("Macintosh");
}
function module$contents$goog$labs$userAgent$platform_isLinux() {
  return module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform() ? module$contents$goog$labs$userAgent$util_userAgentDataInternal.platform === "Linux" : module$contents$goog$labs$userAgent$util_matchUserAgent("Linux");
}
function module$contents$goog$labs$userAgent$platform_isWindows() {
  return module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform() ? module$contents$goog$labs$userAgent$util_userAgentDataInternal.platform === "Windows" : module$contents$goog$labs$userAgent$util_matchUserAgent("Windows");
}
function module$contents$goog$labs$userAgent$platform_isChromeOS() {
  return module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform() ? module$contents$goog$labs$userAgent$util_userAgentDataInternal.platform === "Chrome OS" : module$contents$goog$labs$userAgent$util_matchUserAgent("CrOS");
}
function module$contents$goog$labs$userAgent$platform_isChromecast() {
  return module$contents$goog$labs$userAgent$util_matchUserAgent("CrKey");
}
function module$contents$goog$labs$userAgent$platform_isKaiOS() {
  return module$contents$goog$labs$userAgent$util_matchUserAgentIgnoreCase("KaiOS");
}
function module$contents$goog$labs$userAgent$platform_getVersion() {
  var userAgentString = module$contents$goog$labs$userAgent$util_getUserAgent(), version = "";
  if (module$contents$goog$labs$userAgent$platform_isWindows()) {
    var re = /Windows (?:NT|Phone) ([0-9.]+)/;
    let match = re.exec(userAgentString);
    version = match ? match[1] : "0.0";
  } else if (module$contents$goog$labs$userAgent$platform_isIos()) {
    re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
    let match = re.exec(userAgentString);
    version = match && match[1].replace(/_/g, ".");
  } else if (module$contents$goog$labs$userAgent$platform_isMacintosh()) {
    re = /Mac OS X ([0-9_.]+)/;
    let match = re.exec(userAgentString);
    version = match ? match[1].replace(/_/g, ".") : "10";
  } else if (module$contents$goog$labs$userAgent$platform_isKaiOS()) {
    re = /(?:KaiOS)\/(\S+)/i;
    let match = re.exec(userAgentString);
    version = match && match[1];
  } else if (module$contents$goog$labs$userAgent$platform_isAndroid()) {
    re = /Android\s+([^\);]+)(\)|;)/;
    let match = re.exec(userAgentString);
    version = match && match[1];
  } else if (module$contents$goog$labs$userAgent$platform_isChromeOS()) {
    re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
    let match = re.exec(userAgentString);
    version = match && match[1];
  }
  return version || "";
}
function module$contents$goog$labs$userAgent$platform_isVersionOrHigher(version) {
  return module$contents$goog$string$internal_compareVersions(module$contents$goog$labs$userAgent$platform_getVersion(), version) >= 0;
}
class module$contents$goog$labs$userAgent$platform_PlatformVersion {
  constructor() {
    this.preUachHasLoaded_ = !1;
  }
  getIfLoaded() {
    if (module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform(!0)) {
      let loadedPlatformVersion = module$exports$goog$labs$userAgent$highEntropy$highEntropyData.platformVersion.getIfLoaded();
      return loadedPlatformVersion === void 0 ? void 0 : new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(loadedPlatformVersion);
    }
    if (this.preUachHasLoaded_) {
      return new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(module$contents$goog$labs$userAgent$platform_getVersion());
    }
  }
  async load() {
    var \u1d43\u1d9cfactorym1628565157$0 = $jscomp.asyncContextStart(), \u1d43\u1d9csuspendm1628565157$0 = \u1d43\u1d9cfactorym1628565157$0(), \u1d43\u1d9cresumem1628565157$0 = \u1d43\u1d9cfactorym1628565157$0(1);
    try {
      if (module$contents$goog$labs$userAgent$platform_useUserAgentDataPlatform(!0)) {
        return new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(\u1d43\u1d9cresumem1628565157$0(await \u1d43\u1d9csuspendm1628565157$0(module$exports$goog$labs$userAgent$highEntropy$highEntropyData.platformVersion.load())));
      }
      this.preUachHasLoaded_ = !0;
      return new module$exports$goog$labs$userAgent$highEntropy$highEntropyValue.Version(module$contents$goog$labs$userAgent$platform_getVersion());
    } finally {
      \u1d43\u1d9csuspendm1628565157$0();
    }
  }
  resetForTesting() {
    module$exports$goog$labs$userAgent$highEntropy$highEntropyData.platformVersion.resetForTesting();
    this.preUachHasLoaded_ = !1;
  }
}
const module$contents$goog$labs$userAgent$platform_version = new module$contents$goog$labs$userAgent$platform_PlatformVersion();
/** @const */ 
goog.labs.userAgent.platform.getVersion = module$contents$goog$labs$userAgent$platform_getVersion;
/** @const */ 
goog.labs.userAgent.platform.isAndroid = module$contents$goog$labs$userAgent$platform_isAndroid;
/** @const */ 
goog.labs.userAgent.platform.isChromeOS = module$contents$goog$labs$userAgent$platform_isChromeOS;
/** @const */ 
goog.labs.userAgent.platform.isChromecast = module$contents$goog$labs$userAgent$platform_isChromecast;
/** @const */ 
goog.labs.userAgent.platform.isIos = module$contents$goog$labs$userAgent$platform_isIos;
/** @const */ 
goog.labs.userAgent.platform.isIpad = module$contents$goog$labs$userAgent$platform_isIpad;
/** @const */ 
goog.labs.userAgent.platform.isIphone = module$contents$goog$labs$userAgent$platform_isIphone;
/** @const */ 
goog.labs.userAgent.platform.isIpod = module$contents$goog$labs$userAgent$platform_isIpod;
/** @const */ 
goog.labs.userAgent.platform.isKaiOS = module$contents$goog$labs$userAgent$platform_isKaiOS;
/** @const */ 
goog.labs.userAgent.platform.isLinux = module$contents$goog$labs$userAgent$platform_isLinux;
/** @const */ 
goog.labs.userAgent.platform.isMacintosh = module$contents$goog$labs$userAgent$platform_isMacintosh;
/** @const */ 
goog.labs.userAgent.platform.isVersionOrHigher = module$contents$goog$labs$userAgent$platform_isVersionOrHigher;
/** @const */ 
goog.labs.userAgent.platform.isWindows = module$contents$goog$labs$userAgent$platform_isWindows;
/** @const */ 
goog.labs.userAgent.platform.version = module$contents$goog$labs$userAgent$platform_version;
/** @const */ 
goog.reflect = {};
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.objectProperty = function(prop) {
  return prop;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = function() {
};
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    return goog.reflect.sinkValue(obj[prop]), !0;
  } catch (e) {
  }
  return !1;
};
goog.reflect.cache = function(cacheObj, key, valueFn, opt_keyFn) {
  var storedKey = opt_keyFn ? opt_keyFn(key) : key;
  return Object.prototype.hasOwnProperty.call(cacheObj, storedKey) ? cacheObj[storedKey] : cacheObj[storedKey] = valueFn(key);
};
/** @const */ 
goog.userAgent = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_IE = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_EDGE = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_GECKO = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_WEBKIT = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_OPERA = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return module$contents$goog$labs$userAgent$util_getUserAgent();
};
goog.userAgent.getNavigatorTyped = function() {
  return goog.global.navigator || null;
};
goog.userAgent.getNavigator = function() {
  return goog.userAgent.getNavigatorTyped();
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : module$contents$goog$labs$userAgent$browser_matchOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : module$contents$goog$labs$userAgent$browser_matchIE();
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : module$contents$goog$labs$userAgent$engine_isEdge();
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : module$contents$goog$labs$userAgent$engine_isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : module$contents$goog$labs$userAgent$engine_isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && module$contents$goog$labs$userAgent$util_matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigatorTyped();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_MAC = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_WINDOWS = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_LINUX = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_ANDROID = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_IPHONE = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_IPAD = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_IPOD = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.userAgent.ASSUME_KAIOS = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : module$contents$goog$labs$userAgent$platform_isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : module$contents$goog$labs$userAgent$platform_isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return module$contents$goog$labs$userAgent$platform_isLinux() || module$contents$goog$labs$userAgent$platform_isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : module$contents$goog$labs$userAgent$platform_isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : module$contents$goog$labs$userAgent$platform_isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : module$contents$goog$labs$userAgent$platform_isIpad();
goog.userAgent.IPOD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPOD : module$contents$goog$labs$userAgent$platform_isIpod();
goog.userAgent.IOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD : module$contents$goog$labs$userAgent$platform_isIos();
goog.userAgent.KAIOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_KAIOS : module$contents$goog$labs$userAgent$platform_isKaiOS();
goog.userAgent.determineVersion_ = function() {
  var version = "", arr = goog.userAgent.getVersionRegexResult_();
  arr && (version = arr ? arr[1] : "");
  if (goog.userAgent.IE) {
    let docMode = goog.userAgent.getDocumentMode_();
    if (docMode != null && docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getVersionRegexResult_ = function() {
  var userAgent = goog.userAgent.getUserAgentString();
  if (goog.userAgent.GECKO) {
    return /rv:([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(userAgent);
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(userAgent);
  }
  if (goog.userAgent.OPERA) {
    return /(?:Version)[ \/]?(\S+)/.exec(userAgent);
  }
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global.document;
  return doc ? doc.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return module$contents$goog$string$internal_compareVersions(v1, v2);
};
/** @const */ 
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, version, function() {
    return module$contents$goog$string$internal_compareVersions(goog.userAgent.VERSION, version) >= 0;
  });
};
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= documentMode;
};
var JSCompiler_inline_result$jscomp$77;
{
  let doc = goog.global.document;
  if (doc && goog.userAgent.IE) {
    var documentMode$jscomp$inline_84 = goog.userAgent.getDocumentMode_();
    if (documentMode$jscomp$inline_84) {
      JSCompiler_inline_result$jscomp$77 = documentMode$jscomp$inline_84;
    } else {
      var ieVersion$jscomp$inline_85 = parseInt(goog.userAgent.VERSION, 10);
      JSCompiler_inline_result$jscomp$77 = ieVersion$jscomp$inline_85 || void 0;
    }
  } else {
    JSCompiler_inline_result$jscomp$77 = void 0;
  }
}
/** @const */ 
goog.userAgent.DOCUMENT_MODE = JSCompiler_inline_result$jscomp$77;
/** @const */ 
goog.events.eventTypeHelpers = {};
function module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : eventName.toLowerCase();
}
function module$contents$goog$events$eventTypeHelpers_getPointerFallbackEventName(pointerEventName, fallbackEventName) {
  return goog.events.BrowserFeature.POINTER_EVENTS ? pointerEventName : fallbackEventName;
}
/** @const */ 
goog.events.eventTypeHelpers.getPointerFallbackEventName = module$contents$goog$events$eventTypeHelpers_getPointerFallbackEventName;
/** @const */ 
goog.events.eventTypeHelpers.getVendorPrefixedName = module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName;
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$events$EventType_EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", AUXCLICK:"auxclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", MOUSECANCEL:"mousecancel", SELECTIONCHANGE:"selectionchange", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", 
FOCUSIN:"focusin", FOCUSOUT:"focusout", CHANGE:"change", RESET:"reset", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DEVICECHANGE:"devicechange", 
DEVICEMOTION:"devicemotion", DEVICEORIENTATION:"deviceorientation", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", CANPLAY:"canplay", CANPLAYTHROUGH:"canplaythrough", DURATIONCHANGE:"durationchange", EMPTIED:"emptied", ENDED:"ended", LOADEDDATA:"loadeddata", LOADEDMETADATA:"loadedmetadata", PAUSE:"pause", PLAY:"play", 
PLAYING:"playing", PROGRESS:"progress", RATECHANGE:"ratechange", SEEKED:"seeked", SEEKING:"seeking", STALLED:"stalled", SUSPEND:"suspend", TIMEUPDATE:"timeupdate", VOLUMECHANGE:"volumechange", WAITING:"waiting", SOURCEOPEN:"sourceopen", SOURCEENDED:"sourceended", SOURCECLOSED:"sourceclosed", ABORT:"abort", UPDATE:"update", UPDATESTART:"updatestart", UPDATEEND:"updateend", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", INSTALL:"install", ACTIVATE:"activate", FETCH:"fetch", FOREIGNFETCH:"foreignfetch", MESSAGEERROR:"messageerror", STATECHANGE:"statechange", UPDATEFOUND:"updatefound", CONTROLLERCHANGE:"controllerchange", ANIMATIONSTART:module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName("AnimationStart"), ANIMATIONEND:module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName("AnimationEnd"), 
ANIMATIONITERATION:module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName("AnimationIteration"), TRANSITIONEND:module$contents$goog$events$eventTypeHelpers_getVendorPrefixedName("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", 
MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", 
MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", TEXTINPUT:"textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", BEFOREINPUT:"beforeinput", FULLSCREENCHANGE:"fullscreenchange", WEBKITBEGINFULLSCREEN:"webkitbeginfullscreen", WEBKITENDFULLSCREEN:"webkitendfullscreen", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", 
SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", BEFOREPRINT:"beforeprint", AFTERPRINT:"afterprint", BEFOREINSTALLPROMPT:"beforeinstallprompt", APPINSTALLED:"appinstalled", CANCEL:"cancel", FINISH:"finish", REMOVE:"remove"};
/** @const */ 
goog.events.EventType = module$contents$goog$events$EventType_EventType;
/** @constructor */ 
function module$contents$goog$events$BrowserEvent_BrowserEvent(opt_e, opt_currentTarget) {
  goog.events.Event.call(this, opt_e ? opt_e.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.key = "";
  this.charCode = this.keyCode = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.timeStamp = 0;
  this.event_ = null;
  opt_e && this.init(opt_e, opt_currentTarget);
}
goog.inherits(module$contents$goog$events$BrowserEvent_BrowserEvent, goog.events.Event);
/** @define {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$events$BrowserEvent_BrowserEvent.USE_LAYER_XY_AS_OFFSET_XY = !1;
module$contents$goog$events$BrowserEvent_BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type, relevantTouch = e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : null;
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  relatedTarget || (type == module$contents$goog$events$EventType_EventType.MOUSEOVER ? relatedTarget = e.fromElement : type == module$contents$goog$events$EventType_EventType.MOUSEOUT && (relatedTarget = e.toElement));
  this.relatedTarget = relatedTarget;
  relevantTouch ? (this.clientX = relevantTouch.clientX !== void 0 ? relevantTouch.clientX : relevantTouch.pageX, this.clientY = relevantTouch.clientY !== void 0 ? relevantTouch.clientY : relevantTouch.pageY, this.screenX = relevantTouch.screenX || 0, this.screenY = relevantTouch.screenY || 0) : (module$contents$goog$events$BrowserEvent_BrowserEvent.USE_LAYER_XY_AS_OFFSET_XY ? (this.offsetX = e.layerX !== void 0 ? e.layerX : e.offsetX, this.offsetY = e.layerY !== void 0 ? e.layerY : e.offsetY) : 
  (this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== void 0 ? e.offsetX : e.layerX, this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== void 0 ? e.offsetY : e.layerY), this.clientX = e.clientX !== void 0 ? e.clientX : e.pageX, this.clientY = e.clientY !== void 0 ? e.clientY : e.pageY, this.screenX = e.screenX || 0, this.screenY = e.screenY || 0);
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.key = e.key || "";
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.pointerId = e.pointerId || 0;
  this.pointerType = module$contents$goog$events$BrowserEvent_BrowserEvent.getPointerType_(e);
  this.state = e.state;
  this.timeStamp = e.timeStamp;
  this.event_ = e;
  e.defaultPrevented && module$contents$goog$events$BrowserEvent_BrowserEvent.superClass_.preventDefault.call(this);
};
module$contents$goog$events$BrowserEvent_BrowserEvent.prototype.stopPropagation = function() {
  module$contents$goog$events$BrowserEvent_BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
module$contents$goog$events$BrowserEvent_BrowserEvent.prototype.preventDefault = function() {
  module$contents$goog$events$BrowserEvent_BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  be.preventDefault ? be.preventDefault() : be.returnValue = !1;
};
module$contents$goog$events$BrowserEvent_BrowserEvent.getPointerType_ = function(e) {
  return e.pointerType;
};
/** @const */ 
goog.events.BrowserEvent = module$contents$goog$events$BrowserEvent_BrowserEvent;
/** @interface */ 
goog.events.Listenable = function() {
};
/** @const */ 
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (Math.random() * 1E6 | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  return !(!obj || !obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.Listenable.prototype.listen = function() {
};
goog.events.Listenable.prototype.listenOnce = function() {
};
goog.events.Listenable.prototype.unlisten = function() {
};
goog.events.Listenable.prototype.unlistenByKey = function() {
};
goog.events.Listenable.prototype.dispatchEvent = function() {
};
goog.events.Listenable.prototype.removeAllListeners = function() {
};
goog.events.Listenable.prototype.getParentEventTarget = function() {
};
goog.events.Listenable.prototype.fireListeners = function() {
};
goog.events.Listenable.prototype.getListeners = function() {
};
goog.events.Listenable.prototype.getListener = function() {
};
goog.events.Listenable.prototype.hasListener = function() {
};
/** @interface */ 
function module$contents$goog$events$ListenableKey_ListenableKey() {
}
module$contents$goog$events$ListenableKey_ListenableKey.counter_ = 0;
module$contents$goog$events$ListenableKey_ListenableKey.reserveKey = function() {
  return ++module$contents$goog$events$ListenableKey_ListenableKey.counter_;
};
/** @const */ 
goog.events.ListenableKey = module$contents$goog$events$ListenableKey_ListenableKey;
/** @constructor */ 
function module$contents$goog$events$Listener_Listener(listener, proxy, src, type, capture, opt_handler) {
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  /** @const */ 
  this.type = type;
  /** @const */ 
  this.capture = !!capture;
  this.handler = opt_handler;
  /** @const */ 
  this.key = module$contents$goog$events$ListenableKey_ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
}
module$contents$goog$events$Listener_Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null;
};
/** @const */ 
goog.events.Listener = module$contents$goog$events$Listener_Listener;
/** @const */ 
goog.object = {};
function module$contents$goog$object_forEach(obj, f, opt_obj) {
  for (let key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
}
function module$contents$goog$object_filter(obj, f, opt_obj) {
  var res = {};
  for (let key in obj) {
    f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
  }
  return res;
}
function module$contents$goog$object_map(obj, f, opt_obj) {
  var res = {};
  for (let key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
}
function module$contents$goog$object_some(obj, f, opt_obj) {
  for (let key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return !0;
    }
  }
  return !1;
}
function module$contents$goog$object_every(obj, f, opt_obj) {
  for (let key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return !1;
    }
  }
  return !0;
}
function module$contents$goog$object_getCount(obj) {
  var rv = 0;
  for (let key in obj) {
    rv++;
  }
  return rv;
}
function module$contents$goog$object_getAnyKey(obj) {
  for (let key in obj) {
    return key;
  }
}
function module$contents$goog$object_getAnyValue(obj) {
  for (let key in obj) {
    return obj[key];
  }
}
function module$contents$goog$object_contains(obj, val) {
  return module$contents$goog$object_containsValue(obj, val);
}
function module$contents$goog$object_getValues(obj) {
  var res = [], i = 0;
  for (let key in obj) {
    res[i++] = obj[key];
  }
  return res;
}
function module$contents$goog$object_getKeys(obj) {
  var res = [], i = 0;
  for (let key in obj) {
    res[i++] = key;
  }
  return res;
}
function module$contents$goog$object_getValueByKeys(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments;
  for (let i = isArrayLike ? 0 : 1; i < keys.length; i++) {
    if (obj == null) {
      return;
    }
    obj = obj[keys[i]];
  }
  return obj;
}
function module$contents$goog$object_containsKey(obj, key) {
  return obj !== null && key in obj;
}
function module$contents$goog$object_containsValue(obj, val) {
  for (let key in obj) {
    if (obj[key] == val) {
      return !0;
    }
  }
  return !1;
}
function module$contents$goog$object_findKey(obj, f, thisObj) {
  for (let key in obj) {
    if (f.call(thisObj, obj[key], key, obj)) {
      return key;
    }
  }
}
function module$contents$goog$object_findValue(obj, f, thisObj) {
  var key = module$contents$goog$object_findKey(obj, f, thisObj);
  return key && obj[key];
}
function module$contents$goog$object_isEmpty(obj) {
  for (let key in obj) {
    return !1;
  }
  return !0;
}
function module$contents$goog$object_clear(obj) {
  for (let i in obj) {
    delete obj[i];
  }
}
function module$contents$goog$object_remove(obj, key) {
  var rv;
  (rv = key in obj) && delete obj[key];
  return rv;
}
function module$contents$goog$object_add(obj, key, val) {
  if (obj !== null && key in obj) {
    throw Error(`The object already contains the key "${key}"`);
  }
  obj[key] = val;
}
function module$contents$goog$object_get(obj, key, val) {
  return obj !== null && key in obj ? obj[key] : val;
}
function module$contents$goog$object_set(obj, key, value) {
  obj[key] = value;
}
function module$contents$goog$object_setIfUndefined(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
}
function module$contents$goog$object_setWithReturnValueIfNotSet(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  return obj[key] = val;
}
function module$contents$goog$object_equals(a, b) {
  for (let k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return !1;
    }
  }
  for (let k in b) {
    if (!(k in a)) {
      return !1;
    }
  }
  return !0;
}
function module$contents$goog$object_clone(obj) {
  var res = {};
  for (let key in obj) {
    res[key] = obj[key];
  }
  return res;
}
function module$contents$goog$object_unsafeClone(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (typeof obj.clone === "function") {
    return obj.clone();
  }
  if (typeof Map !== "undefined" && obj instanceof Map) {
    return new Map(obj);
  }
  if (typeof Set !== "undefined" && obj instanceof Set) {
    return new Set(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  var clone = Array.isArray(obj) ? [] : typeof ArrayBuffer !== "function" || typeof ArrayBuffer.isView !== "function" || !ArrayBuffer.isView(obj) || obj instanceof DataView ? {} : new obj.constructor(obj.length);
  for (let key in obj) {
    clone[key] = module$contents$goog$object_unsafeClone(obj[key]);
  }
  return clone;
}
function module$contents$goog$object_transpose(obj) {
  var transposed = {};
  for (let key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
}
const module$contents$goog$object_PROTOTYPE_FIELDS = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function module$contents$goog$object_extend(target, var_args) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (let j = 0; j < module$contents$goog$object_PROTOTYPE_FIELDS.length; j++) {
      var key = module$contents$goog$object_PROTOTYPE_FIELDS[j];
      Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
  }
}
function module$contents$goog$object_create(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && Array.isArray(arguments[0])) {
    return module$contents$goog$object_create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (let i = 0; i < argLength; i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
}
function module$contents$goog$object_createSet(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && Array.isArray(arguments[0])) {
    return module$contents$goog$object_createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (let i = 0; i < argLength; i++) {
    rv[arguments[i]] = !0;
  }
  return rv;
}
function module$contents$goog$object_createImmutableView(obj) {
  var result = obj;
  Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
  return result;
}
function module$contents$goog$object_isImmutableView(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
}
function module$contents$goog$object_getAllPropertyNames(obj, includeObjectPrototype, includeFunctionPrototype) {
  if (!obj) {
    return [];
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return module$contents$goog$object_getKeys(obj);
  }
  for (var visitedSet = {}, proto = obj; proto && (proto !== Object.prototype || includeObjectPrototype) && (proto !== Function.prototype || includeFunctionPrototype);) {
    let names = Object.getOwnPropertyNames(proto);
    for (let i = 0; i < names.length; i++) {
      visitedSet[names[i]] = !0;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return module$contents$goog$object_getKeys(visitedSet);
}
function module$contents$goog$object_getSuperClass(constructor) {
  var proto = Object.getPrototypeOf(constructor.prototype);
  return proto && proto.constructor;
}
/** @const */ 
goog.object.add = module$contents$goog$object_add;
/** @const */ 
goog.object.clear = module$contents$goog$object_clear;
/** @const */ 
goog.object.clone = module$contents$goog$object_clone;
/** @const */ 
goog.object.contains = module$contents$goog$object_contains;
/** @const */ 
goog.object.containsKey = module$contents$goog$object_containsKey;
/** @const */ 
goog.object.containsValue = module$contents$goog$object_containsValue;
/** @const */ 
goog.object.create = module$contents$goog$object_create;
/** @const */ 
goog.object.createImmutableView = module$contents$goog$object_createImmutableView;
/** @const */ 
goog.object.createSet = module$contents$goog$object_createSet;
/** @const */ 
goog.object.equals = module$contents$goog$object_equals;
/** @const */ 
goog.object.every = module$contents$goog$object_every;
/** @const */ 
goog.object.extend = module$contents$goog$object_extend;
/** @const */ 
goog.object.filter = module$contents$goog$object_filter;
/** @const */ 
goog.object.findKey = module$contents$goog$object_findKey;
/** @const */ 
goog.object.findValue = module$contents$goog$object_findValue;
/** @const */ 
goog.object.forEach = module$contents$goog$object_forEach;
/** @const */ 
goog.object.get = module$contents$goog$object_get;
/** @const */ 
goog.object.getAllPropertyNames = module$contents$goog$object_getAllPropertyNames;
/** @const */ 
goog.object.getAnyKey = module$contents$goog$object_getAnyKey;
/** @const */ 
goog.object.getAnyValue = module$contents$goog$object_getAnyValue;
/** @const */ 
goog.object.getCount = module$contents$goog$object_getCount;
/** @const */ 
goog.object.getKeys = module$contents$goog$object_getKeys;
/** @const */ 
goog.object.getSuperClass = module$contents$goog$object_getSuperClass;
/** @const */ 
goog.object.getValueByKeys = module$contents$goog$object_getValueByKeys;
/** @const */ 
goog.object.getValues = module$contents$goog$object_getValues;
/** @const */ 
goog.object.isEmpty = module$contents$goog$object_isEmpty;
/** @const */ 
goog.object.isImmutableView = module$contents$goog$object_isImmutableView;
/** @const */ 
goog.object.map = module$contents$goog$object_map;
/** @const */ 
goog.object.remove = module$contents$goog$object_remove;
/** @const */ 
goog.object.set = module$contents$goog$object_set;
/** @const */ 
goog.object.setIfUndefined = module$contents$goog$object_setIfUndefined;
/** @const */ 
goog.object.setWithReturnValueIfNotSet = module$contents$goog$object_setWithReturnValueIfNotSet;
/** @const */ 
goog.object.some = module$contents$goog$object_some;
/** @const */ 
goog.object.transpose = module$contents$goog$object_transpose;
/** @const */ 
goog.object.unsafeClone = module$contents$goog$object_unsafeClone;
/** @constructor */ 
function module$contents$goog$events$ListenerMap_ListenerMap(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
}
module$contents$goog$events$ListenerMap_ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString(), listenerArray = this.listeners[typeStr];
  listenerArray || (listenerArray = this.listeners[typeStr] = [], this.typeCount_++);
  var index = module$contents$goog$events$ListenerMap_ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    var listenerObj = listenerArray[index];
    callOnce || (listenerObj.callOnce = !1);
  } else {
    listenerObj = new module$contents$goog$events$Listener_Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope), listenerObj.callOnce = callOnce, listenerArray.push(listenerObj);
  }
  return listenerObj;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return !1;
  }
  var listenerArray = this.listeners[typeStr], index = module$contents$goog$events$ListenerMap_ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    let listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    module$contents$goog$array_removeAt(listenerArray, index);
    listenerArray.length == 0 && (delete this.listeners[typeStr], this.typeCount_--);
    return !0;
  }
  return !1;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return !1;
  }
  var removed = module$contents$goog$array_remove(this.listeners[type], listener);
  removed && (listener.markAsRemoved(), this.listeners[type].length == 0 && (delete this.listeners[type], this.typeCount_--));
  return removed;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString(), count = 0;
  for (let type in this.listeners) {
    if (!typeStr || type == typeStr) {
      let listenerArray = this.listeners[type];
      for (let i = 0; i < listenerArray.length; i++) {
        ++count, listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()], rv = [];
  if (listenerArray) {
    for (let i = 0; i < listenerArray.length; ++i) {
      let listenerObj = listenerArray[i];
      listenerObj.capture == capture && rv.push(listenerObj);
    }
  }
  return rv;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()], i = -1;
  listenerArray && (i = module$contents$goog$events$ListenerMap_ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope));
  return i > -1 ? listenerArray[i] : null;
};
module$contents$goog$events$ListenerMap_ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = opt_type !== void 0, typeStr = hasType ? opt_type.toString() : "", hasCapture = opt_capture !== void 0;
  return module$contents$goog$object_some(this.listeners, function(listenerArray) {
    for (let i = 0; i < listenerArray.length; ++i) {
      if (!(hasType && listenerArray[i].type != typeStr || hasCapture && listenerArray[i].capture != opt_capture)) {
        return !0;
      }
    }
    return !1;
  });
};
module$contents$goog$events$ListenerMap_ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (let i = 0; i < listenerArray.length; ++i) {
    let listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return -1;
};
/** @const */ 
goog.events.ListenerMap = module$contents$goog$events$ListenerMap_ListenerMap;
/** @const */ 
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (Math.random() * 1E6 | 0);
/** @const */ 
goog.events.onString_ = "on";
/** @const */ 
goog.events.onStringMap_ = {};
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_options, opt_handler) {
  if (opt_options && opt_options.once) {
    return goog.events.listenOnce(src, type, listener, opt_options, opt_handler);
  }
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      goog.events.listen(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    let capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
    return src.listen(type, listener, capture, opt_handler);
  }
  return goog.events.listen_(src, type, listener, !1, opt_options, opt_handler);
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_options, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options, listenerMap = goog.events.getListenerMap_(src);
  listenerMap || (src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new module$contents$goog$events$ListenerMap_ListenerMap(src));
  var listenerObj = listenerMap.add(type, listener, callOnce, capture, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  if (src.addEventListener) {
    goog.events.BrowserFeature.PASSIVE_EVENTS || (opt_options = capture), opt_options === void 0 && (opt_options = !1), src.addEventListener(type.toString(), proxy, opt_options);
  } else if (src.attachEvent) {
    src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
  } else if (src.addListener && src.removeListener) {
    goog.asserts.assert(type === "change", "MediaQueryList only has a change event"), src.addListener(proxy);
  } else {
    throw Error("addEventListener and attachEvent are unavailable.");
  }
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_, f = function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_options, opt_handler) {
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      goog.events.listenOnce(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    let capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
    return src.listenOnce(type, listener, capture, opt_handler);
  }
  return goog.events.listen_(src, type, listener, !0, opt_options, opt_handler);
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_options, opt_handler) {
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      goog.events.unlisten(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }
  var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(type, listener, capture, opt_handler);
  }
  if (!src) {
    return !1;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    let listenerObj = listenerMap.getListener(type, listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return !1;
};
goog.events.unlistenByKey = function(key) {
  if (typeof key === "number") {
    return !1;
  }
  var listener = key;
  if (!listener || listener.removed) {
    return !1;
  }
  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }
  var type = listener.type, proxy = listener.proxy;
  src.removeEventListener ? src.removeEventListener(type, proxy, listener.capture) : src.detachEvent ? src.detachEvent(goog.events.getOnString_(type), proxy) : src.addListener && src.removeListener && src.removeListener(proxy);
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_(src);
  listenerMap ? (listenerMap.removeByKey(listener), listenerMap.typeCount_ == 0 && (listenerMap.src = null, src[goog.events.LISTENER_MAP_PROP_] = null)) : listener.markAsRemoved();
  return !0;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(obj, opt_type) {
  if (!obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  if (!listenerMap) {
    return 0;
  }
  var count = 0, typeStr = opt_type && opt_type.toString();
  for (let type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      let listeners = listenerMap.listeners[type].concat();
      for (let i = 0; i < listeners.length; ++i) {
        goog.events.unlistenByKey(listeners[i]) && ++count;
      }
    }
  }
  return count;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  }
  if (!obj) {
    return [];
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return listenerMap ? listenerMap.getListeners(type, capture) : [];
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  return listenerMap ? listenerMap.getListener(type, listener, capture, opt_handler) : null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [];
  for (let key in e) {
    e[key] && e[key].id ? str.push(key + " = " + e[key] + " (" + e[key].id + ")") : str.push(key + " = " + e[key]);
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  return type in goog.events.onStringMap_ ? goog.events.onStringMap_[type] : goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  return goog.events.Listenable.isImplementedBy(obj) ? obj.fireListeners(type, capture, eventObject) : goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = !0, listenerMap = goog.events.getListenerMap_(obj);
  if (listenerMap) {
    let listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      listenerArray = listenerArray.concat();
      for (let i = 0; i < listenerArray.length; i++) {
        let listener = listenerArray[i];
        if (listener && listener.capture == capture && !listener.removed) {
          let result = goog.events.fireListener(listener, eventObject);
          retval = retval && result !== !1;
        }
      }
    }
  }
  return retval;
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
  listener.callOnce && goog.events.unlistenByKey(listener);
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  return listener.removed ? !0 : goog.events.fireListener(listener, new module$contents$goog$events$BrowserEvent_BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = !1;
  if (e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = !0;
    }
  }
  if (useReturnValue || e.returnValue == void 0) {
    e.returnValue = !0;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != void 0;
};
goog.events.uniqueIdCounter_ = 0;
/** @idGenerator {unique} */ 
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof module$contents$goog$events$ListenerMap_ListenerMap ? listenerMap : null;
};
/** @const */ 
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (typeof listener === "function") {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  listener[goog.events.LISTENER_WRAPPER_PROP_] || (listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
    return listener.handleEvent(e);
  });
  return listener[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
/** @constructor */ 
function module$contents$goog$events$EventTarget_EventsEventTarget() {
  module$contents$goog$Disposable_Disposable.call(this);
  this.eventTargetListeners_ = new module$contents$goog$events$ListenerMap_ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
}
goog.inherits(module$contents$goog$events$EventTarget_EventsEventTarget, module$contents$goog$Disposable_Disposable);
goog.events.Listenable.addImplementation(module$contents$goog$events$EventTarget_EventsEventTarget);
/** @const */ 
module$contents$goog$events$EventTarget_EventsEventTarget.MAX_ANCESTORS_ = 1E3;
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestor = this.getParentEventTarget();
  if (ancestor) {
    var ancestorsTree = [];
    let ancestorCount = 1;
    for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor), goog.asserts.assert(++ancestorCount < module$contents$goog$events$EventTarget_EventsEventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return module$contents$goog$events$EventTarget_EventsEventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.disposeInternal = function() {
  module$contents$goog$events$EventTarget_EventsEventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, !1, opt_useCapture, opt_listenerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, !0, opt_useCapture, opt_listenerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.removeAllListeners = function(opt_type) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(opt_type) : 0;
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return !0;
  }
  listenerArray = listenerArray.concat();
  var rv = !0;
  for (let i = 0; i < listenerArray.length; ++i) {
    let listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      let listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
      listener.callOnce && this.unlistenByKey(listener);
      rv = listenerFn.call(listenerHandler, eventObject) !== !1 && rv;
    }
  }
  return rv && !eventObject.defaultPrevented;
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  var id = opt_type !== void 0 ? String(opt_type) : void 0;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
};
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
module$contents$goog$events$EventTarget_EventsEventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || e;
  if (typeof e === "string") {
    e = new goog.events.Event(e, target);
  } else if (e instanceof goog.events.Event) {
    e.target = e.target || target;
  } else {
    let oldEvent = e;
    e = new goog.events.Event(type, target);
    module$contents$goog$object_extend(e, oldEvent);
  }
  var rv = !0, i;
  if (opt_ancestorsTree) {
    for (i = opt_ancestorsTree.length - 1; !e.propagationStopped_ && i >= 0; i--) {
      var currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, !0, e) && rv;
    }
  }
  e.propagationStopped_ || (currentTarget = e.currentTarget = target, rv = currentTarget.fireListeners(type, !0, e) && rv, e.propagationStopped_ || (rv = currentTarget.fireListeners(type, !1, e) && rv));
  if (opt_ancestorsTree) {
    for (i = 0; !e.propagationStopped_ && i < opt_ancestorsTree.length; i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i], rv = currentTarget.fireListeners(type, !1, e) && rv;
    }
  }
  return rv;
};
/** @const */ 
goog.events.EventTarget = module$contents$goog$events$EventTarget_EventsEventTarget;
/** @const */ 
goog.functions = {};
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = function() {
  return !1;
};
goog.functions.TRUE = function() {
  return !0;
};
goog.functions.NULL = function() {
  return null;
};
goog.functions.UNDEFINED = function() {
};
goog.functions.EMPTY = goog.functions.UNDEFINED;
goog.functions.identity = function(opt_returnValue) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    var self = this;
    return f.apply(self, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.partialRight = function(fn, var_args) {
  var rightArgs = Array.prototype.slice.call(arguments, 1);
  return function() {
    var self = this;
    self === goog.global && (self = void 0);
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.push.apply(newArgs, rightArgs);
    return fn.apply(self, newArgs);
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
  return function(other) {
    return opt_useLooseComparison ? value == other : value === other;
  };
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var self = this, result;
    length && (result = functions[length - 1].apply(self, arguments));
    for (let i = length - 2; i >= 0; i--) {
      result = functions[i].call(self, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var self = this;
    for (let i = 0; i < length; i++) {
      var result = functions[i].apply(self, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var self = this;
    for (let i = 0; i < length; i++) {
      if (!functions[i].apply(self, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var self = this;
    for (let i = 0; i < length; i++) {
      if (functions[i].apply(self, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
goog.functions.not = function(f) {
  return function() {
    var self = this;
    return !f.apply(self, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  /** @constructor */ 
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp();
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(fn) {
  var called = !1, value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    called || (value = fn(), called = !0);
    return value;
  };
};
goog.functions.once = function(f) {
  var inner = f;
  return function() {
    if (inner) {
      let tmp = inner;
      inner = null;
      tmp();
    }
  };
};
goog.functions.debounce = function(f, interval, opt_scope) {
  var timeout = 0;
  return function(var_args) {
    goog.global.clearTimeout(timeout);
    var args = arguments;
    timeout = goog.global.setTimeout(function() {
      f.apply(opt_scope, args);
    }, interval);
  };
};
goog.functions.throttle = function(f, interval, opt_scope) {
  var timeout = 0, shouldFire = !1, storedArgs = [], handleTimeout = function() {
    timeout = 0;
    shouldFire && (shouldFire = !1, fire());
  }, fire = function() {
    timeout = goog.global.setTimeout(handleTimeout, interval);
    var args = storedArgs;
    storedArgs = [];
    f.apply(opt_scope, args);
  };
  return function(var_args) {
    storedArgs = arguments;
    timeout ? shouldFire = !0 : fire();
  };
};
goog.functions.rateLimit = function(f, interval, opt_scope) {
  var timeout = 0, handleTimeout = function() {
    timeout = 0;
  };
  return function(var_args) {
    timeout || (timeout = goog.global.setTimeout(handleTimeout, interval), f.apply(opt_scope, arguments));
  };
};
goog.functions.isFunction = val => typeof val === "function";
/** @const */ 
goog.promise = {};
/** @interface */ 
class module$contents$goog$promise$Resolver_Resolver {
  constructor() {
  }
}
/** @const */ 
goog.promise.Resolver = module$contents$goog$promise$Resolver_Resolver;
/** @interface */ 
function module$contents$goog$Thenable_Thenable() {
}
module$contents$goog$Thenable_Thenable.prototype.then = function() {
};
/** @const */ 
module$contents$goog$Thenable_Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
module$contents$goog$Thenable_Thenable.addImplementation = function(ctor) {
  ctor.prototype[module$contents$goog$Thenable_Thenable.IMPLEMENTED_BY_PROP] = !0;
};
module$contents$goog$Thenable_Thenable.isImplementedBy = function(object) {
  if (!object) {
    return !1;
  }
  try {
    return !!object[module$contents$goog$Thenable_Thenable.IMPLEMENTED_BY_PROP];
  } catch (e) {
    return !1;
  }
};
/** @const */ 
goog.Thenable = module$contents$goog$Thenable_Thenable;
/** @constructor */ 
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = void 0;
  this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
  this.executing_ = !1;
  goog.Promise.UNHANDLED_REJECTION_DELAY > 0 ? this.unhandledRejectionId_ = 0 : goog.Promise.UNHANDLED_REJECTION_DELAY == 0 && (this.hadUnhandledRejection_ = !1);
  goog.Promise.LONG_STACK_TRACES && (this.stack_ = [], this.addStackTrace_(Error("created")), this.currentStep_ = 0);
  if (resolver != goog.functions.UNDEFINED) {
    try {
      let self = this;
      resolver.call(opt_context, function(value) {
        self.resolve_(goog.Promise.State_.FULFILLED, value);
      }, function(reason) {
        if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
          try {
            if (reason instanceof Error) {
              throw reason;
            }
            throw Error("Promise rejected.");
          } catch (e) {
          }
        }
        self.resolve_(goog.Promise.State_.REJECTED, reason);
      });
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e);
    }
  }
};
/** @const */ 
goog.Promise.wrap_ = module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.Promise.LONG_STACK_TRACES = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.Promise.UNHANDLED_REJECTION_DELAY = 0;
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
/** @constructor */ 
goog.Promise.CallbackEntry_ = function() {
  this.next = this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = !1;
};
goog.Promise.CallbackEntry_.prototype.reset = function() {
  this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = !1;
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.Promise.DEFAULT_MAX_UNUSED = 100;
/** @const */ 
goog.Promise.freelist_ = new module$contents$goog$async$FreeList_FreeList(function() {
  return new goog.Promise.CallbackEntry_();
}, function(item) {
  item.reset();
}, goog.Promise.DEFAULT_MAX_UNUSED);
goog.Promise.getCallbackEntry_ = function(onFulfilled, onRejected, context) {
  var entry = goog.Promise.freelist_.get();
  entry.onFulfilled = onFulfilled;
  entry.onRejected = onRejected;
  entry.context = context;
  return entry;
};
goog.Promise.returnEntry_ = function(entry) {
  goog.Promise.freelist_.put(entry);
};
goog.Promise.resolve = function(opt_value) {
  if (opt_value instanceof goog.Promise) {
    return opt_value;
  }
  var promise = new goog.Promise(goog.functions.UNDEFINED);
  promise.resolve_(goog.Promise.State_.FULFILLED, opt_value);
  return promise;
};
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
};
goog.Promise.resolveThen_ = function(value, onFulfilled, onRejected) {
  var isThenable = goog.Promise.maybeThen_(value, onFulfilled, onRejected, null);
  isThenable || module$contents$goog$async$run_run(goog.partial(onFulfilled, value));
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    promises.length || resolve(void 0);
    for (let i = 0; i < promises.length; i++) {
      var promise = promises[i];
      goog.Promise.resolveThen_(promise, resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length, values = [];
    if (toFulfill) {
      var onFulfill = function(index, value) {
        toFulfill--;
        values[index] = value;
        toFulfill == 0 && resolve(values);
      }, onReject = function(reason) {
        reject(reason);
      };
      for (let i = 0; i < promises.length; i++) {
        var promise = promises[i];
        goog.Promise.resolveThen_(promise, goog.partial(onFulfill, i), onReject);
      }
    } else {
      resolve(values);
    }
  });
};
goog.Promise.allSettled = function(promises) {
  return new goog.Promise(function(resolve) {
    var toSettle = promises.length, results = [];
    if (toSettle) {
      var onSettled = function(index, fulfilled, result) {
        toSettle--;
        results[index] = fulfilled ? {fulfilled:!0, value:result} : {fulfilled:!1, reason:result};
        toSettle == 0 && resolve(results);
      };
      for (let i = 0; i < promises.length; i++) {
        var promise = promises[i];
        goog.Promise.resolveThen_(promise, goog.partial(onSettled, i, !0), goog.partial(onSettled, i, !1));
      }
    } else {
      resolve(results);
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length, reasons = [];
    if (toReject) {
      var onFulfill = function(value) {
        resolve(value);
      }, onReject = function(index, reason) {
        toReject--;
        reasons[index] = reason;
        toReject == 0 && reject(reasons);
      };
      for (let i = 0; i < promises.length; i++) {
        var promise = promises[i];
        goog.Promise.resolveThen_(promise, onFulfill, goog.partial(onReject, i));
      }
    } else {
      resolve(void 0);
    }
  });
};
goog.Promise.withResolver = function() {
  var resolve, reject, promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
};
goog.Promise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  opt_onFulfilled != null && goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  opt_onRejected != null && goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
  return this.addChildPromise_(module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext(typeof opt_onFulfilled === "function" ? opt_onFulfilled : null), module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext(typeof opt_onRejected === "function" ? opt_onRejected : null), opt_context);
};
module$contents$goog$Thenable_Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenVoid = function(opt_onFulfilled, opt_onRejected, opt_context) {
  opt_onFulfilled != null && goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  opt_onRejected != null && goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
  this.addCallbackEntry_(goog.Promise.getCallbackEntry_(opt_onFulfilled || goog.functions.UNDEFINED, opt_onRejected || null, opt_context));
};
goog.Promise.prototype.finally = function(onSettled) {
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("finally"));
  onSettled = module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext(onSettled);
  return new goog.Promise((resolve, reject) => {
    this.thenVoid(value => {
      onSettled();
      resolve(value);
    }, cause => {
      onSettled();
      reject(cause);
    });
  });
};
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenCatch"));
  return this.addChildPromise_(null, module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext(onRejected), opt_context);
};
goog.Promise.prototype.catch = goog.Promise.prototype.thenCatch;
goog.Promise.prototype.cancel = function(opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    let err = new goog.Promise.CancellationError(opt_message);
    module$contents$goog$async$run_run(function() {
      this.cancelInternal_(err);
    }, this);
  }
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  this.state_ == goog.Promise.State_.PENDING && (this.parent_ ? (this.parent_.cancelChild_(this, err), this.parent_ = null) : this.resolve_(goog.Promise.State_.REJECTED, err));
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (this.callbackEntries_) {
    var childCount = 0, childEntry = null, beforeChildEntry = null;
    for (let entry = this.callbackEntries_; entry && (entry.always || (childCount++, entry.child == childPromise && (childEntry = entry), !(childEntry && childCount > 1))); entry = entry.next) {
      childEntry || (beforeChildEntry = entry);
    }
    childEntry && (this.state_ == goog.Promise.State_.PENDING && childCount == 1 ? this.cancelInternal_(err) : (beforeChildEntry ? this.removeEntryAfter_(beforeChildEntry) : this.popEntry_(), this.executeCallback_(childEntry, goog.Promise.State_.REJECTED, err)));
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  this.hasEntry_() || this.state_ != goog.Promise.State_.FULFILLED && this.state_ != goog.Promise.State_.REJECTED || this.scheduleCallbacks_();
  this.queueEntry_(callbackEntry);
};
goog.Promise.prototype.addChildPromise_ = function(onFulfilled, onRejected, opt_context) {
  onFulfilled &&= module$contents$goog$debug$asyncStackTag_wrap(onFulfilled, "goog.Promise.then");
  onRejected &&= module$contents$goog$debug$asyncStackTag_wrap(onRejected, "goog.Promise.then");
  var callbackEntry = goog.Promise.getCallbackEntry_(null, null, null);
  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        let result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        let result = onRejected.call(opt_context, reason);
        result === void 0 && reason instanceof goog.Promise.CancellationError ? reject(reason) : resolve(result);
      } catch (err) {
        reject(err);
      }
    } : reject;
  });
  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(callbackEntry);
  return callbackEntry.child;
};
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
};
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
};
goog.Promise.prototype.resolve_ = function(state, x) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    this === x && (state = goog.Promise.State_.REJECTED, x = new TypeError("Promise cannot resolve to itself"));
    this.state_ = goog.Promise.State_.BLOCKED;
    var isThenable = goog.Promise.maybeThen_(x, this.unblockAndFulfill_, this.unblockAndReject_, this);
    isThenable || (this.result_ = x, this.state_ = state, this.parent_ = null, this.scheduleCallbacks_(), state != goog.Promise.State_.REJECTED || x instanceof goog.Promise.CancellationError || goog.Promise.addUnhandledRejection_(this, x));
  }
};
goog.Promise.maybeThen_ = function(value, onFulfilled, onRejected, context) {
  if (value instanceof goog.Promise) {
    return value.thenVoid(onFulfilled, onRejected, context), !0;
  }
  if (module$contents$goog$Thenable_Thenable.isImplementedBy(value)) {
    return value.then(onFulfilled, onRejected, context), !0;
  }
  if (goog.isObject(value)) {
    let thenable = value;
    try {
      let then = thenable.then;
      if (typeof then === "function") {
        return goog.Promise.tryThen_(thenable, then, onFulfilled, onRejected, context), !0;
      }
    } catch (e) {
      return onRejected.call(context, e), !0;
    }
  }
  return !1;
};
goog.Promise.tryThen_ = function(thenable, then, onFulfilled, onRejected, context) {
  var called = !1, resolve = function(value) {
    called || (called = !0, onFulfilled.call(context, value));
  }, reject = function(reason) {
    called || (called = !0, onRejected.call(context, reason));
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  this.executing_ || (this.executing_ = !0, module$contents$goog$async$run_run(this.executeCallbacks_, this));
};
goog.Promise.prototype.hasEntry_ = function() {
  return !!this.callbackEntries_;
};
goog.Promise.prototype.queueEntry_ = function(entry) {
  goog.asserts.assert(entry.onFulfilled != null);
  this.callbackEntriesTail_ ? this.callbackEntriesTail_.next = entry : this.callbackEntries_ = entry;
  this.callbackEntriesTail_ = entry;
};
goog.Promise.prototype.popEntry_ = function() {
  var entry = null;
  this.callbackEntries_ && (entry = this.callbackEntries_, this.callbackEntries_ = entry.next, entry.next = null);
  this.callbackEntries_ || (this.callbackEntriesTail_ = null);
  entry != null && goog.asserts.assert(entry.onFulfilled != null);
  return entry;
};
goog.Promise.prototype.removeEntryAfter_ = function(previous) {
  goog.asserts.assert(this.callbackEntries_);
  goog.asserts.assert(previous != null);
  previous.next == this.callbackEntriesTail_ && (this.callbackEntriesTail_ = previous);
  previous.next = previous.next.next;
};
goog.Promise.prototype.executeCallbacks_ = function() {
  for (var entry; entry = this.popEntry_();) {
    goog.Promise.LONG_STACK_TRACES && this.currentStep_++, this.executeCallback_(entry, this.state_, this.result_);
  }
  this.executing_ = !1;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  state == goog.Promise.State_.REJECTED && callbackEntry.onRejected && !callbackEntry.always && this.removeUnhandledRejection_();
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null, goog.Promise.invokeCallback_(callbackEntry, state, result);
  } else {
    try {
      callbackEntry.always ? callbackEntry.onFulfilled.call(callbackEntry.context) : goog.Promise.invokeCallback_(callbackEntry, state, result);
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err);
    }
  }
  goog.Promise.returnEntry_(callbackEntry);
};
goog.Promise.invokeCallback_ = function(callbackEntry, state, result) {
  state == goog.Promise.State_.FULFILLED ? callbackEntry.onFulfilled.call(callbackEntry.context, result) : callbackEntry.onRejected && callbackEntry.onRejected.call(callbackEntry.context, result);
};
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && typeof err.stack === "string") {
    let trace = err.stack.split("\n", 4)[3], message = err.message;
    message += Array(11 - message.length).join(" ");
    this.stack_.push(message + trace);
  }
};
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && err && typeof err.stack === "string" && this.stack_.length) {
    let longTrace = ["Promise trace:"];
    for (let promise = this; promise; promise = promise.parent_) {
      for (let i = this.currentStep_; i >= 0; i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: [" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] <" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (let p = this; p && p.unhandledRejectionId_; p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_), p.unhandledRejectionId_ = 0;
    }
  } else if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
    for (let p = this; p && p.hadUnhandledRejection_; p = p.parent_) {
      p.hadUnhandledRejection_ = !1;
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  goog.Promise.UNHANDLED_REJECTION_DELAY > 0 ? promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
    promise.appendLongStack_(reason);
    goog.Promise.handleRejection_.call(null, reason);
  }, goog.Promise.UNHANDLED_REJECTION_DELAY) : goog.Promise.UNHANDLED_REJECTION_DELAY == 0 && (promise.hadUnhandledRejection_ = !0, module$contents$goog$async$run_run(function() {
    promise.hadUnhandledRejection_ && (promise.appendLongStack_(reason), goog.Promise.handleRejection_.call(null, reason));
  }));
};
goog.Promise.handleRejection_ = module$contents$goog$async$throwException_throwException;
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
};
/** @constructor */ 
goog.Promise.CancellationError = function(opt_message) {
  module$contents$goog$debug$Error_DebugError.call(this, opt_message);
};
goog.inherits(goog.Promise.CancellationError, module$contents$goog$debug$Error_DebugError);
goog.Promise.CancellationError.prototype.name = "cancel";
/** @constructor */ 
goog.Promise.Resolver_ = function(promise, resolve, reject) {
  /** @const */ 
  this.promise = promise;
  /** @const */ 
  this.resolve = resolve;
  /** @const */ 
  this.reject = reject;
};
/** @constructor */ 
function module$contents$goog$Timer_Timer(opt_interval, opt_timerObject) {
  module$contents$goog$events$EventTarget_EventsEventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || module$contents$goog$Timer_Timer.defaultTimerObject;
  /** @const */ 
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
}
goog.inherits(module$contents$goog$Timer_Timer, module$contents$goog$events$EventTarget_EventsEventTarget);
/** @const */ 
module$contents$goog$Timer_Timer.MAX_TIMEOUT_ = 2147483647;
/** @const */ 
module$contents$goog$Timer_Timer.INVALID_TIMEOUT_ID_ = -1;
module$contents$goog$Timer_Timer.prototype.enabled = !1;
module$contents$goog$Timer_Timer.defaultTimerObject = goog.global;
module$contents$goog$Timer_Timer.intervalScale = .8;
module$contents$goog$Timer_Timer.prototype.timer_ = null;
module$contents$goog$Timer_Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop();
};
module$contents$goog$Timer_Timer.prototype.tick_ = function() {
  if (this.enabled) {
    let elapsed = goog.now() - this.last_;
    elapsed > 0 && elapsed < this.interval_ * module$contents$goog$Timer_Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.stop(), this.start()));
  }
};
module$contents$goog$Timer_Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(module$contents$goog$Timer_Timer.TICK);
};
module$contents$goog$Timer_Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now());
};
module$contents$goog$Timer_Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null);
};
module$contents$goog$Timer_Timer.prototype.disposeInternal = function() {
  module$contents$goog$Timer_Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
/** @const */ 
module$contents$goog$Timer_Timer.TICK = "tick";
module$contents$goog$Timer_Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (typeof listener === "function") {
    opt_handler && (listener = goog.bind(listener, opt_handler));
  } else if (listener && typeof listener.handleEvent == "function") {
    listener = goog.bind(listener.handleEvent, listener);
  } else {
    throw Error("Invalid listener argument");
  }
  return Number(opt_delay) > module$contents$goog$Timer_Timer.MAX_TIMEOUT_ ? module$contents$goog$Timer_Timer.INVALID_TIMEOUT_ID_ : module$contents$goog$Timer_Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
};
module$contents$goog$Timer_Timer.clear = function(timerId) {
  module$contents$goog$Timer_Timer.defaultTimerObject.clearTimeout(timerId);
};
module$contents$goog$Timer_Timer.promise = function(delay, opt_result) {
  var timerKey = null;
  return (new goog.Promise(function(resolve, reject) {
    timerKey = module$contents$goog$Timer_Timer.callOnce(function() {
      resolve(opt_result);
    }, delay);
    timerKey == module$contents$goog$Timer_Timer.INVALID_TIMEOUT_ID_ && reject(Error("Failed to schedule timer."));
  })).thenCatch(function(error) {
    module$contents$goog$Timer_Timer.clear(timerKey);
    throw error;
  });
};
/** @const */ 
goog.Timer = module$contents$goog$Timer_Timer;
class module$contents$goog$async$Throttle_Throttle extends module$contents$goog$Disposable_Disposable {
  constructor(listener, interval, handler) {
    super();
    this.listener_ = handler != null ? listener.bind(handler) : listener;
    this.interval_ = interval;
    this.args_ = null;
    this.shouldFire_ = !1;
    this.pauseCount_ = 0;
    this.timer_ = null;
  }
  fire(var_args) {
    this.args_ = arguments;
    this.timer_ || this.pauseCount_ ? this.shouldFire_ = !0 : this.doAction_();
  }
  stop() {
    this.timer_ && (module$contents$goog$Timer_Timer.clear(this.timer_), this.timer_ = null, this.shouldFire_ = !1, this.args_ = null);
  }
  pause() {
    this.pauseCount_++;
  }
  resume() {
    this.pauseCount_--;
    this.pauseCount_ || !this.shouldFire_ || this.timer_ || (this.shouldFire_ = !1, this.doAction_());
  }
  disposeInternal() {
    super.disposeInternal();
    this.stop();
  }
  onTimer_() {
    this.timer_ = null;
    this.shouldFire_ && !this.pauseCount_ && (this.shouldFire_ = !1, this.doAction_());
  }
  doAction_() {
    this.timer_ = module$contents$goog$Timer_Timer.callOnce(() => this.onTimer_(), this.interval_);
    var args = this.args_;
    this.args_ = null;
    this.listener_.apply(null, args);
  }
}
/** @const */ 
goog.async.Throttle = module$contents$goog$async$Throttle_Throttle;
/** @const */ 
goog.collections = {};
/** @const */ 
goog.collections.maps = {};
/** @interface */ 
class module$contents$goog$collections$maps_MapLike {
  constructor() {
  }
  set() {
  }
  get() {
  }
  keys() {
  }
  values() {
  }
  has() {
  }
}
/** @const */ 
goog.collections.maps.MapLike = module$contents$goog$collections$maps_MapLike;
function module$contents$goog$collections$maps_setAll(map, entries) {
  if (entries) {
    for (let [k, v] of entries) {
      map.set(k, v);
    }
  }
}
/** @const */ 
goog.collections.maps.setAll = module$contents$goog$collections$maps_setAll;
function module$contents$goog$collections$maps_hasValue(map, val, valueEqualityFn = module$contents$goog$collections$maps_defaultEqualityFn) {
  for (let v of map.values()) {
    if (valueEqualityFn(v, val)) {
      return !0;
    }
  }
  return !1;
}
/** @const */ 
goog.collections.maps.hasValue = module$contents$goog$collections$maps_hasValue;
function module$contents$goog$collections$maps_getWithDefault(map, key, defaultValue) {
  return map.has(key) ? map.get(key) : defaultValue;
}
/** @const */ 
goog.collections.maps.getWithDefault = module$contents$goog$collections$maps_getWithDefault;
/** @const */ 
const module$contents$goog$collections$maps_defaultEqualityFn = (a, b) => a === b;
function module$contents$goog$collections$maps_equals(map, otherMap, valueEqualityFn = module$contents$goog$collections$maps_defaultEqualityFn) {
  if (map === otherMap) {
    return !0;
  }
  if (map.size !== otherMap.size) {
    return !1;
  }
  for (let key of map.keys()) {
    if (!otherMap.has(key) || !valueEqualityFn(map.get(key), otherMap.get(key))) {
      return !1;
    }
  }
  return !0;
}
/** @const */ 
goog.collections.maps.equals = module$contents$goog$collections$maps_equals;
function module$contents$goog$collections$maps_transpose(map) {
  var transposed = new Map();
  for (let key of map.keys()) {
    let val = map.get(key);
    transposed.set(val, key);
  }
  return transposed;
}
/** @const */ 
goog.collections.maps.transpose = module$contents$goog$collections$maps_transpose;
function module$contents$goog$collections$maps_toObject(map) {
  var obj = {};
  for (let key of map.keys()) {
    obj[key] = map.get(key);
  }
  return obj;
}
/** @const */ 
goog.collections.maps.toObject = module$contents$goog$collections$maps_toObject;
function module$contents$goog$collections$maps_clone(map) {
  return new map.constructor(map);
}
/** @const */ 
goog.collections.maps.clone = module$contents$goog$collections$maps_clone;
/** @const */ 
goog.debug.errorcontext = {};
function module$contents$goog$debug$errorcontext_addErrorContext(err, contextKey, contextValue) {
  err.__closure__error__context__984382 || (err.__closure__error__context__984382 = {});
  err.__closure__error__context__984382[contextKey] = contextValue;
}
function module$contents$goog$debug$errorcontext_getErrorContext(err) {
  return err.__closure__error__context__984382 || {};
}
/** @const */ 
goog.debug.errorcontext.addErrorContext = module$contents$goog$debug$errorcontext_addErrorContext;
/** @const */ 
goog.debug.errorcontext.getErrorContext = module$contents$goog$debug$errorcontext_getErrorContext;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.debug.LOGGING_ENABLED = goog.DEBUG;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.debug.FORCE_SLOPPY_STACKS = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.debug.CHECK_FOR_THROWN_EVENT = !1;
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global, oldErrorHandler = target.onerror, retVal = !!opt_cancel;
  target.onerror = function(message, url, line, opt_col, opt_error) {
    oldErrorHandler && oldErrorHandler(message, url, line, opt_col, opt_error);
    logFunc({message, fileName:url, line, lineNumber:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if (typeof obj == "undefined") {
    return "undefined";
  }
  if (obj == null) {
    return "NULL";
  }
  var str = [];
  for (let x in obj) {
    if (!opt_showFn && typeof obj[x] === "function") {
      continue;
    }
    let s = x + " = ";
    try {
      s += obj[x];
    } catch (e) {
      s += "*** " + e + " ***";
    }
    str.push(s);
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj, opt_showFn) {
  var str = [], uidsToCleanup = [], ancestorUids = {}, helper = function(obj, space) {
    var nestspace = space + "  ";
    try {
      if (obj === void 0) {
        str.push("undefined");
      } else if (obj === null) {
        str.push("NULL");
      } else if (typeof obj === "string") {
        str.push('"' + obj.replace(/\n/g, "\n" + space) + '"');
      } else if (typeof obj === "function") {
        str.push(String(obj).replace(/\n/g, "\n" + space));
      } else if (goog.isObject(obj)) {
        goog.hasUid(obj) || uidsToCleanup.push(obj);
        let uid = goog.getUid(obj);
        if (ancestorUids[uid]) {
          str.push("*** reference loop detected (id=" + uid + ") ***");
        } else {
          ancestorUids[uid] = !0;
          str.push("{");
          for (let x in obj) {
            if (opt_showFn || typeof obj[x] !== "function") {
              str.push("\n"), str.push(nestspace), str.push(x + " = "), helper(obj[x], nestspace);
            }
          }
          str.push("\n" + space + "}");
          delete ancestorUids[uid];
        }
      } else {
        str.push(obj);
      }
    } catch (e) {
      str.push("*** " + e + " ***");
    }
  };
  helper(obj, "");
  for (let i = 0; i < uidsToCleanup.length; i++) {
    goog.removeUid(uidsToCleanup[i]);
  }
  return str.join("");
};
goog.debug.exposeArray = function(arr) {
  var str = [];
  for (let i = 0; i < arr.length; i++) {
    Array.isArray(arr[i]) ? str.push(goog.debug.exposeArray(arr[i])) : str.push(arr[i]);
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  err == null && (err = 'Unknown Error of type "null/undefined"');
  if (typeof err === "string") {
    return {message:err, name:"Unknown error", lineNumber:"Not available", fileName:href, stack:"Not available"};
  }
  var threwError = !1;
  try {
    var lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available", threwError = !0;
  }
  try {
    var fileName = err.fileName || err.filename || err.sourceURL || goog.global.$googDebugFname || href;
  } catch (e) {
    fileName = "Not available", threwError = !0;
  }
  var stack = goog.debug.serializeErrorStack_(err);
  if (!(!threwError && err.lineNumber && err.fileName && err.stack && err.message && err.name)) {
    let message = err.message;
    if (message == null) {
      if (err.constructor && err.constructor instanceof Function) {
        let ctorName = err.constructor.name ? err.constructor.name : goog.debug.getFunctionName(err.constructor);
        message = 'Unknown Error of type "' + ctorName + '"';
        if (goog.debug.CHECK_FOR_THROWN_EVENT && ctorName == "Event") {
          try {
            message = message + ' with Event.type "' + (err.type || "") + '"';
          } catch (e) {
          }
        }
      } else {
        message = "Unknown Error of unknown type";
      }
      typeof err.toString === "function" && Object.prototype.toString !== err.toString && (message += ": " + err.toString());
    }
    return {message, name:err.name || "UnknownError", lineNumber, fileName, stack:stack || "Not available"};
  }
  return {message:err.message, name:err.name, lineNumber:err.lineNumber, fileName:err.fileName, stack};
};
goog.debug.serializeErrorStack_ = function(e, seen) {
  seen ||= {};
  seen[goog.debug.serializeErrorAsKey_(e)] = !0;
  var stack = e.stack || "", cause = e.cause;
  cause && !seen[goog.debug.serializeErrorAsKey_(cause)] && (stack += "\nCaused by: ", cause.stack && cause.stack.indexOf(cause.toString()) == 0 || (stack += typeof cause === "string" ? cause : cause.message + "\n"), stack += goog.debug.serializeErrorStack_(cause, seen));
  var errors = e.errors;
  if (Array.isArray(errors)) {
    let actualIndex = 1, i;
    for (i = 0; i < errors.length && !(actualIndex > 4); i++) {
      seen[goog.debug.serializeErrorAsKey_(errors[i])] || (stack += "\nInner error " + actualIndex++ + ": ", errors[i].stack && errors[i].stack.indexOf(errors[i].toString()) == 0 || (stack += typeof errors[i] === "string" ? errors[i] : errors[i].message + "\n"), stack += goog.debug.serializeErrorStack_(errors[i], seen));
    }
    i < errors.length && (stack += "\n... " + (errors.length - i) + " more inner errors");
  }
  return stack;
};
goog.debug.serializeErrorAsKey_ = function(e) {
  var keyPrefix = "";
  typeof e.toString === "function" && (keyPrefix = "" + e);
  return keyPrefix + e.stack;
};
goog.debug.enhanceError = function(err, opt_message) {
  if (err instanceof Error) {
    var error = err;
  } else {
    error = Error(err), Error.captureStackTrace && Error.captureStackTrace(error, goog.debug.enhanceError);
  }
  error.stack || (error.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (opt_message) {
    let x = 0;
    for (; error["message" + x];) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.enhanceErrorWithContext = function(err, opt_context) {
  var error = goog.debug.enhanceError(err);
  if (opt_context) {
    for (let key in opt_context) {
      module$contents$goog$debug$errorcontext_addErrorContext(error, key, opt_context[key]);
    }
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    let stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  for (var sb = [], fn = arguments.callee.caller, depth = 0; fn && (!opt_depth || depth < opt_depth);) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  opt_depth && depth >= opt_depth ? sb.push("[...reached max depth limit...]") : sb.push("[end]");
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(tempErr, fn), String(tempErr.stack);
  }
  try {
    throw tempErr;
  } catch (e) {
    tempErr = e;
  }
  var stack = tempErr.stack;
  return stack ? String(stack) : null;
};
goog.debug.getStacktrace = function(fn) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    let contextFn = fn || goog.debug.getStacktrace;
    var stack = goog.debug.getNativeStackTrace_(contextFn);
  }
  stack ||= goog.debug.getStacktraceHelper_(fn || arguments.callee.caller, []);
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (module$contents$goog$array_contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
    sb.push(goog.debug.getFunctionName(fn) + "(");
    let args = fn.arguments;
    for (let i = 0; args && i < args.length; i++) {
      i > 0 && sb.push(", ");
      let argDesc, arg = args[i];
      switch(typeof arg) {
        case "object":
          argDesc = arg ? "object" : "null";
          break;
        case "string":
          argDesc = arg;
          break;
        case "number":
          argDesc = String(arg);
          break;
        case "boolean":
          argDesc = arg ? "true" : "false";
          break;
        case "function":
          argDesc = (argDesc = goog.debug.getFunctionName(arg)) ? argDesc : "[fn]";
          break;
        default:
          argDesc = typeof arg;
      }
      argDesc.length > 40 && (argDesc = argDesc.slice(0, 40) + "...");
      sb.push(argDesc);
    }
    visited.push(fn);
    sb.push(")\n");
    try {
      sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
    }
  } else {
    fn ? sb.push("[...long stack...]") : sb.push("[end]");
  }
  return sb.join("");
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    let matches = /function\s+([^\(]+)/m.exec(functionSource);
    if (matches) {
      let method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method;
    } else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]";
    }
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.runtimeType = function(value) {
  return value instanceof Function ? value.displayName || value.name || "unknown type name" : value instanceof Object ? value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value) : value === null ? "null" : typeof value;
};
goog.debug.fnNameCache_ = {};
goog.debug.freezeInternal_ = goog.DEBUG && Object.freeze || function(arg) {
  return arg;
};
goog.debug.freeze = function(arg) {
  return goog.debug.freezeInternal_(arg);
};
/** @constructor */ 
function module$contents$goog$events$EventHandler_EventHandler(opt_scope) {
  module$contents$goog$Disposable_Disposable.call(this);
  this.handler_ = opt_scope;
  this.keys_ = {};
}
goog.inherits(module$contents$goog$events$EventHandler_EventHandler, module$contents$goog$Disposable_Disposable);
/** @const */ 
module$contents$goog$events$EventHandler_EventHandler.typeArray_ = [];
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listen = function(src, type, opt_fn, opt_options) {
  var self = this;
  return self.listen_(src, type, opt_fn, opt_options);
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listen_ = function(src, type, opt_fn, opt_options, opt_scope) {
  var self = this;
  Array.isArray(type) || (type && (module$contents$goog$events$EventHandler_EventHandler.typeArray_[0] = type.toString()), type = module$contents$goog$events$EventHandler_EventHandler.typeArray_);
  for (let i = 0; i < type.length; i++) {
    let listenerObj = goog.events.listen(src, type[i], opt_fn || self.handleEvent, opt_options || !1, opt_scope || self.handler_ || self);
    if (!listenerObj) {
      break;
    }
    let key = listenerObj.key;
    self.keys_[key] = listenerObj;
  }
  return self;
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listenOnce = function(src, type, opt_fn, opt_options) {
  var self = this;
  return self.listenOnce_(src, type, opt_fn, opt_options);
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listenOnce_ = function(src, type, opt_fn, opt_options, opt_scope) {
  var self = this;
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      self.listenOnce_(src, type[i], opt_fn, opt_options, opt_scope);
    }
  } else {
    let listenerObj = goog.events.listenOnce(src, type, opt_fn || self.handleEvent, opt_options, opt_scope || self.handler_ || self);
    if (!listenerObj) {
      return self;
    }
    let key = listenerObj.key;
    self.keys_[key] = listenerObj;
  }
  return self;
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listenWithWrapper = function(src, wrapper, listener, opt_capt) {
  var self = this;
  return self.listenWithWrapper_(src, wrapper, listener, opt_capt);
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.listenWithWrapper_ = function(src, wrapper, listener, opt_capt, opt_scope) {
  var self = this;
  wrapper.listen(src, listener, opt_capt, opt_scope || self.handler_ || self, self);
  return self;
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.unlisten = function(src, type, opt_fn, opt_options, opt_scope) {
  var self = this;
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      self.unlisten(src, type[i], opt_fn, opt_options, opt_scope);
    }
  } else {
    let capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options, listener = goog.events.getListener(src, type, opt_fn || self.handleEvent, capture, opt_scope || self.handler_ || self);
    listener && (goog.events.unlistenByKey(listener), delete self.keys_[listener.key]);
  }
  return self;
};
/**
 * @this {JSDocSerializer_placeholder_type}
 */
module$contents$goog$events$EventHandler_EventHandler.prototype.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_scope) {
  var self = this;
  wrapper.unlisten(src, listener, opt_capt, opt_scope || self.handler_ || self, self);
  return self;
};
module$contents$goog$events$EventHandler_EventHandler.prototype.removeAll = function() {
  module$contents$goog$object_forEach(this.keys_, function(listenerObj, key) {
    this.keys_.hasOwnProperty(key) && goog.events.unlistenByKey(listenerObj);
  }, this);
  this.keys_ = {};
};
module$contents$goog$events$EventHandler_EventHandler.prototype.disposeInternal = function() {
  module$contents$goog$events$EventHandler_EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
module$contents$goog$events$EventHandler_EventHandler.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
/** @const */ 
goog.events.EventHandler = module$contents$goog$events$EventHandler_EventHandler;
/** @const */ 
goog.json = {};
function module$contents$goog$json_isValid(s) {
  if (/^\s*$/.test(s)) {
    return !1;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g, simpleValuesRe = /(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
}
function module$contents$goog$json_setErrorLogger() {
}
const module$contents$goog$json_parse = goog.global.JSON.parse;
let module$contents$goog$json_Replacer, module$contents$goog$json_Reviver;
const module$contents$goog$json_serialize = goog.global.JSON.stringify;
/** @constructor */ 
function module$contents$goog$json_Serializer(opt_replacer) {
  this.replacer_ = opt_replacer;
}
module$contents$goog$json_Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
module$contents$goog$json_Serializer.prototype.serializeInternal = function(object, sb) {
  if (object == null) {
    sb.push("null");
  } else {
    if (typeof object == "object") {
      if (Array.isArray(object)) {
        this.serializeArray(object, sb);
        return;
      }
      if (object instanceof String || object instanceof Number || object instanceof Boolean) {
        object = object.valueOf();
      } else {
        this.serializeObject_(object, sb);
        return;
      }
    }
    switch(typeof object) {
      case "string":
        this.serializeString_(object, sb);
        break;
      case "number":
        this.serializeNumber_(object, sb);
        break;
      case "boolean":
        sb.push(String(object));
        break;
      case "function":
        sb.push("null");
        break;
      default:
        throw Error("Unknown type: " + typeof object);
    }
  }
};
module$contents$goog$json_Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\v":"\\u000b"};
module$contents$goog$json_Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;
module$contents$goog$json_Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(module$contents$goog$json_Serializer.charsToReplace_, function(c) {
    var rv = module$contents$goog$json_Serializer.charToJsonCharCache_[c];
    rv || (rv = "\\u" + (c.charCodeAt(0) | 65536).toString(16).slice(1), module$contents$goog$json_Serializer.charToJsonCharCache_[c] = rv);
    return rv;
  }), '"');
};
module$contents$goog$json_Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? String(n) : "null");
};
module$contents$goog$json_Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for (let i = 0; i < l; i++) {
    sb.push(sep);
    let value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
module$contents$goog$json_Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let value = obj[key];
      typeof value != "function" && (sb.push(sep), this.serializeString_(key, sb), sb.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb), sep = ",");
    }
  }
  sb.push("}");
};
/** @const */ 
goog.json.Replacer = module$contents$goog$json_Replacer;
/** @const */ 
goog.json.Reviver = module$contents$goog$json_Reviver;
/** @const */ 
goog.json.Serializer = module$contents$goog$json_Serializer;
/** @const */ 
goog.json.USE_NATIVE_JSON = !0;
/** @const */ 
goog.json.isValid = module$contents$goog$json_isValid;
/** @const */ 
goog.json.parse = module$contents$goog$json_parse;
/** @const */ 
goog.json.serialize = module$contents$goog$json_serialize;
/** @const */ 
goog.json.setErrorLogger = module$contents$goog$json_setErrorLogger;
/** @const */ 
goog.json.hybrid = {};
const module$contents$goog$json$hybrid_stringify = goog.global.JSON.stringify, module$contents$goog$json$hybrid_parse = goog.global.JSON.parse;
/** @const */ 
goog.json.hybrid.parse = module$contents$goog$json$hybrid_parse;
/** @const */ 
goog.json.hybrid.stringify = module$contents$goog$json$hybrid_stringify;
/** @interface */ 
function module$contents$goog$string$Parser_Parser() {
}
/** @const */ 
goog.string.Parser = module$contents$goog$string$Parser_Parser;
/** @interface */ 
function module$contents$goog$string$Stringifier_Stringifier() {
}
/** @const */ 
goog.string.Stringifier = module$contents$goog$string$Stringifier_Stringifier;
/** @const */ 
goog.json.NativeJsonProcessor = class {
  constructor(opt_replacer, opt_reviver) {
    goog.asserts.assert(goog.global.JSON !== void 0, "JSON not defined");
    this.replacer_ = opt_replacer;
    this.reviver_ = opt_reviver;
  }
  stringify(object) {
    return goog.global.JSON.stringify(object, this.replacer_);
  }
  parse(s) {
    return goog.global.JSON.parse(s, this.reviver_);
  }
};
/** @const */ 
goog.net = {};
/** @interface */ 
function module$contents$goog$net$XhrLike_XhrLike() {
}
module$contents$goog$net$XhrLike_XhrLike.prototype.open = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.send = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.abort = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.setRequestHeader = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.getResponseHeader = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.getAllResponseHeaders = function() {
};
module$contents$goog$net$XhrLike_XhrLike.prototype.setTrustToken = function() {
};
/** @const */ 
goog.net.XhrLike = module$contents$goog$net$XhrLike_XhrLike;
/** @constructor */ 
function module$contents$goog$net$XmlHttpFactory_XmlHttpFactory() {
}
/** @const */ 
goog.net.XmlHttpFactory = module$contents$goog$net$XmlHttpFactory_XmlHttpFactory;
/** @interface */ 
function module$contents$goog$net$WebChannel_WebChannel() {
}
/** @interface */ 
module$contents$goog$net$WebChannel_WebChannel.FailureRecovery = function() {
};
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$net$WebChannel_WebChannel.EventType = {OPEN:"a", CLOSE:"b", ERROR:"c", MESSAGE:"d"};
/** @constructor */ 
module$contents$goog$net$WebChannel_WebChannel.MessageEvent = function() {
  goog.events.Event.call(this, module$contents$goog$net$WebChannel_WebChannel.EventType.MESSAGE);
};
goog.inherits(module$contents$goog$net$WebChannel_WebChannel.MessageEvent, goog.events.Event);
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$net$WebChannel_WebChannel.ErrorStatus = {OK:0, NETWORK_ERROR:1, SERVER_ERROR:2};
/** @constructor */ 
module$contents$goog$net$WebChannel_WebChannel.ErrorEvent = function() {
  goog.events.Event.call(this, module$contents$goog$net$WebChannel_WebChannel.EventType.ERROR);
};
goog.inherits(module$contents$goog$net$WebChannel_WebChannel.ErrorEvent, goog.events.Event);
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$net$WebChannel_WebChannel.FailureRecovery.State = {INIT:"init", FAILED:"failed", RECOVERING:"recovering", CLOSED:"closed"};
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$net$WebChannel_WebChannel.FailureRecovery.FailureCondition = {HTTP_ERROR:"http_error", ABORT:"abort", TIMEOUT:"timeout", EXCEPTION:"exception"};
module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL = "X-Client-Protocol";
module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL = "webchannel";
module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_WIRE_PROTOCOL = "X-Client-Wire-Protocol";
module$contents$goog$net$WebChannel_WebChannel.X_HTTP_SESSION_ID = "X-HTTP-Session-Id";
module$contents$goog$net$WebChannel_WebChannel.X_HTTP_INITIAL_RESPONSE = "X-HTTP-Initial-Response";
module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CONTENT_TYPE = "X-WebChannel-Content-Type";
module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CLIENT_PROFILE = "X-WebChannel-Client-Profile";
/** @const */ 
goog.net.WebChannel = module$contents$goog$net$WebChannel_WebChannel;
/** @const */ 
goog.labs.net = {};
/** @const */ 
goog.labs.net.webChannel = {};
/** @interface */ 
function module$contents$goog$labs$net$webChannel$Channel_Channel() {
}
/** @const */ 
goog.labs.net.webChannel.Channel = module$contents$goog$labs$net$webChannel$Channel_Channel;
/** @const */ 
goog.labs.net.webChannel.environment = {};
function module$contents$goog$labs$net$webChannel$environment_isUrlGoogle(url) {
  var match = /\/\/([^\/]+)\//.exec(url);
  if (!match) {
    return !1;
  }
  var origin = match[1];
  return origin.endsWith("google.com");
}
let module$contents$goog$labs$net$webChannel$environment_isStartOriginTrialsCalled = !1;
/** @const */ 
goog.labs.net.webChannel.environment.startOriginTrials = function(path, logError) {
  if (!module$contents$goog$labs$net$webChannel$environment_isStartOriginTrialsCalled) {
    module$contents$goog$labs$net$webChannel$environment_isStartOriginTrialsCalled = !0;
    {
      b: {
        let navigator = goog.global.navigator;
        if (navigator) {
          let userAgent = navigator.userAgent;
          if (userAgent) {
            var JSCompiler_inline_result = userAgent;
            break b;
          }
        }
        JSCompiler_inline_result = "";
      }
      let userAgentStr = JSCompiler_inline_result;
      if (userAgentStr.indexOf("Chrome") == -1 || userAgentStr.indexOf("Edg") != -1) {
        var JSCompiler_inline_result$jscomp$0 = !1;
      } else {
        var match = /Chrome\/(\d+)/.exec(userAgentStr), chromeVersion = parseInt(match[1], 10);
        JSCompiler_inline_result$jscomp$0 = chromeVersion >= 90;
      }
    }
    if (JSCompiler_inline_result$jscomp$0 && module$contents$goog$labs$net$webChannel$environment_isUrlGoogle(path) && window && window.document && module$contents$goog$labs$net$webChannel$environment_isUrlGoogle(window.document.URL)) {
      var tokenElement = document.createElement("meta");
      tokenElement.httpEquiv = "origin-trial";
      tokenElement.content = "A0eNbltY1nd4MP7XTHXnTxWogDL6mWTdgIIKfKOTJoUHNbFFMZQBoiHHjJ9UK9lgYndWFaxOWR7ld8uUjcWmcwIAAAB/eyJvcmlnaW4iOiJodHRwczovL2dvb2dsZS5jb206NDQzIiwiZmVhdHVyZSI6IkZldGNoVXBsb2FkU3RyZWFtaW5nIiwiZXhwaXJ5IjoxNjM2NTAyMzk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==";
      document.head.appendChild(tokenElement);
      var supportsRequestStreams = !(new Request("", {body:new ReadableStream(), method:"POST"})).headers.has("Content-Type");
      supportsRequestStreams && logError("OriginTrial unexpected.");
    }
  }
};
/** @const */ 
goog.labs.net.webChannel.requestStats = {};
/** @const */ 
const module$contents$goog$labs$net$webChannel$requestStats_Event = {};
let module$contents$goog$labs$net$webChannel$requestStats_eventTargetInternal = null;
function module$contents$goog$labs$net$webChannel$requestStats_getStatEventTargetInternal() {
  return module$contents$goog$labs$net$webChannel$requestStats_eventTargetInternal = module$contents$goog$labs$net$webChannel$requestStats_eventTargetInternal || new module$contents$goog$events$EventTarget_EventsEventTarget();
}
module$contents$goog$labs$net$webChannel$requestStats_Event.SERVER_REACHABILITY_EVENT = "serverreachability";
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$labs$net$webChannel$requestStats_ServerReachability = {REQUEST_MADE:1, REQUEST_SUCCEEDED:2, REQUEST_FAILED:3, BACK_CHANNEL_ACTIVITY:4};
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$requestStats_ServerReachabilityEvent(target) {
  goog.events.Event.call(this, module$contents$goog$labs$net$webChannel$requestStats_Event.SERVER_REACHABILITY_EVENT, target);
}
goog.inherits(module$contents$goog$labs$net$webChannel$requestStats_ServerReachabilityEvent, goog.events.Event);
function module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(reachabilityType) {
  var target = module$contents$goog$labs$net$webChannel$requestStats_getStatEventTargetInternal();
  target.dispatchEvent(new module$contents$goog$labs$net$webChannel$requestStats_ServerReachabilityEvent(target, reachabilityType));
}
module$contents$goog$labs$net$webChannel$requestStats_Event.STAT_EVENT = "statevent";
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$labs$net$webChannel$requestStats_Stat = {CONNECT_ATTEMPT:0, ERROR_NETWORK:1, ERROR_OTHER:2, TEST_STAGE_ONE_START:3, TEST_STAGE_TWO_START:4, TEST_STAGE_TWO_DATA_ONE:5, TEST_STAGE_TWO_DATA_TWO:6, TEST_STAGE_TWO_DATA_BOTH:7, TEST_STAGE_ONE_FAILED:8, TEST_STAGE_TWO_FAILED:9, PROXY:10, NOPROXY:11, REQUEST_UNKNOWN_SESSION_ID:12, REQUEST_BAD_STATUS:13, REQUEST_INCOMPLETE_DATA:14, REQUEST_BAD_DATA:15, REQUEST_NO_DATA:16, REQUEST_TIMEOUT:17, BACKCHANNEL_MISSING:18, BACKCHANNEL_DEAD:19, 
BROWSER_OFFLINE:20};
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$requestStats_StatEvent(eventTarget, stat) {
  goog.events.Event.call(this, module$contents$goog$labs$net$webChannel$requestStats_Event.STAT_EVENT, eventTarget);
  this.stat = stat;
}
goog.inherits(module$contents$goog$labs$net$webChannel$requestStats_StatEvent, goog.events.Event);
function module$contents$goog$labs$net$webChannel$requestStats_getStatEventTarget() {
  return module$contents$goog$labs$net$webChannel$requestStats_getStatEventTargetInternal();
}
function module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(stat) {
  var target = module$contents$goog$labs$net$webChannel$requestStats_getStatEventTargetInternal();
  target.dispatchEvent(new module$contents$goog$labs$net$webChannel$requestStats_StatEvent(target, stat));
}
module$contents$goog$labs$net$webChannel$requestStats_Event.TIMING_EVENT = "timingevent";
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$requestStats_TimingEvent(target, size, rtt) {
  goog.events.Event.call(this, module$contents$goog$labs$net$webChannel$requestStats_Event.TIMING_EVENT, target);
  this.size = size;
  this.rtt = rtt;
}
goog.inherits(module$contents$goog$labs$net$webChannel$requestStats_TimingEvent, goog.events.Event);
function module$contents$goog$labs$net$webChannel$requestStats_notifyTimingEvent(size, rtt, retries) {
  var target = module$contents$goog$labs$net$webChannel$requestStats_getStatEventTargetInternal();
  target.dispatchEvent(new module$contents$goog$labs$net$webChannel$requestStats_TimingEvent(target, size, rtt, retries));
}
function module$contents$goog$labs$net$webChannel$requestStats_setStartThreadExecutionHook(startHook) {
  module$contents$goog$labs$net$webChannel$requestStats_startExecutionHook = startHook;
}
function module$contents$goog$labs$net$webChannel$requestStats_setEndThreadExecutionHook(endHook) {
  module$contents$goog$labs$net$webChannel$requestStats_endExecutionHook = endHook;
}
let module$contents$goog$labs$net$webChannel$requestStats_startExecutionHook = function() {
}, module$contents$goog$labs$net$webChannel$requestStats_endExecutionHook = function() {
};
function module$contents$goog$labs$net$webChannel$requestStats_onStartExecution() {
  module$contents$goog$labs$net$webChannel$requestStats_startExecutionHook();
}
function module$contents$goog$labs$net$webChannel$requestStats_onEndExecution() {
  module$contents$goog$labs$net$webChannel$requestStats_endExecutionHook();
}
function module$contents$goog$labs$net$webChannel$requestStats_setTimeout(fn, ms) {
  if (typeof fn !== "function") {
    throw Error("Fn must not be null and must be a function");
  }
  return goog.global.setTimeout(function() {
    module$contents$goog$labs$net$webChannel$requestStats_startExecutionHook();
    try {
      fn();
    } finally {
      module$contents$goog$labs$net$webChannel$requestStats_endExecutionHook();
    }
  }, ms);
}
/** @const */ 
goog.labs.net.webChannel.requestStats.Event = module$contents$goog$labs$net$webChannel$requestStats_Event;
/** @const */ 
goog.labs.net.webChannel.requestStats.ServerReachability = module$contents$goog$labs$net$webChannel$requestStats_ServerReachability;
/** @const */ 
goog.labs.net.webChannel.requestStats.ServerReachabilityEvent = module$contents$goog$labs$net$webChannel$requestStats_ServerReachabilityEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.Stat = module$contents$goog$labs$net$webChannel$requestStats_Stat;
/** @const */ 
goog.labs.net.webChannel.requestStats.StatEvent = module$contents$goog$labs$net$webChannel$requestStats_StatEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.TimingEvent = module$contents$goog$labs$net$webChannel$requestStats_TimingEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.getStatEventTarget = module$contents$goog$labs$net$webChannel$requestStats_getStatEventTarget;
/** @const */ 
goog.labs.net.webChannel.requestStats.notifyServerReachabilityEvent = module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.notifyStatEvent = module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.notifyTimingEvent = module$contents$goog$labs$net$webChannel$requestStats_notifyTimingEvent;
/** @const */ 
goog.labs.net.webChannel.requestStats.onEndExecution = module$contents$goog$labs$net$webChannel$requestStats_onEndExecution;
/** @const */ 
goog.labs.net.webChannel.requestStats.onStartExecution = module$contents$goog$labs$net$webChannel$requestStats_onStartExecution;
/** @const */ 
goog.labs.net.webChannel.requestStats.setEndThreadExecutionHook = module$contents$goog$labs$net$webChannel$requestStats_setEndThreadExecutionHook;
/** @const */ 
goog.labs.net.webChannel.requestStats.setStartThreadExecutionHook = module$contents$goog$labs$net$webChannel$requestStats_setStartThreadExecutionHook;
/** @const */ 
goog.labs.net.webChannel.requestStats.setTimeout = module$contents$goog$labs$net$webChannel$requestStats_setTimeout;
/** @const */ 
goog.log = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
/** @const */ 
goog.log.ROOT_LOGGER_NAME = "";
goog.log.Level = class {
  constructor(name, value) {
    /** @const */ 
    this.name = name;
    this.value = value;
  }
  toString() {
    return this.name;
  }
};
goog.log.Level.OFF = new goog.log.Level("OFF", Infinity);
goog.log.Level.SHOUT = new goog.log.Level("SHOUT", 1200);
goog.log.Level.SEVERE = new goog.log.Level("SEVERE", 1E3);
goog.log.Level.WARNING = new goog.log.Level("WARNING", 900);
goog.log.Level.INFO = new goog.log.Level("INFO", 800);
goog.log.Level.CONFIG = new goog.log.Level("CONFIG", 700);
goog.log.Level.FINE = new goog.log.Level("FINE", 500);
goog.log.Level.FINER = new goog.log.Level("FINER", 400);
goog.log.Level.FINEST = new goog.log.Level("FINEST", 300);
goog.log.Level.ALL = new goog.log.Level("ALL", 0);
goog.log.Level.PREDEFINED_LEVELS = [goog.log.Level.OFF, goog.log.Level.SHOUT, goog.log.Level.SEVERE, goog.log.Level.WARNING, goog.log.Level.INFO, goog.log.Level.CONFIG, goog.log.Level.FINE, goog.log.Level.FINER, goog.log.Level.FINEST, goog.log.Level.ALL];
goog.log.Level.predefinedLevelsCache_ = null;
goog.log.Level.createPredefinedLevelsCache_ = function() {
  goog.log.Level.predefinedLevelsCache_ = {};
  for (let i = 0, level; level = goog.log.Level.PREDEFINED_LEVELS[i]; i++) {
    goog.log.Level.predefinedLevelsCache_[level.value] = level, goog.log.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.log.Level.getPredefinedLevel = function(name) {
  goog.log.Level.predefinedLevelsCache_ || goog.log.Level.createPredefinedLevelsCache_();
  return goog.log.Level.predefinedLevelsCache_[name] || null;
};
goog.log.Level.getPredefinedLevelByValue = function(value) {
  goog.log.Level.predefinedLevelsCache_ || goog.log.Level.createPredefinedLevelsCache_();
  if (value in goog.log.Level.predefinedLevelsCache_) {
    return goog.log.Level.predefinedLevelsCache_[value];
  }
  for (let i = 0; i < goog.log.Level.PREDEFINED_LEVELS.length; ++i) {
    let level = goog.log.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
/** @interface */ 
goog.log.Logger = class {
  getName() {
  }
};
goog.log.Logger.Level = goog.log.Level;
goog.log.LogBuffer = class {
  constructor(capacity) {
    this.capacity_ = typeof capacity === "number" ? capacity : goog.log.LogBuffer.CAPACITY;
    this.clear();
  }
  addRecord(level, msg, loggerName) {
    if (!this.isBufferingEnabled()) {
      return new goog.log.LogRecord(level, msg, loggerName);
    }
    var curIndex = (this.curIndex_ + 1) % this.capacity_;
    this.curIndex_ = curIndex;
    if (this.isFull_) {
      let ret = this.buffer_[curIndex];
      ret.reset(level, msg, loggerName);
      return ret;
    }
    this.isFull_ = curIndex == this.capacity_ - 1;
    return this.buffer_[curIndex] = new goog.log.LogRecord(level, msg, loggerName);
  }
  isBufferingEnabled() {
    return this.capacity_ > 0;
  }
  isFull() {
    return this.isFull_;
  }
  clear() {
    this.buffer_ = Array(this.capacity_);
    this.curIndex_ = -1;
    this.isFull_ = !1;
  }
};
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.log.LogBuffer.CAPACITY = 0;
goog.log.LogBuffer.getInstance = function() {
  goog.log.LogBuffer.instance_ || (goog.log.LogBuffer.instance_ = new goog.log.LogBuffer(goog.log.LogBuffer.CAPACITY));
  return goog.log.LogBuffer.instance_;
};
goog.log.LogBuffer.isBufferingEnabled = function() {
  return goog.log.LogBuffer.getInstance().isBufferingEnabled();
};
goog.log.LogRecord = class {
  constructor(level, msg, loggerName, time, sequenceNumber) {
    this.reset(level || goog.log.Level.OFF, msg, loggerName, time, sequenceNumber);
  }
  reset(level) {
    this.level_ = level;
  }
  getLevel() {
    return this.level_;
  }
  setLevel(level) {
    this.level_ = level;
  }
};
goog.log.LogRecord.nextSequenceNumber_ = 0;
goog.log.LogRegistryEntry_ = class {
  constructor(name, parent = null) {
    this.level = null;
    this.handlers = [];
    this.parent = parent || null;
    this.children = [];
    this.logger = {getName:() => name};
  }
  getEffectiveLevel() {
    if (this.level) {
      return this.level;
    }
    if (this.parent) {
      return this.parent.getEffectiveLevel();
    }
    goog.asserts.fail("Root logger has no level set.");
    return goog.log.Level.OFF;
  }
  publish(logRecord) {
    for (var target = this; target;) {
      target.handlers.forEach(handler => {
        handler(logRecord);
      }), target = target.parent;
    }
  }
};
goog.log.LogRegistry_ = class {
  constructor() {
    this.entries = {};
    var rootLogRegistryEntry = new goog.log.LogRegistryEntry_(goog.log.ROOT_LOGGER_NAME);
    rootLogRegistryEntry.level = goog.log.Level.CONFIG;
    this.entries[goog.log.ROOT_LOGGER_NAME] = rootLogRegistryEntry;
  }
  getLogRegistryEntry(name, level) {
    var entry = this.entries[name];
    if (entry) {
      return level !== void 0 && (entry.level = level), entry;
    }
    var lastDotIndex = name.lastIndexOf("."), parentName = name.slice(0, Math.max(lastDotIndex, 0)), parentLogRegistryEntry = this.getLogRegistryEntry(parentName), logRegistryEntry = new goog.log.LogRegistryEntry_(name, parentLogRegistryEntry);
    this.entries[name] = logRegistryEntry;
    parentLogRegistryEntry.children.push(logRegistryEntry);
    level !== void 0 && (logRegistryEntry.level = level);
    return logRegistryEntry;
  }
  getAllLoggers() {
    return Object.keys(this.entries).map(loggerName => this.entries[loggerName].logger);
  }
};
goog.log.LogRegistry_.getInstance = function() {
  goog.log.LogRegistry_.instance_ || (goog.log.LogRegistry_.instance_ = new goog.log.LogRegistry_());
  return goog.log.LogRegistry_.instance_;
};
goog.log.getLogger = function(name, level) {
  if (goog.log.ENABLED) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(name, level);
    return loggerEntry.logger;
  }
  return null;
};
goog.log.getRootLogger = function() {
  if (goog.log.ENABLED) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(goog.log.ROOT_LOGGER_NAME);
    return loggerEntry.logger;
  }
  return null;
};
goog.log.addHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    loggerEntry.handlers.push(handler);
  }
};
goog.log.removeHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName()), indexOfHandler = loggerEntry.handlers.indexOf(handler);
    if (indexOfHandler !== -1) {
      return loggerEntry.handlers.splice(indexOfHandler, 1), !0;
    }
  }
  return !1;
};
goog.log.setLevel = function(logger, level) {
  if (goog.log.ENABLED && logger) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    loggerEntry.level = level;
  }
};
goog.log.getLevel = function(logger) {
  if (goog.log.ENABLED && logger) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    return loggerEntry.level;
  }
  return null;
};
goog.log.getEffectiveLevel = function(logger) {
  if (goog.log.ENABLED && logger) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    return loggerEntry.getEffectiveLevel();
  }
  return goog.log.Level.OFF;
};
goog.log.isLoggable = function(logger, level) {
  return goog.log.ENABLED && logger && level ? level.value >= goog.log.getEffectiveLevel(logger).value : !1;
};
goog.log.getAllLoggers = function() {
  return goog.log.ENABLED ? goog.log.LogRegistry_.getInstance().getAllLoggers() : [];
};
goog.log.getLogRecord = function(logger, level, msg) {
  var logRecord = goog.log.LogBuffer.getInstance().addRecord(level || goog.log.Level.OFF, msg, logger.getName());
  return logRecord;
};
goog.log.publishLogRecord = function(logger, logRecord) {
  if (goog.log.ENABLED && logger && goog.log.isLoggable(logger, logRecord.getLevel())) {
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    loggerEntry.publish(logRecord);
  }
};
goog.log.log = function(logger, level, msg) {
  if (goog.log.ENABLED && logger && goog.log.isLoggable(logger, level)) {
    level = level || goog.log.Level.OFF;
    let loggerEntry = goog.log.LogRegistry_.getInstance().getLogRegistryEntry(logger.getName());
    typeof msg === "function" && (msg = msg());
    let logRecord = goog.log.LogBuffer.getInstance().addRecord(level, msg, logger.getName());
    loggerEntry.publish(logRecord);
  }
};
goog.log.error = function(logger, msg, exception) {
  goog.log.ENABLED && logger && goog.log.log(logger, goog.log.Level.SEVERE, msg, exception);
};
goog.log.warning = function(logger, msg, exception) {
  goog.log.ENABLED && logger && goog.log.log(logger, goog.log.Level.WARNING, msg, exception);
};
goog.log.info = function(logger, msg, exception) {
  goog.log.ENABLED && logger && goog.log.log(logger, goog.log.Level.INFO, msg, exception);
};
goog.log.fine = function(logger, msg, exception) {
  goog.log.ENABLED && logger && goog.log.log(logger, goog.log.Level.FINE, msg, exception);
};
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug() {
  /** @const */ 
  this.logger_ = goog.log.getLogger("goog.labs.net.webChannel.WebChannelDebug");
  this.redactEnabled_ = !0;
}
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.disableRedact = function() {
  this.redactEnabled_ = !1;
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.xmlHttpChannelRequest = function(verb, uri, id, attempt, postData) {
  var self = this;
  this.info(function() {
    return "XMLHTTP REQ (" + id + ") [attempt " + attempt + "]: " + verb + "\n" + uri + "\n" + self.maybeRedactPostData_(postData);
  });
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.xmlHttpChannelResponseMetaData = function(verb, uri, id, attempt, readyState, statusCode) {
  this.info(function() {
    return "XMLHTTP RESP (" + id + ") [ attempt " + attempt + "]: " + verb + "\n" + uri + "\n" + readyState + " " + statusCode;
  });
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.xmlHttpChannelResponseText = function(id, responseText, opt_desc) {
  var self = this;
  this.info(function() {
    return "XMLHTTP TEXT (" + id + "): " + self.redactResponse_(responseText) + (opt_desc ? " " + opt_desc : "");
  });
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.timeoutResponse = function(uri) {
  this.info(function() {
    return "TIMEOUT: " + uri;
  });
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.debug = function(text) {
  goog.log.fine(this.logger_, text);
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.dumpException = function(e, opt_msg) {
  goog.log.error(this.logger_, opt_msg || "Exception", e);
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.info = function(text) {
  goog.log.info(this.logger_, text);
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.warning = function(text) {
  goog.log.warning(this.logger_, text);
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.severe = function(text) {
  goog.log.error(this.logger_, text);
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.redactResponse_ = function(responseText) {
  if (!this.redactEnabled_) {
    return responseText;
  }
  if (!responseText) {
    return null;
  }
  try {
    let responseArray = JSON.parse(responseText);
    if (responseArray) {
      for (let i = 0; i < responseArray.length; i++) {
        Array.isArray(responseArray[i]) && this.maybeRedactArray_(responseArray[i]);
      }
    }
    return module$contents$goog$json_serialize(responseArray);
  } catch (e) {
    return this.debug("Exception parsing expected JS array - probably was not JS"), responseText;
  }
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.maybeRedactArray_ = function(array) {
  if (!(array.length < 2)) {
    var dataPart = array[1];
    if (Array.isArray(dataPart) && !(dataPart.length < 1)) {
      var type = dataPart[0];
      if (type != "noop" && type != "stop" && type != "close") {
        for (let i = 1; i < dataPart.length; i++) {
          dataPart[i] = "";
        }
      }
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug.prototype.maybeRedactPostData_ = function(data) {
  if (!this.redactEnabled_) {
    return data;
  }
  if (!data) {
    return null;
  }
  var out = "", params = data.split("&");
  for (let i = 0; i < params.length; i++) {
    let param = params[i], keyValue = param.split("=");
    if (keyValue.length > 1) {
      let key = keyValue[0], value = keyValue[1], keyParts = key.split("_");
      out = keyParts.length >= 2 && keyParts[1] == "type" ? out + (key + "=" + value + "&") : out + (key + "=redacted&");
    }
  }
  return out;
};
/** @const */ 
goog.labs.net.webChannel.WebChannelDebug = module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug;
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$net$ErrorCode_ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9, getDebugMessage:function(errorCode) {
  switch(errorCode) {
    case module$contents$goog$net$ErrorCode_ErrorCode.NO_ERROR:
      return "No Error";
    case module$contents$goog$net$ErrorCode_ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case module$contents$goog$net$ErrorCode_ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case module$contents$goog$net$ErrorCode_ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case module$contents$goog$net$ErrorCode_ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case module$contents$goog$net$ErrorCode_ErrorCode.EXCEPTION:
      return "An exception occurred";
    case module$contents$goog$net$ErrorCode_ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case module$contents$goog$net$ErrorCode_ErrorCode.ABORT:
      return "Request was aborted";
    case module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT:
      return "Request timed out";
    case module$contents$goog$net$ErrorCode_ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
}};
/** @const */ 
goog.net.ErrorCode = module$contents$goog$net$ErrorCode_ErrorCode;
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$net$EventType_EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress", DOWNLOAD_PROGRESS:"downloadprogress", UPLOAD_PROGRESS:"uploadprogress"};
/** @const */ 
goog.net.EventType = module$contents$goog$net$EventType_EventType;
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
};
/** @constructor */ 
goog.net.DefaultXmlHttpFactory = function() {
};
goog.inherits(goog.net.DefaultXmlHttpFactory, module$contents$goog$net$XmlHttpFactory_XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  return new XMLHttpRequest();
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory());
/** @license

 Copyright Google LLC
 SPDX-License-Identifier: Apache-2.0
*/
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$internals$secrets = {secretToken:{}};
function module$contents$google3$third_party$javascript$safevalues$internals$secrets_ensureTokenIsValid(token) {
  if (goog.DEBUG && token !== module$exports$google3$third_party$javascript$safevalues$internals$secrets.secretToken) {
    throw Error("Bad secret");
  }
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$secrets.ensureTokenIsValid = module$contents$google3$third_party$javascript$safevalues$internals$secrets_ensureTokenIsValid;
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$internals$trusted_types = {};
/** @define {!JSDocSerializer_placeholder_type} */ 
const module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_configuredPolicyName = goog.TRUSTED_TYPES_POLICY_NAME ? goog.TRUSTED_TYPES_POLICY_NAME + "#html" : "";
let module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policyName = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_configuredPolicyName;
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.trustedTypes = globalThis.trustedTypes;
/** @noinline */ 
let module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_trustedTypesInternal = module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.trustedTypes, module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policy;
function module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_createPolicy() {
  var policy = null;
  if (module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policyName === "" || !module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_trustedTypesInternal) {
    return policy;
  }
  try {
    let identity = x => x;
    policy = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_trustedTypesInternal.createPolicy(module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policyName, {createHTML:identity, createScript:identity, createScriptURL:identity});
  } catch (e) {
    if (goog.DEBUG) {
      throw e;
    }
  }
  return policy;
}
function module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_getPolicy() {
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policy === void 0 && (module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policy = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_createPolicy());
  return module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policy;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.getPolicy = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_getPolicy;
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.TEST_ONLY = {setPolicyName(name) {
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policyName = name;
}, setTrustedTypes(mockTrustedTypes) {
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_trustedTypesInternal = mockTrustedTypes;
}, resetDefaults() {
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policy = void 0;
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_policyName = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_configuredPolicyName;
  module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_trustedTypesInternal = module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.trustedTypes;
}};
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl = {TrustedResourceUrl:class {
  constructor(token, value) {
    goog.DEBUG && module$contents$google3$third_party$javascript$safevalues$internals$secrets_ensureTokenIsValid(token);
    this.privateDoNotAccessOrElseWrappedResourceUrl = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedResourceUrl + "";
  }
}};
function module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_createResourceUrlInternal(value$jscomp$0) {
  /** @noinline */ 
  var noinlineValue = value$jscomp$0, policy = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_getPolicy(), JSCompiler_inline_result, value = policy ? policy.createScriptURL(noinlineValue) : noinlineValue;
  return JSCompiler_inline_result = new module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.TrustedResourceUrl(module$exports$google3$third_party$javascript$safevalues$internals$secrets.secretToken, value);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.createResourceUrlInternal = module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_createResourceUrlInternal;
function module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_isResourceUrl(value) {
  return value instanceof module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.TrustedResourceUrl;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.isResourceUrl = module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_isResourceUrl;
function module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_unwrapResourceUrl(value) {
  if (module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_isResourceUrl(value)) {
    return value.privateDoNotAccessOrElseWrappedResourceUrl;
  }
  var message = "";
  goog.DEBUG && (message = "Unexpected type when unwrapping TrustedResourceUrl");
  throw Error(message);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.unwrapResourceUrl = module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_unwrapResourceUrl;
function module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen(templateObj) {
  return Object.isFrozen(templateObj) && Object.isFrozen(templateObj.raw);
}
function module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkTranspiled(fn) {
  return fn.toString().indexOf("`") === -1;
}
const module$contents$google3$third_party$javascript$safevalues$internals$string_literal_isTranspiled = module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkTranspiled(tag => tag``) || module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkTranspiled(tag => tag`\0`) || module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkTranspiled(tag => tag`\n`) || module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkTranspiled(tag => 
tag`\u0000`), module$contents$google3$third_party$javascript$safevalues$internals$string_literal_frozenTSA = module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen`` && module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen`\0` && module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen`\n` && module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen`\u0000`;
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$internals$url_impl = {SafeUrl:class {
  constructor(token, value) {
    goog.DEBUG && module$contents$google3$third_party$javascript$safevalues$internals$secrets_ensureTokenIsValid(token);
    this.privateDoNotAccessOrElseWrappedUrl = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedUrl;
  }
}};
function module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(value) {
  return new module$exports$google3$third_party$javascript$safevalues$internals$url_impl.SafeUrl(module$exports$google3$third_party$javascript$safevalues$internals$secrets.secretToken, value);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$url_impl.createUrlInternal = module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal;
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$url_impl.ABOUT_BLANK = module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal("about:blank");
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$url_impl.INNOCUOUS_URL = module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal("about:invalid#zClosurez");
function module$contents$google3$third_party$javascript$safevalues$internals$url_impl_isUrl(value) {
  return value instanceof module$exports$google3$third_party$javascript$safevalues$internals$url_impl.SafeUrl;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$url_impl.isUrl = module$contents$google3$third_party$javascript$safevalues$internals$url_impl_isUrl;
function module$contents$google3$third_party$javascript$safevalues$internals$url_impl_unwrapUrl(value) {
  if (module$contents$google3$third_party$javascript$safevalues$internals$url_impl_isUrl(value)) {
    return value.privateDoNotAccessOrElseWrappedUrl;
  }
  var message = "";
  goog.DEBUG && (message = `Unexpected type when unwrapping SafeUrl, got '${value}' of type '${typeof value}'`);
  throw Error(message);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$url_impl.unwrapUrl = module$contents$google3$third_party$javascript$safevalues$internals$url_impl_unwrapUrl;
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$builders$url_builders = {};
/** @interface */ 
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_Scheme() {
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.Scheme = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_Scheme;
class module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl {
  constructor(isValid) {
    this.isValid = isValid;
  }
}
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme(scheme) {
  return new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => url.substr(0, scheme.length + 1).toLowerCase() === scheme + ":");
}
const module$contents$google3$third_party$javascript$safevalues$builders$url_builders_RELATIVE_SCHEME = new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => /^[^:]*([/?#]|$)/.test(url)), module$contents$google3$third_party$javascript$safevalues$builders$url_builders_CALLTO_SCHEME = new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => /^callto:\+?\d*$/i.test(url)), module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SSH_SCHEME = 
new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => url.indexOf("ssh://") === 0), module$contents$google3$third_party$javascript$safevalues$builders$url_builders_EXTENSION_SCHEME = new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => url.indexOf("chrome-extension://") === 0 || url.indexOf("moz-extension://") === 0 || url.indexOf("ms-browser-extension://") === 0 || url.indexOf("safari-web-extension://") === 
0), module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SIP_SCHEME = new module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl(url => url.indexOf("sip:") === 0 || url.indexOf("sips:") === 0);
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme = {TEL:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("tel"), CALLTO:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_CALLTO_SCHEME, SSH:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SSH_SCHEME, RTSP:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("rtsp"), 
DATA:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("data"), HTTP:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("http"), HTTPS:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("https"), EXTENSION:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_EXTENSION_SCHEME, FTP:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("ftp"), 
RELATIVE:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_RELATIVE_SCHEME, MAILTO:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("mailto"), INTENT:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("intent"), MARKET:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("market"), ITMS:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("itms"), 
ITMS_APPSS:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("itms-appss"), ITMS_SERVICES:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("itms-services"), FACEBOOK_MESSENGER:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("fb-messenger"), WHATSAPP:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("whatsapp"), SIP:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SIP_SCHEME, 
SMS:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("sms"), VND_YOUTUBE:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("vnd.youtube"), GOOGLEHOME:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("googlehome"), GOOGLEHOMESDK:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("googlehomesdk"), LINE:module$contents$google3$third_party$javascript$safevalues$builders$url_builders_simpleScheme("line")};
const module$contents$google3$third_party$javascript$safevalues$builders$url_builders_DEFAULT_SCHEMES = [module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.DATA, module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.HTTP, module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.HTTPS, module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.MAILTO, 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.FTP, module$exports$google3$third_party$javascript$safevalues$builders$url_builders.SanitizableUrlScheme.RELATIVE];
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_trySanitizeUrl(url, allowedSchemes = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_DEFAULT_SCHEMES) {
  if (module$contents$google3$third_party$javascript$safevalues$internals$url_impl_isUrl(url)) {
    return url;
  }
  for (let i = 0; i < allowedSchemes.length; ++i) {
    let scheme = allowedSchemes[i];
    if (scheme instanceof module$contents$google3$third_party$javascript$safevalues$builders$url_builders_SchemeImpl && scheme.isValid(url)) {
      return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(url);
    }
  }
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.trySanitizeUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_trySanitizeUrl;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeUrl(url, allowedSchemes = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_DEFAULT_SCHEMES) {
  var sanitizedUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_trySanitizeUrl(url, allowedSchemes);
  sanitizedUrl === void 0 && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_triggerCallbacks(url.toString());
  return sanitizedUrl || module$exports$google3$third_party$javascript$safevalues$internals$url_impl.INNOCUOUS_URL;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.sanitizeUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeUrl;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_objectUrlFromSafeSource(source) {
  var windowAsAny = window;
  if (typeof MediaSource !== "undefined" && source instanceof MediaSource || typeof windowAsAny.ManagedMediaSource !== "undefined" && source instanceof windowAsAny.ManagedMediaSource) {
    return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(URL.createObjectURL(source));
  }
  var blob = source;
  var mimeType = blob.type;
  if (mimeType.toLowerCase() === "application/octet-stream") {
    var JSCompiler_inline_result = !0;
  } else {
    var match = mimeType.match(/^([^;]+)(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i);
    JSCompiler_inline_result = match?.length === 2 && (/^image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon|heic|heif|avif|x-ms-bmp)$/i.test(match[1]) || /^video\/(?:3gpp|avi|mpeg|mpg|mp4|ogg|webm|x-flv|x-matroska|quicktime|x-ms-wmv)$/i.test(match[1]) || /^audio\/(?:3gpp2|3gpp|aac|amr|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)$/i.test(match[1]) || /^font\/[\w-]+$/i.test(match[1]));
  }
  if (!JSCompiler_inline_result) {
    let message = "";
    goog.DEBUG && (message = `unsafe blob MIME type: ${blob.type}`);
    throw Error(message);
  }
  return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(URL.createObjectURL(blob));
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.objectUrlFromSafeSource = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_objectUrlFromSafeSource;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_fromMediaSource(media) {
  if (typeof MediaSource !== "undefined" && media instanceof MediaSource) {
    return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(URL.createObjectURL(media));
  }
  var message = "";
  goog.DEBUG && (message = `fromMediaSource only accepts MediaSource instances, but was called with ${media}.`);
  throw Error(message);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.fromMediaSource = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_fromMediaSource;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_fromTrustedResourceUrl(url) {
  return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_unwrapResourceUrl(url).toString());
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.fromTrustedResourceUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_fromTrustedResourceUrl;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_safeUrl(templateObj, ...rest) {
  if (goog.DEBUG && (!Array.isArray(templateObj) || !Array.isArray(templateObj.raw) || templateObj.length !== templateObj.raw.length || !module$contents$google3$third_party$javascript$safevalues$internals$string_literal_isTranspiled && templateObj === templateObj.raw || !(module$contents$google3$third_party$javascript$safevalues$internals$string_literal_isTranspiled && !module$contents$google3$third_party$javascript$safevalues$internals$string_literal_frozenTSA || module$contents$google3$third_party$javascript$safevalues$internals$string_literal_checkFrozen(templateObj)) || 
  rest.length + 1 !== templateObj.length)) {
    throw new TypeError("\n    ############################## ERROR ##############################\n\n    It looks like you are trying to call a template tag function (fn`...`)\n    using the normal function syntax (fn(...)), which is not supported.\n\n    The functions in the safevalues library are not designed to be called\n    like normal functions, and doing so invalidates the security guarantees\n    that safevalues provides.\n\n    If you are stuck and not sure how to proceed, please reach out to us\n    instead through:\n     - go/ise-hardening-yaqs (preferred) // LINE-INTERNAL\n     - g/ise-hardening // LINE-INTERNAL\n     - https://github.com/google/safevalues/issues\n\n    ############################## ERROR ##############################");
  }
  var prefix = templateObj[0];
  if (goog.DEBUG) {
    {
      var prefix$jscomp$0 = prefix, isWholeUrl = rest.length === 0;
      let markerIdx = prefix$jscomp$0.search(/[:/?#]/);
      if (markerIdx < 0) {
        var JSCompiler_inline_result = isWholeUrl;
      } else {
        if (prefix$jscomp$0.charAt(markerIdx) !== ":") {
          JSCompiler_inline_result = !0;
        } else {
          var scheme = prefix$jscomp$0.substring(0, markerIdx).toLowerCase();
          JSCompiler_inline_result = /^[a-z][a-z\d+.-]*$/.test(scheme) && scheme !== "javascript";
        }
      }
    }
    if (!JSCompiler_inline_result) {
      throw Error(`Trying to interpolate with unsupported prefix: ${prefix}`);
    }
  }
  var urlParts = [prefix];
  for (let i = 0; i < rest.length; i++) {
    urlParts.push(String(rest[i])), urlParts.push(templateObj[i + 1]);
  }
  return module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(urlParts.join(""));
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.safeUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_safeUrl;
/** @define {!JSDocSerializer_placeholder_type} */ 
const module$contents$google3$third_party$javascript$safevalues$builders$url_builders_ASSUME_IMPLEMENTS_URL_API = goog.FEATURESET_YEAR >= 2020, module$contents$google3$third_party$javascript$safevalues$builders$url_builders_supportsURLAPI = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_ASSUME_IMPLEMENTS_URL_API ? !0 : typeof URL === "function";
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_extractScheme(url) {
  if (!module$contents$google3$third_party$javascript$safevalues$builders$url_builders_supportsURLAPI) {
    a: {
      let aTag = document.createElement("a");
      try {
        aTag.href = url;
      } catch (e) {
        var JSCompiler_inline_result = void 0;
        break a;
      }
      let protocol = aTag.protocol;
      JSCompiler_inline_result = protocol === ":" || protocol === "" ? "https:" : protocol;
    }
    return JSCompiler_inline_result;
  }
  try {
    var parsedUrl = new URL(url);
  } catch (e) {
    return "https:";
  }
  return parsedUrl.protocol;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.extractScheme = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_extractScheme;
const module$contents$google3$third_party$javascript$safevalues$builders$url_builders_ALLOWED_SCHEMES = ["data:", "http:", "https:", "mailto:", "ftp:"];
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.IS_NOT_JAVASCRIPT_URL_PATTERN = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_reportJavaScriptUrl(url) {
  var hasJavascriptUrlScheme = !module$exports$google3$third_party$javascript$safevalues$builders$url_builders.IS_NOT_JAVASCRIPT_URL_PATTERN.test(url);
  hasJavascriptUrlScheme && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_triggerCallbacks(url);
  return hasJavascriptUrlScheme;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.reportJavaScriptUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_reportJavaScriptUrl;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeJavaScriptUrl(url) {
  if (!module$contents$google3$third_party$javascript$safevalues$builders$url_builders_reportJavaScriptUrl(url)) {
    return url;
  }
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.sanitizeJavaScriptUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeJavaScriptUrl;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeUrlForMigration(url) {
  var sanitizedUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeJavaScriptUrl(url);
  return sanitizedUrl === void 0 ? module$exports$google3$third_party$javascript$safevalues$internals$url_impl.INNOCUOUS_URL : module$contents$google3$third_party$javascript$safevalues$internals$url_impl_createUrlInternal(sanitizedUrl);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.sanitizeUrlForMigration = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeUrlForMigration;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_unwrapUrlOrSanitize(url) {
  return url instanceof module$exports$google3$third_party$javascript$safevalues$internals$url_impl.SafeUrl ? module$contents$google3$third_party$javascript$safevalues$internals$url_impl_unwrapUrl(url) : module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizeJavaScriptUrl(url);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.unwrapUrlOrSanitize = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_unwrapUrlOrSanitize;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_restrictivelySanitizeUrl(url) {
  var parsedScheme = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_extractScheme(url);
  return parsedScheme !== void 0 && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_ALLOWED_SCHEMES.indexOf(parsedScheme.toLowerCase()) !== -1 ? url : "about:invalid#zClosurez";
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.restrictivelySanitizeUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_restrictivelySanitizeUrl;
const module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks = [];
let module$contents$google3$third_party$javascript$safevalues$builders$url_builders_triggerCallbacks = () => {
};
goog.DEBUG && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_addJavaScriptUrlSanitizationCallback(url => {
  console.warn(`A URL with content '${url}' was sanitized away.`);
});
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_addJavaScriptUrlSanitizationCallback(callback) {
  module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks.indexOf(callback) === -1 && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks.push(callback);
  module$contents$google3$third_party$javascript$safevalues$builders$url_builders_triggerCallbacks = url => {
    module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks.forEach(callback => {
      callback(url);
    });
  };
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.addJavaScriptUrlSanitizationCallback = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_addJavaScriptUrlSanitizationCallback;
function module$contents$google3$third_party$javascript$safevalues$builders$url_builders_removeJavaScriptUrlSanitizationCallback(callback) {
  var callbackIndex = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks.indexOf(callback);
  callbackIndex !== -1 && module$contents$google3$third_party$javascript$safevalues$builders$url_builders_sanitizationCallbacks.splice(callbackIndex, 1);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$builders$url_builders.removeJavaScriptUrlSanitizationCallback = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_removeJavaScriptUrlSanitizationCallback;
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$internals$html_impl = {SafeHtml:class {
  constructor(token, value) {
    goog.DEBUG && module$contents$google3$third_party$javascript$safevalues$internals$secrets_ensureTokenIsValid(token);
    this.privateDoNotAccessOrElseWrappedHtml = value;
  }
  toString() {
    return this.privateDoNotAccessOrElseWrappedHtml + "";
  }
}};
function module$contents$google3$third_party$javascript$safevalues$internals$html_impl_createHtmlInternal(value$jscomp$0) {
  /** @noinline */ 
  var noinlineValue = value$jscomp$0, policy = module$contents$google3$third_party$javascript$safevalues$internals$trusted_types_getPolicy(), JSCompiler_inline_result, value = policy ? policy.createHTML(noinlineValue) : noinlineValue;
  return JSCompiler_inline_result = new module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml(module$exports$google3$third_party$javascript$safevalues$internals$secrets.secretToken, value);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$html_impl.createHtmlInternal = module$contents$google3$third_party$javascript$safevalues$internals$html_impl_createHtmlInternal;
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$html_impl.EMPTY_HTML = new module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml(module$exports$google3$third_party$javascript$safevalues$internals$secrets.secretToken, module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.trustedTypes ? module$exports$google3$third_party$javascript$safevalues$internals$trusted_types.trustedTypes.emptyHTML : "");
function module$contents$google3$third_party$javascript$safevalues$internals$html_impl_isHtml(value) {
  return value instanceof module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml;
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$html_impl.isHtml = module$contents$google3$third_party$javascript$safevalues$internals$html_impl_isHtml;
function module$contents$google3$third_party$javascript$safevalues$internals$html_impl_unwrapHtml(value) {
  if (module$contents$google3$third_party$javascript$safevalues$internals$html_impl_isHtml(value)) {
    return value.privateDoNotAccessOrElseWrappedHtml;
  }
  var message = "";
  goog.DEBUG && (message = "Unexpected type when unwrapping SafeHtml");
  throw Error(message);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$internals$html_impl.unwrapHtml = module$contents$google3$third_party$javascript$safevalues$internals$html_impl_unwrapHtml;
/** @const */ 
var module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe = {};
function module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrc(iframe, v) {
  iframe.src = module$contents$google3$third_party$javascript$safevalues$internals$resource_url_impl_unwrapResourceUrl(v).toString();
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.setIframeSrc = module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrc;
function module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdoc(iframe, v) {
  iframe.srcdoc = (0,module$exports$google3$third_party$javascript$safevalues$internals$html_impl.unwrapHtml)(v);
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.setIframeSrcdoc = module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdoc;
/** @const @enum {!JSDocSerializer_placeholder_type} */ 
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent = {FORMATTED_HTML_CONTENT:0, EMBEDDED_INTERNAL_CONTENT:1, EMBEDDED_TRUSTED_EXTERNAL_CONTENT:2};
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent[module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.FORMATTED_HTML_CONTENT] = "FORMATTED_HTML_CONTENT";
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent[module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT] = "EMBEDDED_INTERNAL_CONTENT";
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent[module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_TRUSTED_EXTERNAL_CONTENT] = "EMBEDDED_TRUSTED_EXTERNAL_CONTENT";
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective = {ALLOW_SAME_ORIGIN:"allow-same-origin", ALLOW_SCRIPTS:"allow-scripts", ALLOW_FORMS:"allow-forms", ALLOW_POPUPS:"allow-popups", ALLOW_POPUPS_TO_ESCAPE_SANDBOX:"allow-popups-to-escape-sandbox", ALLOW_STORAGE_ACCESS_BY_USER_ACTIVATION:"allow-storage-access-by-user-activation"};
function module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(ifr, directives) {
  ifr.setAttribute("sandbox", "");
  for (let i = 0; i < directives.length; i++) {
    ifr.sandbox.supports && !ifr.sandbox.supports(directives[i]) || ifr.sandbox.add(directives[i]);
  }
}
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError = class extends Error {
  constructor(type, intent) {
    super(`${type} cannot be used with intent ${module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent[intent]}`);
    this.type = type;
    this.name = "TypeCannotBeUsedWithIframeIntentError";
  }
};
function module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcWithIntent(element, intent, src) {
  element.removeAttribute("srcdoc");
  switch(intent) {
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.FORMATTED_HTML_CONTENT:
      if (src instanceof module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.TrustedResourceUrl) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError("TrustedResourceUrl", module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.FORMATTED_HTML_CONTENT);
      }
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, []);
      let sanitizedUrl = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_unwrapUrlOrSanitize(src);
      sanitizedUrl !== void 0 && (element.src = sanitizedUrl);
      break;
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT:
      if (!(src instanceof module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.TrustedResourceUrl)) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError(typeof src, module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT);
      }
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, [module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SAME_ORIGIN, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SCRIPTS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_FORMS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS, 
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS_TO_ESCAPE_SANDBOX, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_STORAGE_ACCESS_BY_USER_ACTIVATION]);
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrc(element, src);
      break;
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_TRUSTED_EXTERNAL_CONTENT:
      if (src instanceof module$exports$google3$third_party$javascript$safevalues$internals$resource_url_impl.TrustedResourceUrl) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError("TrustedResourceUrl", module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_TRUSTED_EXTERNAL_CONTENT);
      }
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, [module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SAME_ORIGIN, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SCRIPTS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_FORMS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS, 
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS_TO_ESCAPE_SANDBOX, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_STORAGE_ACCESS_BY_USER_ACTIVATION]);
      let sanitizedUrl$jscomp$0 = module$contents$google3$third_party$javascript$safevalues$builders$url_builders_unwrapUrlOrSanitize(src);
      sanitizedUrl$jscomp$0 !== void 0 && (element.src = sanitizedUrl$jscomp$0);
      break;
    default:
      module$contents$google3$javascript$typescript$contrib$check_checkExhaustiveAllowing(intent, void 0);
  }
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.setIframeSrcWithIntent = module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcWithIntent;
function module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdocWithIntent(element, intent, srcdoc) {
  element.removeAttribute("src");
  switch(intent) {
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.FORMATTED_HTML_CONTENT:
      if (srcdoc instanceof module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError("SafeHtml", module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.FORMATTED_HTML_CONTENT);
      }
      element.csp = "default-src 'none'";
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, []);
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdoc(element, (0,module$exports$google3$third_party$javascript$safevalues$internals$html_impl.createHtmlInternal)(srcdoc));
      break;
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT:
      if (!(srcdoc instanceof module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml)) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError("string", module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT);
      }
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, [module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SAME_ORIGIN, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SCRIPTS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_FORMS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS, 
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS_TO_ESCAPE_SANDBOX, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_STORAGE_ACCESS_BY_USER_ACTIVATION]);
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdoc(element, srcdoc);
      break;
    case module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_TRUSTED_EXTERNAL_CONTENT:
      if (srcdoc instanceof module$exports$google3$third_party$javascript$safevalues$internals$html_impl.SafeHtml) {
        throw new module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.TypeCannotBeUsedWithIframeIntentError("SafeHtml", module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.IframeIntent.EMBEDDED_INTERNAL_CONTENT);
      }
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setSandboxDirectives(element, [module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_SCRIPTS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_FORMS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS, module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_POPUPS_TO_ESCAPE_SANDBOX, 
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_SandboxDirective.ALLOW_STORAGE_ACCESS_BY_USER_ACTIVATION]);
      module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdoc(element, (0,module$exports$google3$third_party$javascript$safevalues$internals$html_impl.createHtmlInternal)(srcdoc));
      break;
    default:
      module$contents$google3$javascript$typescript$contrib$check_checkExhaustiveAllowing(intent, void 0);
  }
}
/** @const */ 
module$exports$google3$third_party$javascript$safevalues$dom$elements$iframe.setIframeSrcdocWithIntent = module$contents$google3$third_party$javascript$safevalues$dom$elements$iframe_setIframeSrcdocWithIntent;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.string.DETECT_DOUBLE_ESCAPING = !1;
/** @define {!JSDocSerializer_placeholder_type} */ 
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.string.Unicode = {NBSP:"\u00a0", ZERO_WIDTH_SPACE:"\u200b"};
goog.string.startsWith = module$contents$goog$string$internal_startsWith;
goog.string.endsWith = module$contents$goog$string$internal_endsWith;
goog.string.caseInsensitiveStartsWith = module$contents$goog$string$internal_caseInsensitiveStartsWith;
goog.string.caseInsensitiveEndsWith = module$contents$goog$string$internal_caseInsensitiveEndsWith;
goog.string.caseInsensitiveEquals = module$contents$goog$string$internal_caseInsensitiveEquals;
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1); subsArguments.length && splitParts.length > 1;) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = module$contents$goog$string$internal_isEmptyOrWhitespace;
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = module$contents$goog$string$internal_trim;
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = module$contents$goog$string$internal_caseInsensitiveCompare;
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(tokenizerRegExp), tokens2 = str2.toLowerCase().match(tokenizerRegExp), count = Math.min(tokens1.length, tokens2.length);
  for (let i = 0; i < count; i++) {
    let a = tokens1[i], b = tokens2[i];
    if (a != b) {
      let num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        let num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = module$contents$goog$string$internal_newLineToBr;
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  str = module$contents$goog$string$internal_htmlEscape(str, opt_isLikelyToContainHtmlChars);
  goog.string.DETECT_DOUBLE_ESCAPING && (str = str.replace(goog.string.E_RE_, "&#101;"));
  return str;
};
/** @const */ 
goog.string.E_RE_ = /e/g;
goog.string.unescapeEntities = function(str) {
  return goog.string.contains(str, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div = opt_document ? opt_document.createElement("div") : goog.global.document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      let n = Number("0" + entity.slice(1));
      isNaN(n) || (value = String.fromCharCode(n));
    }
    if (!value) {
      var JSCompiler_temp_const = div, html = s + " ", options = {justification:"Single HTML entity."};
      if (goog.DEBUG) {
        var justification = options.justification;
        if (typeof justification !== "string" || justification.trim() === "") {
          let errMsg = "Calls to uncheckedconversion functions must go through security review.";
          errMsg += " A justification must be provided to capture what security assumptions are being made.";
          errMsg += " See go/unchecked-conversions";
          throw Error(errMsg);
        }
      }
      var JSCompiler_inline_result = (0,module$exports$google3$third_party$javascript$safevalues$internals$html_impl.createHtmlInternal)(html);
      var elOrRoot = JSCompiler_temp_const, v = JSCompiler_inline_result;
      if (elOrRoot.nodeType === 1) {
        let message = "", tagName = elOrRoot.tagName;
        if (/^(script|style)$/i.test(tagName)) {
          throw goog.DEBUG && (message = tagName.toLowerCase() === "script" ? "Use setScriptTextContent with a SafeScript." : "Use setStyleTextContent with a SafeStyleSheet."), Error(message);
        }
      }
      elOrRoot.innerHTML = (0,module$exports$google3$third_party$javascript$safevalues$internals$html_impl.unwrapHtml)(v);
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if (entity.charAt(0) == "#") {
          let n = Number("0" + entity.slice(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (let i = 0; i < length; i++) {
    let quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  str.length > chars && (str = str.substring(0, chars - 3) + "...");
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  if (opt_trailingChars && str.length > chars) {
    opt_trailingChars > chars && (opt_trailingChars = chars);
    let endPoint = str.length - opt_trailingChars, startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else if (str.length > chars) {
    let half = Math.floor(chars / 2), endPos = str.length - half;
    half += chars % 2;
    str = str.substring(0, half) + "..." + str.substring(endPos);
  }
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\v":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"\\u003C"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  var sb = ['"'];
  for (let i = 0; i < s.length; i++) {
    let ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (let i = 0; i < str.length; i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    var rv = c;
  } else {
    if (cc < 256) {
      if (rv = "\\x", cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u", cc < 4096 && (rv += "0");
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = module$contents$goog$string$internal_contains;
goog.string.caseInsensitiveContains = module$contents$goog$string$internal_caseInsensitiveContains;
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  index >= 0 && index < s.length && stringLength > 0 && (resultStr = s.slice(0, index) + s.slice(index + stringLength));
  return resultStr;
};
goog.string.remove = function(str, substr) {
  return str.replace(substr, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.replaceAll = function(s, ss, replacement) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, replacement.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = goog.FEATURESET_YEAR >= 2018 || String.prototype.repeat ? function(string, length) {
  return string.repeat(length);
} : function(string, length) {
  return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  if (!Number.isFinite(num)) {
    return String(num);
  }
  var s = opt_precision !== void 0 ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  index === -1 && (index = s.length);
  var sign = s[0] === "-" ? "-" : "";
  sign && (s = s.substring(1));
  return sign + goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36);
};
goog.string.compareVersions = module$contents$goog$string$internal_compareVersions;
goog.string.hashCode = function(str) {
  var result = 0;
  for (let i = 0; i < str.length; ++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  return num == 0 && goog.string.isEmptyOrWhitespace(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = typeof opt_delimiters === "string" ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.slice(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  isFinite(value) && (value = String(value));
  return typeof value === "string" ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = []; limit > 0 && parts.length;) {
    returnVal.push(parts.shift()), limit--;
  }
  parts.length && returnVal.push(parts.join(separator));
  return returnVal;
};
goog.string.lastComponent = function(str, separators) {
  if (separators) {
    typeof separators == "string" && (separators = [separators]);
  } else {
    return str;
  }
  var lastSeparatorIndex = -1;
  for (let i = 0; i < separators.length; i++) {
    if (separators[i] == "") {
      continue;
    }
    let currentSeparatorIndex = str.lastIndexOf(separators[i]);
    currentSeparatorIndex > lastSeparatorIndex && (lastSeparatorIndex = currentSeparatorIndex);
  }
  return lastSeparatorIndex == -1 ? str : str.slice(lastSeparatorIndex + 1);
};
goog.string.editDistance = function(a, b) {
  var v0 = [], v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (let i = 0; i < b.length + 1; i++) {
    v0[i] = i;
  }
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      let cost = Number(a[i] != b[j]);
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j < v0.length; j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest(channel, channelDebug, opt_sessionId, opt_requestId, opt_retryId) {
  this.channel_ = channel;
  this.channelDebug_ = channelDebug;
  this.sid_ = opt_sessionId;
  this.rid_ = opt_requestId;
  this.retryId_ = opt_retryId || 1;
  this.eventHandler_ = new module$contents$goog$events$EventHandler_EventHandler(this);
  this.timeout_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.TIMEOUT_MS_;
  this.extraHeaders_ = null;
  this.successful_ = !1;
  this.postData_ = this.requestUri_ = this.baseUri_ = this.type_ = this.requestStartTime_ = this.watchDogTimeoutTime_ = this.watchDogTimerId_ = null;
  this.pendingMessages_ = [];
  this.xmlHttp_ = null;
  this.xmlHttpChunkStart_ = 0;
  this.lastError_ = this.verb_ = null;
  this.lastStatusCode_ = -1;
  this.cancelled_ = !1;
  this.readyStateChangeThrottleMs_ = 0;
  this.readyStateChangeThrottle_ = null;
  this.firstByteReceived_ = this.initialResponseDecoded_ = this.decodeInitialResponse_ = this.decodeChunks_ = !1;
  this.fetchResponseState_ = new goog.labs.net.webChannel.FetchResponseState();
}
/** @constructor */ 
goog.labs.net.webChannel.FetchResponseState = function() {
  this.textDecoder = null;
  this.responseBuffer = "";
  this.responseArrivedForFetch = !1;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.TIMEOUT_MS_ = 45E3;
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_ = {XML_HTTP:1, CLOSE_REQUEST:2};
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error = {STATUS:0, NO_DATA:1, TIMEOUT:2, UNKNOWN_SESSION_ID:3, BAD_DATA:4, HANDLER_EXCEPTION:5, BROWSER_OFFLINE:6};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.errorStringFromCode = function(errorCode, statusCode) {
  switch(errorCode) {
    case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.STATUS:
      return "Non-200 return code (" + statusCode + ")";
    case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.NO_DATA:
      return "XMLHTTP failure (no data)";
    case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.TIMEOUT:
      return "HttpConnection timeout";
    default:
      return "Unknown error";
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INVALID_CHUNK_ = {};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INCOMPLETE_CHUNK_ = {};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.setTimeout = function(timeout) {
  this.timeout_ = timeout;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.setReadyStateChangeThrottle = function(throttle) {
  this.readyStateChangeThrottleMs_ = throttle;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.setPendingMessages = function(pendingMessages) {
  this.pendingMessages_ = pendingMessages;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.getPendingMessages = function() {
  return this.pendingMessages_;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.xmlHttpPost = function(uri, postData, decodeChunks) {
  this.type_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_.XML_HTTP;
  this.baseUri_ = uri.clone().makeUnique();
  this.postData_ = postData;
  this.decodeChunks_ = decodeChunks;
  this.sendXmlHttp_(null);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.xmlHttpGet = function(uri, decodeChunks, hostPrefix) {
  this.type_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_.XML_HTTP;
  this.baseUri_ = uri.clone().makeUnique();
  this.postData_ = null;
  this.decodeChunks_ = decodeChunks;
  this.sendXmlHttp_(hostPrefix);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.sendXmlHttp_ = function(hostPrefix) {
  this.requestStartTime_ = Date.now();
  this.ensureWatchDogTimer_();
  this.requestUri_ = this.baseUri_.clone();
  this.requestUri_.setParameterValues("t", this.retryId_);
  this.xmlHttpChunkStart_ = 0;
  var useSecondaryDomains = this.channel_.supportsCrossDomainXhrs_;
  this.fetchResponseState_ = new goog.labs.net.webChannel.FetchResponseState();
  this.xmlHttp_ = this.channel_.createXhrIo(useSecondaryDomains ? hostPrefix : null, !this.postData_);
  this.readyStateChangeThrottleMs_ > 0 && (this.readyStateChangeThrottle_ = new module$contents$goog$async$Throttle_Throttle(goog.bind(this.xmlHttpHandler_, this, this.xmlHttp_), this.readyStateChangeThrottleMs_));
  this.eventHandler_.listen(this.xmlHttp_, module$contents$goog$net$EventType_EventType.READY_STATE_CHANGE, this.readyStateChangeHandler_);
  var headers = this.extraHeaders_ ? module$contents$goog$object_clone(this.extraHeaders_) : {};
  this.postData_ ? (this.verb_ || (this.verb_ = "POST"), headers["Content-Type"] = "application/x-www-form-urlencoded", this.xmlHttp_.send(this.requestUri_, this.verb_, this.postData_, headers)) : (this.verb_ = "GET", this.xmlHttp_.send(this.requestUri_, this.verb_, null, headers));
  module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(module$contents$goog$labs$net$webChannel$requestStats_ServerReachability.REQUEST_MADE);
  this.channelDebug_.xmlHttpChannelRequest(this.verb_, this.requestUri_, this.rid_, this.retryId_, this.postData_);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.readyStateChangeHandler_ = function(evt) {
  var xhr = evt.target, throttle = this.readyStateChangeThrottle_;
  throttle && xhr.getReadyState() == goog.net.XmlHttp.ReadyState.INTERACTIVE ? (this.channelDebug_.debug("Throttling readystatechange."), throttle.fire()) : this.xmlHttpHandler_(xhr);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.xmlHttpHandler_ = function(xmlhttp) {
  module$contents$goog$labs$net$webChannel$requestStats_startExecutionHook();
  try {
    if (xmlhttp == this.xmlHttp_) {
      this.onXmlHttpReadyStateChanged_();
    } else {
      this.channelDebug_.warning("Called back with an unexpected xmlhttp");
    }
  } catch (ex) {
    if (this.channelDebug_.debug("Failed call to OnXmlHttpReadyStateChanged_"), this.hasResponseBody_()) {
      let channelRequest = this;
      this.channelDebug_.dumpException(ex, function() {
        return "ResponseText: " + channelRequest.xmlHttp_.getResponseText();
      });
    } else {
      this.channelDebug_.dumpException(ex, "No response text");
    }
  } finally {
    module$contents$goog$labs$net$webChannel$requestStats_endExecutionHook();
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.onXmlHttpReadyStateChanged_ = function() {
  var readyState = this.xmlHttp_.getReadyState(), errorCode = this.xmlHttp_.lastErrorCode_, statusCode = this.xmlHttp_.getStatus();
  if (!(readyState < goog.net.XmlHttp.ReadyState.INTERACTIVE || readyState == goog.net.XmlHttp.ReadyState.INTERACTIVE && !this.hasResponseBody_())) {
    this.cancelled_ || readyState != goog.net.XmlHttp.ReadyState.COMPLETE || errorCode == module$contents$goog$net$ErrorCode_ErrorCode.ABORT || (errorCode == module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT || statusCode <= 0 ? module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(module$contents$goog$labs$net$webChannel$requestStats_ServerReachability.REQUEST_FAILED) : module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(module$contents$goog$labs$net$webChannel$requestStats_ServerReachability.REQUEST_SUCCEEDED));
    this.cancelWatchDogTimer_();
    var status = this.xmlHttp_.getStatus();
    this.lastStatusCode_ = status;
    var responseText = this.decodeXmlHttpResponse_();
    if (!this.hasResponseBody_()) {
      let channelRequest = this;
      this.channelDebug_.debug(function() {
        return "No response text for uri " + channelRequest.requestUri_ + " status " + status;
      });
    }
    this.successful_ = status == 200;
    this.channelDebug_.xmlHttpChannelResponseMetaData(this.verb_, this.requestUri_, this.rid_, this.retryId_, readyState, status);
    if (this.successful_) {
      if (this.shouldCheckInitialResponse_()) {
        let initialResponse = this.getInitialResponse_();
        if (initialResponse) {
          this.channelDebug_.xmlHttpChannelResponseText(this.rid_, initialResponse, "Initial handshake response via " + module$contents$goog$net$WebChannel_WebChannel.X_HTTP_INITIAL_RESPONSE), this.initialResponseDecoded_ = !0, this.safeOnRequestData_(initialResponse);
        } else {
          this.successful_ = !1;
          this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.UNKNOWN_SESSION_ID;
          module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_UNKNOWN_SESSION_ID);
          this.channelDebug_.warning("XMLHTTP Missing X_HTTP_INITIAL_RESPONSE (" + this.rid_ + ")");
          this.cleanup_();
          this.dispatchFailure_();
          return;
        }
      }
      this.decodeChunks_ ? this.decodeNextChunks_(readyState, responseText) : (this.channelDebug_.xmlHttpChannelResponseText(this.rid_, responseText, null), this.safeOnRequestData_(responseText));
      readyState == goog.net.XmlHttp.ReadyState.COMPLETE && this.cleanup_();
      if (this.successful_ && !this.cancelled_) {
        if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
          this.channel_.onRequestComplete(this);
        } else {
          this.successful_ = !1, this.ensureWatchDogTimer_();
        }
      }
    } else {
      this.xmlHttp_.getResponseHeaders(), status == 400 && responseText.indexOf("Unknown SID") > 0 ? (this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.UNKNOWN_SESSION_ID, module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_UNKNOWN_SESSION_ID), this.channelDebug_.warning("XMLHTTP Unknown SID (" + this.rid_ + ")")) : (this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.STATUS, 
      module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_BAD_STATUS), this.channelDebug_.warning("XMLHTTP Bad status " + status + " (" + this.rid_ + ")")), this.cleanup_(), this.dispatchFailure_();
    }
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.shouldCheckInitialResponse_ = function() {
  return this.decodeInitialResponse_ && !this.initialResponseDecoded_;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.getInitialResponse_ = function() {
  if (this.xmlHttp_) {
    let value = this.xmlHttp_.getStreamingResponseHeader(module$contents$goog$net$WebChannel_WebChannel.X_HTTP_INITIAL_RESPONSE);
    if (value && !goog.string.isEmptyOrWhitespace(value)) {
      return value;
    }
  }
  return null;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.setDecodeInitialResponse = function() {
  this.decodeInitialResponse_ = !0;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.decodeXmlHttpResponse_ = function() {
  if (!this.useFetchStreamsForResponse_()) {
    return this.xmlHttp_.getResponseText();
  }
  var responseChunks = this.xmlHttp_.getResponse();
  if (responseChunks === "") {
    return "";
  }
  var responseText = "", responseLength = responseChunks.length, requestCompleted = this.xmlHttp_.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
  if (!this.fetchResponseState_.textDecoder) {
    if (typeof TextDecoder === "undefined") {
      return this.channelDebug_.severe("TextDecoder is not supported by this browser."), this.cleanup_(), this.dispatchFailure_(), "";
    }
    this.fetchResponseState_.textDecoder = new goog.global.TextDecoder();
  }
  for (let i = 0; i < responseLength; i++) {
    this.fetchResponseState_.responseArrivedForFetch = !0;
    let isLastChunk = requestCompleted && i == responseLength - 1;
    responseText += this.fetchResponseState_.textDecoder.decode(responseChunks[i], {stream:!isLastChunk});
  }
  responseChunks.length = 0;
  this.fetchResponseState_.responseBuffer += responseText;
  this.xmlHttpChunkStart_ = 0;
  return this.fetchResponseState_.responseBuffer;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.hasResponseBody_ = function() {
  return this.xmlHttp_ ? this.fetchResponseState_.responseArrivedForFetch ? !0 : !(!this.xmlHttp_.getResponseText() && !this.xmlHttp_.getResponse()) : !1;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.useFetchStreamsForResponse_ = function() {
  return this.xmlHttp_ ? this.verb_ == "GET" && this.type_ != module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_.CLOSE_REQUEST && this.channel_.usesFetchStreams_ : !1;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.decodeNextChunks_ = function(readyState, responseText) {
  for (var decodeNextChunksSuccessful = !0, chunkText; !this.cancelled_ && this.xmlHttpChunkStart_ < responseText.length;) {
    if (chunkText = this.getNextChunk_(responseText), chunkText == module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INCOMPLETE_CHUNK_) {
      readyState == goog.net.XmlHttp.ReadyState.COMPLETE && (this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.BAD_DATA, module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_INCOMPLETE_DATA), decodeNextChunksSuccessful = !1);
      this.channelDebug_.xmlHttpChannelResponseText(this.rid_, null, "[Incomplete Response]");
      break;
    } else if (chunkText == module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INVALID_CHUNK_) {
      this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.BAD_DATA;
      module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_BAD_DATA);
      this.channelDebug_.xmlHttpChannelResponseText(this.rid_, responseText, "[Invalid Chunk]");
      decodeNextChunksSuccessful = !1;
      break;
    } else {
      this.channelDebug_.xmlHttpChannelResponseText(this.rid_, chunkText, null), this.safeOnRequestData_(chunkText);
    }
  }
  this.useFetchStreamsForResponse_() && this.xmlHttpChunkStart_ != 0 && (this.fetchResponseState_.responseBuffer = this.fetchResponseState_.responseBuffer.slice(this.xmlHttpChunkStart_), this.xmlHttpChunkStart_ = 0);
  readyState != goog.net.XmlHttp.ReadyState.COMPLETE || responseText.length != 0 || this.fetchResponseState_.responseArrivedForFetch || (this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.NO_DATA, module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_NO_DATA), decodeNextChunksSuccessful = !1);
  this.successful_ = this.successful_ && decodeNextChunksSuccessful;
  decodeNextChunksSuccessful ? responseText.length > 0 && !this.firstByteReceived_ && (this.firstByteReceived_ = !0, this.channel_.onFirstByteReceived(this, responseText)) : (this.channelDebug_.xmlHttpChannelResponseText(this.rid_, responseText, "[Invalid Chunked Response]"), this.cleanup_(), this.dispatchFailure_());
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.getNextChunk_ = function(responseText) {
  var sizeStartIndex = this.xmlHttpChunkStart_, sizeEndIndex = responseText.indexOf("\n", sizeStartIndex);
  if (sizeEndIndex == -1) {
    return module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INCOMPLETE_CHUNK_;
  }
  var sizeAsString = responseText.substring(sizeStartIndex, sizeEndIndex), size = Number(sizeAsString);
  if (isNaN(size)) {
    return module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INVALID_CHUNK_;
  }
  var chunkStartIndex = sizeEndIndex + 1;
  if (chunkStartIndex + size > responseText.length) {
    return module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.INCOMPLETE_CHUNK_;
  }
  var chunkText = responseText.slice(chunkStartIndex, chunkStartIndex + size);
  this.xmlHttpChunkStart_ = chunkStartIndex + size;
  return chunkText;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.sendCloseRequest = function(uri) {
  this.type_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_.CLOSE_REQUEST;
  this.baseUri_ = uri.clone().makeUnique();
  var requestSent = !1;
  if (goog.global.navigator && goog.global.navigator.sendBeacon) {
    try {
      requestSent = goog.global.navigator.sendBeacon(this.baseUri_.toString(), "");
    } catch {
    }
  }
  if (!requestSent && goog.global.Image) {
    let eltImg = new Image();
    eltImg.src = this.baseUri_;
    requestSent = !0;
  }
  requestSent || (this.xmlHttp_ = this.channel_.createXhrIo(null), this.xmlHttp_.send(this.baseUri_));
  this.requestStartTime_ = Date.now();
  this.ensureWatchDogTimer_();
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.cancel = function() {
  this.cancelled_ = !0;
  this.cleanup_();
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.resetTimeout = function(opt_timeout) {
  opt_timeout && this.setTimeout(opt_timeout);
  this.watchDogTimerId_ && (this.cancelWatchDogTimer_(), this.ensureWatchDogTimer_());
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.ensureWatchDogTimer_ = function() {
  this.watchDogTimeoutTime_ = Date.now() + this.timeout_;
  this.startWatchDogTimer_(this.timeout_);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.startWatchDogTimer_ = function(time) {
  if (this.watchDogTimerId_ != null) {
    throw Error("WatchDog timer not null");
  }
  this.watchDogTimerId_ = module$contents$goog$labs$net$webChannel$requestStats_setTimeout(goog.bind(this.onWatchDogTimeout_, this), time);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.cancelWatchDogTimer_ = function() {
  this.watchDogTimerId_ && (goog.global.clearTimeout(this.watchDogTimerId_), this.watchDogTimerId_ = null);
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.onWatchDogTimeout_ = function() {
  this.watchDogTimerId_ = null;
  var now = Date.now();
  goog.asserts.assert(this.watchDogTimeoutTime_, "WatchDog timeout time missing?");
  now - this.watchDogTimeoutTime_ >= 0 ? this.handleTimeout_() : (this.channelDebug_.warning("WatchDog timer called too early"), this.startWatchDogTimer_(this.watchDogTimeoutTime_ - now));
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.handleTimeout_ = function() {
  this.successful_ && this.channelDebug_.severe("Received watchdog timeout even though request loaded successfully");
  this.channelDebug_.timeoutResponse(this.requestUri_);
  this.type_ != module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Type_.CLOSE_REQUEST && (module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(module$contents$goog$labs$net$webChannel$requestStats_ServerReachability.REQUEST_FAILED), module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.REQUEST_TIMEOUT));
  this.cleanup_();
  this.lastError_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.TIMEOUT;
  this.dispatchFailure_();
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.dispatchFailure_ = function() {
  if (!this.channel_.isClosed() && !this.cancelled_) {
    this.channel_.onRequestComplete(this);
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.cleanup_ = function() {
  this.cancelWatchDogTimer_();
  module$contents$goog$dispose_dispose(this.readyStateChangeThrottle_);
  this.readyStateChangeThrottle_ = null;
  this.eventHandler_.removeAll();
  if (this.xmlHttp_) {
    let xmlhttp = this.xmlHttp_;
    this.xmlHttp_ = null;
    xmlhttp.abort();
    xmlhttp.dispose();
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.getLastError = function() {
  return this.lastError_;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.prototype.safeOnRequestData_ = function(data) {
  try {
    this.channel_.onRequestData(this, data);
    let stats = module$contents$goog$labs$net$webChannel$requestStats_ServerReachability;
    module$contents$goog$labs$net$webChannel$requestStats_notifyServerReachabilityEvent(stats.BACK_CHANNEL_ACTIVITY);
  } catch (e) {
    this.channelDebug_.dumpException(e, "Error in httprequest callback");
  }
};
module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.createChannelRequest = function(channel, channelDebug, opt_sessionId, opt_requestId, opt_retryId) {
  return new module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest(channel, channelDebug, opt_sessionId, opt_requestId, opt_retryId);
};
/** @const */ 
goog.labs.net.webChannel.ChannelRequest = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest;
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$ConnectionState_ConnectionState() {
}
/** @const */ 
goog.labs.net.webChannel.ConnectionState = module$contents$goog$labs$net$webChannel$ConnectionState_ConnectionState;
/** @interface */ 
class module$contents$goog$labs$net$webChannel$Wire_Wire {
  constructor() {
  }
}
module$contents$goog$labs$net$webChannel$Wire_Wire.LATEST_CHANNEL_VERSION = 8;
module$contents$goog$labs$net$webChannel$Wire_Wire.RAW_DATA_KEY = "__data__";
module$contents$goog$labs$net$webChannel$Wire_Wire.QueuedMap = class {
  constructor(mapId, map, opt_context) {
    this.mapId = mapId;
    this.map = map;
    this.context = opt_context || null;
  }
  getRawDataSize() {
    if (module$contents$goog$labs$net$webChannel$Wire_Wire.RAW_DATA_KEY in this.map) {
      let data = this.map[module$contents$goog$labs$net$webChannel$Wire_Wire.RAW_DATA_KEY];
      if (typeof data === "string") {
        return data.length;
      }
    }
  }
};
/** @const */ 
goog.labs.net.webChannel.Wire = module$contents$goog$labs$net$webChannel$Wire_Wire;
/** @constructor */ 
const module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool = function(opt_maxPoolSize) {
  this.maxPoolSizeConfigured_ = opt_maxPoolSize || module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.MAX_POOL_SIZE_;
  this.maxSize_ = module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.isSpdyOrHttp2Enabled_() ? this.maxPoolSizeConfigured_ : 1;
  this.requestPool_ = null;
  this.maxSize_ > 1 && (this.requestPool_ = new Set());
  this.request_ = null;
  this.pendingMessages_ = [];
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.MAX_POOL_SIZE_ = 10;
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.isSpdyOrHttp2Enabled_ = function() {
  if (goog.global.PerformanceNavigationTiming) {
    let entrys = goog.global.performance.getEntriesByType("navigation");
    return entrys.length > 0 && (entrys[0].nextHopProtocol == "hq" || entrys[0].nextHopProtocol == "h2");
  }
  return !!(goog.global.chrome && goog.global.chrome.loadTimes && goog.global.chrome.loadTimes() && goog.global.chrome.loadTimes().wasFetchedViaSpdy);
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.applyClientProtocol = function(clientProtocol) {
  !this.requestPool_ && (goog.string.contains(clientProtocol, "spdy") || goog.string.contains(clientProtocol, "quic") || goog.string.contains(clientProtocol, "h2")) && (this.maxSize_ = this.maxPoolSizeConfigured_, this.requestPool_ = new Set(), this.request_ && (this.addRequest(this.request_), this.request_ = null));
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.isFull = function() {
  return this.request_ ? !0 : this.requestPool_ ? this.requestPool_.size >= this.maxSize_ : !1;
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.getRequestCount = function() {
  return this.request_ ? 1 : this.requestPool_ ? this.requestPool_.size : 0;
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.hasRequest = function(req) {
  return this.request_ ? this.request_ == req : this.requestPool_ ? this.requestPool_.has(req) : !1;
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.addRequest = function(req) {
  this.requestPool_ ? this.requestPool_.add(req) : this.request_ = req;
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.removeRequest = function(req) {
  return this.request_ && this.request_ == req ? (this.request_ = null, !0) : this.requestPool_ && this.requestPool_.has(req) ? (this.requestPool_.delete(req), !0) : !1;
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.cancel = function() {
  this.pendingMessages_ = this.getPendingMessages();
  if (this.request_) {
    this.request_.cancel(), this.request_ = null;
  } else {
    if (this.requestPool_ && this.requestPool_.size !== 0) {
      for (let val of this.requestPool_.values()) {
        val.cancel();
      }
      this.requestPool_.clear();
    }
  }
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.getPendingMessages = function() {
  if (this.request_ != null) {
    return this.pendingMessages_.concat(this.request_.getPendingMessages());
  }
  if (this.requestPool_ != null && this.requestPool_.size !== 0) {
    let result = this.pendingMessages_;
    for (let val of this.requestPool_.values()) {
      result = result.concat(val.getPendingMessages());
    }
    return result;
  }
  return module$contents$goog$array_toArray(this.pendingMessages_);
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.addPendingMessages = function(messages) {
  this.pendingMessages_ = this.pendingMessages_.concat(messages);
};
module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool.prototype.clearPendingMessages = function() {
  this.pendingMessages_.length = 0;
};
/** @const */ 
goog.labs.net.webChannel.ForwardChannelRequestPool = module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool;
/** @const */ 
goog.structs = {};
goog.structs.getCount = function(col) {
  return col.getCount && typeof col.getCount == "function" ? col.getCount() : goog.isArrayLike(col) || typeof col === "string" ? col.length : module$contents$goog$object_getCount(col);
};
goog.structs.getValues = function(col) {
  if (col.getValues && typeof col.getValues == "function") {
    return col.getValues();
  }
  if (typeof Map !== "undefined" && col instanceof Map || typeof Set !== "undefined" && col instanceof Set) {
    return Array.from(col.values());
  }
  if (typeof col === "string") {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    let rv = [], l = col.length;
    for (let i = 0; i < l; i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return module$contents$goog$object_getValues(col);
};
goog.structs.getKeys = function(col) {
  if (col.getKeys && typeof col.getKeys == "function") {
    return col.getKeys();
  }
  if (!col.getValues || typeof col.getValues != "function") {
    if (typeof Map !== "undefined" && col instanceof Map) {
      return Array.from(col.keys());
    }
    if (!(typeof Set !== "undefined" && col instanceof Set)) {
      if (goog.isArrayLike(col) || typeof col === "string") {
        let rv = [], l = col.length;
        for (let i = 0; i < l; i++) {
          rv.push(i);
        }
        return rv;
      }
      return module$contents$goog$object_getKeys(col);
    }
  }
};
goog.structs.contains = function(col, val) {
  return col.contains && typeof col.contains == "function" ? col.contains(val) : col.containsValue && typeof col.containsValue == "function" ? col.containsValue(val) : goog.isArrayLike(col) || typeof col === "string" ? module$contents$goog$array_contains(col, val) : module$contents$goog$object_containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  return col.isEmpty && typeof col.isEmpty == "function" ? col.isEmpty() : goog.isArrayLike(col) || typeof col === "string" ? col.length === 0 : module$contents$goog$object_isEmpty(col);
};
goog.structs.clear = function(col) {
  col.clear && typeof col.clear == "function" ? col.clear() : goog.isArrayLike(col) ? module$contents$goog$array_clear(col) : module$contents$goog$object_clear(col);
};
goog.structs.forEach = function(col, f, opt_obj) {
  if (col.forEach && typeof col.forEach == "function") {
    col.forEach(f, opt_obj);
  } else if (goog.isArrayLike(col) || typeof col === "string") {
    Array.prototype.forEach.call(col, f, opt_obj);
  } else {
    let keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
    for (let i = 0; i < l; i++) {
      f.call(opt_obj, values[i], keys && keys[i], col);
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if (typeof col.filter == "function") {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || typeof col === "string") {
    return Array.prototype.filter.call(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    var rv = {};
    for (let i = 0; i < l; i++) {
      f.call(opt_obj, values[i], keys[i], col) && (rv[keys[i]] = values[i]);
    }
  } else {
    rv = [];
    for (let i = 0; i < l; i++) {
      f.call(opt_obj, values[i], void 0, col) && rv.push(values[i]);
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if (typeof col.map == "function") {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || typeof col === "string") {
    return Array.prototype.map.call(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    var rv = {};
    for (let i = 0; i < l; i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    rv = [];
    for (let i = 0; i < l; i++) {
      rv[i] = f.call(opt_obj, values[i], void 0, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == "function") {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || typeof col === "string") {
    return Array.prototype.some.call(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  for (let i = 0; i < l; i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return !0;
    }
  }
  return !1;
};
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == "function") {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || typeof col === "string") {
    return Array.prototype.every.call(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  for (let i = 0; i < l; i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return !1;
    }
  }
  return !0;
};
/** @const */ 
goog.uri = {};
/** @const */ 
goog.uri.utils = {};
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$uri$utils_CharCode = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
function module$contents$goog$uri$utils_buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  opt_scheme && (out += opt_scheme + ":");
  opt_domain && (out += "//", opt_userInfo && (out += opt_userInfo + "@"), out += opt_domain, opt_port && (out += ":" + opt_port));
  opt_path && (out += opt_path);
  opt_queryData && (out += "?" + opt_queryData);
  opt_fragment && (out += "#" + opt_fragment);
  return out;
}
const module$contents$goog$uri$utils_splitRe = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"), module$contents$goog$uri$utils_ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
let module$contents$goog$uri$utils_urlPackageSupportLoggingHandler = null;
function module$contents$goog$uri$utils_setUrlPackageSupportLoggingHandler(handler) {
  module$contents$goog$uri$utils_urlPackageSupportLoggingHandler = handler;
}
function module$contents$goog$uri$utils_split(uri) {
  var result = uri.match(module$contents$goog$uri$utils_splitRe);
  module$contents$goog$uri$utils_urlPackageSupportLoggingHandler && ["http", "https", "ws", "wss", "ftp"].indexOf(result[module$contents$goog$uri$utils_ComponentIndex.SCHEME]) >= 0 && module$contents$goog$uri$utils_urlPackageSupportLoggingHandler(uri);
  return result;
}
function module$contents$goog$uri$utils_decodeIfPossible(uri, opt_preserveReserved) {
  return uri ? opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri) : uri;
}
function module$contents$goog$uri$utils_getComponentByIndex(componentIndex, uri) {
  return module$contents$goog$uri$utils_split(uri)[componentIndex] || null;
}
function module$contents$goog$uri$utils_getScheme(uri) {
  return module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.SCHEME, uri);
}
function module$contents$goog$uri$utils_getEffectiveScheme(uri) {
  var scheme = module$contents$goog$uri$utils_getScheme(uri);
  if (!scheme && goog.global.self && goog.global.self.location) {
    let protocol = goog.global.self.location.protocol;
    scheme = protocol.slice(0, -1);
  }
  return scheme ? scheme.toLowerCase() : "";
}
function module$contents$goog$uri$utils_getUserInfoEncoded(uri) {
  return module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.USER_INFO, uri);
}
function module$contents$goog$uri$utils_getUserInfo(uri) {
  return module$contents$goog$uri$utils_decodeIfPossible(module$contents$goog$uri$utils_getUserInfoEncoded(uri));
}
function module$contents$goog$uri$utils_getDomainEncoded(uri) {
  return module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.DOMAIN, uri);
}
function module$contents$goog$uri$utils_getDomain(uri) {
  return module$contents$goog$uri$utils_decodeIfPossible(module$contents$goog$uri$utils_getDomainEncoded(uri), !0);
}
function module$contents$goog$uri$utils_getPort(uri) {
  return Number(module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.PORT, uri)) || null;
}
function module$contents$goog$uri$utils_getPathEncoded(uri) {
  return module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.PATH, uri);
}
function module$contents$goog$uri$utils_getPath(uri) {
  return module$contents$goog$uri$utils_decodeIfPossible(module$contents$goog$uri$utils_getPathEncoded(uri), !0);
}
function module$contents$goog$uri$utils_getQueryData(uri) {
  return module$contents$goog$uri$utils_getComponentByIndex(module$contents$goog$uri$utils_ComponentIndex.QUERY_DATA, uri);
}
function module$contents$goog$uri$utils_getFragmentEncoded(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.slice(hashIndex + 1);
}
function module$contents$goog$uri$utils_setFragmentEncoded(uri, fragment) {
  return module$contents$goog$uri$utils_removeFragment(uri) + (fragment ? "#" + fragment : "");
}
function module$contents$goog$uri$utils_getFragment(uri) {
  return module$contents$goog$uri$utils_decodeIfPossible(module$contents$goog$uri$utils_getFragmentEncoded(uri));
}
function module$contents$goog$uri$utils_getHost(uri) {
  var pieces = module$contents$goog$uri$utils_split(uri);
  return module$contents$goog$uri$utils_buildFromEncodedParts(pieces[module$contents$goog$uri$utils_ComponentIndex.SCHEME], pieces[module$contents$goog$uri$utils_ComponentIndex.USER_INFO], pieces[module$contents$goog$uri$utils_ComponentIndex.DOMAIN], pieces[module$contents$goog$uri$utils_ComponentIndex.PORT]);
}
function module$contents$goog$uri$utils_getOrigin(uri) {
  var pieces = module$contents$goog$uri$utils_split(uri);
  return module$contents$goog$uri$utils_buildFromEncodedParts(pieces[module$contents$goog$uri$utils_ComponentIndex.SCHEME], null, pieces[module$contents$goog$uri$utils_ComponentIndex.DOMAIN], pieces[module$contents$goog$uri$utils_ComponentIndex.PORT]);
}
function module$contents$goog$uri$utils_getPathAndAfter(uri) {
  var pieces = module$contents$goog$uri$utils_split(uri);
  return module$contents$goog$uri$utils_buildFromEncodedParts(null, null, null, null, pieces[module$contents$goog$uri$utils_ComponentIndex.PATH], pieces[module$contents$goog$uri$utils_ComponentIndex.QUERY_DATA], pieces[module$contents$goog$uri$utils_ComponentIndex.FRAGMENT]);
}
function module$contents$goog$uri$utils_removeFragment(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.slice(0, hashIndex);
}
function module$contents$goog$uri$utils_haveSameDomain(uri1, uri2) {
  var pieces1 = module$contents$goog$uri$utils_split(uri1), pieces2 = module$contents$goog$uri$utils_split(uri2);
  return pieces1[module$contents$goog$uri$utils_ComponentIndex.DOMAIN] == pieces2[module$contents$goog$uri$utils_ComponentIndex.DOMAIN] && pieces1[module$contents$goog$uri$utils_ComponentIndex.SCHEME] == pieces2[module$contents$goog$uri$utils_ComponentIndex.SCHEME] && pieces1[module$contents$goog$uri$utils_ComponentIndex.PORT] == pieces2[module$contents$goog$uri$utils_ComponentIndex.PORT];
}
let module$contents$goog$uri$utils_QueryValue, module$contents$goog$uri$utils_QueryArray;
function module$contents$goog$uri$utils_parseQueryData(encodedQuery, callback) {
  if (encodedQuery) {
    var pairs = encodedQuery.split("&");
    for (let i = 0; i < pairs.length; i++) {
      let indexOfEquals = pairs[i].indexOf("="), name, value = null;
      indexOfEquals >= 0 ? (name = pairs[i].substring(0, indexOfEquals), value = pairs[i].substring(indexOfEquals + 1)) : name = pairs[i];
      callback(name, value ? goog.string.urlDecode(value) : "");
    }
  }
}
function module$contents$goog$uri$utils_splitQueryData(uri) {
  var hashIndex = uri.indexOf("#");
  hashIndex < 0 && (hashIndex = uri.length);
  var questionIndex = uri.indexOf("?");
  if (questionIndex < 0 || questionIndex > hashIndex) {
    questionIndex = hashIndex;
    var queryData = "";
  } else {
    queryData = uri.substring(questionIndex + 1, hashIndex);
  }
  return [uri.slice(0, questionIndex), queryData, uri.slice(hashIndex)];
}
function module$contents$goog$uri$utils_appendQueryData(queryData, newData) {
  return newData ? queryData ? queryData + "&" + newData : newData : queryData;
}
function module$contents$goog$uri$utils_appendQueryDataToUri(uri, queryData) {
  if (!queryData) {
    return uri;
  }
  var parts = module$contents$goog$uri$utils_splitQueryData(uri);
  parts[1] = module$contents$goog$uri$utils_appendQueryData(parts[1], queryData);
  return parts[0] + (parts[1] ? "?" + parts[1] : "") + parts[2];
}
function module$contents$goog$uri$utils_appendKeyValuePairs(key, value, pairs) {
  goog.asserts.assertString(key);
  if (Array.isArray(value)) {
    goog.asserts.assertArray(value);
    for (let j = 0; j < value.length; j++) {
      module$contents$goog$uri$utils_appendKeyValuePairs(key, String(value[j]), pairs);
    }
  } else {
    value != null && pairs.push(key + (value === "" ? "" : "=" + goog.string.urlEncode(value)));
  }
}
function module$contents$goog$uri$utils_buildQueryData(keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  var params = [];
  for (let i = opt_startIndex || 0; i < keysAndValues.length; i += 2) {
    let key = keysAndValues[i];
    module$contents$goog$uri$utils_appendKeyValuePairs(key, keysAndValues[i + 1], params);
  }
  return params.join("&");
}
function module$contents$goog$uri$utils_buildQueryDataFromMap(map) {
  var params = [];
  for (let key in map) {
    module$contents$goog$uri$utils_appendKeyValuePairs(key, map[key], params);
  }
  return params.join("&");
}
function module$contents$goog$uri$utils_appendParams(uri, var_args) {
  var queryData = arguments.length == 2 ? module$contents$goog$uri$utils_buildQueryData(arguments[1], 0) : module$contents$goog$uri$utils_buildQueryData(arguments, 1);
  return module$contents$goog$uri$utils_appendQueryDataToUri(uri, queryData);
}
function module$contents$goog$uri$utils_appendParamsFromMap(uri, map) {
  var queryData = module$contents$goog$uri$utils_buildQueryDataFromMap(map);
  return module$contents$goog$uri$utils_appendQueryDataToUri(uri, queryData);
}
function module$contents$goog$uri$utils_appendParam(uri, key, opt_value) {
  var value = opt_value != null ? "=" + goog.string.urlEncode(opt_value) : "";
  return module$contents$goog$uri$utils_appendQueryDataToUri(uri, key + value);
}
function module$contents$goog$uri$utils_findParam(uri, startIndex, keyEncoded, hashOrEndIndex) {
  for (var index = startIndex, keyLength = keyEncoded.length; (index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex;) {
    let precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == module$contents$goog$uri$utils_CharCode.AMPERSAND || precedingChar == module$contents$goog$uri$utils_CharCode.QUESTION) {
      let followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == module$contents$goog$uri$utils_CharCode.EQUAL || followingChar == module$contents$goog$uri$utils_CharCode.AMPERSAND || followingChar == module$contents$goog$uri$utils_CharCode.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return -1;
}
const module$contents$goog$uri$utils_hashOrEndRe = /#|$/;
function module$contents$goog$uri$utils_hasParam(uri, keyEncoded) {
  return module$contents$goog$uri$utils_findParam(uri, 0, keyEncoded, uri.search(module$contents$goog$uri$utils_hashOrEndRe)) >= 0;
}
function module$contents$goog$uri$utils_getParamValue(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(module$contents$goog$uri$utils_hashOrEndRe), foundIndex = module$contents$goog$uri$utils_findParam(uri, 0, keyEncoded, hashOrEndIndex);
  if (foundIndex < 0) {
    return null;
  }
  var endPosition = uri.indexOf("&", foundIndex);
  if (endPosition < 0 || endPosition > hashOrEndIndex) {
    endPosition = hashOrEndIndex;
  }
  foundIndex += keyEncoded.length + 1;
  return goog.string.urlDecode(uri.slice(foundIndex, endPosition !== -1 ? endPosition : 0));
}
function module$contents$goog$uri$utils_getParamValues(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(module$contents$goog$uri$utils_hashOrEndRe), position = 0, foundIndex, result = []; (foundIndex = module$contents$goog$uri$utils_findParam(uri, position, keyEncoded, hashOrEndIndex)) >= 0;) {
    position = uri.indexOf("&", foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.slice(foundIndex, Math.max(position, 0))));
  }
  return result;
}
const module$contents$goog$uri$utils_trailingQueryPunctuationRe = /[?&]($|#)/;
function module$contents$goog$uri$utils_removeParam(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(module$contents$goog$uri$utils_hashOrEndRe), position = 0, foundIndex, buffer = []; (foundIndex = module$contents$goog$uri$utils_findParam(uri, position, keyEncoded, hashOrEndIndex)) >= 0;) {
    buffer.push(uri.substring(position, foundIndex)), position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.slice(position));
  return buffer.join("").replace(module$contents$goog$uri$utils_trailingQueryPunctuationRe, "$1");
}
function module$contents$goog$uri$utils_setParam(uri, keyEncoded, value) {
  return module$contents$goog$uri$utils_appendParam(module$contents$goog$uri$utils_removeParam(uri, keyEncoded), keyEncoded, value);
}
function module$contents$goog$uri$utils_setParamsFromMap(uri, params) {
  var parts = module$contents$goog$uri$utils_splitQueryData(uri), queryData = parts[1], buffer = [];
  queryData && queryData.split("&").forEach(function(pair) {
    var indexOfEquals = pair.indexOf("="), name = indexOfEquals >= 0 ? pair.slice(0, indexOfEquals) : pair;
    params.hasOwnProperty(name) || buffer.push(pair);
  });
  parts[1] = module$contents$goog$uri$utils_appendQueryData(buffer.join("&"), module$contents$goog$uri$utils_buildQueryDataFromMap(params));
  return parts[0] + (parts[1] ? "?" + parts[1] : "") + parts[2];
}
function module$contents$goog$uri$utils_appendPath(baseUri, path) {
  var uri = baseUri;
  goog.asserts.assert(uri.indexOf("#") < 0 && uri.indexOf("?") < 0, "goog.uri.utils: Fragment or query identifiers are not supported: [%s]", uri);
  goog.string.endsWith(baseUri, "/") && (baseUri = baseUri.slice(0, -1));
  goog.string.startsWith(path, "/") && (path = path.slice(1));
  return "" + baseUri + "/" + path;
}
function module$contents$goog$uri$utils_setPath(uri, path) {
  goog.string.startsWith(path, "/") || (path = "/" + path);
  var parts = module$contents$goog$uri$utils_split(uri);
  return module$contents$goog$uri$utils_buildFromEncodedParts(parts[module$contents$goog$uri$utils_ComponentIndex.SCHEME], parts[module$contents$goog$uri$utils_ComponentIndex.USER_INFO], parts[module$contents$goog$uri$utils_ComponentIndex.DOMAIN], parts[module$contents$goog$uri$utils_ComponentIndex.PORT], path, parts[module$contents$goog$uri$utils_ComponentIndex.QUERY_DATA], parts[module$contents$goog$uri$utils_ComponentIndex.FRAGMENT]);
}
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$uri$utils_StandardQueryParam = {RANDOM:"zx"};
function module$contents$goog$uri$utils_makeUnique(uri) {
  return module$contents$goog$uri$utils_setParam(uri, module$contents$goog$uri$utils_StandardQueryParam.RANDOM, goog.string.getRandomString());
}
/** @const */ 
goog.uri.utils.ComponentIndex = module$contents$goog$uri$utils_ComponentIndex;
/** @const */ 
goog.uri.utils.StandardQueryParam = module$contents$goog$uri$utils_StandardQueryParam;
/** @const */ 
goog.uri.utils.QueryArray = module$contents$goog$uri$utils_QueryArray;
/** @const */ 
goog.uri.utils.QueryValue = module$contents$goog$uri$utils_QueryValue;
/** @const */ 
goog.uri.utils.appendParam = module$contents$goog$uri$utils_appendParam;
/** @const */ 
goog.uri.utils.appendParams = module$contents$goog$uri$utils_appendParams;
/** @const */ 
goog.uri.utils.appendParamsFromMap = module$contents$goog$uri$utils_appendParamsFromMap;
/** @const */ 
goog.uri.utils.appendPath = module$contents$goog$uri$utils_appendPath;
/** @const */ 
goog.uri.utils.buildFromEncodedParts = module$contents$goog$uri$utils_buildFromEncodedParts;
/** @const */ 
goog.uri.utils.buildQueryData = module$contents$goog$uri$utils_buildQueryData;
/** @const */ 
goog.uri.utils.buildQueryDataFromMap = module$contents$goog$uri$utils_buildQueryDataFromMap;
/** @const */ 
goog.uri.utils.getDomain = module$contents$goog$uri$utils_getDomain;
/** @const */ 
goog.uri.utils.getDomainEncoded = module$contents$goog$uri$utils_getDomainEncoded;
/** @const */ 
goog.uri.utils.getEffectiveScheme = module$contents$goog$uri$utils_getEffectiveScheme;
/** @const */ 
goog.uri.utils.getFragment = module$contents$goog$uri$utils_getFragment;
/** @const */ 
goog.uri.utils.getFragmentEncoded = module$contents$goog$uri$utils_getFragmentEncoded;
/** @const */ 
goog.uri.utils.getHost = module$contents$goog$uri$utils_getHost;
/** @const */ 
goog.uri.utils.getOrigin = module$contents$goog$uri$utils_getOrigin;
/** @const */ 
goog.uri.utils.getParamValue = module$contents$goog$uri$utils_getParamValue;
/** @const */ 
goog.uri.utils.getParamValues = module$contents$goog$uri$utils_getParamValues;
/** @const */ 
goog.uri.utils.getPath = module$contents$goog$uri$utils_getPath;
/** @const */ 
goog.uri.utils.getPathAndAfter = module$contents$goog$uri$utils_getPathAndAfter;
/** @const */ 
goog.uri.utils.getPathEncoded = module$contents$goog$uri$utils_getPathEncoded;
/** @const */ 
goog.uri.utils.getPort = module$contents$goog$uri$utils_getPort;
/** @const */ 
goog.uri.utils.getQueryData = module$contents$goog$uri$utils_getQueryData;
/** @const */ 
goog.uri.utils.getScheme = module$contents$goog$uri$utils_getScheme;
/** @const */ 
goog.uri.utils.getUserInfo = module$contents$goog$uri$utils_getUserInfo;
/** @const */ 
goog.uri.utils.getUserInfoEncoded = module$contents$goog$uri$utils_getUserInfoEncoded;
/** @const */ 
goog.uri.utils.hasParam = module$contents$goog$uri$utils_hasParam;
/** @const */ 
goog.uri.utils.haveSameDomain = module$contents$goog$uri$utils_haveSameDomain;
/** @const */ 
goog.uri.utils.makeUnique = module$contents$goog$uri$utils_makeUnique;
/** @const */ 
goog.uri.utils.parseQueryData = module$contents$goog$uri$utils_parseQueryData;
/** @const */ 
goog.uri.utils.removeFragment = module$contents$goog$uri$utils_removeFragment;
/** @const */ 
goog.uri.utils.removeParam = module$contents$goog$uri$utils_removeParam;
/** @const */ 
goog.uri.utils.setFragmentEncoded = module$contents$goog$uri$utils_setFragmentEncoded;
/** @const */ 
goog.uri.utils.setParam = module$contents$goog$uri$utils_setParam;
/** @const */ 
goog.uri.utils.setParamsFromMap = module$contents$goog$uri$utils_setParamsFromMap;
/** @const */ 
goog.uri.utils.setPath = module$contents$goog$uri$utils_setPath;
/** @const */ 
goog.uri.utils.setUrlPackageSupportLoggingHandler = module$contents$goog$uri$utils_setUrlPackageSupportLoggingHandler;
/** @const */ 
goog.uri.utils.split = module$contents$goog$uri$utils_split;
/** @constructor */ 
function module$contents$goog$Uri_Uri(opt_uri, opt_ignoreCase) {
  this.domain_ = this.userInfo_ = this.scheme_ = "";
  this.port_ = null;
  this.fragment_ = this.path_ = "";
  this.ignoreCase_ = this.isReadOnly_ = !1;
  var m;
  opt_uri instanceof module$contents$goog$Uri_Uri ? (this.ignoreCase_ = opt_ignoreCase !== void 0 ? opt_ignoreCase : opt_uri.ignoreCase_, this.setScheme(opt_uri.getScheme()), this.setUserInfo(opt_uri.getUserInfo()), this.setDomain(opt_uri.getDomain()), this.setPort(opt_uri.getPort()), this.setPath(opt_uri.getPath()), this.setQueryData(opt_uri.getQueryData().clone()), this.setFragment(opt_uri.getFragment())) : opt_uri && (m = module$contents$goog$uri$utils_split(String(opt_uri))) ? (this.ignoreCase_ = 
  !!opt_ignoreCase, this.setScheme(m[module$contents$goog$uri$utils_ComponentIndex.SCHEME] || "", !0), this.setUserInfo(m[module$contents$goog$uri$utils_ComponentIndex.USER_INFO] || "", !0), this.setDomain(m[module$contents$goog$uri$utils_ComponentIndex.DOMAIN] || "", !0), this.setPort(m[module$contents$goog$uri$utils_ComponentIndex.PORT]), this.setPath(m[module$contents$goog$uri$utils_ComponentIndex.PATH] || "", !0), this.setQueryData(m[module$contents$goog$uri$utils_ComponentIndex.QUERY_DATA] || 
  "", !0), this.setFragment(m[module$contents$goog$uri$utils_ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!opt_ignoreCase, this.queryData_ = new module$contents$goog$Uri_Uri.QueryData(null, this.ignoreCase_));
}
module$contents$goog$Uri_Uri.RANDOM_PARAM = module$contents$goog$uri$utils_StandardQueryParam.RANDOM;
module$contents$goog$Uri_Uri.prototype.toString = function() {
  var out = [], scheme = this.getScheme();
  scheme && out.push(module$contents$goog$Uri_Uri.encodeSpecialChars_(scheme, module$contents$goog$Uri_Uri.reDisallowedInSchemeOrUserInfo_, !0), ":");
  var domain = this.getDomain();
  if (domain || scheme == "file") {
    out.push("//");
    let userInfo = this.getUserInfo();
    userInfo && out.push(module$contents$goog$Uri_Uri.encodeSpecialChars_(userInfo, module$contents$goog$Uri_Uri.reDisallowedInSchemeOrUserInfo_, !0), "@");
    out.push(module$contents$goog$Uri_Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
    let port = this.getPort();
    port != null && out.push(":", String(port));
  }
  var path = this.getPath();
  path && (this.hasDomain() && path.charAt(0) != "/" && out.push("/"), out.push(module$contents$goog$Uri_Uri.encodeSpecialChars_(path, path.charAt(0) == "/" ? module$contents$goog$Uri_Uri.reDisallowedInAbsolutePath_ : module$contents$goog$Uri_Uri.reDisallowedInRelativePath_, !0)));
  var query = this.getEncodedQuery();
  query && out.push("?", query);
  var fragment = this.getFragment();
  fragment && out.push("#", module$contents$goog$Uri_Uri.encodeSpecialChars_(fragment, module$contents$goog$Uri_Uri.reDisallowedInFragment_));
  return out.join("");
};
module$contents$goog$Uri_Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone(), overridden = relativeUri.hasScheme();
  overridden ? absoluteUri.setScheme(relativeUri.getScheme()) : overridden = relativeUri.hasUserInfo();
  overridden ? absoluteUri.setUserInfo(relativeUri.getUserInfo()) : overridden = relativeUri.hasDomain();
  overridden ? absoluteUri.setDomain(relativeUri.getDomain()) : overridden = relativeUri.hasPort();
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    if (overridden = relativeUri.hasPath()) {
      if (path.charAt(0) != "/") {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          let lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          lastSlashIndex != -1 && (path = absoluteUri.getPath().slice(0, lastSlashIndex + 1) + path);
        }
      }
      path = module$contents$goog$Uri_Uri.removeDotSegments(path);
    }
  }
  overridden ? absoluteUri.setPath(path) : overridden = relativeUri.hasQuery();
  overridden ? absoluteUri.setQueryData(relativeUri.getQueryData().clone()) : overridden = relativeUri.hasFragment();
  overridden && absoluteUri.setFragment(relativeUri.getFragment());
  return absoluteUri;
};
module$contents$goog$Uri_Uri.prototype.clone = function() {
  return new module$contents$goog$Uri_Uri(this);
};
module$contents$goog$Uri_Uri.prototype.getScheme = function() {
  return this.scheme_;
};
module$contents$goog$Uri_Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  if (this.scheme_ = opt_decode ? module$contents$goog$Uri_Uri.decodeOrEmpty_(newScheme, !0) : newScheme) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasScheme = function() {
  return !!this.scheme_;
};
module$contents$goog$Uri_Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
module$contents$goog$Uri_Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? module$contents$goog$Uri_Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasUserInfo = function() {
  return !!this.userInfo_;
};
module$contents$goog$Uri_Uri.prototype.getDomain = function() {
  return this.domain_;
};
module$contents$goog$Uri_Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? module$contents$goog$Uri_Uri.decodeOrEmpty_(newDomain, !0) : newDomain;
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasDomain = function() {
  return !!this.domain_;
};
module$contents$goog$Uri_Uri.prototype.getPort = function() {
  return this.port_;
};
module$contents$goog$Uri_Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasPort = function() {
  return this.port_ != null;
};
module$contents$goog$Uri_Uri.prototype.getPath = function() {
  return this.path_;
};
module$contents$goog$Uri_Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? module$contents$goog$Uri_Uri.decodeOrEmpty_(newPath, !0) : newPath;
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasPath = function() {
  return !!this.path_;
};
module$contents$goog$Uri_Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== "";
};
module$contents$goog$Uri_Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  queryData instanceof module$contents$goog$Uri_Uri.QueryData ? (this.queryData_ = queryData, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (opt_decode || (queryData = module$contents$goog$Uri_Uri.encodeSpecialChars_(queryData, module$contents$goog$Uri_Uri.reDisallowedInQuery_)), this.queryData_ = new module$contents$goog$Uri_Uri.QueryData(queryData, this.ignoreCase_));
  return this;
};
module$contents$goog$Uri_Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
module$contents$goog$Uri_Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
module$contents$goog$Uri_Uri.prototype.getQuery = function() {
  return this.getEncodedQuery();
};
module$contents$goog$Uri_Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
module$contents$goog$Uri_Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  Array.isArray(values) || (values = [String(values)]);
  this.queryData_.setValues(key, values);
  return this;
};
module$contents$goog$Uri_Uri.prototype.getFragment = function() {
  return this.fragment_;
};
module$contents$goog$Uri_Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? module$contents$goog$Uri_Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
module$contents$goog$Uri_Uri.prototype.hasFragment = function() {
  return !!this.fragment_;
};
module$contents$goog$Uri_Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(module$contents$goog$Uri_Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
module$contents$goog$Uri_Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this;
};
module$contents$goog$Uri_Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
module$contents$goog$Uri_Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  this.queryData_ && this.queryData_.setIgnoreCase(ignoreCase);
  return this;
};
module$contents$goog$Uri_Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof module$contents$goog$Uri_Uri ? uri.clone() : new module$contents$goog$Uri_Uri(uri, opt_ignoreCase);
};
module$contents$goog$Uri_Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new module$contents$goog$Uri_Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
module$contents$goog$Uri_Uri.resolve = function(base, rel) {
  base instanceof module$contents$goog$Uri_Uri || (base = module$contents$goog$Uri_Uri.parse(base));
  rel instanceof module$contents$goog$Uri_Uri || (rel = module$contents$goog$Uri_Uri.parse(rel));
  return base.resolve(rel);
};
module$contents$goog$Uri_Uri.removeDotSegments = function(path) {
  if (path == ".." || path == ".") {
    return "";
  }
  if (goog.string.contains(path, "./") || goog.string.contains(path, "/.")) {
    let leadingSlash = goog.string.startsWith(path, "/"), segments = path.split("/"), out = [];
    for (let pos = 0; pos < segments.length;) {
      let segment = segments[pos++];
      segment == "." ? leadingSlash && pos == segments.length && out.push("") : segment == ".." ? ((out.length > 1 || out.length == 1 && out[0] != "") && out.pop(), leadingSlash && pos == segments.length && out.push("")) : (out.push(segment), leadingSlash = !0);
    }
    return out.join("/");
  }
  return path;
};
module$contents$goog$Uri_Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
  return val ? opt_preserveReserved ? decodeURI(val.replace(/%25/g, "%2525")) : decodeURIComponent(val) : "";
};
module$contents$goog$Uri_Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
  if (typeof unescapedPart === "string") {
    let encoded = encodeURI(unescapedPart).replace(extra, module$contents$goog$Uri_Uri.encodeChar_);
    opt_removeDoubleEncoding && (encoded = module$contents$goog$Uri_Uri.removeDoubleEncoding_(encoded));
    return encoded;
  }
  return null;
};
module$contents$goog$Uri_Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
module$contents$goog$Uri_Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
  return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
module$contents$goog$Uri_Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
module$contents$goog$Uri_Uri.reDisallowedInRelativePath_ = /[#\?:]/g;
module$contents$goog$Uri_Uri.reDisallowedInAbsolutePath_ = /[#\?]/g;
module$contents$goog$Uri_Uri.reDisallowedInQuery_ = /[#\?@]/g;
module$contents$goog$Uri_Uri.reDisallowedInFragment_ = /#/g;
module$contents$goog$Uri_Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = module$contents$goog$uri$utils_split(uri1String), pieces2 = module$contents$goog$uri$utils_split(uri2String);
  return pieces1[module$contents$goog$uri$utils_ComponentIndex.DOMAIN] == pieces2[module$contents$goog$uri$utils_ComponentIndex.DOMAIN] && pieces1[module$contents$goog$uri$utils_ComponentIndex.PORT] == pieces2[module$contents$goog$uri$utils_ComponentIndex.PORT];
};
/** @constructor */ 
module$contents$goog$Uri_Uri.QueryData = function(opt_query, opt_ignoreCase) {
  this.count_ = this.keyMap_ = null;
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
module$contents$goog$Uri_Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_ && (this.keyMap_ = new Map(), this.count_ = 0, this.encodedQuery_)) {
    let self = this;
    module$contents$goog$uri$utils_parseQueryData(this.encodedQuery_, function(name, value) {
      self.add(goog.string.urlDecode(name), value);
    });
  }
};
module$contents$goog$Uri_Uri.QueryData.createFromMap = function(map, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if (typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  var queryData = new module$contents$goog$Uri_Uri.QueryData(null, opt_ignoreCase), values = goog.structs.getValues(map);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i], value = values[i];
    Array.isArray(value) ? queryData.setValues(key, value) : queryData.add(key, value);
  }
  return queryData;
};
module$contents$goog$Uri_Uri.QueryData.createFromKeysValues = function(keys, values, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  var queryData = new module$contents$goog$Uri_Uri.QueryData(null, opt_ignoreCase);
  for (let i = 0; i < keys.length; i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
module$contents$goog$Uri_Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
module$contents$goog$Uri_Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  values || this.keyMap_.set(key, values = []);
  values.push(value);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
module$contents$goog$Uri_Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.has(key) ? (this.invalidateCache_(), this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(key).length, this.keyMap_.delete(key)) : !1;
};
module$contents$goog$Uri_Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
module$contents$goog$Uri_Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0;
};
module$contents$goog$Uri_Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.has(key);
};
module$contents$goog$Uri_Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return module$contents$goog$array_contains(vals, value);
};
module$contents$goog$Uri_Uri.QueryData.prototype.forEach = function(f, opt_scope) {
  this.ensureKeyMapInitialized_();
  this.keyMap_.forEach(function(values, key) {
    values.forEach(function(value) {
      f.call(opt_scope, value, key, this);
    }, this);
  }, this);
};
module$contents$goog$Uri_Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var vals = Array.from(this.keyMap_.values()), keys = Array.from(this.keyMap_.keys()), rv = [];
  for (let i = 0; i < keys.length; i++) {
    let val = vals[i];
    for (let j = 0; j < val.length; j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
module$contents$goog$Uri_Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (typeof opt_key === "string") {
    this.containsKey(opt_key) && (rv = rv.concat(this.keyMap_.get(this.getKeyName_(opt_key))));
  } else {
    let values = Array.from(this.keyMap_.values());
    for (let i = 0; i < values.length; i++) {
      rv = rv.concat(values[i]);
    }
  }
  return rv;
};
module$contents$goog$Uri_Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  this.containsKey(key) && (this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(key).length);
  this.keyMap_.set(key, [value]);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
module$contents$goog$Uri_Uri.QueryData.prototype.get = function(key, opt_default) {
  if (!key) {
    return opt_default;
  }
  var values = this.getValues(key);
  return values.length > 0 ? String(values[0]) : opt_default;
};
module$contents$goog$Uri_Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  values.length > 0 && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(key), module$contents$goog$array_toArray(values)), this.count_ = goog.asserts.assertNumber(this.count_) + values.length);
};
module$contents$goog$Uri_Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  var sb = [], keys = Array.from(this.keyMap_.keys());
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i], encodedKey = goog.string.urlEncode(key), val = this.getValues(key);
    for (let j = 0; j < val.length; j++) {
      let param = encodedKey;
      val[j] !== "" && (param += "=" + goog.string.urlEncode(val[j]));
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
module$contents$goog$Uri_Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
module$contents$goog$Uri_Uri.QueryData.prototype.clone = function() {
  var rv = new module$contents$goog$Uri_Uri.QueryData();
  rv.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (rv.keyMap_ = new Map(this.keyMap_), rv.count_ = this.count_);
  return rv;
};
module$contents$goog$Uri_Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  this.ignoreCase_ && (keyName = keyName.toLowerCase());
  return keyName;
};
module$contents$goog$Uri_Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  resetKeys && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(value, key) {
    var lowerCase = key.toLowerCase();
    key != lowerCase && (this.remove(key), this.setValues(lowerCase, value));
  }, this));
  this.ignoreCase_ = ignoreCase;
};
module$contents$goog$Uri_Uri.QueryData.prototype.extend = function(var_args) {
  for (let i = 0; i < arguments.length; i++) {
    let data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value);
    }, this);
  }
};
/** @const */ 
goog.Uri = module$contents$goog$Uri_Uri;
/** @const */ 
goog.labs.net.webChannel.netUtils = {};
function module$contents$goog$labs$net$webChannel$netUtils_testNetwork(callback, opt_baseUrl) {
  var baseUrl = opt_baseUrl || "//www.google.com/images/cleardot.gif", useImageLoader = !opt_baseUrl, uri = new module$contents$goog$Uri_Uri(baseUrl);
  goog.global.location && goog.global.location.protocol == "http" || uri.setScheme("https");
  uri.makeUnique();
  useImageLoader ? module$contents$goog$labs$net$webChannel$netUtils_testLoadImage(uri.toString(), 1E4, callback) : module$contents$goog$labs$net$webChannel$netUtils_testPingServer(uri.toString(), 1E4, callback);
}
function module$contents$goog$labs$net$webChannel$netUtils_testLoadImage(url, timeout, callback) {
  var channelDebug = new module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug();
  channelDebug.debug("TestLoadImage: loading " + url);
  if (goog.global.Image) {
    let img = new Image();
    img.onload = goog.partial(module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback, channelDebug, "TestLoadImage: loaded", !0, callback, img);
    img.onerror = goog.partial(module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback, channelDebug, "TestLoadImage: error", !1, callback, img);
    img.onabort = goog.partial(module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback, channelDebug, "TestLoadImage: abort", !1, callback, img);
    img.ontimeout = goog.partial(module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback, channelDebug, "TestLoadImage: timeout", !1, callback, img);
    goog.global.setTimeout(function() {
      if (img.ontimeout) {
        img.ontimeout();
      }
    }, timeout);
    img.src = url;
  } else {
    callback(!1);
  }
}
function module$contents$goog$labs$net$webChannel$netUtils_testPingServer(url, timeout, callback) {
  var channelDebug = new module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug(), controller = new AbortController(), timeoutId = setTimeout(() => {
    controller.abort();
    module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback(channelDebug, "TestPingServer: timeout", !1, callback);
  }, timeout);
  fetch(url, {signal:controller.signal}).then(response => {
    clearTimeout(timeoutId);
    response.ok ? module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback(channelDebug, "TestPingServer: ok", !0, callback) : module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback(channelDebug, "TestPingServer: server error", !1, callback);
  }).catch(() => {
    clearTimeout(timeoutId);
    module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback(channelDebug, "TestPingServer: error", !1, callback);
  });
}
function module$contents$goog$labs$net$webChannel$netUtils_networkTestCallback(channelDebug, debugText, result, callback, opt_img) {
  try {
    channelDebug.debug(debugText);
    if (opt_img) {
      var img = opt_img;
      img.onload = null;
      img.onerror = null;
      img.onabort = null;
      img.ontimeout = null;
    }
    callback(result);
  } catch (e) {
    channelDebug.dumpException(e);
  }
}
/** @const */ 
goog.labs.net.webChannel.netUtils.NETWORK_TIMEOUT = 1E4;
/** @const */ 
goog.labs.net.webChannel.netUtils.testLoadImage = module$contents$goog$labs$net$webChannel$netUtils_testLoadImage;
/** @const */ 
goog.labs.net.webChannel.netUtils.testNetwork = module$contents$goog$labs$net$webChannel$netUtils_testNetwork;
/** @const */ 
goog.labs.net.webChannel.netUtils.testPingServer = module$contents$goog$labs$net$webChannel$netUtils_testPingServer;
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$WireV8_WireV8() {
  this.parser_ = new goog.json.NativeJsonProcessor();
}
module$contents$goog$labs$net$webChannel$WireV8_WireV8.prototype.encodeMessage = function(message, buffer, opt_prefix) {
  var prefix = opt_prefix || "";
  try {
    let collection = message instanceof Map ? message : Object.entries(message);
    for (let [key, value] of collection) {
      let encodedValue = value;
      goog.isObject(value) && (encodedValue = module$contents$goog$json_serialize(value));
      buffer.push(prefix + key + "=" + encodeURIComponent(encodedValue));
    }
  } catch (ex) {
    throw buffer.push(prefix + "type=" + encodeURIComponent("_badmap")), ex;
  }
};
module$contents$goog$labs$net$webChannel$WireV8_WireV8.prototype.encodeMessageQueue = function(messageQueue, count, badMapHandler) {
  for (var offset = -1;;) {
    let sb = ["count=" + count];
    offset == -1 ? count > 0 ? (offset = messageQueue[0].mapId, sb.push("ofs=" + offset)) : offset = 0 : sb.push("ofs=" + offset);
    let done = !0;
    for (let i = 0; i < count; i++) {
      let mapId = messageQueue[i].mapId, map = messageQueue[i].map;
      mapId -= offset;
      if (mapId < 0) {
        offset = Math.max(0, messageQueue[i].mapId - 100), done = !1;
      } else {
        try {
          this.encodeMessage(map, sb, "req" + mapId + "_");
        } catch (ex) {
          badMapHandler && badMapHandler(map);
        }
      }
    }
    if (done) {
      return sb.join("&");
    }
  }
};
module$contents$goog$labs$net$webChannel$WireV8_WireV8.prototype.decodeMessage = function(messageText) {
  var response = this.parser_.parse(messageText);
  goog.asserts.assert(Array.isArray(response));
  return response;
};
/** @const */ 
goog.labs.net.webChannel.WireV8 = module$contents$goog$labs$net$webChannel$WireV8_WireV8;
/** @interface */ 
goog.net.FetchXmlHttpFactoryOptions = function() {
};
/** @constructor */ 
goog.net.FetchXmlHttpFactory = function(opts) {
  this.worker_ = opts.worker || null;
  this.streamBinaryChunks_ = opts.streamBinaryChunks || !1;
  this.cacheMode_ = this.credentialsMode_ = void 0;
};
goog.inherits(goog.net.FetchXmlHttpFactory, module$contents$goog$net$XmlHttpFactory_XmlHttpFactory);
goog.net.FetchXmlHttpFactory.prototype.createInstance = function() {
  var instance = new goog.net.FetchXmlHttp(this.worker_, this.streamBinaryChunks_);
  this.credentialsMode_ && instance.setCredentialsMode(this.credentialsMode_);
  this.cacheMode_ && instance.setCacheMode(this.cacheMode_);
  return instance;
};
goog.net.FetchXmlHttpFactory.prototype.setCredentialsMode = function(credentialsMode) {
  this.credentialsMode_ = credentialsMode;
};
goog.net.FetchXmlHttpFactory.prototype.setCacheMode = function(cacheMode) {
  this.cacheMode_ = cacheMode;
};
/** @constructor */ 
goog.net.FetchXmlHttp = function(worker, streamBinaryChunks) {
  module$contents$goog$events$EventTarget_EventsEventTarget.call(this);
  this.worker_ = worker;
  this.streamBinaryChunks_ = streamBinaryChunks;
  this.cacheMode_ = this.credentialsMode_ = void 0;
  this.readyState = goog.net.FetchXmlHttp.RequestState.UNSENT;
  this.status = 0;
  this.responseURL = this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = this.responseXML = null;
  this.requestHeaders_ = new Headers();
  this.responseHeaders_ = null;
  this.method_ = "GET";
  this.url_ = "";
  this.inProgress_ = !1;
  this.logger_ = goog.log.getLogger("goog.net.FetchXmlHttp");
  this.textDecoder_ = this.currentReader_ = this.fetchResponse_ = null;
  /** @const */ 
  this.abortController_ = new AbortController();
};
goog.inherits(goog.net.FetchXmlHttp, module$contents$goog$events$EventTarget_EventsEventTarget);
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.net.FetchXmlHttp.RequestState = {UNSENT:0, OPENED:1, HEADER_RECEIVED:2, LOADING:3, DONE:4};
goog.net.FetchXmlHttp.prototype.open = function(method, url, opt_async) {
  goog.asserts.assert(!!opt_async, "Only async requests are supported.");
  if (this.readyState != goog.net.FetchXmlHttp.RequestState.UNSENT) {
    throw this.abort(), Error("Error reopening a connection");
  }
  this.method_ = method;
  this.url_ = url;
  this.readyState = goog.net.FetchXmlHttp.RequestState.OPENED;
  this.dispatchCallback_();
};
goog.net.FetchXmlHttp.prototype.send = function(opt_data) {
  if (this.readyState != goog.net.FetchXmlHttp.RequestState.OPENED) {
    throw this.abort(), Error("need to call open() first. ");
  }
  if (this.abortController_.signal.aborted) {
    throw this.abort(), Error("Request was aborted.");
  }
  this.inProgress_ = !0;
  var requestInit = {headers:this.requestHeaders_, method:this.method_, credentials:this.credentialsMode_, cache:this.cacheMode_, signal:this.abortController_.signal};
  opt_data && (requestInit.body = opt_data);
  (this.worker_ || goog.global).fetch(new Request(this.url_, requestInit)).then(this.handleResponse_.bind(this), this.handleSendFailure_.bind(this));
};
goog.net.FetchXmlHttp.prototype.abort = function() {
  this.response = this.responseText = "";
  this.requestHeaders_ = new Headers();
  this.status = 0;
  this.abortController_.abort("Request was aborted.");
  this.currentReader_ && this.currentReader_.cancel("Request was aborted.").catch(e => goog.log.warning(this.logger_, "Fetch reader cancellation error.", e));
  this.readyState >= goog.net.FetchXmlHttp.RequestState.OPENED && this.inProgress_ && this.readyState != goog.net.FetchXmlHttp.RequestState.DONE && (this.inProgress_ = !1, this.requestDone_());
  this.readyState = goog.net.FetchXmlHttp.RequestState.UNSENT;
};
goog.net.FetchXmlHttp.prototype.handleResponse_ = function(response) {
  if (this.inProgress_ && (this.fetchResponse_ = response, this.responseHeaders_ || (this.status = this.fetchResponse_.status, this.statusText = this.fetchResponse_.statusText, this.responseHeaders_ = response.headers, this.readyState = goog.net.FetchXmlHttp.RequestState.HEADER_RECEIVED, this.dispatchCallback_()), this.inProgress_ && (this.readyState = goog.net.FetchXmlHttp.RequestState.LOADING, this.dispatchCallback_(), this.inProgress_))) {
    if (this.responseType === "arraybuffer") {
      response.arrayBuffer().then(this.handleResponseArrayBuffer_.bind(this), this.handleSendFailure_.bind(this));
    } else if (typeof goog.global.ReadableStream !== "undefined" && "body" in response) {
      this.currentReader_ = response.body.getReader();
      if (this.streamBinaryChunks_) {
        if (this.responseType) {
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        }
        this.response = [];
      } else {
        this.response = this.responseText = "", this.textDecoder_ = new TextDecoder();
      }
      this.readInputFromFetch_();
    } else {
      response.text().then(this.handleResponseText_.bind(this), this.handleSendFailure_.bind(this));
    }
  }
};
goog.net.FetchXmlHttp.prototype.readInputFromFetch_ = function() {
  this.currentReader_.read().then(this.handleDataFromStream_.bind(this)).catch(this.handleSendFailure_.bind(this));
};
goog.net.FetchXmlHttp.prototype.handleDataFromStream_ = function(result) {
  if (this.inProgress_) {
    if (this.streamBinaryChunks_ && result.value) {
      this.response.push(result.value);
    } else if (!this.streamBinaryChunks_) {
      let dataPacket = result.value ? result.value : new Uint8Array(0), newText = this.textDecoder_.decode(dataPacket, {stream:!result.done});
      newText && (this.response = this.responseText += newText);
    }
    result.done ? this.requestDone_() : this.dispatchCallback_();
    this.readyState == goog.net.FetchXmlHttp.RequestState.LOADING && this.readInputFromFetch_();
  }
};
goog.net.FetchXmlHttp.prototype.handleResponseText_ = function(responseText) {
  this.inProgress_ && (this.response = this.responseText = responseText, this.requestDone_());
};
goog.net.FetchXmlHttp.prototype.handleResponseArrayBuffer_ = function(responseArrayBuffer) {
  this.inProgress_ && (this.response = responseArrayBuffer, this.requestDone_());
};
goog.net.FetchXmlHttp.prototype.handleSendFailure_ = function(error) {
  var e = error instanceof Error ? error : Error(error);
  goog.log.warning(this.logger_, "Failed to fetch url " + this.url_, e);
  this.inProgress_ && this.requestDone_();
};
goog.net.FetchXmlHttp.prototype.requestDone_ = function() {
  this.readyState = goog.net.FetchXmlHttp.RequestState.DONE;
  this.textDecoder_ = this.currentReader_ = this.fetchResponse_ = null;
  this.dispatchCallback_();
};
goog.net.FetchXmlHttp.prototype.setRequestHeader = function(header, value) {
  this.requestHeaders_.append(header, value);
};
goog.net.FetchXmlHttp.prototype.getResponseHeader = function(header) {
  return this.responseHeaders_ ? this.responseHeaders_.get(header.toLowerCase()) || "" : (goog.log.warning(this.logger_, "Attempting to get response header but no headers have been received for url: " + this.url_), "");
};
goog.net.FetchXmlHttp.prototype.getAllResponseHeaders = function() {
  if (!this.responseHeaders_) {
    return goog.log.warning(this.logger_, "Attempting to get all response headers but no headers have been received for url: " + this.url_), "";
  }
  for (var lines = [], iter = this.responseHeaders_.entries(), entry = iter.next(); !entry.done;) {
    let pair = entry.value;
    lines.push(pair[0] + ": " + pair[1]);
    entry = iter.next();
  }
  return lines.join("\r\n");
};
goog.net.FetchXmlHttp.prototype.setCredentialsMode = function(credentialsMode) {
  this.credentialsMode_ = credentialsMode;
};
goog.net.FetchXmlHttp.prototype.setCacheMode = function(cacheMode) {
  this.cacheMode_ = cacheMode;
};
goog.net.FetchXmlHttp.prototype.dispatchCallback_ = function() {
  this.onreadystatechange && this.onreadystatechange.call(this);
};
Object.defineProperty(goog.net.FetchXmlHttp.prototype, "withCredentials", {get:/**
 * @this {JSDocSerializer_placeholder_type}
 */
function() {
  return this.credentialsMode_ === "include";
}, set:/**
 * @this {JSDocSerializer_placeholder_type}
 */
function(value) {
  this.setCredentialsMode(value ? "include" : "same-origin");
}});
/** @const */ 
var module$exports$goog$net$rpc$HttpCors = {HTTP_HEADERS_PARAM_NAME:"$httpHeaders", HTTP_METHOD_PARAM_NAME:"$httpMethod", generateHttpHeadersOverwriteParam:function(headers) {
  var result = "";
  module$contents$goog$object_forEach(headers, function(value, key) {
    result += key;
    result += ":";
    result += value;
    result += "\r\n";
  });
  return result;
}, generateEncodedHttpHeadersOverwriteParam:function(headers) {
  return goog.string.urlEncode(module$exports$goog$net$rpc$HttpCors.generateHttpHeadersOverwriteParam(headers));
}, setHttpHeadersWithOverwriteParam:function(url, urlParam, extraHeaders) {
  if (module$contents$goog$object_isEmpty(extraHeaders)) {
    return url;
  }
  var httpHeaders = module$exports$goog$net$rpc$HttpCors.generateHttpHeadersOverwriteParam(extraHeaders);
  if (typeof url === "string") {
    return module$contents$goog$uri$utils_appendParam(url, goog.string.urlEncode(urlParam), httpHeaders);
  }
  url.setParameterValue(urlParam, httpHeaders);
  return url;
}};
/** @enum {!JSDocSerializer_placeholder_type} */ 
const module$contents$goog$net$HttpStatus_HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTI_STATUS:207, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, PERMANENT_REDIRECT:308, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, 
NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, UNPROCESSABLE_ENTITY:422, LOCKED:423, FAILED_DEPENDENCY:424, PRECONDITION_REQUIRED:428, TOO_MANY_REQUESTS:429, REQUEST_HEADER_FIELDS_TOO_LARGE:431, CLIENT_CLOSED_REQUEST:499, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, 
BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, INSUFFICIENT_STORAGE:507, NETWORK_AUTHENTICATION_REQUIRED:511, QUIRK_IE_NO_CONTENT:1223, isSuccess:function(status) {
  switch(status) {
    case module$contents$goog$net$HttpStatus_HttpStatus.OK:
    case module$contents$goog$net$HttpStatus_HttpStatus.CREATED:
    case module$contents$goog$net$HttpStatus_HttpStatus.ACCEPTED:
    case module$contents$goog$net$HttpStatus_HttpStatus.NO_CONTENT:
    case module$contents$goog$net$HttpStatus_HttpStatus.PARTIAL_CONTENT:
    case module$contents$goog$net$HttpStatus_HttpStatus.NOT_MODIFIED:
    case module$contents$goog$net$HttpStatus_HttpStatus.QUIRK_IE_NO_CONTENT:
      return !0;
    default:
      return !1;
  }
}};
/** @const */ 
goog.net.HttpStatus = module$contents$goog$net$HttpStatus_HttpStatus;
/** @constructor */ 
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  module$contents$goog$events$EventTarget_EventsEventTarget.call(this);
  this.headers = new Map();
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  this.active_ = !1;
  this.xhr_ = null;
  this.lastMethod_ = this.lastUri_ = "";
  this.lastErrorCode_ = module$contents$goog$net$ErrorCode_ErrorCode.NO_ERROR;
  this.lastError_ = "";
  this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.progressEventsEnabled_ = this.withCredentials_ = !1;
  this.attributionReportingOptions_ = this.trustToken_ = null;
};
goog.inherits(goog.net.XhrIo, module$contents$goog$events$EventTarget_EventsEventTarget);
/** @enum {!JSDocSerializer_placeholder_type} */ 
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
/** @const */ 
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.CONTENT_TRANSFER_ENCODING = "Content-Transfer-Encoding";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo();
  goog.net.XhrIo.sendInstances_.push(x);
  opt_callback && x.listen(module$contents$goog$net$EventType_EventType.COMPLETE, opt_callback);
  x.listenOnce(module$contents$goog$net$EventType_EventType.READY, x.cleanupSend_);
  opt_timeoutInterval && x.setTimeoutInterval(opt_timeoutInterval);
  opt_withCredentials && x.setWithCredentials(opt_withCredentials);
  x.send(url, opt_method, opt_content, opt_headers);
  return x;
};
goog.net.XhrIo.cleanup = function() {
  for (var instances = goog.net.XhrIo.sendInstances_; instances.length;) {
    instances.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  module$contents$goog$array_remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};
goog.net.XhrIo.prototype.setTrustToken = function(trustToken) {
  this.trustToken_ = trustToken;
};
goog.net.XhrIo.prototype.setAttributionReporting = function(attributionReportingOptions) {
  this.attributionReportingOptions_ = attributionReportingOptions;
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lastUri_ + "; newUri=" + url);
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = module$contents$goog$net$ErrorCode_ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.createXhr();
  this.xhr_.onreadystatechange = (0,module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext)(goog.bind(this.onReadyStateChange_, this));
  this.progressEventsEnabled_ && "onprogress" in this.xhr_ && (this.xhr_.onprogress = (0,module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext)(goog.bind(function(e) {
    this.onProgressHandler_(e, !0);
  }, this)), this.xhr_.upload && (this.xhr_.upload.onprogress = (0,module$exports$google3$javascript$common$async$context$propagate.propagateAsyncContext)(goog.bind(this.onProgressHandler_, this))));
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr")), this.inOpen_ = !0, this.xhr_.open(method, String(url), !0), this.inOpen_ = !1;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(module$contents$goog$net$ErrorCode_ErrorCode.EXCEPTION, err);
    return;
  }
  var content = opt_content || "", headers = new Map(this.headers);
  if (opt_headers) {
    if (Object.getPrototypeOf(opt_headers) === Object.prototype) {
      for (let key in opt_headers) {
        headers.set(key, opt_headers[key]);
      }
    } else if (typeof opt_headers.keys === "function" && typeof opt_headers.get === "function") {
      for (let key of opt_headers.keys()) {
        headers.set(key, opt_headers.get(key));
      }
    } else {
      throw Error("Unknown input type for opt_headers: " + String(opt_headers));
    }
  }
  var contentTypeKey = Array.from(headers.keys()).find(header => goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header)), contentIsFormData = goog.global.FormData && content instanceof goog.global.FormData;
  !module$contents$goog$array_contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) || contentTypeKey || contentIsFormData || headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  for (let [key, value] of headers) {
    this.xhr_.setRequestHeader(key, value);
  }
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  "withCredentials" in this.xhr_ && this.xhr_.withCredentials !== this.withCredentials_ && (this.xhr_.withCredentials = this.withCredentials_);
  if ("setTrustToken" in this.xhr_ && this.trustToken_) {
    try {
      this.xhr_.setTrustToken(this.trustToken_);
    } catch (err) {
      goog.log.fine(this.logger_, this.formatMsg_("Error SetTrustToken: " + err.message));
    }
  }
  if ("setAttributionReporting" in this.xhr_ && this.attributionReportingOptions_) {
    try {
      this.xhr_.setAttributionReporting(this.attributionReportingOptions_);
    } catch (err) {
      goog.log.fine(this.logger_, this.formatMsg_("Error SetAttributionReporting: " + err.message));
    }
  }
  try {
    this.cleanUpTimeoutTimer_(), this.timeoutInterval_ > 0 && (goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete")), this.timeoutId_ = setTimeout(this.timeout_.bind(this), this.timeoutInterval_)), goog.log.fine(this.logger_, this.formatMsg_("Sending request")), this.inSend_ = !0, this.xhr_.send(content), this.inSend_ = !1;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + err.message)), this.error_(module$contents$goog$net$ErrorCode_ErrorCode.EXCEPTION, err);
  }
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  typeof goog != "undefined" && this.xhr_ && (this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting", this.lastErrorCode_ = module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT, goog.log.fine(this.logger_, this.formatMsg_(this.lastError_)), this.dispatchEvent(module$contents$goog$net$EventType_EventType.TIMEOUT), this.abort(module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT));
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = !1;
  this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1);
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  this.errorDispatched_ || (this.errorDispatched_ = !0, this.dispatchEvent(module$contents$goog$net$EventType_EventType.COMPLETE), this.dispatchEvent(module$contents$goog$net$EventType_EventType.ERROR));
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  this.xhr_ && this.active_ && (goog.log.fine(this.logger_, this.formatMsg_("Aborting")), this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1, this.lastErrorCode_ = opt_failureCode || module$contents$goog$net$ErrorCode_ErrorCode.ABORT, this.dispatchEvent(module$contents$goog$net$EventType_EventType.COMPLETE), this.dispatchEvent(module$contents$goog$net$EventType_EventType.ABORT), this.cleanUpXhr_());
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1), this.cleanUpXhr_(!0));
  goog.net.XhrIo.superClass_.disposeInternal.call(this);
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (!this.isDisposed()) {
    if (this.inOpen_ || this.inSend_ || this.inAbort_) {
      this.onReadyStateChangeHelper_();
    } else {
      this.onReadyStateChangeEntryPoint_();
    }
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (this.active_ && typeof goog != "undefined") {
    if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
      setTimeout(this.onReadyStateChange_.bind(this), 0);
    } else {
      if (this.dispatchEvent(module$contents$goog$net$EventType_EventType.READY_STATE_CHANGE), this.isComplete()) {
        goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
        this.active_ = !1;
        try {
          this.isSuccess() ? (this.dispatchEvent(module$contents$goog$net$EventType_EventType.COMPLETE), this.dispatchEvent(module$contents$goog$net$EventType_EventType.SUCCESS)) : (this.lastErrorCode_ = module$contents$goog$net$ErrorCode_ErrorCode.HTTP_ERROR, this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]", this.dispatchErrors_());
        } finally {
          this.cleanUpXhr_();
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.onProgressHandler_ = function(e, opt_isDownload) {
  goog.asserts.assert(e.type === module$contents$goog$net$EventType_EventType.PROGRESS, "goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, module$contents$goog$net$EventType_EventType.PROGRESS));
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, opt_isDownload ? module$contents$goog$net$EventType_EventType.DOWNLOAD_PROGRESS : module$contents$goog$net$EventType_EventType.UPLOAD_PROGRESS));
};
goog.net.XhrIo.buildProgressEvent_ = function(e, eventType) {
  return {type:eventType, lengthComputable:e.lengthComputable, loaded:e.loaded, total:e.total};
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    let xhr = this.xhr_;
    this.xhr_ = null;
    opt_fromDispose || this.dispatchEvent(module$contents$goog$net$EventType_EventType.READY);
    try {
      xhr.onreadystatechange = null;
    } catch (e) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  this.timeoutId_ && (clearTimeout(this.timeoutId_), this.timeoutId_ = null);
};
goog.net.XhrIo.prototype.isActive = function() {
  return !!this.xhr_;
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  return module$contents$goog$net$HttpStatus_HttpStatus.isSuccess(status) || status === 0 && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = module$contents$goog$uri$utils_getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (e) {
    return -1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get status: " + e.message), "";
  }
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : "";
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get responseText: " + e.message), "";
  }
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if (!this.xhr_) {
      return null;
    }
    if ("response" in this.xhr_) {
      return this.xhr_.response;
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
    }
    goog.log.error(this.logger_, "Response type " + this.responseType_ + " is not supported on this browser");
    return null;
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get response: " + e.message), null;
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  if (this.xhr_ && this.isComplete()) {
    var value = this.xhr_.getResponseHeader(key);
    return value === null ? void 0 : value;
  }
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.getReadyState() >= goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.getAllResponseHeaders() || "" : "";
};
goog.net.XhrIo.prototype.getResponseHeaders = function() {
  var headersObject = {}, headersArray = this.getAllResponseHeaders().split("\r\n");
  for (let i = 0; i < headersArray.length; i++) {
    if (goog.string.isEmptyOrWhitespace(headersArray[i])) {
      continue;
    }
    let keyValue = goog.string.splitLimit(headersArray[i], ":", 1), key = keyValue[0], value = keyValue[1];
    if (typeof value !== "string") {
      continue;
    }
    value = value.trim();
    let values = headersObject[key] || [];
    headersObject[key] = values;
    values.push(value);
  }
  return module$contents$goog$object_map(headersObject, function(values) {
    return values.join(", ");
  });
};
goog.net.XhrIo.prototype.getStreamingResponseHeader = function(key) {
  return this.xhr_ ? this.xhr_.getResponseHeader(key) : null;
};
goog.net.XhrIo.prototype.getLastError = function() {
  return typeof this.lastError_ === "string" ? this.lastError_ : String(this.lastError_);
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
function module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam(paramName, defaultValue, options) {
  return options && options.internalChannelParams ? options.internalChannelParams[paramName] || defaultValue : defaultValue;
}
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase(opt_options, opt_clientVersion) {
  /** @const */ 
  this.clientVersion_ = opt_clientVersion || 0;
  this.serverVersion_ = 0;
  this.outgoingMaps_ = [];
  this.channelDebug_ = new module$contents$goog$labs$net$webChannel$WebChannelDebug_WebChannelDebug();
  this.hostPrefix_ = this.backChannelUri_ = this.forwardChannelUri_ = this.path_ = this.backChannelRequest_ = this.httpSessionId_ = this.httpSessionIdParam_ = this.extraParams_ = this.httpHeadersOverwriteParam_ = this.initHeaders_ = this.extraHeaders_ = null;
  this.allowHostPrefix_ = !0;
  this.nextMapId_ = this.nextRid_ = 0;
  this.failFast_ = module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam("failFast", !1, opt_options);
  this.enableStreaming_ = this.deadBackChannelTimerId_ = this.backChannelTimerId_ = this.forwardChannelTimerId_ = this.handler_ = null;
  this.allowStreamingMode_ = !0;
  this.errorResponseStatusCode_ = this.lastPostResponseArrayId_ = this.lastArrayId_ = -1;
  this.backChannelAttemptId_ = this.backChannelRetryCount_ = this.forwardChannelRetryCount_ = 0;
  this.baseRetryDelayMs_ = module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam("baseRetryDelayMs", 5E3, opt_options);
  this.retryDelaySeedMs_ = module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam("retryDelaySeedMs", 1E4, opt_options);
  this.forwardChannelMaxRetries_ = module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam("forwardChannelMaxRetries", 2, opt_options);
  this.forwardChannelRequestTimeoutMs_ = module$contents$goog$labs$net$webChannel$WebChannelBase_getInternalChannelParam("forwardChannelRequestTimeoutMs", 2E4, opt_options);
  /** @const */ 
  this.xmlHttpFactory_ = opt_options && opt_options.xmlHttpFactory || void 0;
  /** @const */ 
  this.networkTestUrl_ = opt_options && opt_options.networkTestUrl || void 0;
  /** @const */ 
  this.usesFetchStreams_ = opt_options && opt_options.useFetchStreams || !1;
  this.backChannelRequestTimeoutMs_ = void 0;
  this.readyStateChangeThrottleMs_ = 0;
  this.supportsCrossDomainXhrs_ = opt_options && opt_options.supportsCrossDomainXhr || !1;
  this.sid_ = "";
  /** @const */ 
  this.forwardChannelRequestPool_ = new module$contents$goog$labs$net$webChannel$ForwardChannelRequestPool_ForwardChannelRequestPool(opt_options && opt_options.concurrentRequestLimit);
  /** @const */ 
  this.maxMapsPerRequest_ = Math.min(opt_options && opt_options.maxMessagesPerRequest || 1E3, 1E3);
  /** @const */ 
  this.wireCodec_ = new module$contents$goog$labs$net$webChannel$WireV8_WireV8();
  /** @const */ 
  this.fastHandshake_ = opt_options && opt_options.fastHandshake || !1;
  this.encodeInitMessageHeaders_ = opt_options && opt_options.encodeInitMessageHeaders || !1;
  this.fastHandshake_ && this.encodeInitMessageHeaders_ && (this.channelDebug_.warning("Ignore encodeInitMessageHeaders because fastHandshake is set."), this.encodeInitMessageHeaders_ = !1);
  /** @const */ 
  this.blockingHandshake_ = opt_options && opt_options.blockingHandshake || !1;
  opt_options && opt_options.disableRedact && this.channelDebug_.disableRedact();
  opt_options && opt_options.forceLongPolling && (this.allowStreamingMode_ = !1);
  /** @const */ 
  this.detectBufferingProxy_ = !this.fastHandshake_ && this.allowStreamingMode_ && opt_options && opt_options.detectBufferingProxy || !1;
  this.longPollingTimeout_ = void 0;
  opt_options && opt_options.longPollingTimeout && opt_options.longPollingTimeout > 0 && (this.longPollingTimeout_ = opt_options.longPollingTimeout);
  this.forwardChannelFlushedCallback_ = void 0;
  this.handshakeRttMs_ = 0;
  this.bpDetectionDone_ = !1;
  this.bpDetectionTimerId_ = null;
  /** @const */ 
  this.enableOriginTrials_ = !1;
  this.nonAckedMapsAtChannelClose_ = null;
}
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.channelVersion_ = module$contents$goog$labs$net$webChannel$Wire_Wire.LATEST_CHANNEL_VERSION;
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State = {CLOSED:0, INIT:1, OPENING:2, OPENED:3};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.state_ = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.INIT;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.BACK_CHANNEL_MAX_RETRIES = 3;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.RTT_ESTIMATE = 3E3;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.INACTIVE_CHANNEL_RETRY_FACTOR = 2;
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error = {OK:0, REQUEST_FAILED:2, LOGGED_OUT:4, NO_DATA:5, UNKNOWN_SESSION_ID:6, STOP:7, NETWORK:8, BAD_DATA:10, BAD_RESPONSE:11};
/** @enum {!JSDocSerializer_placeholder_type} */ 
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_ = {FORWARD_CHANNEL:1, BACK_CHANNEL:2};
/** @const */ 
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.MAX_CHARS_PER_GET_ = 4096;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF = 37500;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.connect = function(channelPath, opt_extraParams, opt_oldSessionId, opt_oldArrayId) {
  this.channelDebug_.debug("connect()");
  this.startOriginTrials_(channelPath);
  module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.CONNECT_ATTEMPT);
  this.path_ = channelPath;
  this.extraParams_ = opt_extraParams || {};
  opt_oldSessionId && opt_oldArrayId !== void 0 && (this.extraParams_.OSID = opt_oldSessionId, this.extraParams_.OAID = opt_oldArrayId);
  this.enableStreaming_ = this.allowStreamingMode_;
  this.connectChannel_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.disconnect = function() {
  this.channelDebug_.debug("disconnect()");
  this.cancelRequests_();
  if (this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED) {
    let rid = this.nextRid_++, uri = this.forwardChannelUri_.clone();
    uri.setParameterValue("SID", this.sid_);
    uri.setParameterValue("RID", rid);
    uri.setParameterValue("TYPE", "terminate");
    this.addAdditionalParams_(uri);
    let request = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.createChannelRequest(this, this.channelDebug_, this.sid_, rid);
    request.sendCloseRequest(uri);
  }
  this.onClose_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.connectChannel_ = function() {
  this.channelDebug_.debug("connectChannel_()");
  this.ensureInState_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.INIT, module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED);
  this.forwardChannelUri_ = this.getForwardChannelUri(this.path_);
  this.ensureForwardChannel_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.startOriginTrials_ = function(channelPath) {
  this.enableOriginTrials_ && (this.channelDebug_.info("Origin Trials enabled."), module$contents$goog$async$run_run(goog.bind(this.runOriginTrials_, this, channelPath)));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.runOriginTrials_ = function(channelPath) {
  try {
    goog.labs.net.webChannel.environment.startOriginTrials(channelPath, e => {
      this.channelDebug_.dumpException(e, "Error in running origin trials");
    }), this.channelDebug_.info("Origin Trials invoked: " + channelPath);
  } catch (e) {
    this.channelDebug_.dumpException(e, "Error in running origin trials");
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.cancelBackChannelRequest_ = function() {
  this.backChannelRequest_ && (this.clearBpDetectionTimer_(), this.backChannelRequest_.cancel(), this.backChannelRequest_ = null);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.cancelRequests_ = function() {
  this.cancelBackChannelRequest_();
  this.backChannelTimerId_ && (goog.global.clearTimeout(this.backChannelTimerId_), this.backChannelTimerId_ = null);
  this.clearDeadBackchannelTimer_();
  this.forwardChannelRequestPool_.cancel();
  this.forwardChannelTimerId_ && this.clearForwardChannelTimer_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.clearForwardChannelTimer_ = function() {
  typeof this.forwardChannelTimerId_ === "number" && goog.global.clearTimeout(this.forwardChannelTimerId_);
  this.forwardChannelTimerId_ = null;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setInitHeaders = function(initHeaders) {
  this.initHeaders_ = initHeaders;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setHttpHeadersOverwriteParam = function(httpHeadersOverwriteParam) {
  this.httpHeadersOverwriteParam_ = httpHeadersOverwriteParam;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setHttpSessionIdParam = function(httpSessionIdParam) {
  this.httpSessionIdParam_ = httpSessionIdParam;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setHttpSessionId = function(httpSessionId) {
  this.httpSessionId_ = httpSessionId;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getHttpSessionId = function() {
  return this.httpSessionId_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setReadyStateChangeThrottle = function(throttle) {
  this.readyStateChangeThrottleMs_ = throttle;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setSupportsCrossDomainXhrs = function(supportCrossDomain) {
  this.supportsCrossDomainXhrs_ = supportCrossDomain;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setHandler = function(handler) {
  this.handler_ = handler;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.isBuffered = function() {
  return !this.enableStreaming_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.sendMap = function(map, opt_context) {
  goog.asserts.assert(this.state_ != module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED, "Invalid operation: sending map when state is closed");
  this.outgoingMaps_.length == this.maxMapsPerRequest_ && this.channelDebug_.severe(() => "Already have " + this.maxMapsPerRequest_ + " queued maps upon queueing " + module$contents$goog$json_serialize(map));
  this.outgoingMaps_.push(new module$contents$goog$labs$net$webChannel$Wire_Wire.QueuedMap(this.nextMapId_++, map, opt_context));
  this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED && this.ensureForwardChannel_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getForwardChannelMaxRetries = function() {
  return this.failFast_ ? 0 : this.forwardChannelMaxRetries_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getBackChannelMaxRetries = function() {
  return module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.BACK_CHANNEL_MAX_RETRIES;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.isClosed = function() {
  return this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getState = function() {
  return this.state_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getLastStatusCode = function() {
  return this.errorResponseStatusCode_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.ensureForwardChannel_ = function() {
  this.forwardChannelRequestPool_.isFull() || this.forwardChannelTimerId_ || (this.forwardChannelTimerId_ = !0, module$contents$goog$async$run_run(this.onStartForwardChannelTimer_, this), this.forwardChannelRetryCount_ = 0);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.maybeRetryForwardChannel_ = function(request) {
  if (this.forwardChannelRequestPool_.getRequestCount() >= this.forwardChannelRequestPool_.maxSize_ - (this.forwardChannelTimerId_ ? 1 : 0)) {
    return this.channelDebug_.severe("Unexpected retry request is scheduled."), !1;
  }
  if (this.forwardChannelTimerId_) {
    return this.channelDebug_.debug("Use the retry request that is already scheduled."), this.outgoingMaps_ = request.getPendingMessages().concat(this.outgoingMaps_), !0;
  }
  if (this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.INIT || this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENING || this.forwardChannelRetryCount_ >= this.getForwardChannelMaxRetries()) {
    return !1;
  }
  this.channelDebug_.debug("Going to retry POST");
  this.forwardChannelTimerId_ = module$contents$goog$labs$net$webChannel$requestStats_setTimeout(goog.bind(this.onStartForwardChannelTimer_, this, request), this.getRetryTime_(this.forwardChannelRetryCount_));
  this.forwardChannelRetryCount_++;
  return !0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onStartForwardChannelTimer_ = function(opt_retryRequest) {
  this.forwardChannelTimerId_ && (this.forwardChannelTimerId_ = null, this.startForwardChannel_(opt_retryRequest));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.startForwardChannel_ = function(opt_retryRequest) {
  this.channelDebug_.debug("startForwardChannel_");
  this.okToMakeRequest_() && (this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.INIT ? opt_retryRequest ? this.channelDebug_.severe("Not supposed to retry the open") : (this.open_(), this.state_ = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENING) : this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED && (opt_retryRequest ? this.makeForwardChannelRequest_(opt_retryRequest) : 
  this.outgoingMaps_.length == 0 ? this.channelDebug_.debug("startForwardChannel_ returned: nothing to send") : this.forwardChannelRequestPool_.isFull() ? this.channelDebug_.severe("startForwardChannel_ returned: connection already in progress") : (this.makeForwardChannelRequest_(), this.channelDebug_.debug("startForwardChannel_ finished, sent request"))));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.open_ = function() {
  this.channelDebug_.debug("open_()");
  this.nextRid_ = Math.floor(Math.random() * 1E5);
  var rid = this.nextRid_++, request = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.createChannelRequest(this, this.channelDebug_, "", rid), extraHeaders = this.extraHeaders_;
  this.initHeaders_ && (extraHeaders ? (extraHeaders = module$contents$goog$object_clone(extraHeaders), module$contents$goog$object_extend(extraHeaders, this.initHeaders_)) : extraHeaders = this.initHeaders_);
  this.httpHeadersOverwriteParam_ !== null || this.encodeInitMessageHeaders_ || (request.setExtraHeaders(extraHeaders), extraHeaders = null);
  var requestText = this.dequeueOutgoingMaps_(request, this.fastHandshake_ ? this.getMaxNumMessagesForFastHandshake_() : this.maxMapsPerRequest_), uri = this.forwardChannelUri_.clone();
  uri.setParameterValue("RID", rid);
  this.clientVersion_ > 0 && uri.setParameterValue("CVER", this.clientVersion_);
  this.httpSessionIdParam_ && uri.setParameterValue(module$contents$goog$net$WebChannel_WebChannel.X_HTTP_SESSION_ID, this.httpSessionIdParam_);
  this.addAdditionalParams_(uri);
  if (extraHeaders) {
    if (this.encodeInitMessageHeaders_) {
      let encodedHeaders = (0,module$exports$goog$net$rpc$HttpCors.generateEncodedHttpHeadersOverwriteParam)(extraHeaders);
      requestText = "headers=" + encodedHeaders + "&" + requestText;
    } else {
      this.httpHeadersOverwriteParam_ && (0,module$exports$goog$net$rpc$HttpCors.setHttpHeadersWithOverwriteParam)(uri, this.httpHeadersOverwriteParam_, extraHeaders);
    }
  }
  this.forwardChannelRequestPool_.addRequest(request);
  this.blockingHandshake_ && uri.setParameterValue("TYPE", "init");
  this.fastHandshake_ ? (uri.setParameterValue("$req", requestText), uri.setParameterValue("SID", "null"), request.setDecodeInitialResponse(), request.xmlHttpPost(uri, null, !0)) : request.xmlHttpPost(uri, requestText, !0);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getMaxNumMessagesForFastHandshake_ = function() {
  var total = 0;
  for (let i = 0; i < this.outgoingMaps_.length; i++) {
    let map = this.outgoingMaps_[i], size = map.getRawDataSize();
    if (size === void 0) {
      break;
    }
    total += size;
    if (total > module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.MAX_CHARS_PER_GET_) {
      return i;
    }
    if (total === module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.MAX_CHARS_PER_GET_ || i === this.outgoingMaps_.length - 1) {
      return i + 1;
    }
  }
  return this.maxMapsPerRequest_;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.makeForwardChannelRequest_ = function(opt_retryRequest) {
  var rid = opt_retryRequest ? opt_retryRequest.rid_ : this.nextRid_++;
  var uri = this.forwardChannelUri_.clone();
  uri.setParameterValue("SID", this.sid_);
  uri.setParameterValue("RID", rid);
  uri.setParameterValue("AID", this.lastArrayId_);
  this.addAdditionalParams_(uri);
  this.httpHeadersOverwriteParam_ && this.extraHeaders_ && (0,module$exports$goog$net$rpc$HttpCors.setHttpHeadersWithOverwriteParam)(uri, this.httpHeadersOverwriteParam_, this.extraHeaders_);
  var request = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.createChannelRequest(this, this.channelDebug_, this.sid_, rid, this.forwardChannelRetryCount_ + 1);
  this.httpHeadersOverwriteParam_ === null && request.setExtraHeaders(this.extraHeaders_);
  opt_retryRequest && this.requeuePendingMaps_(opt_retryRequest);
  var requestText = this.dequeueOutgoingMaps_(request, this.maxMapsPerRequest_);
  request.setTimeout(Math.round(this.forwardChannelRequestTimeoutMs_ * .5) + Math.round(this.forwardChannelRequestTimeoutMs_ * .5 * Math.random()));
  this.forwardChannelRequestPool_.addRequest(request);
  request.xmlHttpPost(uri, requestText, !0);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.addAdditionalParams_ = function(uri) {
  this.extraParams_ && module$contents$goog$object_forEach(this.extraParams_, function(value, key) {
    uri.setParameterValue(key, value);
  });
  if (this.handler_) {
    let params = {};
    module$contents$goog$object_forEach(params, function(value, key) {
      uri.setParameterValue(key, value);
    });
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.dequeueOutgoingMaps_ = function(request, maxNum) {
  var count = Math.min(this.outgoingMaps_.length, maxNum), badMapHandler = this.handler_ ? goog.bind(this.handler_.badMapError, this.handler_, this) : null, result = this.wireCodec_.encodeMessageQueue(this.outgoingMaps_, count, badMapHandler);
  request.setPendingMessages(this.outgoingMaps_.splice(0, count));
  return result;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.requeuePendingMaps_ = function(retryRequest) {
  this.outgoingMaps_ = retryRequest.getPendingMessages().concat(this.outgoingMaps_);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.ensureBackChannel_ = function() {
  this.backChannelRequest_ || this.backChannelTimerId_ || (this.backChannelAttemptId_ = 1, module$contents$goog$async$run_run(this.onStartBackChannelTimer_, this), this.backChannelRetryCount_ = 0);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.maybeRetryBackChannel_ = function() {
  if (this.backChannelRequest_ || this.backChannelTimerId_) {
    return this.channelDebug_.severe("Request already in progress"), !1;
  }
  if (this.backChannelRetryCount_ >= this.getBackChannelMaxRetries()) {
    return !1;
  }
  this.channelDebug_.debug("Going to retry GET");
  this.backChannelAttemptId_++;
  this.backChannelTimerId_ = module$contents$goog$labs$net$webChannel$requestStats_setTimeout(goog.bind(this.onStartBackChannelTimer_, this), this.getRetryTime_(this.backChannelRetryCount_));
  this.backChannelRetryCount_++;
  return !0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onStartBackChannelTimer_ = function() {
  this.backChannelTimerId_ = null;
  this.startBackChannel_();
  if (this.detectBufferingProxy_ && !this.bpDetectionDone_) {
    if (this.backChannelRequest_ == null || this.handshakeRttMs_ <= 0) {
      this.channelDebug_.warning("Skip bpDetectionTimerId_ " + this.backChannelRequest_ + " " + this.handshakeRttMs_);
    } else {
      var bpDetectionTimeout = 4 * this.handshakeRttMs_;
      this.channelDebug_.info("BP detection timer enabled: " + bpDetectionTimeout);
      this.bpDetectionTimerId_ = module$contents$goog$labs$net$webChannel$requestStats_setTimeout(goog.bind(this.onBpDetectionTimer_, this), bpDetectionTimeout);
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onBpDetectionTimer_ = function() {
  if (this.bpDetectionTimerId_) {
    this.bpDetectionTimerId_ = null;
    this.channelDebug_.info("BP detection timeout reached.");
    goog.asserts.assert(this.backChannelRequest_ != null, "Invalid state: no backchannel request");
    if (this.backChannelRequest_.xmlHttp_ != null) {
      let responseData = this.backChannelRequest_.xmlHttp_.getResponseText();
      responseData && this.channelDebug_.warning("Timer should have been cancelled : " + responseData);
    }
    this.channelDebug_.info("Buffering proxy detected and switch to long-polling!");
    this.enableStreaming_ = !1;
    this.bpDetectionDone_ = !0;
    module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.PROXY);
    this.cancelBackChannelRequest_();
    this.startBackChannel_();
  } else {
    this.channelDebug_.warning("Invalid operation.");
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.clearBpDetectionTimer_ = function() {
  this.bpDetectionTimerId_ != null && (this.channelDebug_.debug("Cancel the BP detection timer."), goog.global.clearTimeout(this.bpDetectionTimerId_), this.bpDetectionTimerId_ = null);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.startBackChannel_ = function() {
  if (this.okToMakeRequest_()) {
    this.channelDebug_.debug("Creating new HttpRequest");
    this.backChannelRequest_ = module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.createChannelRequest(this, this.channelDebug_, this.sid_, "rpc", this.backChannelAttemptId_);
    this.httpHeadersOverwriteParam_ === null && this.backChannelRequest_.setExtraHeaders(this.extraHeaders_);
    this.backChannelRequest_.setReadyStateChangeThrottle(this.readyStateChangeThrottleMs_);
    var uri = this.backChannelUri_.clone();
    uri.setParameterValue("RID", "rpc");
    uri.setParameterValue("SID", this.sid_);
    uri.setParameterValue("AID", this.lastArrayId_);
    uri.setParameterValue("CI", this.enableStreaming_ ? "0" : "1");
    !this.enableStreaming_ && this.longPollingTimeout_ && uri.setParameterValue("TO", this.longPollingTimeout_);
    uri.setParameterValue("TYPE", "xmlhttp");
    this.addAdditionalParams_(uri);
    this.httpHeadersOverwriteParam_ && this.extraHeaders_ && (0,module$exports$goog$net$rpc$HttpCors.setHttpHeadersWithOverwriteParam)(uri, this.httpHeadersOverwriteParam_, this.extraHeaders_);
    this.backChannelRequestTimeoutMs_ && this.backChannelRequest_.setTimeout(this.backChannelRequestTimeoutMs_);
    this.backChannelRequest_.xmlHttpGet(uri, !0, this.hostPrefix_);
    this.channelDebug_.debug("New Request created");
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.okToMakeRequest_ = function() {
  if (this.handler_) {
    let result = this.handler_.okToMakeRequest(this);
    if (result != module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.OK) {
      return this.channelDebug_.debug("Handler returned error code from okToMakeRequest"), this.signalError_(result), !1;
    }
  }
  return !0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onFirstByteReceived = function(request, responseText) {
  this.backChannelRequest_ == request && this.detectBufferingProxy_ && !this.bpDetectionDone_ && (this.channelDebug_.info("Great, no buffering proxy detected. Bytes received: " + responseText.length), goog.asserts.assert(this.bpDetectionTimerId_, "Timer should not have been cancelled."), this.clearBpDetectionTimer_(), this.bpDetectionDone_ = !0, module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.NOPROXY));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onRequestData = function(request, responseText) {
  if (this.state_ != module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED && (this.backChannelRequest_ == request || this.forwardChannelRequestPool_.hasRequest(request))) {
    if (!request.initialResponseDecoded_ && this.forwardChannelRequestPool_.hasRequest(request) && this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED) {
      let response;
      try {
        response = this.wireCodec_.decodeMessage(responseText);
      } catch (ex) {
        response = null;
      }
      Array.isArray(response) && response.length == 3 ? (this.handlePostResponse_(response, request), this.onForwardChannelFlushed_()) : (this.channelDebug_.debug("Bad POST response data returned"), this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.BAD_RESPONSE));
    } else {
      if ((request.initialResponseDecoded_ || this.backChannelRequest_ == request) && this.clearDeadBackchannelTimer_(), !goog.string.isEmptyOrWhitespace(responseText)) {
        let response = this.wireCodec_.decodeMessage(responseText);
        this.onInput_(response, request);
      }
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onForwardChannelFlushed_ = function() {
  if (this.forwardChannelRequestPool_.getRequestCount() <= 1 && this.forwardChannelFlushedCallback_) {
    try {
      this.forwardChannelFlushedCallback_();
    } catch (ex) {
      this.channelDebug_.dumpException(ex, "Exception from forwardChannelFlushedCallback_ ");
    }
    this.forwardChannelFlushedCallback_ = void 0;
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.handlePostResponse_ = function(responseValues, forwardReq) {
  if (responseValues[0] == 0) {
    this.handleBackchannelMissing_(forwardReq);
  } else {
    this.lastPostResponseArrayId_ = responseValues[1];
    var outstandingArrays = this.lastPostResponseArrayId_ - this.lastArrayId_;
    if (0 < outstandingArrays) {
      let numOutstandingBackchannelBytes = responseValues[2];
      this.channelDebug_.debug(numOutstandingBackchannelBytes + " bytes (in " + outstandingArrays + " arrays) are outstanding on the BackChannel");
      this.shouldRetryBackChannel_(numOutstandingBackchannelBytes) && !this.deadBackChannelTimerId_ && (this.deadBackChannelTimerId_ = module$contents$goog$labs$net$webChannel$requestStats_setTimeout(goog.bind(this.onBackChannelDead_, this), 2 * module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.RTT_ESTIMATE));
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.handleBackchannelMissing_ = function(forwardReq) {
  this.channelDebug_.debug("Server claims our backchannel is missing.");
  if (this.backChannelTimerId_) {
    this.channelDebug_.debug("But we are currently starting the request.");
  } else {
    if (this.backChannelRequest_) {
      if (this.backChannelRequest_.requestStartTime_ + module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.RTT_ESTIMATE < forwardReq.requestStartTime_) {
        this.clearDeadBackchannelTimer_(), this.cancelBackChannelRequest_();
      } else {
        return;
      }
    } else {
      this.channelDebug_.warning("We do not have a BackChannel established");
    }
    this.maybeRetryBackChannel_();
    module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.BACKCHANNEL_MISSING);
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.shouldRetryBackChannel_ = function(outstandingBytes) {
  return outstandingBytes < module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF && !this.isBuffered() && this.backChannelRetryCount_ == 0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.correctHostPrefix = function(serverHostPrefix) {
  return this.allowHostPrefix_ ? this.handler_ ? this.handler_.correctHostPrefix(serverHostPrefix) : serverHostPrefix : null;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onBackChannelDead_ = function() {
  this.deadBackChannelTimerId_ != null && (this.deadBackChannelTimerId_ = null, this.cancelBackChannelRequest_(), this.maybeRetryBackChannel_(), module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.BACKCHANNEL_DEAD));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.clearDeadBackchannelTimer_ = function() {
  this.deadBackChannelTimerId_ != null && (goog.global.clearTimeout(this.deadBackChannelTimerId_), this.deadBackChannelTimerId_ = null);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.isFatalError_ = function(error, statusCode) {
  return error == module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.UNKNOWN_SESSION_ID || error == module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.STATUS && statusCode > 0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onRequestComplete = function(request) {
  this.channelDebug_.debug("Request complete");
  var pendingMessages = null;
  if (this.backChannelRequest_ == request) {
    this.clearDeadBackchannelTimer_();
    this.clearBpDetectionTimer_();
    this.backChannelRequest_ = null;
    var type = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_.BACK_CHANNEL;
  } else if (this.forwardChannelRequestPool_.hasRequest(request)) {
    pendingMessages = request.getPendingMessages(), this.forwardChannelRequestPool_.removeRequest(request), type = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_.FORWARD_CHANNEL;
  } else {
    return;
  }
  if (this.state_ != module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED) {
    if (request.successful_) {
      if (type == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_.FORWARD_CHANNEL) {
        let size = request.postData_ ? request.postData_.length : 0;
        module$contents$goog$labs$net$webChannel$requestStats_notifyTimingEvent(size, Date.now() - request.requestStartTime_, this.forwardChannelRetryCount_);
        this.ensureForwardChannel_();
      } else {
        this.ensureBackChannel_();
      }
    } else {
      var lastStatusCode = request.getLastStatusCode(), lastError = request.getLastError();
      if (module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.isFatalError_(lastError, lastStatusCode)) {
        this.channelDebug_.debug("Not retrying due to error type"), lastStatusCode > 200 && (this.errorResponseStatusCode_ = request.getLastStatusCode());
      } else {
        let self = this;
        this.channelDebug_.debug(function() {
          return "Maybe retrying, last error: " + module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.errorStringFromCode(lastError, self.errorResponseStatusCode_);
        });
        if (type == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_.FORWARD_CHANNEL && this.maybeRetryForwardChannel_(request) || type == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.ChannelType_.BACK_CHANNEL && this.maybeRetryBackChannel_()) {
          return;
        }
        this.channelDebug_.debug("Exceeded max number of retries");
      }
      pendingMessages && pendingMessages.length > 0 && this.forwardChannelRequestPool_.addPendingMessages(pendingMessages);
      this.channelDebug_.debug("Error: HTTP request failed");
      switch(lastError) {
        case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.NO_DATA:
          this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.NO_DATA);
          break;
        case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.BAD_DATA:
          this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.BAD_DATA);
          break;
        case module$contents$goog$labs$net$webChannel$ChannelRequest_ChannelRequest.Error.UNKNOWN_SESSION_ID:
          this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.UNKNOWN_SESSION_ID);
          break;
        default:
          this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.REQUEST_FAILED);
      }
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getRetryTime_ = function(retryCount) {
  var retryTime = this.baseRetryDelayMs_ + Math.floor(Math.random() * this.retryDelaySeedMs_);
  this.isActive() || (this.channelDebug_.debug("Inactive channel"), retryTime *= module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.INACTIVE_CHANNEL_RETRY_FACTOR);
  return retryTime *= retryCount;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.applyControlHeaders_ = function(request) {
  var xhr = request.xmlHttp_;
  if (xhr) {
    let clientProtocol = xhr.getStreamingResponseHeader(module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_WIRE_PROTOCOL);
    clientProtocol && this.forwardChannelRequestPool_.applyClientProtocol(clientProtocol);
    if (this.httpSessionIdParam_) {
      let httpSessionIdHeader = xhr.getStreamingResponseHeader(module$contents$goog$net$WebChannel_WebChannel.X_HTTP_SESSION_ID);
      if (httpSessionIdHeader) {
        this.setHttpSessionId(httpSessionIdHeader);
        let httpSessionIdParam = this.httpSessionIdParam_;
        this.forwardChannelUri_.setParameterValue(httpSessionIdParam, httpSessionIdHeader);
      } else {
        this.channelDebug_.warning("Missing X_HTTP_SESSION_ID in the handshake response");
      }
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onInput_ = function(respArray, request) {
  var batch = this.handler_ && this.handler_.channelHandleMultipleArrays ? [] : null;
  for (let i = 0; i < respArray.length; i++) {
    let nextArray = respArray[i], incomingArrayId = nextArray[0];
    if (incomingArrayId <= this.lastArrayId_) {
      this.channelDebug_.warning("Ignoring out-of-order or duplicate message with arrayId: " + incomingArrayId + ", lastArrayId: " + this.lastArrayId_);
    } else if (incomingArrayId > this.lastArrayId_ + 1 && this.lastArrayId_ > -1 && this.channelDebug_.warning("Received non-consecutive message with arrayId: " + incomingArrayId + ", lastArrayId: " + this.lastArrayId_), this.lastArrayId_ = incomingArrayId, nextArray = nextArray[1], this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENING) {
      if (nextArray[0] == "c") {
        this.sid_ = nextArray[1];
        this.hostPrefix_ = this.correctHostPrefix(nextArray[2]);
        let negotiatedVersion = nextArray[3];
        negotiatedVersion != null && (this.channelVersion_ = negotiatedVersion, this.channelDebug_.info("VER=" + this.channelVersion_));
        let negotiatedServerVersion = nextArray[4];
        negotiatedServerVersion != null && (this.serverVersion_ = negotiatedServerVersion, this.channelDebug_.info("SVER=" + this.serverVersion_));
        let serverKeepaliveMs = nextArray[5];
        if (serverKeepaliveMs != null && typeof serverKeepaliveMs === "number" && serverKeepaliveMs > 0) {
          let timeout = 1.5 * serverKeepaliveMs;
          this.backChannelRequestTimeoutMs_ = timeout;
          this.channelDebug_.info("backChannelRequestTimeoutMs_=" + timeout);
        }
        this.applyControlHeaders_(request);
        this.state_ = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED;
        this.handler_ && this.handler_.channelOpened(this);
        this.detectBufferingProxy_ && (this.handshakeRttMs_ = Date.now() - request.requestStartTime_, this.channelDebug_.info("Handshake RTT: " + this.handshakeRttMs_ + "ms"));
        this.startBackchannelAfterHandshake_(request);
        this.outgoingMaps_.length > 0 && this.ensureForwardChannel_();
      } else {
        nextArray[0] != "stop" && nextArray[0] != "close" || this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.STOP);
      }
    } else {
      this.state_ == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.OPENED && (nextArray[0] == "stop" || nextArray[0] == "close" ? (batch && batch.length !== 0 && (this.handler_.channelHandleMultipleArrays(this, batch), batch.length = 0), nextArray[0] == "stop" ? this.signalError_(module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.STOP) : this.disconnect()) : nextArray[0] != "noop" && (batch ? batch.push(nextArray) : this.handler_ && this.handler_.channelHandleArray(this, 
      nextArray)), this.backChannelRetryCount_ = 0);
    }
  }
  batch && batch.length !== 0 && this.handler_.channelHandleMultipleArrays(this, batch);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.startBackchannelAfterHandshake_ = function(request) {
  this.backChannelUri_ = this.getBackChannelUri(this.hostPrefix_, this.path_);
  request.initialResponseDecoded_ ? (this.channelDebug_.debug("Upgrade the handshake request to a backchannel."), this.forwardChannelRequestPool_.removeRequest(request), request.resetTimeout(this.backChannelRequestTimeoutMs_), this.backChannelRequest_ = request) : this.ensureBackChannel_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.ensureInState_ = function(var_args) {
  goog.asserts.assert(module$contents$goog$array_contains(arguments, this.state_), "Unexpected channel state: %s", this.state_);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.signalError_ = function(error) {
  this.channelDebug_.info("Error code " + error);
  error == module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.REQUEST_FAILED ? module$contents$goog$labs$net$webChannel$netUtils_testNetwork(goog.bind(this.testNetworkCallback_, this), this.networkTestUrl_) : module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.ERROR_OTHER);
  this.onError_(error);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.testNetworkCallback_ = function(networkUp) {
  networkUp ? (this.channelDebug_.info("Successfully pinged google.com"), module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.ERROR_OTHER)) : (this.channelDebug_.info("Failed to ping google.com"), module$contents$goog$labs$net$webChannel$requestStats_notifyStatEvent(module$contents$goog$labs$net$webChannel$requestStats_Stat.ERROR_NETWORK));
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onError_ = function(error) {
  this.channelDebug_.debug("HttpChannel: error - " + error);
  this.state_ = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED;
  this.handler_ && this.handler_.channelError(this, error);
  this.onClose_();
  this.cancelRequests_();
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.onClose_ = function() {
  this.state_ = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.State.CLOSED;
  this.nonAckedMapsAtChannelClose_ = [];
  if (this.handler_) {
    let pendingMessages = this.forwardChannelRequestPool_.getPendingMessages();
    if (pendingMessages.length == 0 && this.outgoingMaps_.length == 0) {
      this.handler_.channelClosed(this);
    } else {
      this.channelDebug_.debug(() => "Number of undelivered maps, pending: " + pendingMessages.length + ", outgoing: " + this.outgoingMaps_.length);
      module$contents$goog$array_extend(this.nonAckedMapsAtChannelClose_, pendingMessages);
      module$contents$goog$array_extend(this.nonAckedMapsAtChannelClose_, this.outgoingMaps_);
      this.forwardChannelRequestPool_.clearPendingMessages();
      let copyOfUndeliveredMaps = module$contents$goog$array_toArray(this.outgoingMaps_);
      this.outgoingMaps_.length = 0;
      this.handler_.channelClosed(this, pendingMessages, copyOfUndeliveredMaps);
    }
  }
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getForwardChannelUri = function(path) {
  var uri = this.createDataUri(null, path);
  this.channelDebug_.debug("GetForwardChannelUri: " + uri);
  return uri;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.getBackChannelUri = function(hostPrefix, path) {
  var uri = this.createDataUri(this.supportsCrossDomainXhrs_ ? hostPrefix : null, path);
  this.channelDebug_.debug("GetBackChannelUri: " + uri);
  return uri;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.createDataUri = function(hostPrefix, path, opt_overridePort) {
  var uri = module$contents$goog$Uri_Uri.parse(path), uriAbsolute = uri.getDomain() != "";
  if (uriAbsolute) {
    hostPrefix && uri.setDomain(hostPrefix + "." + uri.getDomain()), uri.setPort(opt_overridePort || uri.getPort());
  } else {
    let locationPage = goog.global.location, hostName;
    hostName = hostPrefix ? hostPrefix + "." + locationPage.hostname : locationPage.hostname;
    let port = opt_overridePort || +locationPage.port;
    uri = module$contents$goog$Uri_Uri.create(locationPage.protocol, null, hostName, port, path);
  }
  var param = this.httpSessionIdParam_, value = this.getHttpSessionId();
  param && value && uri.setParameterValue(param, value);
  uri.setParameterValue("VER", this.channelVersion_);
  this.addAdditionalParams_(uri);
  return uri;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.createXhrIo = function(hostPrefix, isStreaming) {
  if (hostPrefix && !this.supportsCrossDomainXhrs_) {
    throw Error("Can't create secondary domain capable XhrIo object.");
  }
  var xhr = this.usesFetchStreams_ && !this.xmlHttpFactory_ ? new goog.net.XhrIo(new goog.net.FetchXmlHttpFactory({streamBinaryChunks:isStreaming})) : new goog.net.XhrIo(this.xmlHttpFactory_);
  xhr.setWithCredentials(this.supportsCrossDomainXhrs_);
  return xhr;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.isActive = function() {
  return !!this.handler_ && this.handler_.isActive(this);
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.prototype.setForwardChannelFlushCallback = function(callback) {
  this.forwardChannelFlushedCallback_ = callback;
};
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.channelHandleMultipleArrays = null;
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.okToMakeRequest = function() {
  return module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Error.OK;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.channelOpened = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.channelHandleArray = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.channelError = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.channelClosed = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.isActive = function() {
  return !0;
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.badMapError = function() {
};
module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler.prototype.correctHostPrefix = function(serverHostPrefix) {
  return serverHostPrefix;
};
/** @const */ 
goog.labs.net.webChannel.WebChannelBase = module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase;
/** @interface */ 
function module$contents$goog$net$WebChannelTransport_WebChannelTransport() {
}
/** @const */ 
module$contents$goog$net$WebChannelTransport_WebChannelTransport.CLIENT_VERSION = 22;
/** @const */ 
goog.net.WebChannelTransport = module$contents$goog$net$WebChannelTransport_WebChannelTransport;
/** @constructor */ 
function module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport() {
}
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.prototype.createWebChannel = function(url, opt_options) {
  return new module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel(url, opt_options);
};
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel = function(url, opt_options) {
  module$contents$goog$events$EventTarget_EventsEventTarget.call(this);
  this.channel_ = new module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase(opt_options, module$contents$goog$net$WebChannelTransport_WebChannelTransport.CLIENT_VERSION);
  this.url_ = url;
  this.logger_ = goog.log.getLogger("goog.labs.net.webChannel.WebChannelBaseTransport");
  this.messageUrlParams_ = opt_options && opt_options.messageUrlParams || null;
  var messageHeaders = opt_options && opt_options.messageHeaders || null;
  opt_options && opt_options.clientProtocolHeaderRequired && (messageHeaders ? messageHeaders[module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL] = module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL : messageHeaders = {[module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL]:module$contents$goog$net$WebChannel_WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL});
  this.channel_.setExtraHeaders(messageHeaders);
  var initHeaders = opt_options && opt_options.initMessageHeaders || null;
  opt_options && opt_options.messageContentType && (initHeaders ? initHeaders[module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CONTENT_TYPE] = opt_options.messageContentType : initHeaders = {[module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CONTENT_TYPE]:opt_options.messageContentType});
  opt_options && opt_options.clientProfile && (initHeaders ? initHeaders[module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CLIENT_PROFILE] = opt_options.clientProfile : initHeaders = {[module$contents$goog$net$WebChannel_WebChannel.X_WEBCHANNEL_CLIENT_PROFILE]:opt_options.clientProfile});
  this.channel_.setInitHeaders(initHeaders);
  var httpHeadersOverwriteParam = opt_options && opt_options.httpHeadersOverwriteParam;
  httpHeadersOverwriteParam && !goog.string.isEmptyOrWhitespace(httpHeadersOverwriteParam) && this.channel_.setHttpHeadersOverwriteParam(httpHeadersOverwriteParam);
  this.supportsCrossDomainXhr_ = opt_options && opt_options.supportsCrossDomainXhr || !1;
  this.sendRawJson_ = opt_options && opt_options.sendRawJson || !1;
  var httpSessionIdParam = opt_options && opt_options.httpSessionIdParam;
  httpSessionIdParam && !goog.string.isEmptyOrWhitespace(httpSessionIdParam) && (this.channel_.setHttpSessionIdParam(httpSessionIdParam), module$contents$goog$object_containsKey(this.messageUrlParams_, httpSessionIdParam) && (module$contents$goog$object_remove(this.messageUrlParams_, httpSessionIdParam), goog.log.warning(this.logger_, "Ignore httpSessionIdParam also specified with messageUrlParams: " + httpSessionIdParam)));
  this.channelHandler_ = new module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_(this);
};
goog.inherits(module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel, module$contents$goog$events$EventTarget_EventsEventTarget);
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.open = function() {
  this.channel_.setHandler(this.channelHandler_);
  this.supportsCrossDomainXhr_ && this.channel_.setSupportsCrossDomainXhrs(!0);
  this.channel_.connect(this.url_, this.messageUrlParams_ || void 0);
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.close = function() {
  this.channel_.disconnect();
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.send = function(message) {
  this.channel_.sendMap(this.messageToMapObject_(message));
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.messageToMapObject_ = function(message) {
  goog.asserts.assert(goog.isObject(message) || typeof message === "string", "only object type or raw string is supported");
  if (typeof message === "string") {
    let rawJson = {};
    rawJson[module$contents$goog$labs$net$webChannel$Wire_Wire.RAW_DATA_KEY] = message;
    return rawJson;
  }
  if (this.sendRawJson_) {
    let rawJson = {};
    rawJson[module$contents$goog$labs$net$webChannel$Wire_Wire.RAW_DATA_KEY] = module$contents$goog$json_serialize(message);
    return rawJson;
  }
  return message;
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.disposeInternal = function() {
  this.channel_.setHandler(null);
  delete this.channelHandler_;
  this.channel_.disconnect();
  delete this.channel_;
  module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.superClass_.disposeInternal.call(this);
};
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.MessageEvent = function(array) {
  module$contents$goog$net$WebChannel_WebChannel.MessageEvent.call(this);
  array.__headers__ && (this.headers = array.__headers__, this.statusCode = array.__status__, delete array.__headers__, delete array.__status__);
  var metadata = array.__sm__;
  this.data = metadata ? (this.metadataKey = module$contents$goog$object_getAnyKey(metadata)) ? module$contents$goog$object_get(metadata, this.metadataKey) : metadata : array;
};
goog.inherits(module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.MessageEvent, module$contents$goog$net$WebChannel_WebChannel.MessageEvent);
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.ErrorEvent = function(error) {
  module$contents$goog$net$WebChannel_WebChannel.ErrorEvent.call(this);
  this.status = module$contents$goog$net$WebChannel_WebChannel.ErrorStatus.NETWORK_ERROR;
  /** @const */ 
  this.errorCode = error;
};
goog.inherits(module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.ErrorEvent, module$contents$goog$net$WebChannel_WebChannel.ErrorEvent);
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_ = function(channel) {
  this.channel_ = channel;
};
goog.inherits(module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_, module$contents$goog$labs$net$webChannel$WebChannelBase_WebChannelBase.Handler);
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_.prototype.channelOpened = function() {
  goog.log.info(this.channel_.logger_, "WebChannel opened on " + this.channel_.url_);
  this.channel_.dispatchEvent(module$contents$goog$net$WebChannel_WebChannel.EventType.OPEN);
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_.prototype.channelHandleArray = function(channel, array) {
  goog.asserts.assert(array, "array expected to be defined");
  this.channel_.dispatchEvent(new module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.MessageEvent(array));
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_.prototype.channelError = function(channel, error) {
  goog.log.info(this.channel_.logger_, "WebChannel aborted on " + this.channel_.url_ + " due to channel error: " + error);
  this.channel_.dispatchEvent(new module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.ErrorEvent(error));
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.Handler_.prototype.channelClosed = function() {
  goog.log.info(this.channel_.logger_, "WebChannel closed on " + this.channel_.url_);
  this.channel_.dispatchEvent(module$contents$goog$net$WebChannel_WebChannel.EventType.CLOSE);
};
/** @constructor */ 
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.ChannelProperties = function(transportChannel, channel) {
  /** @const */ 
  this.channel_ = channel;
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.ChannelProperties.prototype.getHttpSessionId = function() {
  return this.channel_.getHttpSessionId();
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.ChannelProperties.prototype.commit = function(callback) {
  this.channel_.setForwardChannelFlushCallback(callback);
};
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.ChannelProperties.prototype.getLastStatusCode = function() {
  return this.channel_.getLastStatusCode();
};
/** @const */ 
goog.labs.net.webChannel.WebChannelBaseTransport = module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport;
function module$contents$goog$net$createWebChannelTransport_createWebChannelTransport() {
  return new module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport();
}
/** @const */ 
goog.net.createWebChannelTransport = module$contents$goog$net$createWebChannelTransport_createWebChannelTransport;
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.prototype.createWebChannel = module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.prototype.createWebChannel;
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.send = module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.send;
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.open = module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.open;
module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.close = module$contents$goog$labs$net$webChannel$WebChannelBaseTransport_WebChannelBaseTransport.Channel.prototype.close;
module.exports.createWebChannelTransport = module$contents$goog$net$createWebChannelTransport_createWebChannelTransport;
module.exports.getStatEventTarget = module$contents$goog$labs$net$webChannel$requestStats_getStatEventTarget;
module.exports.Event = module$contents$goog$labs$net$webChannel$requestStats_Event;
module.exports.Stat = module$contents$goog$labs$net$webChannel$requestStats_Stat;
module$contents$goog$net$ErrorCode_ErrorCode.NO_ERROR = module$contents$goog$net$ErrorCode_ErrorCode.NO_ERROR;
module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT = module$contents$goog$net$ErrorCode_ErrorCode.TIMEOUT;
module$contents$goog$net$ErrorCode_ErrorCode.HTTP_ERROR = module$contents$goog$net$ErrorCode_ErrorCode.HTTP_ERROR;
module.exports.ErrorCode = module$contents$goog$net$ErrorCode_ErrorCode;
module$contents$goog$net$EventType_EventType.COMPLETE = module$contents$goog$net$EventType_EventType.COMPLETE;
module.exports.EventType = module$contents$goog$net$EventType_EventType;
module$contents$goog$net$WebChannel_WebChannel.EventType = module$contents$goog$net$WebChannel_WebChannel.EventType;
module$contents$goog$net$WebChannel_WebChannel.EventType.OPEN = module$contents$goog$net$WebChannel_WebChannel.EventType.OPEN;
module$contents$goog$net$WebChannel_WebChannel.EventType.CLOSE = module$contents$goog$net$WebChannel_WebChannel.EventType.CLOSE;
module$contents$goog$net$WebChannel_WebChannel.EventType.ERROR = module$contents$goog$net$WebChannel_WebChannel.EventType.ERROR;
module$contents$goog$net$WebChannel_WebChannel.EventType.MESSAGE = module$contents$goog$net$WebChannel_WebChannel.EventType.MESSAGE;
module$contents$goog$events$EventTarget_EventsEventTarget.prototype.listen = module$contents$goog$events$EventTarget_EventsEventTarget.prototype.listen;
module.exports.WebChannel = module$contents$goog$net$WebChannel_WebChannel;
}).apply( typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self  : typeof window !== 'undefined' ? window  : {});
