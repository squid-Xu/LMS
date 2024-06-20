const { Controller } = require('egg');

const Account = {
	username: 'string',
	password: 'string',
};

class AdminController extends Controller {
	/**
	 * @管理员登录
	 */
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
		ctx.sendSuccess(token);
	}
	/**
	 * @获取用户信息
	 */
	async info() {
		const { ctx } = this;
		const payload = ctx.request.userInfo;
		const res = await ctx.service.admin.getById(payload.admin_id);
		if (res) {
			ctx.sendSuccess({ admin_id: res.admin_id, username: res.username, nickname: res.nickname });
		} else {
			ctx.sendError('token失效', 401);
		}
	}
}

module.exports = AdminController;
