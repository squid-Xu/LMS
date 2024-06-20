/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 路由前缀
  router.prefix('/lsm-api/v1');

  // router.get('/', controller.home.index);

  // 管理员
  router.post('/admin/login', controller.admin.login);
  router.get('/admin/info', controller.admin.info);
  // 图书分类
  router.post('/class_info/add', controller.class_info.add);
};
