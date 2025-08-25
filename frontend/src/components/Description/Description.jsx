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
	const [chapters, setChapters] = useState(null);

	useEffect(() => {
		if (!selectedExtension || !id) return;

		const fetchDetails = async () => {
			try {
				const res = await window.api.getDetails(selectedExtension, id);

				setTitle(res.title || null);
				setDescription(res.description || null);
				setCover(res.coverArt || null);
				setChapters(res.chapters || null);
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
					class={styles.descriptionChildren}>
					<div id={styles.coverImageContainer}>
						<img src={cover} alt='' />
					</div>
					<div id={styles.mangaDetailsContainer}>
						<h1 id={styles.mangaTitle}>{title}</h1>
						<p id={styles.mangaDescription}>{description}</p>
					</div>
				</section>
				<section
					id={styles.chapters}
					class={styles.descriptionChildren}>
					<div id={styles.buttonContainer}>
						<div id={styles.readButton}>
							Read Now <FaPlay />
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};
