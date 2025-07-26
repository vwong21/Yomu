import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import '../../Normalize.css';
import styles from './Browse.module.css';
import { MangaCardBrowse } from '../common/MangaCardBrowse/MangaCardBrowse';
import { CiSearch } from 'react-icons/ci';

const COLUMN_COUNT = 4;
const VERTICAL_GAP_REM = 1; // 16px / 16
const PADDING_REM = 2;
const FETCH_BATCH_SIZE = 40;
const REM_TO_PX = 16;

export const Browse = ({ selectedExtension }) => {
	const [searchInput, setSearchInput] = useState('')
	const [mangaObj, setMangaObj] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const loadingRef = useRef(false);
	const hasMoreRef = useRef(true);

const handleSearch = async () => {
	if (!selectedExtension || !searchInput.trim()) {
		console.log('Search aborted: missing extension or empty input');
		return;
	}

	console.log(`Searching for "${searchInput.trim()}" using ${selectedExtension}`);
	loadingRef.current = true;

	try {
		const res = await window.api.searchManga(
			selectedExtension,
			searchInput.trim()
		);

		console.log('Raw search response:', res);

		if (Array.isArray(res) && res.length > 0) {
			console.log(`Search successful. Found ${res.length} results.`);
			setMangaObj(res);
			setOffset(res.length);
			setHasMore(false); // disable infinite scroll after search
			hasMoreRef.current = false;
		} else {
			console.log('Search returned no results.');
			setMangaObj([]);
			setHasMore(false);
			hasMoreRef.current = false;
		}
	} catch (error) {
		console.error('Search failed:', error);
		setMangaObj([]);
		setHasMore(false);
		hasMoreRef.current = false;
	} finally {
		loadingRef.current = false;
		console.log(mangaObj)
		console.log('Search completed.');
	}
};


	const fetchManga = useCallback(
		async (currentOffset) => {
			if (loadingRef.current || !selectedExtension || !hasMoreRef.current)
				return;

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
						hasMoreRef.current = false;
					} else {
						setHasMore(true);
						hasMoreRef.current = true;
					}
				} else {
					setHasMore(false);
					hasMoreRef.current = false;
				}
			} catch (error) {
				console.error('Error fetching manga:', error);
				setHasMore(false);
				hasMoreRef.current = false;
			} finally {
				loadingRef.current = false;
			}
		},
		[selectedExtension]
	);

	useEffect(() => {
	if (searchInput.trim() === '') {
			setMangaObj([]);
			setOffset(0);
			setHasMore(true);
			hasMoreRef.current = true;
			loadingRef.current = false;
			fetchManga(0);
		}
	}, [searchInput, fetchManga]);

	useEffect(() => {
		setMangaObj([]);
		setOffset(0);
		setHasMore(true);
		hasMoreRef.current = true;
		loadingRef.current = false;
		fetchManga(0);
	}, [selectedExtension, fetchManga]);

	const handleItemsRendered = useCallback(
		({ visibleRowStopIndex, overscanRowStopIndex }) => {
			const totalRows = Math.ceil(mangaObj.length / COLUMN_COUNT);
			const lastRow = totalRows - 1;

			if (
				!loadingRef.current &&
				hasMoreRef.current &&
				(visibleRowStopIndex >= lastRow ||
					overscanRowStopIndex >= lastRow)
			) {
				if (offset === mangaObj.length) {
					fetchManga(offset);
				}
			}
		},
		[mangaObj.length, offset, fetchManga]
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
						height: '100%',
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
		<div id={styles.browseMain}>
			<div id={styles.searchContainer}>
				<input type='text' id={styles.searchInput} onChange={(e) => setSearchInput(e.target.value)} />
				<button id={styles.search} onClick={handleSearch}>
					<CiSearch style={{ width: '1.5rem', height: '1.5rem' }} />
				</button>
			</div>
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

						// Maintain 3:5 aspect ratio (width:height) + vertical gap
						const cardHeight = columnWidth * (5 / 3);
						const rowHeight =
							cardHeight + VERTICAL_GAP_REM * REM_TO_PX;

						return (
							<div
								style={{
									padding: `${
										PADDING_REM / 2
									}rem ${PADDING_REM}rem ${PADDING_REM}rem ${PADDING_REM}rem`,
									boxSizing: 'border-box',
									height,
									width,
								}}>
								<Grid
									columnCount={COLUMN_COUNT}
									columnWidth={columnWidth}
									height={height}
									rowCount={rowCount}
									rowHeight={rowHeight}
									width={availableWidth}
									overscanRowCount={3}
									onItemsRendered={handleItemsRendered}
									outerRef={(ref) => {
										if (ref)
											ref.classList.add(
												styles.noScrollbar
											);
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
		</div>
	);
};
