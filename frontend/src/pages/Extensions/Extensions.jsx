import React, { useState } from 'react';
import '../../Normalize.css';
import styles from './Extensions.module.css';
import { Nav } from '../../components/Nav/Nav';
import { ExtensionsList } from '../../components/ExtensionList/ExtensionsList';
import { Frame } from '../../components/Frame/Frame';

export const Extensions = () => {
	// State to manage the extension the user clicks on
	const [selectedExtension, setSelectedExtension] = useState(null);
	// Updates state
	const handleExtensionSelect = (extension) => {
		console.log('Selected Extension:', extension); // Logs the selected user
		setSelectedExtension(extension); // Updates state
	};
	return (
		<div id='app' className={styles.app}>
			<Frame />
			<Nav />
			<ExtensionsList onExtensionSelect={handleExtensionSelect} />
			<section id={styles.details}></section>
		</div>
	);
};
