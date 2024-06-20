
const { Controller } = require('egg');

const addCate = {
  class_name: 'string',
};


class class_infoController extends Controller {
  // 增加分类
  async add() {
    const { ctx } = this;
    ctx.validate(addCate, ctx.request.body);
    const data = {
      id: ctx.helper.uuid(),
      class_name: ctx.request.body.class_name,
    };

    const res = await ctx.service.class_name.save(data);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
}

module.exports = class_infoController;
