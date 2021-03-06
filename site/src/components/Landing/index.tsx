import dynamic from 'next/dynamic';
import Description from './Description';
import About from './About';
import Faq from './Faq';

import styles from '@/styles/landing.module.css';

const Banners = dynamic(() => import('@/components/Banner'));
// TODO complete the gallery component or create a new one
//  labels: enhance, to-be-discussed
// const Gallery = dynamic(() => import('@/components/Gallery'));

export default function Landing() {
	// TODO Replace images with next/image for a faster landing
	//  labels: enhance, landing
	return (
		<>
			<Banners />
			<Description />
			<div>
				<h1 className={`${styles.about}`}>ABOUT DSC</h1>
			</div>
			<About />
			<div>
				<h1 className={`${styles.about}`}>FREQUENTLY ASKED</h1>
			</div>
			<Faq />
		</>
	);
}
