
const { Controller } = require('egg');

const addClass = {
  ser_num: 'int?',
  book_id: 'number?',
  reader_id: 'number?',
  status: 'int',
  back_date: 'string?',
};

const listClass = {
  pageSize: 'string',
  pageNum: 'string',
};
const selfListClass = {
  pageSize: 'string',
  pageNum: 'string',
  phone: 'string',
};


class lendListController extends Controller {
  // 增加
  async add() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.lendList.save(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 编辑
  async edit() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.lendList.edit(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.lendList.delete(id);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 获取列表
  async list() {
    const { ctx } = this;
    ctx.validate(listClass, ctx.request.query);
    const res = await ctx.service.lendList.list(ctx.request.query);
    ctx.sendSuccess(res);
  }
  // 查询自己的借阅记录
  async selfList() {
    const { ctx } = this;
    ctx.validate(selfListClass, ctx.request.query);
    const res = await ctx.service.lendList.selfList(ctx.request.query);
    ctx.sendSuccess(res);
  }
}

module.exports = lendListController;
