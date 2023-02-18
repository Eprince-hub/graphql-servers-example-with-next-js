import Image from 'next/image';
import zebra from '../public/images/zebra.jpeg';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <br />
      {/*
        The Next.js Image component will perform
        some optimizations such as:

        - Blocking the space on the page for the image
          before it loads (to reduce shift of content)
        - Image optimization (reduction in quality to
          deliver images faster)
        - etc
      */}
      <Image
        className={styles.image}
        src="/images/zebra.jpeg"
        width="400"
        height="400"
        alt="Zebra with meme sunglasses saying 'u wot m8' with a elftroll in the foreground"
      />

      {/*
        This is a way of avoiding having to find
        the width and height and writing them
        manually in your JSX
      */}
      <Image
        className={styles.image}
        src={zebra}
        alt="Zebra with meme sunglasses saying 'u wot m8' with a elftroll in the foreground"
      />

      {/*
        You can also use the normal img
        tag if you do not want these optimizations
      */}
      <img
        className={styles.image}
        src="/images/zebra.jpeg"
        alt="Zebra with meme sunglasses saying 'u wot m8' with a elftroll in the foreground"
      />
    </>
  );
}
