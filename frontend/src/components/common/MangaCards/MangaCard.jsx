import React from 'react';
import '../../../Normalize.css';
import styles from './MangaCard.module.css';

export const MangaCard = ({ name, author, image }) => {
	// Takes name, author, image passed from Library.jsx for the individual manga cards.
	return (
		<div id={styles.mangaCard}>
			<div id={styles.cardContainer}>
				<div
					id={styles.imageContainer}
					className={styles.cardContainerChildren}>
					<img className={styles.mangaCover} src={image} alt='' />
				</div>

				<div
					id={styles.textContainer}
					className={styles.cardContainerChildren}>
					<p id={styles.mangaTitle}>{name}</p>
					<p id={styles.mangaAuthor}>{author}</p>
				</div>
			</div>
		</div>
	);
};
