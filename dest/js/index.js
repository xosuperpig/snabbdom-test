/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var snabby = __webpack_require__(1)([
		'props',
		'class',
		'attributes'
	]);

	var $main = document.getElementById('main');
	document.getElementById('playbtn').addEventListener('click', function () {
	    fetch('/play?xhr=1')
		    .then(function (response) {
		        return response.text();
		    })
		    .then(function (html) {
		        console.log(html);
			    let vtree = snabby(html.trim());
			    snabby.update($main, vtree)
		    })
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var snabbdom = __webpack_require__(2)
	var h = __webpack_require__(6).default
	var hyperx = __webpack_require__(8)

	var defModules = {
	  class: __webpack_require__(10).default,
	  props: __webpack_require__(11).default,
	  style: __webpack_require__(12).default,
	  attributes: __webpack_require__(13).default,
	  eventlisteners: __webpack_require__(14).default
	}

	module.exports = init

	function init (modules) {
	  if (modules) {
	    // Plain strings into `snabbdom/modules/*`:
	    for (var i = modules.length; i--;) {
	      var _module = modules[i]
	      if (typeof _module === 'string') {
	        modules[i] = defModules[_module]
	      }
	    }
	  }

	  // Create snabbdom patch function
	  var patch = snabbdom.init(modules || [])

	  // Create template tag function
	  var snabby = hyperx(_create)

	  // Create update function (like `yo.update`)
	  snabby.update = function update (dest, src) {
	    return patch(dest, src)
	  }

	  return snabby
	}

	function _create (sel, input, content) {
	  // Adjust content:
	  if (content && content.length === 1) {
	    content = content[0]
	  }

	  // Attribute names, and handling none faster:
	  var names = Object.keys(input)
	  if (!names || !names.length) {
	    return h(sel, content)
	  }

	  // Parse Snabbdom's `data` from attributes:
	  var data = {}
	  for (var i = 0, max = names.length; max > i; i++) {
	    var name = names[i]
	    if (name[0] === '@') {
	      var parts = name.slice(1).split(':')
	      var previous = data
	      for (var p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
	        var part = parts[p]
	        if (p === last) {
	          previous[part] = input[name]
	        } else if (!previous[part]) {
	          previous = previous[part] = {}
	        } else {
	          previous = previous[part]
	        }
	      }
	    } else if (name[0] === ':') {
	      if (!data.on) data.on = {}
	      data.on[name.slice(1)] = input[name]
	    } else {
	      if (!data.attrs) data.attrs = {}
	      data.attrs[name] = input[name]
	    }
	  }

	  // Return vnode:
	  return h(sel, data, content)
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vnode_1 = __webpack_require__(3);
	var is = __webpack_require__(4);
	var htmldomapi_1 = __webpack_require__(5);
	function isUndef(s) { return s === undefined; }
	function isDef(s) { return s !== undefined; }
	var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
	function sameVnode(vnode1, vnode2) {
	    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}
	function isVnode(vnode) {
	    return vnode.sel !== undefined;
	}
	function createKeyToOldIdx(children, beginIdx, endIdx) {
	    var i, map = {}, key, ch;
	    for (i = beginIdx; i <= endIdx; ++i) {
	        ch = children[i];
	        if (ch != null) {
	            key = ch.key;
	            if (key !== undefined)
	                map[key] = i;
	        }
	    }
	    return map;
	}
	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
	var h_1 = __webpack_require__(6);
	exports.h = h_1.h;
	var thunk_1 = __webpack_require__(7);
	exports.thunk = thunk_1.thunk;
	function init(modules, domApi) {
	    var i, j, cbs = {};
	    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
	    for (i = 0; i < hooks.length; ++i) {
	        cbs[hooks[i]] = [];
	        for (j = 0; j < modules.length; ++j) {
	            var hook = modules[j][hooks[i]];
	            if (hook !== undefined) {
	                cbs[hooks[i]].push(hook);
	            }
	        }
	    }
	    function emptyNodeAt(elm) {
	        var id = elm.id ? '#' + elm.id : '';
	        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
	        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
	    }
	    function createRmCb(childElm, listeners) {
	        return function rmCb() {
	            if (--listeners === 0) {
	                var parent_1 = api.parentNode(childElm);
	                api.removeChild(parent_1, childElm);
	            }
	        };
	    }
	    function createElm(vnode, insertedVnodeQueue) {
	        var i, data = vnode.data;
	        if (data !== undefined) {
	            if (isDef(i = data.hook) && isDef(i = i.init)) {
	                i(vnode);
	                data = vnode.data;
	            }
	        }
	        var children = vnode.children, sel = vnode.sel;
	        if (sel === '!') {
	            if (isUndef(vnode.text)) {
	                vnode.text = '';
	            }
	            vnode.elm = api.createComment(vnode.text);
	        }
	        else if (sel !== undefined) {
	            // Parse selector
	            var hashIdx = sel.indexOf('#');
	            var dotIdx = sel.indexOf('.', hashIdx);
	            var hash = hashIdx > 0 ? hashIdx : sel.length;
	            var dot = dotIdx > 0 ? dotIdx : sel.length;
	            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
	                : api.createElement(tag);
	            if (hash < dot)
	                elm.id = sel.slice(hash + 1, dot);
	            if (dotIdx > 0)
	                elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
	            for (i = 0; i < cbs.create.length; ++i)
	                cbs.create[i](emptyNode, vnode);
	            if (is.array(children)) {
	                for (i = 0; i < children.length; ++i) {
	                    var ch = children[i];
	                    if (ch != null) {
	                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
	                    }
	                }
	            }
	            else if (is.primitive(vnode.text)) {
	                api.appendChild(elm, api.createTextNode(vnode.text));
	            }
	            i = vnode.data.hook; // Reuse variable
	            if (isDef(i)) {
	                if (i.create)
	                    i.create(emptyNode, vnode);
	                if (i.insert)
	                    insertedVnodeQueue.push(vnode);
	            }
	        }
	        else {
	            vnode.elm = api.createTextNode(vnode.text);
	        }
	        return vnode.elm;
	    }
	    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	        for (; startIdx <= endIdx; ++startIdx) {
	            var ch = vnodes[startIdx];
	            if (ch != null) {
	                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
	            }
	        }
	    }
	    function invokeDestroyHook(vnode) {
	        var i, j, data = vnode.data;
	        if (data !== undefined) {
	            if (isDef(i = data.hook) && isDef(i = i.destroy))
	                i(vnode);
	            for (i = 0; i < cbs.destroy.length; ++i)
	                cbs.destroy[i](vnode);
	            if (vnode.children !== undefined) {
	                for (j = 0; j < vnode.children.length; ++j) {
	                    i = vnode.children[j];
	                    if (i != null && typeof i !== "string") {
	                        invokeDestroyHook(i);
	                    }
	                }
	            }
	        }
	    }
	    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	        for (; startIdx <= endIdx; ++startIdx) {
	            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
	            if (ch != null) {
	                if (isDef(ch.sel)) {
	                    invokeDestroyHook(ch);
	                    listeners = cbs.remove.length + 1;
	                    rm = createRmCb(ch.elm, listeners);
	                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
	                        cbs.remove[i_1](ch, rm);
	                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
	                        i_1(ch, rm);
	                    }
	                    else {
	                        rm();
	                    }
	                }
	                else {
	                    api.removeChild(parentElm, ch.elm);
	                }
	            }
	        }
	    }
	    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	        var oldStartIdx = 0, newStartIdx = 0;
	        var oldEndIdx = oldCh.length - 1;
	        var oldStartVnode = oldCh[0];
	        var oldEndVnode = oldCh[oldEndIdx];
	        var newEndIdx = newCh.length - 1;
	        var newStartVnode = newCh[0];
	        var newEndVnode = newCh[newEndIdx];
	        var oldKeyToIdx;
	        var idxInOld;
	        var elmToMove;
	        var before;
	        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	            if (oldStartVnode == null) {
	                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
	            }
	            else if (oldEndVnode == null) {
	                oldEndVnode = oldCh[--oldEndIdx];
	            }
	            else if (newStartVnode == null) {
	                newStartVnode = newCh[++newStartIdx];
	            }
	            else if (newEndVnode == null) {
	                newEndVnode = newCh[--newEndIdx];
	            }
	            else if (sameVnode(oldStartVnode, newStartVnode)) {
	                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	                oldStartVnode = oldCh[++oldStartIdx];
	                newStartVnode = newCh[++newStartIdx];
	            }
	            else if (sameVnode(oldEndVnode, newEndVnode)) {
	                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	                oldEndVnode = oldCh[--oldEndIdx];
	                newEndVnode = newCh[--newEndIdx];
	            }
	            else if (sameVnode(oldStartVnode, newEndVnode)) {
	                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	                oldStartVnode = oldCh[++oldStartIdx];
	                newEndVnode = newCh[--newEndIdx];
	            }
	            else if (sameVnode(oldEndVnode, newStartVnode)) {
	                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	                oldEndVnode = oldCh[--oldEndIdx];
	                newStartVnode = newCh[++newStartIdx];
	            }
	            else {
	                if (oldKeyToIdx === undefined) {
	                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	                }
	                idxInOld = oldKeyToIdx[newStartVnode.key];
	                if (isUndef(idxInOld)) {
	                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	                    newStartVnode = newCh[++newStartIdx];
	                }
	                else {
	                    elmToMove = oldCh[idxInOld];
	                    if (elmToMove.sel !== newStartVnode.sel) {
	                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	                    }
	                    else {
	                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	                        oldCh[idxInOld] = undefined;
	                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	                    }
	                    newStartVnode = newCh[++newStartIdx];
	                }
	            }
	        }
	        if (oldStartIdx > oldEndIdx) {
	            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
	            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	        }
	        else if (newStartIdx > newEndIdx) {
	            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	        }
	    }
	    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	        var i, hook;
	        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	            i(oldVnode, vnode);
	        }
	        var elm = vnode.elm = oldVnode.elm;
	        var oldCh = oldVnode.children;
	        var ch = vnode.children;
	        if (oldVnode === vnode)
	            return;
	        if (vnode.data !== undefined) {
	            for (i = 0; i < cbs.update.length; ++i)
	                cbs.update[i](oldVnode, vnode);
	            i = vnode.data.hook;
	            if (isDef(i) && isDef(i = i.update))
	                i(oldVnode, vnode);
	        }
	        if (isUndef(vnode.text)) {
	            if (isDef(oldCh) && isDef(ch)) {
	                if (oldCh !== ch)
	                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	            }
	            else if (isDef(ch)) {
	                if (isDef(oldVnode.text))
	                    api.setTextContent(elm, '');
	                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	            }
	            else if (isDef(oldCh)) {
	                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	            }
	            else if (isDef(oldVnode.text)) {
	                api.setTextContent(elm, '');
	            }
	        }
	        else if (oldVnode.text !== vnode.text) {
	            api.setTextContent(elm, vnode.text);
	        }
	        if (isDef(hook) && isDef(i = hook.postpatch)) {
	            i(oldVnode, vnode);
	        }
	    }
	    return function patch(oldVnode, vnode) {
	        var i, elm, parent;
	        var insertedVnodeQueue = [];
	        for (i = 0; i < cbs.pre.length; ++i)
	            cbs.pre[i]();
	        if (!isVnode(oldVnode)) {
	            oldVnode = emptyNodeAt(oldVnode);
	        }
	        if (sameVnode(oldVnode, vnode)) {
	            patchVnode(oldVnode, vnode, insertedVnodeQueue);
	        }
	        else {
	            elm = oldVnode.elm;
	            parent = api.parentNode(elm);
	            createElm(vnode, insertedVnodeQueue);
	            if (parent !== null) {
	                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	                removeVnodes(parent, [oldVnode], 0, 0);
	            }
	        }
	        for (i = 0; i < insertedVnodeQueue.length; ++i) {
	            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	        }
	        for (i = 0; i < cbs.post.length; ++i)
	            cbs.post[i]();
	        return vnode;
	    };
	}
	exports.init = init;
	//# sourceMappingURL=snabbdom.js.map

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function vnode(sel, data, children, text, elm) {
	    var key = data === undefined ? undefined : data.key;
	    return { sel: sel, data: data, children: children,
	        text: text, elm: elm, key: key };
	}
	exports.vnode = vnode;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = vnode;
	//# sourceMappingURL=vnode.js.map

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	exports.array = Array.isArray;
	function primitive(s) {
	    return typeof s === 'string' || typeof s === 'number';
	}
	exports.primitive = primitive;
	//# sourceMappingURL=is.js.map

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function createElement(tagName) {
	    return document.createElement(tagName);
	}
	function createElementNS(namespaceURI, qualifiedName) {
	    return document.createElementNS(namespaceURI, qualifiedName);
	}
	function createTextNode(text) {
	    return document.createTextNode(text);
	}
	function createComment(text) {
	    return document.createComment(text);
	}
	function insertBefore(parentNode, newNode, referenceNode) {
	    parentNode.insertBefore(newNode, referenceNode);
	}
	function removeChild(node, child) {
	    node.removeChild(child);
	}
	function appendChild(node, child) {
	    node.appendChild(child);
	}
	function parentNode(node) {
	    return node.parentNode;
	}
	function nextSibling(node) {
	    return node.nextSibling;
	}
	function tagName(elm) {
	    return elm.tagName;
	}
	function setTextContent(node, text) {
	    node.textContent = text;
	}
	function getTextContent(node) {
	    return node.textContent;
	}
	function isElement(node) {
	    return node.nodeType === 1;
	}
	function isText(node) {
	    return node.nodeType === 3;
	}
	function isComment(node) {
	    return node.nodeType === 8;
	}
	exports.htmlDomApi = {
	    createElement: createElement,
	    createElementNS: createElementNS,
	    createTextNode: createTextNode,
	    createComment: createComment,
	    insertBefore: insertBefore,
	    removeChild: removeChild,
	    appendChild: appendChild,
	    parentNode: parentNode,
	    nextSibling: nextSibling,
	    tagName: tagName,
	    setTextContent: setTextContent,
	    getTextContent: getTextContent,
	    isElement: isElement,
	    isText: isText,
	    isComment: isComment,
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.htmlDomApi;
	//# sourceMappingURL=htmldomapi.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vnode_1 = __webpack_require__(3);
	var is = __webpack_require__(4);
	function addNS(data, children, sel) {
	    data.ns = 'http://www.w3.org/2000/svg';
	    if (sel !== 'foreignObject' && children !== undefined) {
	        for (var i = 0; i < children.length; ++i) {
	            var childData = children[i].data;
	            if (childData !== undefined) {
	                addNS(childData, children[i].children, children[i].sel);
	            }
	        }
	    }
	}
	function h(sel, b, c) {
	    var data = {}, children, text, i;
	    if (c !== undefined) {
	        data = b;
	        if (is.array(c)) {
	            children = c;
	        }
	        else if (is.primitive(c)) {
	            text = c;
	        }
	        else if (c && c.sel) {
	            children = [c];
	        }
	    }
	    else if (b !== undefined) {
	        if (is.array(b)) {
	            children = b;
	        }
	        else if (is.primitive(b)) {
	            text = b;
	        }
	        else if (b && b.sel) {
	            children = [b];
	        }
	        else {
	            data = b;
	        }
	    }
	    if (is.array(children)) {
	        for (i = 0; i < children.length; ++i) {
	            if (is.primitive(children[i]))
	                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
	        }
	    }
	    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
	        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
	        addNS(data, children, sel);
	    }
	    return vnode_1.vnode(sel, data, children, text, undefined);
	}
	exports.h = h;
	;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = h;
	//# sourceMappingURL=h.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h_1 = __webpack_require__(6);
	function copyToThunk(vnode, thunk) {
	    thunk.elm = vnode.elm;
	    vnode.data.fn = thunk.data.fn;
	    vnode.data.args = thunk.data.args;
	    thunk.data = vnode.data;
	    thunk.children = vnode.children;
	    thunk.text = vnode.text;
	    thunk.elm = vnode.elm;
	}
	function init(thunk) {
	    var cur = thunk.data;
	    var vnode = cur.fn.apply(undefined, cur.args);
	    copyToThunk(vnode, thunk);
	}
	function prepatch(oldVnode, thunk) {
	    var i, old = oldVnode.data, cur = thunk.data;
	    var oldArgs = old.args, args = cur.args;
	    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
	        copyToThunk(cur.fn.apply(undefined, args), thunk);
	    }
	    for (i = 0; i < args.length; ++i) {
	        if (oldArgs[i] !== args[i]) {
	            copyToThunk(cur.fn.apply(undefined, args), thunk);
	            return;
	        }
	    }
	    copyToThunk(oldVnode, thunk);
	}
	exports.thunk = function thunk(sel, key, fn, args) {
	    if (args === undefined) {
	        args = fn;
	        fn = key;
	        key = undefined;
	    }
	    return h_1.h(sel, {
	        key: key,
	        hook: { init: init, prepatch: prepatch },
	        fn: fn,
	        args: args
	    });
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.thunk;
	//# sourceMappingURL=thunk.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var attrToProp = __webpack_require__(9)

	var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
	var ATTR_KEY = 5, ATTR_KEY_W = 6
	var ATTR_VALUE_W = 7, ATTR_VALUE = 8
	var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
	var ATTR_EQ = 11, ATTR_BREAK = 12

	module.exports = function (h, opts) {
	  h = attrToProp(h)
	  if (!opts) opts = {}
	  var concat = opts.concat || function (a, b) {
	    return String(a) + String(b)
	  }

	  return function (strings) {
	    var state = TEXT, reg = ''
	    var arglen = arguments.length
	    var parts = []

	    for (var i = 0; i < strings.length; i++) {
	      if (i < arglen - 1) {
	        var arg = arguments[i+1]
	        var p = parse(strings[i])
	        var xstate = state
	        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
	        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
	        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
	        if (xstate === ATTR) xstate = ATTR_KEY
	        p.push([ VAR, xstate, arg ])
	        parts.push.apply(parts, p)
	      } else parts.push.apply(parts, parse(strings[i]))
	    }

	    var tree = [null,{},[]]
	    var stack = [[tree,-1]]
	    for (var i = 0; i < parts.length; i++) {
	      var cur = stack[stack.length-1][0]
	      var p = parts[i], s = p[0]
	      if (s === OPEN && /^\//.test(p[1])) {
	        var ix = stack[stack.length-1][1]
	        if (stack.length > 1) {
	          stack.pop()
	          stack[stack.length-1][0][2][ix] = h(
	            cur[0], cur[1], cur[2].length ? cur[2] : undefined
	          )
	        }
	      } else if (s === OPEN) {
	        var c = [p[1],{},[]]
	        cur[2].push(c)
	        stack.push([c,cur[2].length-1])
	      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
	        var key = ''
	        var copyKey
	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_KEY) {
	            key = concat(key, parts[i][1])
	          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
	            if (typeof parts[i][2] === 'object' && !key) {
	              for (copyKey in parts[i][2]) {
	                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
	                  cur[1][copyKey] = parts[i][2][copyKey]
	                }
	              }
	            } else {
	              key = concat(key, parts[i][2])
	            }
	          } else break
	        }
	        if (parts[i][0] === ATTR_EQ) i++
	        var j = i
	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
	            else cur[1][key] = concat(cur[1][key], parts[i][1])
	          } else if (parts[i][0] === VAR
	          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
	            else cur[1][key] = concat(cur[1][key], parts[i][2])
	          } else {
	            if (key.length && !cur[1][key] && i === j
	            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
	              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
	              // empty string is falsy, not well behaved value in browser
	              cur[1][key] = key.toLowerCase()
	            }
	            break
	          }
	        }
	      } else if (s === ATTR_KEY) {
	        cur[1][p[1]] = true
	      } else if (s === VAR && p[1] === ATTR_KEY) {
	        cur[1][p[2]] = true
	      } else if (s === CLOSE) {
	        if (selfClosing(cur[0]) && stack.length) {
	          var ix = stack[stack.length-1][1]
	          stack.pop()
	          stack[stack.length-1][0][2][ix] = h(
	            cur[0], cur[1], cur[2].length ? cur[2] : undefined
	          )
	        }
	      } else if (s === VAR && p[1] === TEXT) {
	        if (p[2] === undefined || p[2] === null) p[2] = ''
	        else if (!p[2]) p[2] = concat('', p[2])
	        if (Array.isArray(p[2][0])) {
	          cur[2].push.apply(cur[2], p[2])
	        } else {
	          cur[2].push(p[2])
	        }
	      } else if (s === TEXT) {
	        cur[2].push(p[1])
	      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
	        // no-op
	      } else {
	        throw new Error('unhandled: ' + s)
	      }
	    }

	    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
	      tree[2].shift()
	    }

	    if (tree[2].length > 2
	    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
	      throw new Error(
	        'multiple root elements must be wrapped in an enclosing tag'
	      )
	    }
	    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
	    && Array.isArray(tree[2][0][2])) {
	      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
	    }
	    return tree[2][0]

	    function parse (str) {
	      var res = []
	      if (state === ATTR_VALUE_W) state = ATTR
	      for (var i = 0; i < str.length; i++) {
	        var c = str.charAt(i)
	        if (state === TEXT && c === '<') {
	          if (reg.length) res.push([TEXT, reg])
	          reg = ''
	          state = OPEN
	        } else if (c === '>' && !quot(state)) {
	          if (state === OPEN) {
	            res.push([OPEN,reg])
	          } else if (state === ATTR_KEY) {
	            res.push([ATTR_KEY,reg])
	          } else if (state === ATTR_VALUE && reg.length) {
	            res.push([ATTR_VALUE,reg])
	          }
	          res.push([CLOSE])
	          reg = ''
	          state = TEXT
	        } else if (state === TEXT) {
	          reg += c
	        } else if (state === OPEN && /\s/.test(c)) {
	          res.push([OPEN, reg])
	          reg = ''
	          state = ATTR
	        } else if (state === OPEN) {
	          reg += c
	        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
	          state = ATTR_KEY
	          reg = c
	        } else if (state === ATTR && /\s/.test(c)) {
	          if (reg.length) res.push([ATTR_KEY,reg])
	          res.push([ATTR_BREAK])
	        } else if (state === ATTR_KEY && /\s/.test(c)) {
	          res.push([ATTR_KEY,reg])
	          reg = ''
	          state = ATTR_KEY_W
	        } else if (state === ATTR_KEY && c === '=') {
	          res.push([ATTR_KEY,reg],[ATTR_EQ])
	          reg = ''
	          state = ATTR_VALUE_W
	        } else if (state === ATTR_KEY) {
	          reg += c
	        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
	          res.push([ATTR_EQ])
	          state = ATTR_VALUE_W
	        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
	          res.push([ATTR_BREAK])
	          if (/[\w-]/.test(c)) {
	            reg += c
	            state = ATTR_KEY
	          } else state = ATTR
	        } else if (state === ATTR_VALUE_W && c === '"') {
	          state = ATTR_VALUE_DQ
	        } else if (state === ATTR_VALUE_W && c === "'") {
	          state = ATTR_VALUE_SQ
	        } else if (state === ATTR_VALUE_DQ && c === '"') {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE_SQ && c === "'") {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
	          state = ATTR_VALUE
	          i--
	        } else if (state === ATTR_VALUE && /\s/.test(c)) {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
	        || state === ATTR_VALUE_DQ) {
	          reg += c
	        }
	      }
	      if (state === TEXT && reg.length) {
	        res.push([TEXT,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE_DQ && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE_SQ && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_KEY) {
	        res.push([ATTR_KEY,reg])
	        reg = ''
	      }
	      return res
	    }
	  }

	  function strfn (x) {
	    if (typeof x === 'function') return x
	    else if (typeof x === 'string') return x
	    else if (x && typeof x === 'object') return x
	    else return concat('', x)
	  }
	}

	function quot (state) {
	  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
	}

	var hasOwn = Object.prototype.hasOwnProperty
	function has (obj, key) { return hasOwn.call(obj, key) }

	var closeRE = RegExp('^(' + [
	  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
	  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
	  'source', 'track', 'wbr',
	  // SVG TAGS
	  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
	  'feBlend', 'feColorMatrix', 'feComposite',
	  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
	  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
	  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
	  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
	  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
	  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
	  'vkern'
	].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
	function selfClosing (tag) { return closeRE.test(tag) }


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = attributeToProperty

	var transform = {
	  'class': 'className',
	  'for': 'htmlFor',
	  'http-equiv': 'httpEquiv'
	}

	function attributeToProperty (h) {
	  return function (tagName, attrs, children) {
	    for (var attr in attrs) {
	      if (attr in transform) {
	        attrs[transform[attr]] = attrs[attr]
	        delete attrs[attr]
	      }
	    }
	    return h(tagName, attrs, children)
	  }
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function updateClass(oldVnode, vnode) {
	    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
	    if (!oldClass && !klass)
	        return;
	    if (oldClass === klass)
	        return;
	    oldClass = oldClass || {};
	    klass = klass || {};
	    for (name in oldClass) {
	        if (!klass[name]) {
	            elm.classList.remove(name);
	        }
	    }
	    for (name in klass) {
	        cur = klass[name];
	        if (cur !== oldClass[name]) {
	            elm.classList[cur ? 'add' : 'remove'](name);
	        }
	    }
	}
	exports.classModule = { create: updateClass, update: updateClass };
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.classModule;
	//# sourceMappingURL=class.js.map

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	function updateProps(oldVnode, vnode) {
	    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
	    if (!oldProps && !props)
	        return;
	    if (oldProps === props)
	        return;
	    oldProps = oldProps || {};
	    props = props || {};
	    for (key in oldProps) {
	        if (!props[key]) {
	            delete elm[key];
	        }
	    }
	    for (key in props) {
	        cur = props[key];
	        old = oldProps[key];
	        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	            elm[key] = cur;
	        }
	    }
	}
	exports.propsModule = { create: updateProps, update: updateProps };
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.propsModule;
	//# sourceMappingURL=props.js.map

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
	var nextFrame = function (fn) { raf(function () { raf(fn); }); };
	function setNextFrame(obj, prop, val) {
	    nextFrame(function () { obj[prop] = val; });
	}
	function updateStyle(oldVnode, vnode) {
	    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
	    if (!oldStyle && !style)
	        return;
	    if (oldStyle === style)
	        return;
	    oldStyle = oldStyle || {};
	    style = style || {};
	    var oldHasDel = 'delayed' in oldStyle;
	    for (name in oldStyle) {
	        if (!style[name]) {
	            if (name[0] === '-' && name[1] === '-') {
	                elm.style.removeProperty(name);
	            }
	            else {
	                elm.style[name] = '';
	            }
	        }
	    }
	    for (name in style) {
	        cur = style[name];
	        if (name === 'delayed') {
	            for (name in style.delayed) {
	                cur = style.delayed[name];
	                if (!oldHasDel || cur !== oldStyle.delayed[name]) {
	                    setNextFrame(elm.style, name, cur);
	                }
	            }
	        }
	        else if (name !== 'remove' && cur !== oldStyle[name]) {
	            if (name[0] === '-' && name[1] === '-') {
	                elm.style.setProperty(name, cur);
	            }
	            else {
	                elm.style[name] = cur;
	            }
	        }
	    }
	}
	function applyDestroyStyle(vnode) {
	    var style, name, elm = vnode.elm, s = vnode.data.style;
	    if (!s || !(style = s.destroy))
	        return;
	    for (name in style) {
	        elm.style[name] = style[name];
	    }
	}
	function applyRemoveStyle(vnode, rm) {
	    var s = vnode.data.style;
	    if (!s || !s.remove) {
	        rm();
	        return;
	    }
	    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
	    for (name in style) {
	        applied.push(name);
	        elm.style[name] = style[name];
	    }
	    compStyle = getComputedStyle(elm);
	    var props = compStyle['transition-property'].split(', ');
	    for (; i < props.length; ++i) {
	        if (applied.indexOf(props[i]) !== -1)
	            amount++;
	    }
	    elm.addEventListener('transitionend', function (ev) {
	        if (ev.target === elm)
	            --amount;
	        if (amount === 0)
	            rm();
	    });
	}
	exports.styleModule = {
	    create: updateStyle,
	    update: updateStyle,
	    destroy: applyDestroyStyle,
	    remove: applyRemoveStyle
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.styleModule;
	//# sourceMappingURL=style.js.map

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	var NamespaceURIs = {
	    "xlink": "http://www.w3.org/1999/xlink"
	};
	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
	    "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
	    "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
	    "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
	    "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
	    "truespeed", "typemustmatch", "visible"];
	var booleanAttrsDict = Object.create(null);
	for (var i = 0, len = booleanAttrs.length; i < len; i++) {
	    booleanAttrsDict[booleanAttrs[i]] = true;
	}
	function updateAttrs(oldVnode, vnode) {
	    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs, namespaceSplit;
	    if (!oldAttrs && !attrs)
	        return;
	    if (oldAttrs === attrs)
	        return;
	    oldAttrs = oldAttrs || {};
	    attrs = attrs || {};
	    // update modified attributes, add new attributes
	    for (key in attrs) {
	        var cur = attrs[key];
	        var old = oldAttrs[key];
	        if (old !== cur) {
	            if (booleanAttrsDict[key]) {
	                if (cur) {
	                    elm.setAttribute(key, "");
	                }
	                else {
	                    elm.removeAttribute(key);
	                }
	            }
	            else {
	                namespaceSplit = key.split(":");
	                if (namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0])) {
	                    elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);
	                }
	                else {
	                    elm.setAttribute(key, cur);
	                }
	            }
	        }
	    }
	    // remove removed attributes
	    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	    // the other option is to remove all attributes with value == undefined
	    for (key in oldAttrs) {
	        if (!(key in attrs)) {
	            elm.removeAttribute(key);
	        }
	    }
	}
	exports.attributesModule = { create: updateAttrs, update: updateAttrs };
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.attributesModule;
	//# sourceMappingURL=attributes.js.map

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	function invokeHandler(handler, vnode, event) {
	    if (typeof handler === "function") {
	        // call function handler
	        handler.call(vnode, event, vnode);
	    }
	    else if (typeof handler === "object") {
	        // call handler with arguments
	        if (typeof handler[0] === "function") {
	            // special case for single argument for performance
	            if (handler.length === 2) {
	                handler[0].call(vnode, handler[1], event, vnode);
	            }
	            else {
	                var args = handler.slice(1);
	                args.push(event);
	                args.push(vnode);
	                handler[0].apply(vnode, args);
	            }
	        }
	        else {
	            // call multiple handlers
	            for (var i = 0; i < handler.length; i++) {
	                invokeHandler(handler[i]);
	            }
	        }
	    }
	}
	function handleEvent(event, vnode) {
	    var name = event.type, on = vnode.data.on;
	    // call event handler(s) if exists
	    if (on && on[name]) {
	        invokeHandler(on[name], vnode, event);
	    }
	}
	function createListener() {
	    return function handler(event) {
	        handleEvent(event, handler.vnode);
	    };
	}
	function updateEventListeners(oldVnode, vnode) {
	    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
	    // optimization for reused immutable handlers
	    if (oldOn === on) {
	        return;
	    }
	    // remove existing listeners which no longer used
	    if (oldOn && oldListener) {
	        // if element changed or deleted we remove all existing listeners unconditionally
	        if (!on) {
	            for (name in oldOn) {
	                // remove listener if element was changed or existing listeners removed
	                oldElm.removeEventListener(name, oldListener, false);
	            }
	        }
	        else {
	            for (name in oldOn) {
	                // remove listener if existing listener removed
	                if (!on[name]) {
	                    oldElm.removeEventListener(name, oldListener, false);
	                }
	            }
	        }
	    }
	    // add new listeners which has not already attached
	    if (on) {
	        // reuse existing listener or create new
	        var listener = vnode.listener = oldVnode.listener || createListener();
	        // update vnode for listener
	        listener.vnode = vnode;
	        // if element changed or added we add all needed listeners unconditionally
	        if (!oldOn) {
	            for (name in on) {
	                // add listener if element was changed or new listeners added
	                elm.addEventListener(name, listener, false);
	            }
	        }
	        else {
	            for (name in on) {
	                // add listener if new listener added
	                if (!oldOn[name]) {
	                    elm.addEventListener(name, listener, false);
	                }
	            }
	        }
	    }
	}
	exports.eventListenersModule = {
	    create: updateEventListeners,
	    update: updateEventListeners,
	    destroy: updateEventListeners
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.eventListenersModule;
	//# sourceMappingURL=eventlisteners.js.map

/***/ }
/******/ ]);