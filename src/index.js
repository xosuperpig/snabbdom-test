var snabby = require("snabby")([
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