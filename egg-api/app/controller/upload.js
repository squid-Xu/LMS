const { Controller } = require('egg');
const xlsx = require('xlsx');

class UploadController extends Controller {
  // 批量导入图书
  async importExcel() {
    const { ctx } = this;
    const file = ctx.request.files[0]; // 获取上传的文件
    const workbook = xlsx.readFile(file.filepath); // 读取文件
    const sheetNames = workbook.SheetNames; // 获取所有sheet的名字
    const sheet = workbook.Sheets[sheetNames[0]]; // 获取第一个sheet
    const data = xlsx.utils.sheet_to_json(sheet); // 将sheet转换为JSON数据

    // 一条一条添加
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      // 假设每行数据是一个对象，对应数据库的字段
      const record = {
        ISBN: item['序号'],
        book_name: item['书目'],
        author: item['作者'],
        publish: item['出版社'],
        class_id: 1,
        price: 0,
        number: 0,
      };
      if (!record.ISBN) {
        this.ctx.sendError(`第${i + 1}行数据导入失败, 序号不能为空`);
        return;
      }
      if (!record.book_name) {
        this.ctx.sendError(`第${i + 1}行数据导入失败, 书目不能为空`);
        return;
      }
      if (!record.author) {
        this.ctx.sendError(`第${i + 1}行数据导入失败, 作者不能为空`);
        return;
      }
      if (!record.publish) {
        this.ctx.sendError(`第${i + 1}行数据导入失败, 出版社不能为空`);
        return;
      }
      // 插入数据库
      const res = await ctx.service.bookInfo.batch(record);
      if (res === false) {
        this.ctx.sendError(`第${i + 1}行数据导入失败,序号：${record.ISBN}已存在`);
        return;
      }
    }
    ctx.sendSuccess('添加成功');

    // 以下是批量添加
    // const values = []; // [ [1,'张三','13519105845',...] ,[],[]...    ]
    // data.forEach(item => {
    //   const _arr = [];
    //   _arr[0] = item['序号'];
    //   _arr[1] = item['书目'];
    //   _arr[2] = item['作者'];
    //   _arr[3] = item['出版社'];
    //   _arr[4] = 1;
    //   _arr[5] = 0;
    //   _arr[6] = 0;
    //   values.push(_arr);
    // });
    // // 重点sql语句
    // const addSql = 'INSERT INTO book_info (ISBN,book_name,author,publish,class_id,price,number) VALUES ?';
    // const _result = await this.app.mysql.query(addSql, [ values ]);
    // ctx.sendSuccess(_result);
  }
}

module.exports = UploadController;
