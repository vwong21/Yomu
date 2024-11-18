import React from 'react';
import '../../Normalize.css';
import './ExtensionsList.css';
import { InstalledExtensions } from '../InstalledExtensions/InstalledExtensions';

export const ExtensionsList = () => {
	return (
		// Sets background for the extensionList. This includes color and sizing
		<div id='extensions-component'>
			<InstalledExtensions />
		</div>
	);
};
