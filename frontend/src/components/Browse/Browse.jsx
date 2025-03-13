import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import styles from './Browse.module.css';
import { MangaCardBrowse } from '../common/MangaCardBrowse/MangaCardBrowse';

export const Browse = ({ selectedExtension }) => {
	const [loading, setLoading] = useState(false);
	const [mangaObj, setMangaObj] = useState([]);

	const browseManga = async () => {
		try {
			setLoading(true);
			const res = await window.api.browseManga(selectedExtension);
			console.log(res);
			if (Array.isArray(res)) {
				setMangaObj((prev) => [...prev, ...res]);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		browseManga();
	}, [selectedExtension]);

	return (
		<div id={styles.browseContainer}>
			{loading && <p id={styles.loading}>Loading...</p>}
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
				{mangaObj.length > 0 && (
					<p
						id={styles.loadMore}
						onClick={() => {
							browseManga();
						}}>
						Load More...
					</p>
				)}
			</div>
		</div>
	);
};
