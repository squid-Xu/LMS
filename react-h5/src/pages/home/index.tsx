import './index.less';
import { SearchBar } from 'antd-mobile';
import { InfiniteScroll, List } from 'antd-mobile';
import { lend_self_list } from '@/api/lend_list';
import { useState } from 'react';
import type { listType } from './type';

function Home() {
	const [list, setList] = useState<listType[]>([]);
	const [val, setVal] = useState<string>('');
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
		setVal(val);
		lend_self_list({
			pageNum: 1,
			pageSize: 10,
			phone: val,
		})
			.then(res => {
				setList(res.data.list);
			})
			.catch(() => {
				setList([]);
			});
	}

	const [hasMore, setHasMore] = useState(true);
	async function loadMore() {
		if (!val) return;
		const res = await lend_self_list({
			pageNum: 1,
			pageSize: 10,
			phone: val,
		});
		setList(res.data.list);
		setHasMore(res.data.list.length > 0);
	}

	return (
		<div className="container">
			<SearchBar placeholder="请输入手机号查询" onClear={onClear} onSearch={onSearch} />
			{/* <ul>
				{list.map(v => (
					<li key={v.ser_num}>{v.phone}</li>
				))}
			</ul> */}

			<List>
				{list.map(v => (
					<List.Item key={v.ser_num}>{v.book_name}</List.Item>
				))}
			</List>
			<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
		</div>
	);
}

export default Home;
