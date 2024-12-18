import React, { useEffect, useState } from 'react';
import '../../../Normalize.css';
import styles from './ExtensionCard.module.css'; // Import the CSS module

// Component that returns a card for each extension
export const ExtensionCard = ({
	name,
	description,
	image,
	installed,
	onExtensionSelect,
}) => {
	// State to see if the extension is installed. If it is, it will display a manage button instead of an install button and vice versa
	const [isInstalled, setIsInstalled] = useState(installed);

	// Log the installation state whenever it changes for debugging purposes
	useEffect(() => {
		setIsInstalled(installed);
	}, [installed]);

	// Function that calls the downloadExtension function from the IPC which downloads the selected extension
	const installExtension = async (extensionName) => {
		try {
			// Call to IPC
			const res = await window.api.downloadExtension(extensionName);
			if (res.status === 'success') {
				// Update the state to reflect the installation
				setIsInstalled(true);
			}
		} catch (error) {
			// Log any errors that occur during installation
			console.error(error);
		}
	};

	// Render the card with details and an appropriate action button
	return (
		<div className={styles.extensionCard}>
			{/* Display the extension's logo */}
			<img
				className={styles.extensionLogo}
				src={image}
				style={{ width: '3rem', height: '3rem', borderRadius: '0' }}
				alt='extension logo'
			/>
			{/* Display the extension's details */}
			<div className={styles.extensionCardDetails}>
				<p
					className={styles.extensionTitle}
					onClick={() => onExtensionSelect(name)}>
					{name}
				</p>
				<p className={styles.extensionDetails}>{description}</p>
				<div className={styles.extensionActionContainer}>
					{/* If the extension is installed, display a manage button, else display an install button */}
					{isInstalled && (
						<p className={styles.extensionAction}>Manage</p>
					)}
					{!isInstalled && (
						<p
							className={styles.extensionAction}
							id={styles.installButton}
							onClick={() => {
								// Call the install function when the Install button is clicked
								installExtension(name);
							}}>
							Install
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
