const { Service } = require('egg');

class readerInfoService extends Service {
  // 添加
  async save(data) {
    const accountInfo = await this.app.mysql.get('reader_info', { phone: data.phone });
    if (accountInfo) {
      this.ctx.sendError('用户已存在');
      return false;
    }
    const result = await this.app.mysql.insert('reader_info', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
  // 编辑
  async edit(data) {
    const accountInfo = await this.app.mysql.query(
      `select * from reader_info where phone = "${data.phone}" AND reader_id != ${data.reader_id}`);
    if (accountInfo.length !== 0) {
      this.ctx.sendError('用户已存在');
      return false;
    }
    const { reader_id, create_time, update_time, ...row } = data;
    const result = await this.app.mysql.update('reader_info', row, { where: { reader_id } });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('编辑失败');
    return false;
  }
  // 删除
  async delete(id) {
    const result = await this.app.mysql.delete('reader_info', { reader_id: id });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('删除失败');
    return false;
  }
  // 获取列表
  async list(data) {
    const where = `where name like '%${data.name || ''}%' 
    and phone like '%${data.phone || ''}%'`;
    const list = await this.app.mysql.query(`select * from reader_info ${where}  limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`select count(*) as count from reader_info ${where}`); // 数量
    return { list, total: total[0].count };
  }
}

module.exports = readerInfoService;
