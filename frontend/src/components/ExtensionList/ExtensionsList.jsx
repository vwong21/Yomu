import React, { useEffect, useState, useMemo } from 'react';
import '../../Normalize.css';
import styles from './ExtensionsList.module.css';
import { ExtensionCard } from '../common/ExtensionCard/ExtensionCard';
import Checkbox from 'react-custom-checkbox';

export const ExtensionsList = ({ onExtensionSelect }) => {
	// State that holds list of all extensions
	const [availableExtensions, setAvailableExtensions] = useState([]);
	// State sets loading screen
	const [loading, setLoading] = useState(true);
	// State that holds list of installed extensions
	const [installedExtensions, setInstalledExtensions] = useState([]);

	const [isChecked, setIsChecked] = useState(true);

	const [searchQuery, setSearchQuery] = useState(''); // Track search input
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // Debounced search input

	const handleChecked = (checked) => {
		setIsChecked(checked);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value); // Update search query immediately
	};

	// Debouncing search query to optimize performance
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery); // Update the debounced search query after a delay
		}, 500); // 500ms delay

		return () => clearTimeout(timer); // Clear previous timeout on new search input
	}, [searchQuery]);

	// Function to fetch all extensions
	const fetchExtensions = async () => {
		try {
			const res = await window.api.retrieveExtensions();
			console.log(res);
			setAvailableExtensions(res.downloadable);
			setInstalledExtensions(res.installed);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	// Fetch extensions when component mounts
	useEffect(() => {
		fetchExtensions();
	}, []);

	// Memoize the filtered extensions to prevent unnecessary recalculation
	const displayedExtensions = useMemo(() => {
		const source = isChecked ? installedExtensions : availableExtensions;
		return source.filter((extension) =>
			extension.name
				.toLowerCase()
				.includes(debouncedSearchQuery.toLowerCase())
		);
	}, [
		isChecked,
		installedExtensions,
		availableExtensions,
		debouncedSearchQuery,
	]);

	return (
		<div id={styles.extensionsComponent}>
			<div id={styles.showExtensions}>
				<header id={styles.extensionsHeader}>
					{isChecked && <h2 id={styles.extensionsH2}>Extensions</h2>}
					{!isChecked && <h2 id={styles.extensionsH2}>Browse</h2>}

					<div id={styles.inputContainer}>
						<input
							type='search'
							placeholder='Search Extensions'
							id={styles.searchExtensions}
							value={searchQuery}
							onChange={handleSearchChange} // Handle search input change
						/>
						<Checkbox
							checked={isChecked}
							onChange={handleChecked}
							style={{
								backgroundColor: '#363636', // Set background color
								border: 'none', // Remove borders
								color: '#212121', // Set check icon color
							}}
						/>
					</div>
				</header>

				{loading && <p>Loading...</p>}

				{!loading && (
					<div id={styles.extensionsListContainer}>
						{displayedExtensions.map((extension, index) => {
							const isInstalled = installedExtensions.some(
								(installedExtension) =>
									installedExtension.name === extension.name
							);
							console.log(isInstalled, extension.name);
							return (
								<ExtensionCard
									key={index}
									name={extension.name}
									description={extension.description}
									image={extension.image}
									installed={isInstalled} // Dynamically determine installed state
									onExtensionSelect={onExtensionSelect}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
