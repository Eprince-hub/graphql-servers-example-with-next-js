import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../util/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import AdminDashboard from './AdminDashboard';

export default async function AnimalsAdminPage() {
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

  if (!data.getLoggedInAnimalByFirstName) {
    redirect('/login');
  }

  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <AdminDashboard />
    </ApolloClientProvider>
  );
}
