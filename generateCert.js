/**
 * 动态生成cert文件
 */
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

/**
 * 获取当前本地ip地址
 * @returns 
 */
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    let ip = '';
    Object.values(interfaces).forEach(list=>{
        list.forEach(ipInfo => {
            if(ipInfo.family === 'IPv4' && ipInfo.address !== '127.0.0.1' && !ipInfo.internal){
                ip = ipInfo.address
            }
        })
    })
   return ip;
};


const mkCmd = () => {
    const localIP = getLocalIP();
    console.log(`localIP: ${localIP}`);
    const option = `-cert-file ${path.resolve(__dirname, 'ssl/cert.pem')} -key-file ${path.resolve(__dirname, 'ssl/key.pem')}`;
    const list = `127.0.0.1 ${localIP} *.example.com`;
    console.log(`
    option:${option}
    list:${list}
    `);
    // 这里可以根据当前环境动态区分控制用哪个脚本
    const bin = path.resolve(__dirname, './bin/mkcert-darwin');

    return {
        get install() {
            return `${bin} -install`;
        },
        get cert() {
            return `${bin} ${option} ${list}`;
        },
    };
};

/**
 * 生成证书文件
 */
const generateFile = () => {
    const mkcertCmd = mkCmd();
    execSync(mkcertCmd.install, { stdio: 'pipe' });
    execSync(mkcertCmd.cert, { stdio: 'pipe' });
};

/**
 * 返回https服务所需的options
 * @returns 
 */
const certOptions = () => {
    // 获取证书前就重新生成一次
    generateFile();

    // 获取文件
    const cert = fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem'));
    const key = fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem'));

    return {
        cert,
        key,
    };
};

module.exports = {
    certOptions
};
