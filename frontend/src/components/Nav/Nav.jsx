import React from 'react';
import { RiHomeLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoExtensionPuzzleOutline } from 'react-icons/io5';
import '../../Normalize.css';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

export const Nav = () => {
	return (
		// Nav section containing hamburger icon, home, and extension buttons
		<section id={styles.navSection}>
			<div id={styles.navContainer}>
				<RxHamburgerMenu className={styles.navIcons} />
				<Link to='/'>
					<RiHomeLine className={styles.navIcons} />
				</Link>
				<Link to='/extensions'>
					<IoExtensionPuzzleOutline className={styles.navIcons} />
				</Link>
			</div>
		</section>
	);
};
