/* eslint valid-jsdoc: "off" */

const CryptoJS = require('crypto-js');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1718589943161_1734';

  // add your middleware config here

  config.tokenWhiteList = [ '/lsm-api/v1/admin/login' ];

  // add your middleware config here
  config.middleware = [ 'jwtPars', 'errorHandler' ];

  config.jwtPars = {
    match(ctx) {
      const { request } = ctx;
      const { url } = request;
      const urls = url.split('?');
      const result = !config.tokenWhiteList.includes(urls[0]);
      return result;
    },
  };
  // 鉴权
  config.jwt = {
    secret: 'sdsddddsdsds',
    sign: {
      // 多少时间后到期。以秒表示或描述时间跨度zeit / ms的字符串。如60，“2 days”，“10h”，“7d”，Expiration time，过期时间
      expiresIn: '1 days', // 多少s后过期。actionToken.js中,jwt.sing(plyload,secret,{expiresIn:number})会被合并，调用时设置优先级更高;
    },
  };
  // 秘钥
  config.KEY = CryptoJS.enc.Utf8.parse('sdghj7df7h23jhy9yh94'); // 20位
  config.IV = CryptoJS.enc.Utf8.parse('gysd7sdg87g2487crhhu');

  // 关闭crsf,开启跨域
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
