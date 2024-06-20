const { Service } = require('egg');

class AdminService extends Service {
	/**
	 * 登录
	 * @param {*} data
	 * @returns
	 */
	async login(data) {
		const accountInfo = await this.app.mysql.get('admin', { username: data.username, password: data.password });
		if (accountInfo) {
			return accountInfo;
		}
		this.ctx.sendError('账号或密码错误');
		return false;
	}
	/**
	 * 获取用户信息
	 * @param {*} admin_id
	 * @returns
	 */
	async getById(admin_id) {
		const accountInfo = await this.app.mysql.get('admin', { admin_id });
		return accountInfo;
	}
}

module.exports = AdminService;
