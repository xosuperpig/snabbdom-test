var parser = require("dom2hscript");
var h = require("snabbdom/h").default;
var patch = require("snabbdom").init([
	require("snabbdom/modules/class").default,
	require("snabbdom/modules/props").default,
	require("snabbdom/modules/style").default
]);

let $main = document.getElementById('main');
let lastVnode = null;
document.getElementById('playbtn').addEventListener('click', function () {
    fetch('/play?xhr=1')
	    .then(function (response) {
	        return response.text();
	    })
	    .then(function (html) {
		    let hs = parser.parseHTML(html.trim());
		    console.log(hs);
		    console.time('snabbdom');
		    let buildVnode = new Function('h', 'return (' + hs + ')');
		    let vnode = buildVnode(h);
		    patch(lastVnode || $main, vnode);
		    lastVnode = vnode;
		    console.timeEnd('snabbdom');
		    // snabby.update($main, vtree)
	    })
});