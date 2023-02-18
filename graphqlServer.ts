import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Mock data source
const animals = [
  {
    id: 1,
    firstName: 'Ralph',
    type: 'Tiger',
    accessory: 'Gold chain',
  },
  {
    id: 2,
    firstName: 'Mayo',
    type: 'Lizard',
    accessory: 'Comb',
  },
];

type Argument = {
  id: string;
};

const typeDefs = `#graphql
  type Animal {
    id: ID!
    firstName: String
    type: String
    accessory: String
  }

  type Query {
    animals: [Animal]

    animal(id: ID!): Animal
  }
`;

const resolvers = {
  Query: {
    animals: () => {
      return animals;
    },

    animal: (parent: string, args: Argument) => {
      return animals.find((animal) => animal.id === parseInt(args.id));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`Server in running at: ${url}`);
}

startApolloServer().catch((error) => {
  console.log(error);
});
