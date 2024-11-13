import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import './InstalledExtensions.css';
import { ExtensionCard } from '../common/ExtensionCard/ExtensionCard';

export const InstalledExtensions = () => {
	const [installedExtensions, setInstalledExtensions] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchExtensions = async () => {
		try {
			const res = await window.api.retrieveExtensions(true);
			setInstalledExtensions(res);
			setLoading(false);
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchExtensions();
	}, []);

	const logger = (logOut) => {
		console.log(logOut);
	};

	return (
		<div id='installed-extensions'>
			<h2>Manage</h2>
			{loading && <p>Loading</p>}
			{!loading && (
				<div id='extensions-list-container'>
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
