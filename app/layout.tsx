import './globals.scss';
import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { initializeApollo } from '../util/graphql';
import styles from './layout.module.scss';

export const metadata = {
  title: {
    default: 'animals4everyone',
    template: '%s | animals4everyone',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = initializeApollo(null);
  const nextCookies = cookies();

  const fakeSessionToken = nextCookies.get('fakeSessionToken');

  const { data } = await client.query({
    query: gql`
      query GetLoggedInAnimalByFirstName($firstName: String! = ${fakeSessionToken?.value}) {
        getLoggedInAnimalByFirstName(firstName: $firstName) {
          accessory
          firstName
        }
      }
    `,
  });

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
            <span>{data.getLoggedInAnimalByFirstName?.firstName}</span>
            {data.getLoggedInAnimalByFirstName?.firstName ? (
              <Link href="/logout">Logout</Link>
            ) : (
              <Link href="/login">Login</Link>
            )}
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
