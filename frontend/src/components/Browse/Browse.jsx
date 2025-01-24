import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import styles from './Browse.module.css';
import { MangaCardBrowse } from '../common/MangaCardBrowse/MangaCardBrowse';

export const Browse = ({ selectedExtension }) => {
	console.log(`from Browse: ${selectedExtension}`);
	const [mangaObj, setMangaObj] = useState([]);

	useEffect(() => {
		const browseManga = async () => {
			try {
				const res = await window.api.browseManga(selectedExtension);
				console.log(res);
				if (Array.isArray(res)) {
					setMangaObj(res);
				}
			} catch (error) {
				console.error(error);
			}
		};
		browseManga();
	}, [selectedExtension]);

	return (
		<div id={styles.browseContainer}>
			<div id={styles.gridContainer}>
				{mangaObj.length > 0 &&
					mangaObj.map((manga, index) => {
						return (
							<MangaCardBrowse
								key={index}
								id={manga.id}
								title={manga.title}
								coverArt={manga.coverArt}
								className={styles.mangaCardBrowse}
							/>
						);
					})}
			</div>
		</div>
	);
};
