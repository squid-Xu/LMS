import React from 'react';
import Home from '@/pages/home';
import About from '@/pages/about';

export interface AppRoute {
	path: string;
	element: React.ReactNode;
	auth?: boolean;
	children?: AppRoute[];
}

export const routes: AppRoute[] = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/about',
		element: <About />,
	},
];
