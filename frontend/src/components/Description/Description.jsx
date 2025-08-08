import { useParams } from 'react-router-dom';

export const Description = () => {
	const { id } = useParams();

	return <h1>{id}</h1>;
};
