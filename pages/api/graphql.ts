import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getAnimalById, getAnimals } from '../../database/animals';

type Argument = {
  id: string;
};

const typeDefs = gql`
  type Query {
    animals: [Animal]
    animal(id: ID!): Animal
  }

  type Animal {
    id: ID!
    firstName: String
    type: String
    accessory: String
  }
`;

const resolvers = {
  Query: {
    animals: async () => {
      return await getAnimals();
    },

    animal: async (parent: string, args: Argument) => {
      return await getAnimalById(parseInt(args.id));
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server);
