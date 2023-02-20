import { gql } from '@apollo/client';
import { initializeApollo } from '../../util/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import Animals from './Animals';

export default async function page() {
  const client = initializeApollo(null);

  await client.query({
    query: gql`
      query GetAnimals {
        animals {
          id
          firstName
          type
          accessory
        }
      }
    `,
  });

  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <Animals />
    </ApolloClientProvider>
  );
}
