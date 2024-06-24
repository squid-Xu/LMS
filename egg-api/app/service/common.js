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
    //     const class_info_total = await this.app.mysql.query(`
    //         SELECT
    //         DATE(create_time) as date,
    //         COUNT(*) as class_info_total
    //         FROM
    //         class_info
    //         WHERE
    //         create_time BETWEEN '2024-06-10 00:00:00' AND '2024-06-24 23:59:59'
    //         GROUP BY
    //         date
    //         ORDER BY
    //         date DESC;
    //   `);
    const class_info_total = await this.app.mysql.query(`
            SELECT date, SUM(count_per_day) AS total_count
            FROM (
                SELECT DATE(create_time) AS date, COUNT(*) AS count_per_day
                FROM class_info
                WHERE create_time BETWEEN '2024-06-10 00:00:00' AND '2024-06-24 23:59:59'
                GROUP BY DATE(create_time)
                UNION ALL
                SELECT DATE(create_time) AS date, COUNT(*) AS count_per_day
                FROM book_info
                WHERE create_time BETWEEN '2024-06-10 00:00:00' AND '2024-06-24 23:59:59'
                GROUP BY DATE(create_time)
            ) AS subquery
            GROUP BY date
            ORDER BY date;
`);
    return class_info_total;
  }

}


module.exports = CommonService;
