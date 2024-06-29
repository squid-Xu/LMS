import axios from 'axios';
import { Toast } from 'antd-mobile';

// 创建axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_API, // api的base_url
	timeout: 60000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
	config => {
		// 可以在这里添加请求头等信息
		return config;
	},
	error => {
		// 请求错误处理
		console.log(error); // for debug
		Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	response => {
		// 对响应数据做处理，例如只返回data部分
		const result = response.data;
		// 根据返回的状态码做相应处理，例如401未授权等
		if (result.code === 200) {
			return result;
		} else {
			Toast.show({
				icon: 'fail',
				content: result.message,
			});
			return Promise.reject(new Error('Error'));
		}
	},
	error => {
		// 响应错误处理
		switch (error.response.status) {
			case 400:
				error.message = '请求错误';
				break;
			case 401:
				// Token 过期时
				error.message = '非法请求';
				break;
			case 403:
				error.message = '拒绝访问';
				break;
			case 404:
				error.message = '请求地址出错';
				break;
			case 408:
				error.message = '请求超时';
				break;
			case 500:
				error.message = '服务器内部错误';
				break;
			case 501:
				error.message = '服务未实现';
				break;
			case 502:
				error.message = '网关错误';
				break;
			case 503:
				error.message = '服务不可用';
				break;
			case 504:
				error.message = '网关超时';
				break;
			case 505:
				error.message = 'HTTP 版本不受支持';
				break;
			default:
				break;
		}
		Toast.show({
			icon: 'fail',
			content: error.message,
		});
		return Promise.reject(new Error('Error'));
	}
);

export default service;
