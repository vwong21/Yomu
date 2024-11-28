import React from 'react';
import '../../Normalize.css';
import styles from './Home.module.css';
import { Nav } from '../../components/Nav/Nav';
import { Library } from '../../components/Library/Library';
import { Frame } from '../../components/Frame/Frame';

export const Home = () => {
	return (
		<div id={styles.app}>
			<Frame />
			{/* 3 sections, navbar, library, and details */}
			<Nav />
			<Library />
			<section id={styles.details}></section>
		</div>
	);
};
