import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

const Header = () => {
	return (
        <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">トップページ</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/reservations/create">予約追加</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/reservations/users">顧客リスト</Link>
            </li>
          </ul>
        </nav>
      </header>
	);
};

export default Header;