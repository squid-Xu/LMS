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

  return {
    ...config,
  };
};
