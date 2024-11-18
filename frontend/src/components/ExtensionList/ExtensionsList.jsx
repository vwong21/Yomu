import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import './ExtensionsList.css';
import { ExtensionCard } from '../common/ExtensionCard/ExtensionCard';
import Checkbox from 'react-custom-checkbox';

export const ExtensionsList = () => {
	// State to either show all the extensions or only the installed ones. False will show all extensions
	const [filterInstalledExtensions, setFilterInstalledExtensions] =
		useState(false);

	// State that will be an array of all extensions. This array may be filtered depending on the filterExtensions state
	const [allExtensions, setAllExtensions] = useState([]);

	const [loading, setLoading] = useState(true);

	const [installedExtensions, setInstalledExtensions] = useState([]);

	const [isChecked, setIsChecked] = useState(false);

	const handleChecked = (checked) => {
		setIsChecked(checked);

		// Filter extensions to show only installed ones when checked is true
		if (checked) {
			const installed = allExtensions.filter(
				(extension) => extension.installed === true
			);
			setInstalledExtensions(installed);
		} else {
			// If unchecked, show all extensions
			setInstalledExtensions(allExtensions);
		}
	};

	// Function to fetch all extensions
	const fetchExtensions = async () => {
		try {
			const res = await window.api.retrieveExtensions();
			setAllExtensions(res);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	// Fetch extensions when component mounts
	useEffect(() => {
		fetchExtensions();
	}, []);

	return (
		<div id='extensions-component'>
			<div id='show-extensions'>
				<header id='extensions-header'>
					<h2 id='extensions-h2'>Extensions</h2>
					<div id='input-container'>
						<input
							type='search'
							placeholder='Search Extensions'
							id='search-extensions'
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
					<div id='extensions-list-container'>
						{isChecked &&
							installedExtensions.map((extension, index) => (
								<ExtensionCard
									key={index}
									name={extension.name}
									description={extension.description}
									image={extension.image}
									installed={extension.installed}
								/>
							))}
						{!isChecked &&
							allExtensions.map((extension, index) => (
								<ExtensionCard
									key={index}
									name={extension.name}
									description={extension.description}
									image={extension.image}
									installed={extension.installed}
								/>
							))}
					</div>
				)}
			</div>
		</div>
	);
};
