import React, { useEffect, useState } from 'react';
import '../../../Normalize.css';
import './ExtensionCard.css';

// Component that returns a card for each extension
export const ExtensionCard = ({ name, description, image, installed }) => {
	// State to see if the extension is installed. If it is, it will display a manage button instead of an install button and vice versa
	const [isInstalled, setIsInstalled] = useState(installed);

	// Refresh the page whenever the state is changed so that if the user installs or deletes an extension, the button that is rendered changes right away
	useEffect(() => console.log(isInstalled), [isInstalled]);

	// Function that calls the downloadExtension function from the IPC which downloads the selected extension
	const installExtension = async (extensionName) => {
		try {
			// Call to IPC
			const res = await window.api.downloadExtension(extensionName);
			if (res.status == 'success') {
				setIsInstalled(true);
			}
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className='extension-card'>
			<img
				src={image}
				style={{ width: '3rem', height: '3rem', borderRadius: '0' }}
			/>
			<div className='extension-card-details'>
				<p className='extension-title'>{name}</p>
				<p className='extension-details'>{description}</p>
				<div className='extension-action-container'>
					{/* If the extension is installed, display a manage button, else display an install button */}
					{isInstalled && <p className='extension-action'>Manage</p>}
					{!isInstalled && (
						<p
							className='extension-action'
							id='install-button'
							onClick={() => {
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
