module.exports = () => {

  const config = exports = {};

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '47.120.33.36',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root_prod',
      // 密码
      password: 'dkTZJtksDdTTtHZK',
      // 数据库名
      database: 'lms_api',
      timezone: '08:00',
      charset: 'utf8mb4',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.cors = {
    // 匹配规则  域名+端口  *则为全匹配
    origin: [ 'http://47.120.33.36:7000', 'http://47.120.33.36:7002' ],
    // origin: '*',

    // 匹配请求方式
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
  };
};
