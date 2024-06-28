export default {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 75, // 设计稿宽度的1/10，代表 1rem=75px
            unitPrecision: 5, //允许REM单位增加的十进制数字。
            propList: ['*'], // 需要做转化处理的css属性  * 就是所有属性都要转换，如`hight`、`width`、`margin`等，`*`表示全部
            selectorBlackList: [], //要忽略的选择器，保留为px
            replace: true, //替换包含rems的规则。
            mediaQuery: false,//允许在媒体查询中转换px。
            minPixelValue: 0,//设置要替换的最小像素值。
            exclude: /node_modules/i, //要忽略并保留为px的文件路径。
        },
    },
};
