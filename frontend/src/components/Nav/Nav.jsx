import React from 'react';
import { RiHomeLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoExtensionPuzzleOutline } from 'react-icons/io5';
import '../../Normalize.css';
import './Nav.css';
import { Link } from 'react-router-dom';

export const Nav = () => {
	return (
		// Nav section containing hamburger icon, home, and extension buttons
		<section id='nav-section'>
			<div id='nav-container'>
				<RxHamburgerMenu className='nav-icons' />
				<Link to='/'>
					<RiHomeLine className='nav-icons' />
				</Link>
				<Link to='/extensions'>
					<IoExtensionPuzzleOutline className='nav-icons' />
				</Link>
			</div>
		</section>
	);
};
