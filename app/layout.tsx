import './globals.scss';
import Link from 'next/link';
import styles from './layout.module.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <nav>
            <div>
              <Link href="/">Home</Link>
              <Link href="/animals">Animals</Link>
              <Link href="/animals/admin">Animal admin</Link>
            </div>
            <span>Mayo</span>
            <Link href="/logout">Logout</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          copyright animals4everyone 2023
        </footer>
      </body>
    </html>
  );
}
