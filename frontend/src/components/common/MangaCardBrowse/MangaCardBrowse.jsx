import React from 'react';
import '../../../Normalize.css';
import styles from './MangaCardBrowse.module.css';

export const MangaCardBrowse = ({ id, title, coverArt }) => {
	// Safe check for title.en existing before accessing length
	const titleText = title.en || title || ''; // fallback to empty string if undefined
	const truncatedTitle =
		titleText.length > 50 ? titleText.slice(0, 50) + '...' : titleText;

	return (
		<div className={styles.mangaCardBrowseContainer}>
			<img
				className={styles.coverArt}
				src={coverArt}
				alt=''
				loading='lazy'
			/>
			<p className={styles.title}>{truncatedTitle}</p>
		</div>
	);
};
