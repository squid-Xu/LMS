
const { Controller } = require('egg');

const addClass = {
  book_id: 'int?',
  book_name: 'string',
  author: 'string',
  publish: 'string',
  ISBN: 'string',
  introduction: 'string?',
  language: 'string?',
  price: 'number',
  pub_date: 'string?',
  class_id: 'int',
  number: 'int',
};

const listClass = {
  pageSize: 'string',
  pageNum: 'string',
};


class bookInfoController extends Controller {
  // 增加
  async add() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.bookInfo.save(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 编辑
  async edit() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.bookInfo.edit(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.bookInfo.delete(id);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 获取列表
  async list() {
    const { ctx } = this;
    ctx.validate(listClass, ctx.request.query);
    const res = await ctx.service.bookInfo.list(ctx.request.query);
    ctx.sendSuccess(res);
  }
  // 获取搜索列表
  async search() {
    const { ctx } = this;
    ctx.validate(listClass, ctx.request.query);
    const res = await ctx.service.bookInfo.search(ctx.request.query);
    ctx.sendSuccess(res);
  }
}

module.exports = bookInfoController;
