
const { Controller } = require('egg');

const addClass = {
  reader_id: 'int?',
  name: 'string',
  phone: 'string',
  sex: 'int',
  birth: 'string?',
  address: 'string?',
  expire: 'string',
};

const listClass = {
  pageSize: 'string',
  pageNum: 'string',
};


class readerInfoController extends Controller {
  // 增加
  async add() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.readerInfo.save(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 编辑
  async edit() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.readerInfo.edit(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.readerInfo.delete(id);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 获取列表
  async list() {
    const { ctx } = this;
    ctx.validate(listClass, ctx.request.query);
    const res = await ctx.service.readerInfo.list(ctx.request.query);
    ctx.sendSuccess(res);
  }
}

module.exports = readerInfoController;
