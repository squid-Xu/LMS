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
          SELECT
          days.date,
          count(class_info.class_name) AS num
          FROM
          (
            SELECT
              @date := DATE_ADD(@date, INTERVAL + 1 DAY) date
            FROM
              (
                SELECT
                  @date := DATE_ADD("2024-06-18", INTERVAL - 1 DAY)
                FROM
                  class_info
                LIMIT 7
              ) time
          ) AS days
          LEFT JOIN class_info ON TO_DAYS(class_info.create_time) = TO_DAYS(days.date)
          GROUP BY days.date
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
        SELECT 
            DATE(create_time) as date,
            COUNT(*) as new_count
        FROM 
            reader_info
        WHERE 
            create_time >= CURRENT_DATE - INTERVAL 7 DAY
        GROUP BY 
            DATE(create_time)
        ORDER BY 
            date;
    `);
    return { class_info_total, book_info_total, reader_info_total };
  }

}


module.exports = CommonService;
