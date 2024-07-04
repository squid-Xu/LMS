// 解析token的中间件
module.exports = () => {
  return async function parsToken(ctx, next) {
    // 从请求头中获取token
    let token = ctx.request.header.authorization;
    let userInfo;
    if (!token) {
      ctx.sendError('未登录或身份信息已过期', 401);
    } else {
      try {
        // 验证token
        const { app } = ctx;
        const { config } = app;
        // 去除Bearer 前缀
        token = token.replace('Bearer ', '');
        // 解析token
        userInfo = app.jwt.verify(token, config.jwt.secret);
        // 把解析出来的token的用户信息，保存在在request.userInfo去，方便每个鉴权的接口获得用户信息
        ctx.request.userInfo = userInfo;
        await next();
      } catch (err) {
        ctx.sendError('未登录或身份信息已过期', 401);
      }
    }
  };
};
