const { Service } = require('egg');

class classInfoService extends Service {
  // 添加
  async save(data) {
    const accountInfo = await this.app.mysql.get('class_info', { class_name: data.class_name });
    if (accountInfo) {
      this.ctx.sendError('分类已存在');
      return false;
    }
    const result = await this.app.mysql.insert('class_info', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
  // 编辑
  async edit(data) {
    const accountInfo = await this.app.mysql.query(
      `select * from class_info where class_name = "${data.class_name}" AND class_id != ${data.class_id}`);
    if (accountInfo.length !== 0) {
      this.ctx.sendError('分类已存在');
      return false;
    }
    const result = await this.app.mysql.update('class_info', { class_name: data.class_name, sort: data.sort }, { where: { class_id: data.class_id } });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('编辑失败');
    return false;
  }
  // 删除
  async delete(id) {
    const list = await this.app.mysql.select('book_info', { where: { class_id: id } }); // 数量
    if (list.length) {
      this.ctx.sendError('请先删除本分类下图书');
      return false;
    }
    const result = await this.app.mysql.delete('class_info', { class_id: id });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('删除失败');
    return false;
  }
  // 获取列表
  async list(data) {
    const where = `${data.class_name ? `where class_name like '%${data.class_name}%'` : ''}`;
    const list = await this.app.mysql.query(`select * from class_info ${where}  order by sort asc  limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`select count(*) as count from class_info ${where}`); // 数量
    return { list, total: total[0].count };
  }
  // 获取全部
  async page() {
    const list = await this.app.mysql.select('class_info', { orders: [[ 'sort', 'asc' ]] });
    return list;
  }
}

module.exports = classInfoService;
