const { Service } = require('egg');

class CommonService extends Service {

  // 统计
  async statistics() {
    const class_info_total = await this.app.mysql.count('class_info');
    const book_info_total = await this.app.mysql.count('book_info');
    const reader_info_total = await this.app.mysql.count('reader_info');
    const admin_total = await this.app.mysql.count('admin', { roles: 'editor' });
    return {
      class_info_total,
      book_info_total,
      reader_info_total,
      admin_total,
    };
  }

  //   折线图
  async echarts() {

    // 分类新增折线图
    const class_info = await this.app.mysql.query(`
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

    // 图书新增折线图
    const book_info = await this.app.mysql.query(`
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

    // 会员新增折线图
    const reader_info = await this.app.mysql.query(`
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

    // 借出新增折线图
    const borrow = await this.app.mysql.query(`
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
            FROM lend_list 
            where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) AND status = 1
            GROUP BY DATE_FORMAT(create_time,"%Y-%m-%d")
            ORDER BY DATE_FORMAT(create_time,"%Y-%m-%d") DESC
          ) b on a.click_date = b.createtimes;
    `);

    // 归还新增折线图
    const give_back = await this.app.mysql.query(`
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
        FROM lend_list 
        where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) AND status = 2
        GROUP BY DATE_FORMAT(create_time,"%Y-%m-%d")
        ORDER BY DATE_FORMAT(create_time,"%Y-%m-%d") DESC
      ) b on a.click_date = b.createtimes;
`);

    return { class_info, book_info, reader_info, borrow, give_back };
  }

  // 饼状图
  async pie() {
    const was_due_total = await this.app.mysql.query('SELECT COUNT(*) AS nums FROM reader_info WHERE expire < CURDATE()');
    const reader_total = await this.app.mysql.count('reader_info');
    const no_return_total = await this.app.mysql.count('lend_list', { status: 1 });
    const lend_total = await this.app.mysql.count('lend_list');
    return {
      was_due_total: was_due_total[0].nums,
      reader_total,
      no_return_total,
      lend_total,
    };
  }

}


module.exports = CommonService;
