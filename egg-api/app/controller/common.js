const { Controller } = require('egg');

class CommonController extends Controller {
  // 统计
  async statistics() {
    const { ctx } = this;
    const res = await ctx.service.common.statistics();
    ctx.sendSuccess(res);
  }
  // 折线图
  async echarts() {
    const { ctx } = this;
    const res = await ctx.service.common.echarts();
    ctx.sendSuccess(res);
  }
}

module.exports = CommonController;
