import React from 'react';
import ReactDOM from 'react-dom/client';
import './Normalize.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Extensions } from './pages/Extensions/Extensions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/extensions' element={<Extensions />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

reportWebVitals();
