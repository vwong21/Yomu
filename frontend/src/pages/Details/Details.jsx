import '../../Normalize.css';
import styles from './Details.module.css';
import { Frame } from '../../components/Frame/Frame';
import { Nav } from '../../components/Nav/Nav';
import { Description } from '../../components/Description/Description';

export const Details = () => {
	return (
		<div id='app' className={styles.app}>
			<Frame />
			<Nav />
			<Description />
		</div>
	);
};
