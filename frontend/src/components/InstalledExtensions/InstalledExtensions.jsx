import React, { useEffect, useState } from 'react';
import '../../Normalize.css';
import './InstalledExtensions.css';

export const InstalledExtensions = () => {
	const [installedExtensions, setInstalledExtensions] = useState([]);
	const fetchExtensions = async () => {
		try {
			const res = await window.api.retrieveExtensions(true);
			setInstalledExtensions(res);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchExtensions();
	}, []);

	return (
		<div id='installed-extensions'>
			<h2>Manage</h2>
		</div>
	);
};
