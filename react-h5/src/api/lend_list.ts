import request from '@/utils/request';

interface paramsType {
	pageSize: number;
	pageNum: number;
	phone: string;
}

export function lend_self_list(params: paramsType) {
	return request({
		url: `/app/lend_list/selfList`,
		method: 'get',
		params,
	});
}
