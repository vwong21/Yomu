import React from 'react';
import '../../../Normalize.css';
import './ExtensionCard.css';

export const ExtensionCard = ({ name, description, image, installed }) => {
	return (
		<div className='extension-card'>
			<img src={image} style={{ width: '50px', height: '50px' }} />
			<div className='extension-card-details'>
				<p className='extension-title'>{name}</p>
				<p className='extension-details'>{description}</p>
				{installed && <p className='extension-action'>manage</p>}
				{!installed && <p className='extension-action'>install</p>}
			</div>
		</div>
	);
};
