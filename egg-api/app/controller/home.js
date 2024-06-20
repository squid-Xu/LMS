const { Controller } = require('egg');

class HomeController extends Controller {
	/**
	 *     ssasa
	 */
	async index() {
		const { ctx } = this;
		const user = await ctx.service.home.find();
		ctx.body = user;
	}
}

module.exports = HomeController;
