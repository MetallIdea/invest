import Link from 'next/link';
import styles from './page.module.css';
import * as fs from 'fs';

const getInitialData = () => {
  return {};
}

export default function Home() {
  const initialData = getInitialData();

  return (
    <div className={styles.page}>
    </div>
  );
}
