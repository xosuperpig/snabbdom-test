const http = require("http");
const app = new (require("koa"));
const serve = require("koa-static");
const router = require("koa-router")();

app.use(serve(__dirname + '/../dest/'));

const templatePlay = require("./template/play");
const templatePlayBody = require("./template/play.body");
router.get('/play', async function () {
	if (this.query.xhr) {
		this.body = templatePlayBody({});

	} else {
		this.body = templatePlay({});
	}
});

const templateIndex = require("./template/index");
const templateIndexBody = require("./template/index.body");
router.get('/index', async function () {
	if (this.query.xhr) {
		this.body = templateIndexBody({});

	} else {
		this.body = templateIndex({});
	}
});

app.use(router.routes());

http.createServer(app.callback()).listen(80);

