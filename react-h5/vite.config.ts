import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: '0.0.0.0',
		/** 接口代理 */
		proxy: {
			'/lsm-api/v1': {
				target: 'http://127.0.0.1:7001',
				ws: true,
				/** 是否允许跨域 */
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
