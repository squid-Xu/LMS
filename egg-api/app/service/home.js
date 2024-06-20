const { Service } = require('egg');

class HomeService extends Service {

  // 查询单个用户信息
  async find() {
    const user = await this.app.mysql.get('admin', { admin_id: 1 });
    return { user };
  }

}


module.exports = HomeService;
