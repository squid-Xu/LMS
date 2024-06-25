const { Controller } = require('egg');
const xlsx = require('xlsx');

class UploadController extends Controller {
  /**
	 *     ssasa
	 */
  async importExcel() {
    const { ctx } = this;
    const file = ctx.request.files[0]; // 获取上传的文件
    const workbook = xlsx.readFile(file.filepath); // 读取文件
    const sheetNames = workbook.SheetNames; // 获取所有sheet的名字
    const sheet = workbook.Sheets[sheetNames[0]]; // 获取第一个sheet
    const data = xlsx.utils.sheet_to_json(sheet); // 将sheet转换为JSON数据
    // 假设第一行是标题行，从第二行开始是数据
    // for (let i = 0; i < data.length; i++) {
    //   const row = data[i];
    //   // 假设每行数据是一个对象，对应数据库的字段
    //   const record = {
    //     // 根据实际字段名称和类型调整
    //     name: row['序号'],
    //     age: row['书目'],
    //   };
    //   console.log(record);
    //   // 插入数据库
    //   // await this.ctx.model.User.create(record);
    // }

    const values = []; // [ [1,'张三','13519105845',...] ,[],[]...    ]
    data.forEach(item => {
      const _arr = [];
      _arr[1] = item['序号'];
      _arr[2] = item['书目'];
      values.push(_arr);
    });


    ctx.sendSuccess(values);
  }
}

module.exports = UploadController;
