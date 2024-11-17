import React, { useEffect, useState } from 'react';
import '../../../Normalize.css';
import './ExtensionCard.css';

export const ExtensionCard = ({ name, description, image, installed }) => {
	const [isInstalled, setIsInstalled] = useState(installed);

	useEffect(() => console.log(isInstalled), [isInstalled]);

	const installExtension = async (extensionName) => {
		try {
			const res = await window.api.downloadExtension(extensionName);
			console.log(res);
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
