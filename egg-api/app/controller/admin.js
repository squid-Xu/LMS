const { Controller } = require('egg');

const Account = {
  username: 'string',
  password: 'string',
};

const addAdmin = {
  admin_id: 'int?',
  username: 'string',
  password: 'string?',
  nickname: 'string',
  status: 'number',
  roles: 'string',
};

const listAdmin = {
  pageSize: 'string',
  pageNum: 'string',
};

class AdminController extends Controller {
  // 登录
  async login() {
    const { ctx, app } = this;
    ctx.validate(Account, ctx.request.body);
    const res = await ctx.service.admin.login(ctx.request.body);
    if (res === false) return;
    const token = app.jwt.sign(
      {
        admin_id: res.admin_id,
        username: res.username,
      },
      app.config.jwt.secret
    );
    ctx.sendSuccess({ token });
  }
  // 获取用户信息
  async info() {
    const { ctx } = this;
    const payload = ctx.request.userInfo;
    const res = await ctx.service.admin.getById(payload.admin_id);
    if (res) {
      ctx.sendSuccess({ admin_id: res.admin_id, username: res.username, nickname: res.nickname, roles: [ res.roles ] });
    } else {
      ctx.sendError('token失效', 401);
    }
  }
  // 增加
  async add() {
    const { ctx } = this;
    ctx.validate(addAdmin, ctx.request.body);
    const res = await ctx.service.admin.save(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 编辑
  async edit() {
    const { ctx } = this;
    ctx.validate(addAdmin, ctx.request.body);
    const res = await ctx.service.admin.edit(ctx.request.body);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.admin.delete(id);
    if (res === false) return;
    ctx.sendSuccess(res);
  }
  // 获取列表
  async list() {
    const { ctx } = this;
    ctx.validate(listAdmin, ctx.request.query);
    const res = await ctx.service.admin.list(ctx.request.query);
    ctx.sendSuccess(res);
  }
}

module.exports = AdminController;
