import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import styles from './Browse.module.css';
import { MangaCardBrowse } from '../common/MangaCardBrowse/MangaCardBrowse';

export const Browse = ({ selectedExtension }) => {
	const [loading, setLoading] = useState(false);
	const [mangaObj, setMangaObj] = useState([]);
	const [offset, setOffset] = useState(0);

	const browseManga = async () => {
		if (loading) return;
		if (!selectedExtension) return;
		try {
			console.log(offset);
			setLoading(true);
			const res = await window.api.browseManga(selectedExtension, offset);
			console.log(res);
			if (Array.isArray(res)) {
				setMangaObj((prev) => [...prev, ...res]);
			}
			setOffset((prevOffset) => {
				const nextOffset =
					prevOffset + (Array.isArray(res) ? res.length : 0);
				return nextOffset;
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		setMangaObj([]);
		setOffset(0);
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
