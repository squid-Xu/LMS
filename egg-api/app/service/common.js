const { Service } = require('egg');

class CommonService extends Service {

  // 统计
  async statistics() {
    const class_info_total = await this.app.mysql.count('class_info');
    const book_info_total = await this.app.mysql.count('book_info');
    const reader_info_total = await this.app.mysql.count('reader_info');
    const lend_list_total = await this.app.mysql.count('lend_list', { status: 1 });
    return {
      class_info_total,
      book_info_total,
      reader_info_total,
      lend_list_total,
    };
  }

  //   折线图
  async echarts() {
    const class_info_total = await this.app.mysql.query(`
          select a.click_date,ifnull(b.nums,0) as count
          from (
              SELECT curdate() as click_date
              union all
              SELECT date_sub(curdate(), interval 1 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 2 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 3 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 4 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 5 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 6 day) as click_date
          ) a left join (
            SELECT 
            DATE_FORMAT(create_time,"%Y-%m-%d") as createtimes,
            COUNT(*) as nums
            FROM class_info 
            where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) 
            GROUP BY DATE_FORMAT(create_time,"%Y-%m-%d")
            ORDER BY DATE_FORMAT(create_time,"%Y-%m-%d") DESC
          ) b on a.click_date = b.createtimes;
      `);
    const book_info_total = await this.app.mysql.query(`
          select a.click_date,ifnull(b.nums,0) as count
          from (
              SELECT curdate() as click_date
              union all
              SELECT date_sub(curdate(), interval 1 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 2 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 3 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 4 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 5 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 6 day) as click_date
          ) a left join (
            SELECT 
            DATE_FORMAT(create_time,"%Y-%m-%d") as createtimes,
            COUNT(*) as nums
            FROM book_info 
            where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) 
            GROUP BY DATE_FORMAT(create_time,"%Y-%m-%d")
            ORDER BY DATE_FORMAT(create_time,"%Y-%m-%d") DESC
          ) b on a.click_date = b.createtimes;
    `);
    const reader_info_total = await this.app.mysql.query(`
          select a.click_date,ifnull(b.nums,0) as count
          from (
              SELECT curdate() as click_date
              union all
              SELECT date_sub(curdate(), interval 1 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 2 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 3 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 4 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 5 day) as click_date
              union all
              SELECT date_sub(curdate(), interval 6 day) as click_date
          ) a left join (
            SELECT 
            DATE_FORMAT(create_time,"%Y-%m-%d") as createtimes,
            COUNT(*) as nums
            FROM reader_info 
            where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) 
            GROUP BY DATE_FORMAT(create_time,"%Y-%m-%d")
            ORDER BY DATE_FORMAT(create_time,"%Y-%m-%d") DESC
          ) b on a.click_date = b.createtimes;
    `);
    return { class_info_total, book_info_total, reader_info_total };
  }

}


module.exports = CommonService;
