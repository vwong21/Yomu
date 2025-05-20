import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import '../../Normalize.css';
import styles from './Browse.module.css';
import { MangaCardBrowse } from '../common/MangaCardBrowse/MangaCardBrowse';

const COLUMN_COUNT = 4;
const CARD_HEIGHT_REM = 25; // 400px / 16
const VERTICAL_GAP_REM = 1; // 16px / 16
const HORIZONTAL_GAP_REM = 0.75; // 12px / 16
const PADDING_REM = 2;
const FETCH_BATCH_SIZE = 40;
const REM_TO_PX = 16;
const ROW_HEIGHT = (CARD_HEIGHT_REM + VERTICAL_GAP_REM) * REM_TO_PX;

export const Browse = ({ selectedExtension }) => {
	const [mangaObj, setMangaObj] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const loadingRef = useRef(false);

	const fetchManga = useCallback(
		async (currentOffset) => {
			if (loadingRef.current || !selectedExtension || !hasMore) return;

			loadingRef.current = true;
			try {
				const res = await window.api.browseManga(
					selectedExtension,
					currentOffset,
					FETCH_BATCH_SIZE
				);

				if (Array.isArray(res) && res.length > 0) {
					setMangaObj((prev) => [...prev, ...res]);
					setOffset((prev) => prev + res.length);

					if (res.length < FETCH_BATCH_SIZE) {
						setHasMore(false);
					}
				} else {
					setHasMore(false);
				}
			} catch (error) {
				console.error('Error fetching manga:', error);
				setHasMore(false);
			} finally {
				loadingRef.current = false;
			}
		},
		[selectedExtension, hasMore]
	);

	useEffect(() => {
		setMangaObj([]);
		setOffset(0);
		setHasMore(true);
		loadingRef.current = false;
		fetchManga(0);
	}, [selectedExtension, fetchManga]);

	const handleItemsRendered = useCallback(
		({ visibleRowStopIndex, overscanRowStopIndex }) => {
			const totalRows = Math.ceil(mangaObj.length / COLUMN_COUNT);
			const lastRow = totalRows - 1;

			if (
				!loadingRef.current &&
				hasMore &&
				(visibleRowStopIndex >= lastRow ||
					overscanRowStopIndex >= lastRow)
			) {
				if (offset === mangaObj.length) {
					fetchManga(offset);
				}
			}
		},
		[hasMore, mangaObj.length, offset, fetchManga]
	);

	const rowCount =
		Math.ceil(mangaObj.length / COLUMN_COUNT) + (hasMore ? 1 : 0);

	const Cell = ({ columnIndex, rowIndex, style }) => {
		const index = rowIndex * COLUMN_COUNT + columnIndex;
		if (index >= mangaObj.length) return null;
		const manga = mangaObj[index];

		return (
			<div
				style={{
					...style,
					boxSizing: 'border-box',
					padding: `${0.5}rem`,
				}}>
				<div
					style={{
						width: '100%',
						height: `${CARD_HEIGHT_REM}rem`,
						boxSizing: 'border-box',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<MangaCardBrowse
						id={manga.id}
						title={manga.title}
						coverArt={manga.coverArt}
						className={styles.mangaCardBrowse}
					/>
				</div>
			</div>
		);
	};

	return (
		<div
			id={styles.browseContainer}
			style={{
				height: '100vh',
				width: '100%',
				overflow: 'hidden',
				boxSizing: 'border-box',
			}}>
			<AutoSizer>
				{({ height, width }) => {
					const paddingPx = PADDING_REM * REM_TO_PX;
					const totalHorizontalPadding = 2 * paddingPx;
					const availableWidth = width - totalHorizontalPadding;
					const columnWidth = availableWidth / COLUMN_COUNT;

					return (
						<div
							style={{
								padding: `${PADDING_REM}rem`,
								boxSizing: 'border-box',
								height,
								width,
							}}>
							<Grid
								columnCount={COLUMN_COUNT}
								columnWidth={columnWidth}
								height={height}
								rowCount={rowCount}
								rowHeight={ROW_HEIGHT}
								width={availableWidth}
								overscanRowCount={3}
								onItemsRendered={handleItemsRendered}
								outerRef={(ref) => {
									if (ref)
										ref.classList.add(styles.noScrollbar);
								}}>
								{Cell}
							</Grid>
						</div>
					);
				}}
			</AutoSizer>

			{loadingRef.current && mangaObj.length === 0 && (
				<div className={styles.spinnerCentered}>
					<div className={styles.spinner}></div>
				</div>
			)}
		</div>
	);
};
