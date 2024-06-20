
const { Controller } = require('egg');

const addClass = {
  class_name: 'string',
};

const listClass = {
  pageSize: 'string',
  pageNum: 'string',
};


class classInfoController extends Controller {
  // 增加分类
  async add() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const data = {
      class_name: ctx.request.body.class_name,
    };

    const res = await ctx.service.classInfo.save(data);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 编辑分类
  async edit() {
    const { ctx } = this;
    ctx.validate(addClass, ctx.request.body);
    const res = await ctx.service.classInfo.edit(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.classInfo.delete(id);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 获取列表
  async list() {
    const { ctx } = this;
    ctx.validate(listClass, ctx.request.query);
    const res = await ctx.service.classInfo.list(ctx.request.query);
    ctx.sendSuccess(res);
  }
  // 获取分类
  async page() {
    const { ctx } = this;
    const res = await ctx.service.classInfo.page();
    ctx.sendSuccess(res);
  }
}

module.exports = classInfoController;
