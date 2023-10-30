/**
 * 入口文件
 */
const Koa = require('koa');
const http = require('http');
const https = require('https');
const {certOptions} = require('./generateCert');
const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello World';
});
// 启动http侦听
http.createServer(app.callback()).listen(3000, () => {
    console.log(`
    http://127.0.0.1:3000
    `);
});
https.createServer(certOptions(), app.callback()).listen(3001, () => {
    console.log(`
    https://127.0.0.1:3001
    `);
});