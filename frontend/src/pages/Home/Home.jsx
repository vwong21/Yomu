import React from 'react';
import '../../Normalize.css';
import styles from './Home.module.css';
import { Nav } from '../../components/Nav/Nav';
import { Library } from '../../components/Library/Library';
import { Frame } from '../../components/Frame/Frame';
import { Description } from '../../components/Description/Description';

export const Home = () => {
	return (
		<div id='app' className={styles.app}>
			<Frame />
			{/* 3 sections, navbar, library, and details */}
			<Nav />
			<Library />
			<Description />
		</div>
	);
};
