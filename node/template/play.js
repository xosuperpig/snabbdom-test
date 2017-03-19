'use strict';
const playBody = require("./play.body");

module.exports = function (data) {
    return `
    <html>
		<head>
            <title>播放页</title>		
        </head>
	    <body>
            ${playBody(data)}
	        <script src="/js/play.js"></script>
		</body>
	</html>`;
};