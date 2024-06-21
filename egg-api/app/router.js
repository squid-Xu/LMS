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
  router.post('/class_info/add', controller.classInfo.add);
  router.put('/class_info/edit', controller.classInfo.edit);
  router.delete('/class_info/delete/:id', controller.classInfo.delete);
  router.get('/class_info/list', controller.classInfo.list);
  router.get('/class_info/page', controller.classInfo.page);

  // 图书管理
  router.post('/book_info/add', controller.bookInfo.add);
  router.put('/book_info/edit', controller.bookInfo.edit);
  router.delete('/book_info/delete/:id', controller.bookInfo.delete);
  router.get('/book_info/list', controller.bookInfo.list);
};
