import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import './InstalledExtensions.css';
import { ExtensionCard } from '../common/ExtensionCard/ExtensionCard';

export const InstalledExtensions = () => {
	// State to either show all the extensions or only the installed ones. False will show all extensions
	const [filterExtensions, setFilterExtensions] = useState(false);
	// State that will be an array of all extensions. This array may be filtered depending on the filterExtensions state
	const [installedExtensions, setInstalledExtensions] = useState([]);
	const [loading, setLoading] = useState(true);

	// Function to make call to retrieveExtensions function through IPC
	const fetchExtensions = async () => {
		try {
			const res = await window.api.retrieveExtensions();
			setInstalledExtensions(res);
			setLoading(false);
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	// UseEffect to refresh the renderer at the beginning and then fetch all the extensions
	useEffect(() => {
		fetchExtensions();
	}, []);

	return (
		<div id='installed-extensions'>
			<h2>Manage</h2>
			{loading && <p>Loading</p>}
			{!loading && (
				<div id='extensions-list-container'>
					{/* Calls the ExtensionCard component for each of the extensions in installedExtensions */}
					{installedExtensions.map((extension, index) => (
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
	);
};
