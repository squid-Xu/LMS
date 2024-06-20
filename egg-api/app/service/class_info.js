const { Service } = require('egg');

class class_infoService extends Service {
  // 添加分类
  async save(data) {
    const result = await this.app.mysql.insert('class_info', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
}

module.exports = class_infoService;
