'use strict';
const indexBody = require("./index.body");

module.exports = function (data) {
	return `
    <html>
		<head>
			<title>首页</title>
		</head>
	    <body>
		    ${indexBody(data)}
            <script src="/js/index.js"></script>
		</body>
	</html>`;
};