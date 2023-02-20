import { gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { initializeApollo } from '../../../util/graphql';

type Props = {
  params: { animalId: string };
};

export default async function AnimalPage(props: Props) {
  const client = initializeApollo(null);
  const animalId = props.params.animalId;

  const { data } = await client.query({
    query: gql`
      query Animal($id: ID! = ${animalId}) {
        animal(id: $id) {
          id
          accessory
          firstName
        }
      }
    `,
  });

  return (
    <>
      <header>
        <Link href="/animals">← Back to animals</Link>
      </header>

      <h1>{data.animal.firstName}</h1>
      <div>
        <div>
          <Image
            src={`/images/${
              data.animal.id
            }-${data.animal.firstName.toLowerCase()}.jpeg`}
            alt={data.animal.firstName}
            width={400}
            height={400}
          />
          <div>
            <h2>{data.animal.firstName}</h2>
            <p>{data.animal.type}</p>
            <p>{data.animal.accessory}</p>
          </div>
        </div>
      </div>
    </>
  );
}
