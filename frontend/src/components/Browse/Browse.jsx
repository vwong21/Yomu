import React from 'react';
import '../../Normalize.css';
import styles from './Browse.module.css';

export const Browse = ({ selectedExtension }) => {
	console.log(`from Browse: ${selectedExtension}`);
	return <div id={styles.browseContainer}></div>;
};
