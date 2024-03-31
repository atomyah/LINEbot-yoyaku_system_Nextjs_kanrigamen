import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">トップページ</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/reservations/add">予約追加</Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>予約管理画面</h1>
          <p>ここに予約状況を表示します。</p>
        </main>
      </div>
    </>
  );
}