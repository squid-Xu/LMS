const { Service } = require('egg');

class bookInfoService extends Service {
  // 添加
  async save(data) {
    const accountInfo = await this.app.mysql.get('book_info', { book_name: data.book_name });
    if (accountInfo) {
      this.ctx.sendError('图书已存在');
      return false;
    }
    const result = await this.app.mysql.insert('book_info', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
  // 编辑
  async edit(data) {
    const accountInfo = await this.app.mysql.query(
      `select * from book_info where book_name = "${data.book_name}" AND book_id != ${data.book_id}`);
    if (accountInfo.length !== 0) {
      this.ctx.sendError('图书已存在');
      return false;
    }
    const { book_id, create_time, update_time, ...row } = data;
    const result = await this.app.mysql.update('book_info', row, { where: { book_id } });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('编辑失败');
    return false;
  }
  // 删除
  async delete(id) {
    const result = await this.app.mysql.delete('book_info', { book_id: id });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('删除失败');
    return false;
  }
  // 获取列表
  async list(data) {
    const where = `
    where book_name like '%${data.book_name || ''}%' 
    and author like '%${data.author || ''}%' 
    and publish like '%${data.publish || ''}%' 
    and ISBN like '%${data.ISBN || ''}%' 
    and class_name like '%${data.class_name || ''}%'
    `;
    const list = await this.app.mysql.query(`
      select book_info.*, 
      class_info.class_name as class_name 
      from book_info 
      join class_info on book_info.class_id = class_info.class_id 
      ${where} 
      order by create_time desc 
      limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`select count(*) as count from book_info join class_info on book_info.class_id = class_info.class_id ${where}`); // 数量
    return { list, total: total[0].count };
  }
  // 获取搜索列表
  async search(data) {
    const where = `
      where book_name like '%${data.book_name || ''}%' 
      OR author like '%${data.book_name || ''}%'
      OR publish like '%${data.book_name || ''}%'
      OR ISBN like '%${data.book_name || ''}%'`;
    const list = await this.app.mysql.query(`select * from book_info ${where} order by create_time desc limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`select count(*) as count from book_info ${where}`); // 数量
    return { list, total: total[0].count };
  }
}

module.exports = bookInfoService;
