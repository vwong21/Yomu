import React from 'react';
import '../../../Normalize.css';
import styles from './MangaCardBrowse.module.css';

export const MangaCardBrowse = ({ id, title, coverArt }) => {
	console.log(id, title, coverArt);
	return (
		<div className={styles.mangaCardBrowseContainer}>
			<img className={styles.coverArt} src={coverArt} alt='' />
			<p className={styles.title}>{title.en}</p>
		</div>
	);
};
