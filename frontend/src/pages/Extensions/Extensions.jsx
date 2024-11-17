import React from 'react';
import '../../Normalize.css';
import './Extensions.css';
import { Nav } from '../../components/Nav/Nav';
import { ExtensionsList } from '../../components/ExtensionList/ExtensionsList';
import { Frame } from '../../components/Frame/Frame';

export const Extensions = () => {
	return (
		<div id='app'>
			<Frame />
			<Nav />
			<ExtensionsList />
			<section id='details'></section>
		</div>
	);
};
