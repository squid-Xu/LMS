module.exports = {
  // 封装成功返回体
  sendSuccess(data = null, message = 'success') {
    this.body = {
      code: 200,
      message,
      data,
    };
  },
  // 封装失败返回体
  sendError(message = 'error', code = 400) {
    this.body = {
      code,
      message,
      data: null,
    };
  },
};
