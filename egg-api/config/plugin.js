/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 跨域问题
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // alinode: {
  //   enable: true,
  //   package: 'egg-alinode',
  // },
};
