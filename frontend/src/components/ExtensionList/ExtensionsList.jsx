import React from 'react';
import '../../Normalize.css';
import './ExtensionsList.css';
import { InstalledExtensions } from '../InstalledExtensions/InstalledExtensions';

export const ExtensionsList = () => {
	return (
		<div id='extensions-component'>
			<InstalledExtensions />
		</div>
	);
};
