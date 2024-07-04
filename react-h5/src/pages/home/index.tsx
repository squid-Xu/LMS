import { useState } from 'react';
import { SearchBar, Footer, ErrorBlock } from 'antd-mobile';
import { lend_self_list } from '@/api/lend_list';
import type { listType } from './type';
import './index.less';

function Home() {
	const [list, setList] = useState<listType[]>([]);
	/**
	 * 点击清除按钮
	 */
	function onClear() {
		setList([]);
	}
	/**
	 * 点击回车按钮
	 * @param val
	 */
	function onSearch(val: string) {
		lend_self_list({
			pageNum: 1,
			pageSize: 100,
			phone: val,
		})
			.then(res => {
				setList(res.data.list);
			})
			.catch(() => {
				setList([]);
			});
	}

	return (
		<div className="container">
			<SearchBar placeholder="请输入手机号查询" maxLength={11} onClear={onClear} onSearch={onSearch} />
			<div className="list">
				{list.map(v => (
					<div className="item" key={v.ser_num}>
						<div className="nav-top">
							<div className="date">{v.lend_date}</div>
							<div
								className="type"
								style={{
									color: v.status === 1 ? '#FF9C00' : '#999999',
								}}
							>
								{v.status === 1 ? '未归还' : '已归还'}
							</div>
						</div>
						<div className="shop-name">{v.book_name}</div>
					</div>
				))}
			</div>

			{list.length === 0 && <ErrorBlock fullPage description="换个手机号试试~~" status="empty" />}

			{list.length > 0 && <Footer label="没有更多了" />}
		</div>
	);
}

export default Home;
