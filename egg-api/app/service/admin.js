const { Service } = require('egg');

class AdminService extends Service {
  // 登录
  async login(data) {
    const accountInfo = await this.app.mysql.get('admin', { username: data.username, password: data.password });
    if (accountInfo) {
      return accountInfo;
    }
    this.ctx.sendError('账号或密码错误');
    return false;
  }
  // 获取用户信息
  async getById(admin_id) {
    const accountInfo = await this.app.mysql.get('admin', { admin_id });
    return accountInfo;
  }
  // 添加
  async save(data) {
    const accountInfo = await this.app.mysql.get('admin', { username: data.username });
    if (accountInfo) {
      this.ctx.sendError('管理员已存在');
      return false;
    }
    const result = await this.app.mysql.insert('admin', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
  // 编辑
  async edit(data) {
    const accountInfo = await this.app.mysql.query(
      `select * from admin where username = "${data.username}" AND admin_id != ${data.admin_id}`);
    if (accountInfo.length !== 0) {
      this.ctx.sendError('管理员已存在');
      return false;
    }
    const { admin_id, create_time, update_time, ...row } = data;
    const result = await this.app.mysql.update('admin', row, { where: { admin_id } });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('编辑失败');
    return false;
  }
  // 删除
  async delete(id) {
    const result = await this.app.mysql.delete('admin', { admin_id: id });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('删除失败');
    return false;
  }
  // 获取列表
  async list(data) {
    const where = `where username like '%${data.username || ''}%' and nickname like '%${data.nickname || ''}%'`;
    const list = await this.app.mysql.query(`select * from admin ${where} order by create_time desc limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`select count(*) as count from admin ${where}`); // 数量
    return { list, total: total[0].count };
  }
}

module.exports = AdminService;
