import { useEffect, useState } from 'react';
import styles from './Description.module.css';
import { useLocation, useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

export const Description = () => {
	const { id } = useParams();
	const location = useLocation();
	const selectedExtension = location.state?.selectedExtension;

	const [title, setTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [cover, setCover] = useState(null);
	const [chapters, setChapters] = useState([]);

	useEffect(() => {
		if (!selectedExtension || !id) return;

		const fetchDetails = async () => {
			try {
				const res = await window.api.getDetails(selectedExtension, id);

				setTitle(res.title || null);
				setDescription(res.description || null);
				setCover(res.coverArt || null);
				const seen = new Set();
				const uniqueChapters = [];

				for (const chapter of res.chapters || []) {
					const chapterNo = chapter.attributes.chapter;
					if (!seen.has(chapterNo)) {
						seen.add(chapterNo);
						uniqueChapters.push(chapter);
					}
				}

				setChapters(uniqueChapters || null);
				console.log(res.chapters);
			} catch (error) {
				console.error('Failed to fetch details:', error);
			}
		};

		fetchDetails();
	}, [selectedExtension, id]);

	return (
		<div id={styles.descriptionContainer}>
			<div id={styles.description}>
				<section
					id={styles.headerInfo}
					className={styles.descriptionChildren}>
					<div id={styles.coverImageContainer}>
						<img src={cover} alt='' />
					</div>
					<div id={styles.mangaDetailsContainer}>
						<h1 id={styles.mangaTitle}>{title}</h1>
						<p id={styles.mangaDescription}>{description}</p>
						<div id={styles.buttonContainer}>
							<div id={styles.readButton}>
								<FaPlay />
							</div>
						</div>
					</div>
				</section>
				<section
					id={styles.chapters}
					className={styles.descriptionChildren}>
					<table id={styles.chaptersTable}>
						<thead>
							<tr className={styles.tableRows}>
								<th className={styles.tableHeaders}>No.</th>
								<th className={styles.tableHeaders}>Title</th>
								<th className={styles.tableHeaders}>Volume</th>
							</tr>
						</thead>
						<tbody>
							{chapters.map((chapter) => (
								<tr>
									<td className={styles.tableCells}>
										{chapter.attributes.chapter}
									</td>
									<td className={styles.tableCells}>
										{chapter.attributes.title}
									</td>
									<td className={styles.tableCells}>
										{chapter.attributes.volume}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
};
