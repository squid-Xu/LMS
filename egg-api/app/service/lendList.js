const { Service } = require('egg');

class lendListService extends Service {
  // 添加
  async save(data) {
    const payload = this.ctx.request.userInfo || {};
    data.borrower = payload.nickname;
    const result = await this.app.mysql.insert('lend_list', data);
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('添加失败');
    return false;
  }
  // 编辑
  async edit(data) {
    const payload = this.ctx.request.userInfo || {};
    data.reverter = payload.nickname;
    const { ser_num, ...row } = data;
    const result = await this.app.mysql.update('lend_list', row, { where: { ser_num } });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('编辑失败');
    return false;
  }
  // 删除
  async delete(id) {
    const result = await this.app.mysql.delete('lend_list', { ser_num: id });
    if (result.affectedRows === 1) {
      return result;
    }
    this.ctx.sendError('删除失败');
    return false;
  }
  // 获取列表
  async list(data) {
    const where = `
    where name like '%${data.name || ''}%' 
    and phone like '%${data.phone || ''}%' 
    and book_name like '%${data.book_name || ''}%' 
    and status like '%${data.status || ''}%' 
    and ISBN like '%${data.ISBN || ''}%' 
    `;
    const list = await this.app.mysql.query(`
      select lend_list.*, 
      reader_info.name as name, 
      reader_info.phone as phone, 
      book_info.book_name as book_name, 
      book_info.ISBN as ISBN 
      from lend_list 
      join reader_info on lend_list.reader_id = reader_info.reader_id 
      join book_info on lend_list.book_id = book_info.book_id 
      ${where} 
      order by lend_date desc 
      limit ${(data.pageNum - 1) * data.pageSize},${data.pageSize}`);
    const total = await this.app.mysql.query(`
      select count(*) as count 
      from lend_list 
      join reader_info on lend_list.reader_id = reader_info.reader_id 
      join book_info on lend_list.book_id = book_info.book_id 
      ${where}`); // 数量
    return { list, total: total[0].count };
  }
}

module.exports = lendListService;
