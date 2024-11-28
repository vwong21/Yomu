import React from 'react';
import '../../Normalize.css';
import styles from './Extensions.module.css';
import { Nav } from '../../components/Nav/Nav';
import { ExtensionsList } from '../../components/ExtensionList/ExtensionsList';
import { Frame } from '../../components/Frame/Frame';

export const Extensions = () => {
	return (
		<div id='app' className={styles.app}>
			<Frame />
			<Nav />
			<ExtensionsList />
			<section id={styles.details}></section>
		</div>
	);
};
